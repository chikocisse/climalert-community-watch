import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Thermometer,
  CloudRain,
  Wind,
  Sun,
  AlertTriangle,
  Heart,
  Phone,
  Shield,
  Baby,
  Users,
  Home
} from 'lucide-react';

const emergencyTips = [
  {
    situation: 'Canicule extrême',
    icon: Thermometer,
    color: 'destructive',
    immediate: [
      'Cherchez immédiatement un endroit frais (climatisé si possible)',
      'Buvez de l\'eau fraîche par petites gorgées',
      'Aspergez votre corps d\'eau fraîche',
      'Desserrez vos vêtements'
    ],
    prevention: [
      'Évitez les sorties entre 11h et 16h',
      'Portez des vêtements légers et clairs',
      'Hydratez-vous régulièrement (2L minimum)',
      'Rafraîchissez votre logement'
    ]
  },
  {
    situation: 'Inondation',
    icon: CloudRain,
    color: 'warning',
    immediate: [
      'Gagnez un terrain élevé immédiatement',
      'Évitez de marcher dans l\'eau courante',
      'Coupez l\'électricité si vous le pouvez en sécurité',
      'Signalez votre position aux secours'
    ],
    prevention: [
      'Préparez un kit d\'urgence',
      'Identifiez les zones d\'évacuation',
      'Surélevez les objets de valeur',
      'Nettoyez les canalisations'
    ]
  },
  {
    situation: 'Vents violents',
    icon: Wind,
    color: 'warning',
    immediate: [
      'Mettez-vous à l\'abri dans un bâtiment solide',
      'Éloignez-vous des fenêtres et objets volants',
      'Évitez les arbres et lignes électriques',
      'Attendez la fin complète de l\'épisode'
    ],
    prevention: [
      'Sécurisez les objets extérieurs',
      'Vérifiez la solidité de votre toiture',
      'Élaguez les arbres proches',
      'Préparez lampes et radio à piles'
    ]
  }
];

const profileAdvice = [
  {
    profile: 'Femmes enceintes',
    icon: '🤱',
    color: 'bg-pink-100 text-pink-800',
    tips: [
      'Hydratation renforcée (3L par jour en cas de chaleur)',
      'Consultez rapidement en cas de contractions',
      'Évitez absolument la déshydratation',
      'Gardez vos documents médicaux accessibles'
    ]
  },
  {
    profile: 'Personnes âgées',
    icon: '👴',
    color: 'bg-blue-100 text-blue-800',
    tips: [
      'Contactez famille/voisins quotidiennement',
      'Prenez vos médicaments à heures fixes',
      'Restez dans un environnement frais',
      'Appelez aide à domicile si besoin'
    ]
  },
  {
    profile: 'Enfants',
    icon: '👶',
    color: 'bg-green-100 text-green-800',
    tips: [
      'Surveillez les signes de déshydratation',
      'Protégez du soleil (crème, chapeau)',
      'Adaptez les horaires de jeu',
      'Consultez si fièvre ou vomissements'
    ]
  },
  {
    profile: 'Personnes vulnérables',
    icon: '🏥',
    color: 'bg-purple-100 text-purple-800',
    tips: [
      'Ayez toujours vos médicaments à portée',
      'Gardez les numéros d\'urgence visibles',
      'Préparez un sac d\'évacuation',
      'Informez vos proches de votre situation'
    ]
  }
];

const emergencyContacts = [
  { service: 'Pompiers', number: '18', icon: '🚒' },
  { service: 'Police', number: '17', icon: '👮' },
  { service: 'SAMU', number: '15', icon: '🚑' },
  { service: 'Urgences', number: '112', icon: '📞' }
];

export default function HelpPage() {
  const getColorClass = (color: string) => {
    switch (color) {
      case 'destructive':
        return 'bg-destructive text-destructive-foreground';
      case 'warning':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20 md:pb-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Que faire ?</h1>
          <p className="text-muted-foreground">
            Conseils d'urgence et de prévention pour faire face aux événements climatiques
          </p>
        </div>

        {/* Numéros d'urgence */}
        <Card className="border-destructive bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Phone className="w-5 h-5" />
              Numéros d'urgence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {emergencyContacts.map((contact, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-16 flex-col gap-1 border-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <span className="text-lg">{contact.icon}</span>
                  <span className="font-bold text-lg">{contact.number}</span>
                  <span className="text-xs">{contact.service}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conseils par situation d'urgence */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-6 h-6" />
            Situations d'urgence
          </h2>
          
          {emergencyTips.map((tip, index) => {
            const IconComponent = tip.icon;
            return (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getColorClass(tip.color)}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    {tip.situation}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Heart className="w-4 h-4 text-destructive" />
                        Actions immédiates
                      </h4>
                      <ul className="space-y-2">
                        {tip.immediate.map((action, actionIndex) => (
                          <li key={actionIndex} className="flex items-start gap-2 text-sm">
                            <span className="text-destructive mt-1 text-lg">•</span>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary" />
                        Prévention
                      </h4>
                      <ul className="space-y-2">
                        {tip.prevention.map((prevention, prevIndex) => (
                          <li key={prevIndex} className="flex items-start gap-2 text-sm">
                            <span className="text-primary mt-1 text-lg">•</span>
                            {prevention}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Conseils par profil */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-6 h-6" />
            Conseils personnalisés
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {profileAdvice.map((advice, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-2xl">{advice.icon}</span>
                    {advice.profile}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {advice.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-1">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Kit d'urgence */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Kit d'urgence à préparer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-3">💧 Eau et nourriture</h4>
                <ul className="text-sm space-y-1">
                  <li>• 4L d'eau par personne/jour</li>
                  <li>• Nourriture non périssable</li>
                  <li>• Ouvre-boîte manuel</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">🏥 Soins médicaux</h4>
                <ul className="text-sm space-y-1">
                  <li>• Trousse de premiers secours</li>
                  <li>• Médicaments essentiels</li>
                  <li>• Thermomètre</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">📱 Communication</h4>
                <ul className="text-sm space-y-1">
                  <li>• Radio à piles</li>
                  <li>• Lampe torche</li>
                  <li>• Téléphone portable chargé</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}