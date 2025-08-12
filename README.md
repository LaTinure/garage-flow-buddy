# 🚗 Garage Abidjan

Une application moderne de gestion de garage développée avec React, TypeScript et Tailwind CSS.

## 🎯 **Fonctionnalités**

- ✅ **Configuration complète du garage** : Informations légales, fiscales et de contact
- ✅ **Gestion des clients** : Ajout, modification, historique
- ✅ **Gestion des véhicules** : Suivi des réparations
- ✅ **Gestion du stock** : Inventaire et alertes
- ✅ **Factures et devis** : Génération automatique avec informations légales
- ✅ **Interface moderne** : Design responsive et thème adaptatif
- ✅ **Système Brain** : Configuration initiale guidée

## 🚀 **Installation et Configuration**

### **1. Cloner le projet**
```bash
git clone <repository-url>
cd garage
```

### **2. Installer les dépendances**
```bash
npm install
```

### **3. Configuration des variables d'environnement**
```bash
# Copier le fichier d'exemple
cp env.example .env

# Éditer le fichier .env avec vos informations
```

**Variables requises :**
```env
# Configuration Supabase
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Configuration du Garage
VITE_GARAGE_NAME=Votre Nom de Garage
VITE_GARAGE_OWNER=Nom du Propriétaire
VITE_GARAGE_ADDRESS=Adresse du Garage
VITE_GARAGE_PHONE=+225 07 58 96 61 56
VITE_GARAGE_EMAIL=contact@votre-garage.com

# Informations légales et fiscales
VITE_GARAGE_RCCM=Votre-RCCM
VITE_GARAGE_TAX_REGIME=reel
VITE_GARAGE_TAX_ID=Votre-Numéro-Fiscal
VITE_GARAGE_CNI=Votre-CNI

# Configuration Stripe (optionnel)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
VITE_STRIPE_SECRET_KEY=sk_test_your_key
VITE_STRIPE_WEBHOOK_SECRET=whsec_your_webhook
```

### **4. Lancer l'application**
```bash
npm run dev
```

## 🧠 **Configuration Initiale (Système Brain)**

Lors du premier lancement, l'application affiche automatiquement la modale de configuration :

1. **Étape 1** : Informations du garage (nom, propriétaire, logo)
2. **Étape 2** : Coordonnées (adresse, téléphone, email)
3. **Étape 3** : Informations légales (RCCM, régime fiscal, etc.)
4. **Étape 4** : Récapitulatif et finalisation

## 📋 **Structure du Projet**

```
garage/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── BrainModal.tsx   # Configuration initiale
│   │   ├── GarageInfo.tsx   # Affichage infos garage
│   │   └── ui/             # Composants UI
│   ├── hooks/              # Hooks personnalisés
│   │   └── useBrainSetup.ts # Gestion configuration
│   ├── lib/                # Utilitaires
│   │   └── config.ts       # Configuration centralisée
│   ├── pages/              # Pages de l'application
│   └── contexts/           # Contextes React
├── supabase/               # Configuration Supabase
├── env.example             # Variables d'environnement
└── README.md
```

## 🔧 **Technologies Utilisées**

- **Frontend** : React 18, TypeScript, Vite
- **Styling** : Tailwind CSS, shadcn/ui
- **Backend** : Supabase (PostgreSQL, Auth, Storage)
- **Paiements** : Stripe
- **État** : React Context, localStorage

## 📱 **Fonctionnalités Principales**

### **Gestion des Clients**
- Ajout de nouveaux clients
- Historique des interventions
- Informations détaillées

### **Gestion des Véhicules**
- Suivi des réparations
- Historique des interventions
- Informations techniques

### **Gestion du Stock**
- Inventaire en temps réel
- Alertes de stock bas
- Gestion des fournisseurs

### **Factures et Devis**
- Génération automatique
- Informations légales intégrées
- Export PDF

## 🔒 **Sécurité**

- Variables d'environnement pour les clés sensibles
- Validation des données côté client
- Authentification Supabase
- RLS (Row Level Security) activé

## 🎨 **Interface Utilisateur**

- Design responsive
- Thème clair/sombre
- Interface intuitive
- Composants réutilisables

## 📊 **Statistiques**

- Dashboard avec métriques
- Graphiques de performance
- Rapports personnalisables

## 🤝 **Contribution**

1. Fork le projet
2. Créer une branche feature
3. Commiter les changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 **Licence**

Ce projet est sous licence MIT.

## 📞 **Support**

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Consulter la documentation
- Contacter l'équipe de développement

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/d11c87bc-0508-439a-8ea8-5e860396a278) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/d11c87bc-0508-439a-8ea8-5e860396a278) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
