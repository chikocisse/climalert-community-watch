import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import climalertLogo from '@/assets/climalert-logo.png';

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'wo', name: 'Wolof', flag: '🇸🇳' },
  { code: 'ff', name: 'Pulaar', flag: '🇸🇳' }
];

export default function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const [formData, setFormData] = useState({
    phone: '',
    firstName: '',
    lastName: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.phone && formData.firstName && formData.lastName) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <img 
              src={climalertLogo} 
              alt="ClimAlert" 
              className="w-20 h-20 object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            ClimAlert
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Surveillance climatique communautaire
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Numéro de téléphone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+221 XX XXX XX XX"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Votre prénom"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Votre nom"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium"
              disabled={!formData.phone || !formData.firstName || !formData.lastName}
            >
              Continuer
            </Button>
          </form>
          
          <div className="space-y-3">
            <Label className="text-sm font-medium">Choisir votre langue</Label>
            <div className="flex gap-2 justify-center">
              {languages.map((lang) => (
                <Badge
                  key={lang.code}
                  variant={selectedLanguage === lang.code ? "default" : "outline"}
                  className={`cursor-pointer px-3 py-2 ${
                    selectedLanguage === lang.code 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-accent'
                  }`}
                  onClick={() => setSelectedLanguage(lang.code)}
                >
                  <span className="mr-1">{lang.flag}</span>
                  {lang.name}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}