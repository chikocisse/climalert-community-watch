import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Camera, Mic, MapPin, Send, Upload } from 'lucide-react';

export default function ReportPage() {
  const [severity, setSeverity] = useState([3]);
  const [location, setLocation] = useState('Dakar Parcelles Assainies');
  const [description, setDescription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [hasPhoto, setHasPhoto] = useState(false);

  const handlePhotoUpload = () => {
    setHasPhoto(true);
  };

  const handleVoiceRecording = () => {
    setIsRecording(!isRecording);
  };

  const handleSubmit = () => {
    // Logique d'envoi du signalement
    console.log('Signalement envoyé:', {
      location,
      description,
      severity: severity[0],
      hasPhoto,
      timestamp: new Date()
    });
  };

  const getSeverityColor = (level: number) => {
    if (level <= 2) return 'bg-success text-success-foreground';
    if (level <= 3) return 'bg-warning text-warning-foreground';
    return 'bg-destructive text-destructive-foreground';
  };

  const getSeverityLabel = (level: number) => {
    if (level <= 2) return 'Faible';
    if (level <= 3) return 'Modéré';
    return 'Critique';
  };

  return (
    <div className="min-h-screen bg-primary p-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center text-primary-foreground">
          <h1 className="text-2xl font-bold mb-2">Signaler un événement</h1>
          <p className="text-primary-foreground/80">
            Aidez votre communauté en partageant vos observations
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Localisation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="location">Position détectée</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="font-medium"
              />
              <p className="text-xs text-muted-foreground">
                Modifiez si nécessaire
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Description de l'événement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Que se passe-t-il ?</Label>
              <Textarea
                id="description"
                placeholder="Décrivez l'événement climatique ou sanitaire observé..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className={`h-16 flex-col gap-2 bg-secondary hover:bg-secondary/90 ${
                  hasPhoto ? 'ring-2 ring-primary' : ''
                }`}
                onClick={handlePhotoUpload}
              >
                {hasPhoto ? <Upload className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                <span className="text-xs">
                  {hasPhoto ? 'Photo ajoutée' : 'Ajouter photo'}
                </span>
              </Button>

              <Button
                variant="outline"
                className={`h-16 flex-col gap-2 bg-secondary hover:bg-secondary/90 ${
                  isRecording ? 'ring-2 ring-destructive animate-pulse' : ''
                }`}
                onClick={handleVoiceRecording}
              >
                <Mic className="w-5 h-5" />
                <span className="text-xs">
                  {isRecording ? 'Enregistrement...' : 'Enregistrer voix'}
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Niveau de gravité</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <Slider
                value={severity}
                onValueChange={setSeverity}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 - Faible</span>
                <span>3 - Modéré</span>
                <span>5 - Critique</span>
              </div>
              <div className="text-center">
                <Badge className={getSeverityColor(severity[0])}>
                  Niveau {severity[0]} - {getSeverityLabel(severity[0])}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleSubmit}
          className="w-full h-12 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium"
          disabled={!description.trim()}
        >
          <Send className="w-5 h-5 mr-2" />
          Envoyer le signalement
        </Button>
      </div>
    </div>
  );
}