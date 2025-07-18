import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertTriangle,
  Send,
  Users,
  MapPin,
  Thermometer,
  CloudRain,
  Wind,
  Clock,
  Target,
  MessageSquare,
  Phone,
  Mail,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const alertTypes = [
  { value: 'heat', label: 'Alerte Canicule', icon: Thermometer, color: 'text-destructive' },
  { value: 'flood', label: 'Alerte Inondation', icon: CloudRain, color: 'text-blue-500' },
  { value: 'wind', label: 'Alerte Vent Fort', icon: Wind, color: 'text-slate-500' },
  { value: 'general', label: 'Alerte Générale', icon: AlertTriangle, color: 'text-warning' }
];

const severityLevels = [
  { value: 1, label: 'Niveau 1 - Information', color: 'bg-blue-100 text-blue-800' },
  { value: 2, label: 'Niveau 2 - Vigilance', color: 'bg-green-100 text-green-800' },
  { value: 3, label: 'Niveau 3 - Alerte', color: 'bg-yellow-100 text-yellow-800' },
  { value: 4, label: 'Niveau 4 - Alerte Renforcée', color: 'bg-orange-100 text-orange-800' },
  { value: 5, label: 'Niveau 5 - Urgence Absolue', color: 'bg-red-100 text-red-800' }
];

const targetGroups = [
  { id: 'pregnant', label: 'Femmes enceintes', icon: Users },
  { id: 'elderly', label: 'Personnes âgées (65+)', icon: Users },
  { id: 'children', label: 'Enfants (0-12 ans)', icon: Users },
  { id: 'workers', label: 'Travailleurs extérieurs', icon: Users },
  { id: 'chronic', label: 'Personnes à risque médical', icon: Users },
  { id: 'all', label: 'Toute la population', icon: Users }
];

const regions = [
  'Dakar', 'Thiès', 'Saint-Louis', 'Kaolack', 'Ziguinchor', 
  'Diourbel', 'Fatick', 'Kolda', 'Louga', 'Matam', 'Sédhiou', 
  'Tambacounda', 'Kaffrine', 'Kédougou'
];

export default function AlertPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [alertType, setAlertType] = useState('');
  const [severity, setSeverity] = useState(1);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [actionAdvice, setActionAdvice] = useState('');
  const [channels, setChannels] = useState({
    sms: true,
    push: true,
    voice: false,
    email: false
  });
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('');

  const handleRegionToggle = (region: string) => {
    setSelectedRegions(prev => 
      prev.includes(region) 
        ? prev.filter(r => r !== region)
        : [...prev, region]
    );
  };

  const handleTargetToggle = (target: string) => {
    setSelectedTargets(prev => 
      prev.includes(target) 
        ? prev.filter(t => t !== target)
        : [...prev, target]
    );
  };

  const handleChannelToggle = (channel: keyof typeof channels) => {
    setChannels(prev => ({ ...prev, [channel]: !prev[channel] }));
  };

  const getPersonalizedMessage = (target: string) => {
    const baseAdvice = actionAdvice || "Suivez les consignes de sécurité.";
    
    switch (target) {
      case 'pregnant':
        return `${baseAdvice} Hydratez-vous régulièrement et évitez les efforts physiques intenses. Consultez votre médecin en cas de malaise.`;
      case 'elderly':
        return `${baseAdvice} Restez dans des lieux frais, hydratez-vous fréquemment et ne sortez pas aux heures les plus chaudes (12h-16h).`;
      case 'children':
        return `${baseAdvice} Surveillez vos enfants, assurez-vous qu'ils boivent régulièrement et évitez les activités extérieures prolongées.`;
      case 'workers':
        return `${baseAdvice} Aménagez des pauses fréquentes, buvez de l'eau toutes les 15-20 minutes et portez des vêtements de protection adaptés.`;
      case 'chronic':
        return `${baseAdvice} Suivez scrupuleusement votre traitement médical, contactez votre médecin en cas de symptômes et évitez toute exposition aux risques.`;
      default:
        return baseAdvice;
    }
  };

  const estimateReach = () => {
    const regionPopulation = {
      'Dakar': 3732000,
      'Thiès': 1788000,
      'Saint-Louis': 1040000,
      'Kaolack': 960000,
      'Ziguinchor': 549000,
      'Diourbel': 1497000,
      'Fatick': 714000,
      'Kolda': 662000,
      'Louga': 874000,
      'Matam': 562000,
      'Sédhiou': 452000,
      'Tambacounda': 678000,
      'Kaffrine': 566000,
      'Kédougou': 151000
    };

    let totalReach = 0;
    selectedRegions.forEach(region => {
      const population = regionPopulation[region as keyof typeof regionPopulation] || 500000;
      
      // Facteur de ciblage par groupe vulnérable
      let targetFactor = 1;
      if (selectedTargets.length > 0 && !selectedTargets.includes('all')) {
        const groupFactors = {
          'pregnant': 0.04,
          'elderly': 0.08,
          'children': 0.25,
          'workers': 0.30,
          'chronic': 0.15
        };
        targetFactor = selectedTargets.reduce((acc, target) => 
          acc + (groupFactors[target as keyof typeof groupFactors] || 0), 0);
      }
      
      totalReach += Math.floor(population * targetFactor * 0.8); // 80% de taux de couverture mobile
    });

    return totalReach;
  };

  const handleSendAlert = () => {
    if (!alertType || !title || !message || selectedRegions.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const estimatedReach = estimateReach();
    const personalizedMessages = selectedTargets.length > 0 
      ? selectedTargets.reduce((acc, target) => {
          acc[target] = getPersonalizedMessage(target);
          return acc;
        }, {} as Record<string, string>)
      : { general: message };

    // Simulation d'envoi d'alerte
    const alertData = {
      type: alertType,
      severity,
      title,
      message,
      personalizedMessages,
      actionAdvice,
      regions: selectedRegions,
      targets: selectedTargets,
      channels,
      estimatedReach,
      scheduled: isScheduled ? scheduledTime : null,
      timestamp: new Date().toISOString()
    };

    console.log('Alerte envoyée:', alertData);
    
    toast({
      title: "Alerte envoyée avec succès",
      description: `Alerte de niveau ${severity} envoyée à ${selectedRegions.length} région(s) - Portée estimée: ${estimatedReach.toLocaleString()} personnes`,
    });
  };

  const selectedAlertType = alertTypes.find(type => type.value === alertType);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Système d'Alerte ClimAlert</h1>
            <p className="text-muted-foreground">Diffusion d'alertes climatiques ciblées</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Type d'alerte */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Type d'alerte
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {alertTypes.map((type) => (
                    <Card 
                      key={type.value}
                      className={`cursor-pointer transition-all ${
                        alertType === type.value 
                          ? 'ring-2 ring-primary bg-primary/5' 
                          : 'hover:bg-accent'
                      }`}
                      onClick={() => setAlertType(type.value)}
                    >
                      <CardContent className="p-4 text-center">
                        <type.icon className={`w-8 h-8 mx-auto mb-2 ${type.color}`} />
                        <p className="text-sm font-medium">{type.label}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Niveau de gravité */}
            <Card>
              <CardHeader>
                <CardTitle>Niveau de gravité</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {severityLevels.map((level) => (
                    <div 
                      key={level.value}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        severity === level.value 
                          ? 'ring-2 ring-primary' 
                          : 'hover:bg-accent'
                      }`}
                      onClick={() => setSeverity(level.value)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{level.label}</span>
                        <Badge className={level.color}>
                          Niveau {level.value}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Message d'alerte */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Contenu de l'alerte
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Titre de l'alerte *</label>
                  <Input 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Alerte canicule - Niveau 4"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Message principal *</label>
                  <Textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Rédigez le message d'alerte..."
                    rows={4}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Conseils et actions recommandées</label>
                  <Textarea 
                    value={actionAdvice}
                    onChange={(e) => setActionAdvice(e.target.value)}
                    placeholder="Ex: Évitez les sorties entre 12h et 16h, hydratez-vous régulièrement..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Configuration du ciblage */}
          <div className="space-y-6">
            {/* Régions ciblées */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Régions ciblées *
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {regions.map((region) => (
                    <div key={region} className="flex items-center space-x-2">
                      <Checkbox 
                        id={region}
                        checked={selectedRegions.includes(region)}
                        onCheckedChange={() => handleRegionToggle(region)}
                      />
                      <label htmlFor={region} className="text-sm font-medium cursor-pointer">
                        {region}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedRegions(regions)}
                  >
                    Sélectionner tout
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-2"
                    onClick={() => setSelectedRegions([])}
                  >
                    Désélectionner tout
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Groupes cibles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Groupes cibles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {targetGroups.map((group) => (
                    <div key={group.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={group.id}
                        checked={selectedTargets.includes(group.id)}
                        onCheckedChange={() => handleTargetToggle(group.id)}
                      />
                      <label htmlFor={group.id} className="text-sm font-medium cursor-pointer">
                        {group.label}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Canaux de diffusion */}
            <Card>
              <CardHeader>
                <CardTitle>Canaux de diffusion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">SMS</span>
                    </div>
                    <Checkbox 
                      checked={channels.sms}
                      onCheckedChange={() => handleChannelToggle('sms')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Send className="w-4 h-4" />
                      <span className="text-sm">Notification Push</span>
                    </div>
                    <Checkbox 
                      checked={channels.push}
                      onCheckedChange={() => handleChannelToggle('push')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">Appel vocal</span>
                    </div>
                    <Checkbox 
                      checked={channels.voice}
                      onCheckedChange={() => handleChannelToggle('voice')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">Email</span>
                    </div>
                    <Checkbox 
                      checked={channels.email}
                      onCheckedChange={() => handleChannelToggle('email')}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Programmation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Programmation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={isScheduled}
                    onCheckedChange={(checked) => setIsScheduled(checked === true)}
                  />
                  <span className="text-sm">Programmer l'envoi</span>
                </div>
                {isScheduled && (
                  <Input 
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Résumé et envoi */}
        <Card>
          <CardHeader>
            <CardTitle>Résumé de l'alerte</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedAlertType && (
              <Alert className="mb-4">
                <selectedAlertType.icon className="h-4 w-4" />
                <AlertDescription>
                  <strong>{selectedAlertType.label}</strong> - Niveau {severity} 
                  {selectedRegions.length > 0 && ` • ${selectedRegions.length} région(s) ciblée(s)`}
                  {selectedTargets.length > 0 && ` • ${selectedTargets.length} groupe(s) cible(s)`}
                  {selectedRegions.length > 0 && (
                    <div className="mt-2">
                      <strong>Portée estimée:</strong> {estimateReach().toLocaleString()} personnes
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {/* Aperçu des messages personnalisés */}
            {selectedTargets.length > 0 && actionAdvice && (
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="text-base">Messages personnalisés par groupe</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedTargets.map(target => (
                    <div key={target} className="p-3 bg-accent rounded-lg">
                      <div className="font-medium text-sm mb-1">
                        {targetGroups.find(g => g.id === target)?.label}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {getPersonalizedMessage(target)}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Canaux de diffusion sélectionnés */}
            {Object.entries(channels).some(([_, enabled]) => enabled) && (
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="text-base">Canaux de diffusion sélectionnés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 flex-wrap">
                    {channels.sms && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        SMS
                      </Badge>
                    )}
                    {channels.push && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Send className="w-3 h-3" />
                        Push
                      </Badge>
                    )}
                    {channels.voice && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        Vocal
                      </Badge>
                    )}
                    {channels.email && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        Email
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="flex gap-4">
              <Button 
                onClick={handleSendAlert}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                disabled={!alertType || !title || !message || selectedRegions.length === 0}
              >
                <Send className="w-4 h-4 mr-2" />
                {isScheduled ? 'Programmer l\'alerte' : 'Envoyer l\'alerte immédiatement'}
              </Button>
              
              <Button variant="outline">
                Prévisualiser
              </Button>
              
              <Button variant="outline">
                Sauvegarder comme modèle
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}