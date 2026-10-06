# Backend IA

Le backend doit recevoir une photo et retourner un JSON stable, par exemple:

{
  "faceShape": "oval",
  "hairStyle": "short",
  "confidence": 0.82,
  "recommendations": [
    {"frameType": "rectangular", "reason": "..." },
    {"frameType": "wayfarer", "reason": "..." }
  ]
}

Architecture recommandée:
Mobile -> HTTPS -> Backend -> modèle de vision -> moteur de recommandation -> Mobile.

Le backend doit:
- ne jamais exposer une clé secrète dans l'app;
- valider le type et la taille de l'image;
- supprimer la photo après traitement si elle n'est pas nécessaire;
- appliquer une politique de conservation claire;
- journaliser le minimum nécessaire;
- retourner uniquement les attributs nécessaires au produit.

L'analyse esthétique doit être présentée comme une recommandation, pas comme une vérité objective.
