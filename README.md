# H8PharmaPrix

Application de calcul tarifaire pour officines pharmaceutiques françaises, spécialisée dans les produits de parapharmacie, homéopathie et pilules contraceptives.

## 🎯 Fonctionnalités

- **Calcul automatique du PVTTC** à partir du prix HT remisé
- **Coefficients réglementaires français** selon le type de produit et la TVA
- **Types de produits supportés** :
  - Parapharmacie (coefficient ×1.7 pour 20% TVA)
  - Homéopathie TG, Dose, Magistral (coefficient ×1.5 pour 2.1% TVA)
  - Pilules contraceptives (coefficient ×1.2 forcé)
- **Comparaison avec prix marché** via SantéStat
- **Historique local** des calculs avec sauvegarde
- **Mode sombre/clair** adaptatif
- **Interface responsive** optimisée mobile et desktop

## 🛠️ Technologies

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Express.js + TypeScript
- **Base de données**: PostgreSQL + Drizzle ORM
- **État**: TanStack Query pour la gestion des données
- **Validation**: Zod pour la validation des schemas

## 🚀 Installation

1. Cloner le repository
```bash
git clone https://github.com/votre-username/h8pharmaprix.git
cd h8pharmaprix
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
```bash
cp .env.example .env
# Renseigner DATABASE_URL avec votre base PostgreSQL
```

4. Lancer l'application
```bash
npm run dev
```

L'application sera accessible à l'adresse `http://localhost:5000`

## 📋 Utilisation

1. **Saisir les données du produit** :
   - Nom du produit (ex: Cicaplast Baume LRP)
   - Type de produit (parapharmacie, homéopathie, etc.)
   - Prix HT remisé
   - Taux de TVA applicable
   - Typologie spéciale (lait infantile, vétérinaire)

2. **Calcul automatique** :
   - Le coefficient approprié est appliqué automatiquement
   - Le PVTTC estimé est calculé en temps réel
   - Comparaison avec le prix marché si renseigné

3. **Gestion de l'historique** :
   - Sauvegarde locale des calculs
   - Consultation de l'historique
   - Suppression individuelle ou collective

## 💡 Règles de calcul

Les coefficients appliqués suivent la réglementation française :

- **20% TVA** : coefficient ×1.7 (parapharmacie)
- **10% TVA** : coefficient ×1.6
- **5.5% TVA** : coefficient ×1.6  
- **2.1% TVA** : coefficient ×1.5 (homéopathie)
- **Pilules contraceptives** : coefficient ×1.2 (forcé, indépendant de la TVA)
- **Produits spéciaux** : coefficient ×1.2 (lait infantile, vétérinaire)

## 🎨 Interface

- **Design H8Pharma** avec éléments glass-morphism
- **Mode sombre par défaut** avec option mode clair
- **Interface responsive** adaptée aux tablettes pharmacie
- **Thème vert pharmaceutique** cohérent avec l'identité H8Pharma

## 📱 Compatibilité

- ✅ Chrome, Firefox, Safari (dernières versions)
- ✅ Mobile iOS/Android
- ✅ Tablettes
- ✅ Desktop Windows/Mac/Linux

## 🔧 Développement

Structure du projet :
```
├── client/          # Frontend React
├── server/          # Backend Express
├── shared/          # Schemas partagés
├── components.json  # Configuration shadcn/ui
└── package.json     # Dépendances
```

Scripts disponibles :
- `npm run dev` - Lancement en mode développement
- `npm run build` - Build de production
- `npm run db:push` - Synchronisation base de données

## 📄 Licence

Propriétaire - H8Pharma © 2025

---

**H8PharmaPrix** - Outil de calcul tarifaire pour officines pharmaceutiques