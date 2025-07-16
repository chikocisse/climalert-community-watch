import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
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

const allMockReports = [
  {
    id: 1,
    location: 'Dakar Plateau',
    type: 'Canicule',
    severity: 4,
    time: '14:30',
    status: 'verified',
    category: 'heat',
    date: 'today'
  },
  {
    id: 2,
    location: 'Rufisque',
    type: 'Inondation',
    severity: 3,
    time: '12:15',
    status: 'pending',
    category: 'flood',
    date: 'today'
  },
  {
    id: 3,
    location: 'Thiès',
    type: 'Vent fort',
    severity: 2,
    time: '10:45',
    status: 'verified',
    category: 'wind',
    date: 'today'
  },
  {
    id: 4,
    location: 'Saint-Louis',
    type: 'Canicule',
    severity: 5,
    time: '16:20',
    status: 'verified',
    category: 'heat',
    date: 'week'
  },
  {
    id: 5,
    location: 'Kaolack',
    type: 'Inondation',
    severity: 4,
    time: '08:30',
    status: 'pending',
    category: 'flood',
    date: 'week'
  },
  {
    id: 6,
    location: 'Ziguinchor',
    type: 'Vent fort',
    severity: 3,
    time: '11:15',
    status: 'verified',
    category: 'wind',
    date: 'month'
  }
];

const weatherData = [
  { region: 'Dakar', temp: '34°C', risk: 'Élevé' },
  { region: 'Thiès', temp: '31°C', risk: 'Modéré' },
  { region: 'Saint-Louis', temp: '29°C', risk: 'Faible' }
];

interface DashboardPageProps {
  onPageChange?: (page: string) => void;
}

export default function DashboardPage({ onPageChange }: DashboardPageProps = {}) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState('today');

  // Filtrer les données selon les filtres sélectionnés
  const filteredReports = useMemo(() => {
    return allMockReports.filter(report => {
      const matchesType = selectedFilter === 'all' || report.category === selectedFilter;
      const matchesDate = report.date === selectedDate || 
        (selectedDate === 'week' && (report.date === 'today' || report.date === 'week')) ||
        (selectedDate === 'month' && (report.date === 'today' || report.date === 'week' || report.date === 'month'));
      return matchesType && matchesDate;
    });
  }, [selectedFilter, selectedDate]);

  // Calculer les métriques dynamiques
  const metrics = useMemo(() => {
    const todayReports = allMockReports.filter(r => r.date === 'today');
    const verifiedReports = filteredReports.filter(r => r.status === 'verified');
    const averageSeverity = filteredReports.reduce((acc, r) => acc + r.severity, 0) / filteredReports.length || 0;
    
    return {
      todayReports: todayReports.length,
      alertsSent: Math.floor(verifiedReports.length * 1.5),
      activeUsers: 1247 + Math.floor(filteredReports.length * 10),
      maxTemp: Math.max(34, 30 + Math.floor(averageSeverity))
    };
  }, [filteredReports]);

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

  const handleSendAlert = () => {
    if (onPageChange) {
      onPageChange('alert-system');
    }
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
            onClick={handleSendAlert}
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
                  <p className="text-3xl font-bold text-foreground">{metrics.todayReports}</p>
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
                  <p className="text-3xl font-bold text-foreground">{metrics.alertsSent}</p>
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
                {filteredReports.map((report) => (
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