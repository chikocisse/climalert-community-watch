import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AlertTriangle, 
  Bell, 
  Calendar, 
  Filter, 
  MapPin, 
  TrendingUp,
  Thermometer,
  CloudRain,
  Users
} from 'lucide-react';

const mockReports = [
  {
    id: 1,
    location: 'Dakar Plateau',
    type: 'Canicule',
    severity: 4,
    time: '14:30',
    status: 'verified'
  },
  {
    id: 2,
    location: 'Rufisque',
    type: 'Inondation',
    severity: 3,
    time: '12:15',
    status: 'pending'
  },
  {
    id: 3,
    location: 'Thiès',
    type: 'Vent fort',
    severity: 2,
    time: '10:45',
    status: 'verified'
  }
];

const weatherData = [
  { region: 'Dakar', temp: '34°C', risk: 'Élevé' },
  { region: 'Thiès', temp: '31°C', risk: 'Modéré' },
  { region: 'Saint-Louis', temp: '29°C', risk: 'Faible' }
];

export default function DashboardPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState('today');

  const getSeverityColor = (level: number) => {
    if (level <= 2) return 'bg-success text-success-foreground';
    if (level <= 3) return 'bg-warning text-warning-foreground';
    return 'bg-destructive text-destructive-foreground';
  };

  const getRiskColor = (risk: string) => {
    if (risk === 'Faible') return 'text-success';
    if (risk === 'Modéré') return 'text-warning';
    return 'text-destructive';
  };

  const sendAlert = () => {
    console.log('Alerte envoyée aux clients');
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tableau de bord ClimAlert</h1>
            <p className="text-muted-foreground">Surveillance en temps réel des événements climatiques</p>
          </div>
          <Button 
            onClick={sendAlert}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            <Bell className="w-4 h-4 mr-2" />
            Alerter les clients
          </Button>
        </div>

        {/* Filtres */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type d'événement</label>
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les événements</SelectItem>
                    <SelectItem value="heat">Canicule</SelectItem>
                    <SelectItem value="flood">Inondation</SelectItem>
                    <SelectItem value="wind">Vent fort</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Période</label>
                <Select value={selectedDate} onValueChange={setSelectedDate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Aujourd'hui</SelectItem>
                    <SelectItem value="week">Cette semaine</SelectItem>
                    <SelectItem value="month">Ce mois</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Région</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les régions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dakar">Dakar</SelectItem>
                    <SelectItem value="thies">Thiès</SelectItem>
                    <SelectItem value="saint-louis">Saint-Louis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Signalements aujourd'hui</p>
                  <p className="text-3xl font-bold text-foreground">23</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Alertes envoyées</p>
                  <p className="text-3xl font-bold text-foreground">12</p>
                </div>
                <Bell className="w-8 h-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Utilisateurs actifs</p>
                  <p className="text-3xl font-bold text-foreground">1,247</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Température max</p>
                  <p className="text-3xl font-bold text-foreground">34°C</p>
                </div>
                <Thermometer className="w-8 h-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Signalements récents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Signalements récents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{report.location}</p>
                      <p className="text-sm text-muted-foreground">{report.type} • {report.time}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(report.severity)}>
                        Niveau {report.severity}
                      </Badge>
                      <Badge variant={report.status === 'verified' ? 'default' : 'outline'}>
                        {report.status === 'verified' ? 'Vérifié' : 'En attente'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Conditions météo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CloudRain className="w-5 h-5" />
                Conditions régionales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weatherData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                    <div>
                      <p className="font-medium">{data.region}</p>
                      <p className="text-2xl font-bold">{data.temp}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Niveau de risque</p>
                      <p className={`font-medium ${getRiskColor(data.risk)}`}>
                        {data.risk}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Zone de carte interactive (placeholder) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Carte interactive des signalements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-accent rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="w-12 h-12 mx-auto mb-2" />
                <p className="font-medium">Carte interactive</p>
                <p className="text-sm">Visualisation géographique des événements en temps réel</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}