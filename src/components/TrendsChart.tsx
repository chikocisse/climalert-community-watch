import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

interface TrendsChartProps {
  selectedFilter: string;
  selectedDate: string;
}

// Données de tendances simulées
const weeklyTrends = [
  { period: 'Lun', canicule: 2, inondation: 0, vent: 1, temperature: 34 },
  { period: 'Mar', canicule: 3, inondation: 1, vent: 2, temperature: 36 },
  { period: 'Mer', canicule: 4, inondation: 0, vent: 1, temperature: 38 },
  { period: 'Jeu', canicule: 5, inondation: 2, vent: 3, temperature: 37 },
  { period: 'Ven', canicule: 3, inondation: 1, vent: 2, temperature: 35 },
  { period: 'Sam', canicule: 2, inondation: 0, vent: 1, temperature: 33 },
  { period: 'Dim', canicule: 1, inondation: 1, vent: 2, temperature: 32 },
];

const monthlyTrends = [
  { period: 'Sem 1', canicule: 15, inondation: 3, vent: 8, temperature: 35 },
  { period: 'Sem 2', canicule: 18, inondation: 5, vent: 12, temperature: 37 },
  { period: 'Sem 3', canicule: 22, inondation: 8, vent: 15, temperature: 39 },
  { period: 'Sem 4', canicule: 19, inondation: 4, vent: 10, temperature: 36 },
];

const regionData = [
  { name: 'Dakar', value: 35, color: '#ef4444' },
  { name: 'Thiès', value: 22, color: '#f97316' },
  { name: 'Saint-Louis', value: 18, color: '#eab308' },
  { name: 'Kaolack', value: 15, color: '#22c55e' },
  { name: 'Autres', value: 10, color: '#6b7280' },
];

const severityData = [
  { severity: 'Niveau 1', count: 8, color: '#22c55e' },
  { severity: 'Niveau 2', count: 15, color: '#eab308' },
  { severity: 'Niveau 3', count: 22, color: '#f97316' },
  { severity: 'Niveau 4', count: 18, color: '#ef4444' },
  { severity: 'Niveau 5', count: 7, color: '#dc2626' },
];

export default function TrendsChart({ selectedFilter, selectedDate }: TrendsChartProps) {
  const [chartType, setChartType] = React.useState('line');
  
  const getTrendData = () => {
    return selectedDate === 'month' ? monthlyTrends : weeklyTrends;
  };

  const getFilteredData = () => {
    const data = getTrendData();
    if (selectedFilter === 'all') return data;
    
    return data.map(item => ({
      ...item,
      [selectedFilter]: item[selectedFilter as keyof typeof item] || 0
    }));
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
              {entry.dataKey === 'temperature' && '°C'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={getFilteredData()}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="period" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {(selectedFilter === 'all' || selectedFilter === 'heat') && (
          <Line 
            type="monotone" 
            dataKey="canicule" 
            stroke="#ef4444" 
            strokeWidth={2}
            name="Canicule"
          />
        )}
        {(selectedFilter === 'all' || selectedFilter === 'flood') && (
          <Line 
            type="monotone" 
            dataKey="inondation" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="Inondation"
          />
        )}
        {(selectedFilter === 'all' || selectedFilter === 'wind') && (
          <Line 
            type="monotone" 
            dataKey="vent" 
            stroke="#6b7280" 
            strokeWidth={2}
            name="Vent fort"
          />
        )}
        <Line 
          type="monotone" 
          dataKey="temperature" 
          stroke="#f97316" 
          strokeWidth={2}
          strokeDasharray="5 5"
          name="Température (°C)"
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={getFilteredData()}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="period" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {(selectedFilter === 'all' || selectedFilter === 'heat') && (
          <Bar dataKey="canicule" fill="#ef4444" name="Canicule" />
        )}
        {(selectedFilter === 'all' || selectedFilter === 'flood') && (
          <Bar dataKey="inondation" fill="#3b82f6" name="Inondation" />
        )}
        {(selectedFilter === 'all' || selectedFilter === 'wind') && (
          <Bar dataKey="vent" fill="#6b7280" name="Vent fort" />
        )}
      </BarChart>
    </ResponsiveContainer>
  );

  const renderPieCharts = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Répartition par région */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Répartition par région</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={regionData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {regionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Répartition par niveau de gravité */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Répartition par gravité</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={severityData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="severity" type="category" width={80} />
              <Tooltip />
              <Bar dataKey="count" fill="#22c55e">
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Tendances et analyses
          </div>
          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="line">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Courbes
                </div>
              </SelectItem>
              <SelectItem value="bar">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Barres
                </div>
              </SelectItem>
              <SelectItem value="pie">
                <div className="flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4" />
                  Répartitions
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartType === 'line' && renderLineChart()}
        {chartType === 'bar' && renderBarChart()}
        {chartType === 'pie' && renderPieCharts()}
        
        {/* Indicateurs clés */}
        <div className="mt-6 pt-4 border-t">
          <h4 className="font-medium mb-3">Indicateurs clés de la période</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-accent rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {getFilteredData().reduce((sum, item) => sum + (item.canicule || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total canicules</div>
            </div>
            
            <div className="text-center p-3 bg-accent rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {Math.max(...getFilteredData().map(item => item.temperature))}°C
              </div>
              <div className="text-sm text-muted-foreground">Pic de chaleur</div>
            </div>
            
            <div className="text-center p-3 bg-accent rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {getFilteredData().reduce((sum, item) => sum + (item.inondation || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total inondations</div>
            </div>
            
            <div className="text-center p-3 bg-accent rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {(getFilteredData().reduce((sum, item) => sum + item.temperature, 0) / getFilteredData().length).toFixed(1)}°C
              </div>
              <div className="text-sm text-muted-foreground">Temp. moyenne</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}