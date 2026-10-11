require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.post('/analyser', async (req, res) => {
  try {
    if (!req.body.image) {
      return res.status(400).json({ erreur: 'Aucune photo reçue' });
    }

    const base64Image = req.body.image;
    const mediaType = req.body.mimeType || 'image/jpeg';

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: base64Image }
          },
          {
            type: 'text',
            text: `Analyse cette photo de visage. Pour chaque oeil, donne le rectangle qui entoure l'oeil visible (paupières comprises), avec son coin haut-gauche (x1, y1) et son coin bas-droit (x2, y2), comme des fractions entre 0 et 1 de la largeur (x) et de la hauteur (y) de l'image, avec l'origine en haut à gauche. Réponds UNIQUEMENT avec un objet JSON, sans aucun texte autour, au format exact :
{"formeVisage": "Ovale|Rond|Carré|Rectangulaire|Coeur|Triangulaire", "styleCheveux": "styleCheveux": "description courte", "yeux": {"oeilGaucheImage": {"x1": 0.xx, "y1": 0.xx, "x2": 0.xx, "y2": 0.xx}, "oeilDroitImage": {"x1": 0.xx, "y1": 0.xx, "x2": 0.xx, "y2": 0.xx}},, "monturesRecommandees": [{"nom": "...", "raison": "..."}], "monturesAEssayer": [{"nom": "...", "raison": "..."}], "monturesMoinsAdaptees": [{"nom": "...", "raison": "..."}]}`
          }
        ]
      }]
    });

        let texteReponse = message.content[0].text;
    texteReponse = texteReponse.replace(/```json/g, '').replace(/```/g, '').trim();

    let resultat;
    try {
      resultat = JSON.parse(texteReponse);
    } catch (e) {
      return res.status(422).json({ erreur: 'AUCUN_VISAGE' });
    }

    res.json(resultat);

  } catch (erreur) {
    console.error(erreur);
    res.status(500).json({ erreur: 'Échec de l\'analyse' });
  }
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Serveur démarré sur http://0.0.0.0:3000');
});