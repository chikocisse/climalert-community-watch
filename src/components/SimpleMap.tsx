import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SimpleMap() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Carte temporairement désactivée</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">Carte interactive en cours de réparation</p>
            <p className="text-sm text-muted-foreground">Problème technique avec react-leaflet détecté</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}