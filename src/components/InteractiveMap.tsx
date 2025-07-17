import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, MapPin, Thermometer, CloudRain, Wind, RefreshCw } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface WeatherData {
  name: string;
  coord: { lat: number; lon: number };
  main: { temp: number; humidity: number; feels_like: number };
  weather: Array<{ main: string; description: string; icon: string }>;
  wind: { speed: number };
  visibility: number;
}

interface Report {
  id: number;
  location: string;
  type: string;
  severity: number;
  coordinates: LatLngExpression;
  time: string;
  status: string;
  category: string;
}

const senegalRegions = [
  { name: 'Dakar', lat: 14.6937, lon: -17.4441 },
  { name: 'Thiès', lat: 14.7886, lon: -16.9246 },
  { name: 'Saint-Louis', lat: 16.0366, lon: -16.4894 },
  { name: 'Kaolack', lat: 14.1516, lon: -16.0728 },
  { name: 'Ziguinchor', lat: 12.5681, lon: -16.2719 },
  { name: 'Tambacounda', lat: 13.7706, lon: -13.6683 },
  { name: 'Kolda', lat: 12.8944, lon: -14.9418 },
  { name: 'Diourbel', lat: 14.6578, lon: -16.2294 },
];

const mockReports: Report[] = [
  {
    id: 1,
    location: 'Dakar Plateau',
    type: 'Canicule',
    severity: 4,
    coordinates: [14.6937, -17.4441],
    time: '14:30',
    status: 'verified',
    category: 'heat'
  },
  {
    id: 2,
    location: 'Rufisque',
    type: 'Inondation',
    severity: 3,
    coordinates: [14.7167, -17.2833],
    time: '12:15',
    status: 'pending',
    category: 'flood'
  },
  {
    id: 3,
    location: 'Thiès',
    type: 'Vent fort',
    severity: 2,
    coordinates: [14.7886, -16.9246],
    time: '10:45',
    status: 'verified',
    category: 'wind'
  },
];

const API_KEY = '6acd425a7fd67ac645bc8d6e2774150d';

export default function InteractiveMap() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedRiskType, setSelectedRiskType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchWeatherData = async () => {
    setIsLoading(true);
    try {
      const weatherPromises = senegalRegions.map(async (region) => {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${region.lat}&lon=${region.lon}&appid=${API_KEY}&units=metric&lang=fr`
        );
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      });

      const results = await Promise.all(weatherPromises);
      setWeatherData(results);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erreur lors de la récupération des données météo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
    // Mise à jour automatique toutes les 30 minutes
    const interval = setInterval(fetchWeatherData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getRiskLevel = (temp: number, humidity: number, windSpeed: number) => {
    if (temp > 40 || windSpeed > 15) return 'critique';
    if (temp > 35 || humidity > 80 || windSpeed > 10) return 'moderé';
    return 'faible';
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critique': return '#ef4444';
      case 'moderé': return '#f97316';
      case 'faible': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const getSeverityIcon = (severity: number, category: string) => {
    const getIconComponent = () => {
      switch (category) {
        case 'heat': return Thermometer;
        case 'flood': return CloudRain;
        case 'wind': return Wind;
        default: return AlertTriangle;
      }
    };
    
    const IconComponent = getIconComponent();
    return <IconComponent className="w-4 h-4" />;
  };

  const filteredReports = mockReports.filter(report => {
    const regionMatch = selectedRegion === 'all' || report.location.toLowerCase().includes(selectedRegion.toLowerCase());
    const riskMatch = selectedRiskType === 'all' || report.category === selectedRiskType;
    return regionMatch && riskMatch;
  });

  const filteredWeatherData = weatherData.filter(data => {
    if (selectedRegion === 'all') return true;
    return data.name.toLowerCase().includes(selectedRegion.toLowerCase());
  });

  return (
    <div className="space-y-4">
      {/* Contrôles de la carte */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Carte climatique interactive
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Dernière mise à jour: {lastUpdate.toLocaleTimeString()}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchWeatherData}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium">Région</label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les régions</SelectItem>
                  {senegalRegions.map((region) => (
                    <SelectItem key={region.name} value={region.name}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Type de risque</label>
              <Select value={selectedRiskType} onValueChange={setSelectedRiskType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les risques</SelectItem>
                  <SelectItem value="heat">Canicule</SelectItem>
                  <SelectItem value="flood">Inondation</SelectItem>
                  <SelectItem value="wind">Vent fort</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <div className="space-y-1">
                <div className="text-xs">Légende:</div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-xs">Critique</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-xs">Modéré</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs">Faible</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Carte */}
          <div className="h-96 rounded-lg overflow-hidden border">
            <MapContainer
              center={[14.4974, -14.4524]} // Centre du Sénégal
              zoom={7}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Données météorologiques */}
              {filteredWeatherData.map((data) => {
                const riskLevel = getRiskLevel(
                  data.main.temp,
                  data.main.humidity,
                  data.wind.speed
                );
                
                return (
                  <React.Fragment key={data.name}>
                    <Circle
                      center={[data.coord.lat, data.coord.lon]}
                      radius={20000}
                      fillColor={getRiskColor(riskLevel)}
                      fillOpacity={0.3}
                      stroke={true}
                      color={getRiskColor(riskLevel)}
                      weight={2}
                    />
                    <Marker position={[data.coord.lat, data.coord.lon]}>
                      <Popup>
                        <div className="p-2 min-w-48">
                          <h3 className="font-bold text-base mb-2">{data.name}</h3>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Température:</span>
                              <span className="font-medium">{Math.round(data.main.temp)}°C</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Ressenti:</span>
                              <span>{Math.round(data.main.feels_like)}°C</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Humidité:</span>
                              <span>{data.main.humidity}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Vent:</span>
                              <span>{Math.round(data.wind.speed * 3.6)} km/h</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Conditions:</span>
                              <span className="capitalize">{data.weather[0].description}</span>
                            </div>
                            <div className="mt-2 pt-2 border-t">
                              <Badge 
                                className={`text-white ${
                                  riskLevel === 'critique' ? 'bg-red-500' :
                                  riskLevel === 'moderé' ? 'bg-orange-500' : 'bg-green-500'
                                }`}
                              >
                                Risque {riskLevel}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  </React.Fragment>
                );
              })}

              {/* Signalements d'événements */}
              {filteredReports.map((report) => (
                <Marker
                  key={report.id}
                  position={report.coordinates}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold flex items-center gap-2">
                        {getSeverityIcon(report.severity, report.category)}
                        {report.location}
                      </h3>
                      <div className="mt-2 space-y-1 text-sm">
                        <div><strong>Type:</strong> {report.type}</div>
                        <div><strong>Heure:</strong> {report.time}</div>
                        <div className="flex items-center gap-2">
                          <strong>Gravité:</strong>
                          <Badge 
                            className={`text-white ${
                              report.severity >= 4 ? 'bg-red-500' :
                              report.severity >= 3 ? 'bg-orange-500' : 'bg-green-500'
                            }`}
                          >
                            Niveau {report.severity}
                          </Badge>
                        </div>
                        <div>
                          <Badge variant={report.status === 'verified' ? 'default' : 'outline'}>
                            {report.status === 'verified' ? 'Vérifié' : 'En attente'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}