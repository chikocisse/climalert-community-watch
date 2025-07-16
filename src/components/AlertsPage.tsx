import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Bell, 
  Clock, 
  MapPin, 
  Thermometer,
  CloudRain,
  Wind,
  Sun,
  Users
} from 'lucide-react';

const alerts = [
  {
    id: 1,
    type: 'Canicule',
    severity: 'critical',
    location: 'Dakar, Plateau',
    message: 'Température extrême de 38°C prévue. Évitez les sorties entre 11h et 16h.',
    time: '09:30',
    affected: 15000,
    icon: Thermometer
  },
  {
    id: 2,
    type: 'Orage',
    severity: 'moderate',
    location: 'Thiès, Centre',
    message: 'Orages avec grêle possibles en fin d\'après-midi. Restez à l\'abri.',
    time: '14:15',
    affected: 8500,
    icon: CloudRain
  },
  {
    id: 3,
    type: 'Vent fort',
    severity: 'low',
    location: 'Saint-Louis',
    message: 'Vents soutenus de 45 km/h. Attention aux objets volants.',
    time: '16:45',
    affected: 5200,
    icon: Wind
  }
];

const personalizedTips = [
  {
    profile: 'Femme enceinte',
    icon: '🤱',
    tips: [
      'Hydratez-vous régulièrement (2-3 litres par jour)',
      'Portez des vêtements légers et clairs',
      'Consultez votre médecin en cas de malaise'
    ]
  },
  {
    profile: 'Personne âgée',
    icon: '👴',
    tips: [
      'Restez à l\'intérieur aux heures chaudes',
      'Prenez des douches tièdes régulièrement',
      'Gardez vos médicaments au frais'
    ]
  },
  {
    profile: 'Enfant',
    icon: '👶',
    tips: [
      'Évitez les activités physiques intenses',
      'Appliquez de la crème solaire toutes les 2h',
      'Buvez même sans avoir soif'
    ]
  }
];

export default function AlertsPage() {
  const [selectedAlert, setSelectedAlert] = useState<number | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-destructive text-destructive-foreground';
      case 'moderate':
        return 'bg-warning text-warning-foreground';
      case 'low':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'Critique';
      case 'moderate':
        return 'Modéré';
      case 'low':
        return 'Faible';
      default:
        return 'Inconnu';
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Alertes Actives</h1>
          <p className="text-muted-foreground">
            Restez informé des conditions climatiques dans votre région
          </p>
        </div>

        {/* Alertes principales */}
        <div className="space-y-4">
          {alerts.map((alert) => {
            const IconComponent = alert.icon;
            return (
              <Card key={alert.id} className="border-l-4 border-l-destructive">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{alert.type}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {alert.location}
                          <Clock className="w-4 h-4 ml-2" />
                          {alert.time}
                        </div>
                      </div>
                    </div>
                    <Badge className={getSeverityColor(alert.severity)}>
                      {getSeverityLabel(alert.severity)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground mb-3">{alert.message}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {alert.affected.toLocaleString()} personnes concernées
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedAlert(selectedAlert === alert.id ? null : alert.id)}
                    >
                      {selectedAlert === alert.id ? 'Masquer' : 'Que faire ?'}
                    </Button>
                  </div>
                  
                  {selectedAlert === alert.id && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-medium mb-3">Conseils personnalisés :</h4>
                      <div className="grid gap-3">
                        {personalizedTips.map((tip, index) => (
                          <div key={index} className="bg-accent p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg">{tip.icon}</span>
                              <span className="font-medium">{tip.profile}</span>
                            </div>
                            <ul className="text-sm space-y-1">
                              {tip.tips.map((advice, tipIndex) => (
                                <li key={tipIndex} className="flex items-start gap-2">
                                  <span className="text-primary mt-1">•</span>
                                  {advice}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Zone d'urgence */}
        <Card className="border-destructive bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              En cas d'urgence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Si vous êtes en situation de détresse immédiate :
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="destructive" className="h-12">
                  <Bell className="w-4 h-4 mr-2" />
                  Appeler les secours
                </Button>
                <Button variant="outline" className="h-12">
                  <MapPin className="w-4 h-4 mr-2" />
                  Partager ma position
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prévisions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="w-5 h-5" />
              Prévisions 24h
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <p className="text-sm font-medium">18h</p>
                <Sun className="w-6 h-6 mx-auto text-warning" />
                <p className="text-sm">32°C</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">22h</p>
                <CloudRain className="w-6 h-6 mx-auto text-muted-foreground" />
                <p className="text-sm">28°C</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">02h</p>
                <Wind className="w-6 h-6 mx-auto text-primary" />
                <p className="text-sm">24°C</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">06h</p>
                <Sun className="w-6 h-6 mx-auto text-success" />
                <p className="text-sm">26°C</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}