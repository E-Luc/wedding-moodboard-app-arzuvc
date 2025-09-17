
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

const resources = {
  en: {
    translation: {
      // Auth & Welcome
      welcome: "Welcome to",
      appName: "The Wedding Planist",
      tagline: "Your dream wedding, perfectly planned",
      signIn: "Sign In",
      createAccount: "Create Account",
      email: "Email",
      password: "Password",
      firstName: "First Name",
      lastName: "Last Name",
      confirmPassword: "Confirm Password",
      forgotPassword: "Forgot Password?",
      
      // Navigation & Menu
      home: "Home",
      profile: "Profile",
      settings: "Settings",
      logout: "Logout",
      menu: "Menu",
      
      // User Profile Setup
      personalInfo: "Personal Information",
      weddingDetails: "Wedding Details",
      preferences: "Preferences",
      dateOfBirth: "Date of Birth",
      weddingDate: "Wedding Date",
      budget: "Budget",
      venue: "Venue",
      guestCount: "Expected Guest Count",
      weddingStyle: "Wedding Style",
      
      // Main Features
      guestManagement: "Guest Management",
      timeline: "Timeline",
      budgetTracker: "Budget Tracker",
      vendorHub: "Vendor Hub",
      inspirationBoard: "Inspiration Board",
      
      // Common Actions
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      add: "Add",
      upload: "Upload",
      next: "Next",
      previous: "Previous",
      finish: "Finish",
      
      // Messages
      requiredField: "This field is required",
      invalidEmail: "Please enter a valid email",
      passwordMismatch: "Passwords do not match",
      profileSaved: "Profile saved successfully",
      
      // Wedding Planning
      daysUntilWedding: "Days Until Wedding",
      planningProgress: "Planning Progress",
      quickActions: "Quick Actions",
      weddingOverview: "Wedding Overview",
      
      // Utility Messages
      infoUtility: {
        personalInfo: "This information helps us personalize your experience and create a wedding timeline that fits your needs.",
        weddingDetails: "These details are essential for planning your perfect day and managing your budget effectively.",
        preferences: "Your preferences help us suggest vendors, themes, and ideas that match your vision."
      }
    }
  },
  fr: {
    translation: {
      // Auth & Welcome
      welcome: "Bienvenue sur",
      appName: "The Wedding Planist",
      tagline: "Votre mariage de rêve, parfaitement planifié",
      signIn: "Se connecter",
      createAccount: "Créer un compte",
      email: "Email",
      password: "Mot de passe",
      firstName: "Prénom",
      lastName: "Nom",
      confirmPassword: "Confirmer le mot de passe",
      forgotPassword: "Mot de passe oublié ?",
      
      // Navigation & Menu
      home: "Accueil",
      profile: "Profil",
      settings: "Paramètres",
      logout: "Déconnexion",
      menu: "Menu",
      
      // User Profile Setup
      personalInfo: "Informations personnelles",
      weddingDetails: "Détails du mariage",
      preferences: "Préférences",
      dateOfBirth: "Date de naissance",
      weddingDate: "Date du mariage",
      budget: "Budget",
      venue: "Lieu",
      guestCount: "Nombre d'invités attendu",
      weddingStyle: "Style de mariage",
      
      // Main Features
      guestManagement: "Gestion des invités",
      timeline: "Chronologie",
      budgetTracker: "Suivi du budget",
      vendorHub: "Centre des prestataires",
      inspirationBoard: "Tableau d'inspiration",
      
      // Common Actions
      save: "Enregistrer",
      cancel: "Annuler",
      edit: "Modifier",
      delete: "Supprimer",
      add: "Ajouter",
      upload: "Télécharger",
      next: "Suivant",
      previous: "Précédent",
      finish: "Terminer",
      
      // Messages
      requiredField: "Ce champ est obligatoire",
      invalidEmail: "Veuillez saisir un email valide",
      passwordMismatch: "Les mots de passe ne correspondent pas",
      profileSaved: "Profil enregistré avec succès",
      
      // Wedding Planning
      daysUntilWedding: "Jours avant le mariage",
      planningProgress: "Progression de la planification",
      quickActions: "Actions rapides",
      weddingOverview: "Aperçu du mariage",
      
      // Utility Messages
      infoUtility: {
        personalInfo: "Ces informations nous aident à personnaliser votre expérience et créer un planning de mariage adapté à vos besoins.",
        weddingDetails: "Ces détails sont essentiels pour planifier votre jour parfait et gérer efficacement votre budget.",
        preferences: "Vos préférences nous aident à suggérer des prestataires, thèmes et idées qui correspondent à votre vision."
      }
    }
  },
  es: {
    translation: {
      // Auth & Welcome
      welcome: "Bienvenido a",
      appName: "The Wedding Planist",
      tagline: "Tu boda de ensueño, perfectamente planificada",
      signIn: "Iniciar sesión",
      createAccount: "Crear cuenta",
      email: "Correo electrónico",
      password: "Contraseña",
      firstName: "Nombre",
      lastName: "Apellido",
      confirmPassword: "Confirmar contraseña",
      forgotPassword: "¿Olvidaste tu contraseña?",
      
      // Navigation & Menu
      home: "Inicio",
      profile: "Perfil",
      settings: "Configuración",
      logout: "Cerrar sesión",
      menu: "Menú",
      
      // User Profile Setup
      personalInfo: "Información personal",
      weddingDetails: "Detalles de la boda",
      preferences: "Preferencias",
      dateOfBirth: "Fecha de nacimiento",
      weddingDate: "Fecha de la boda",
      budget: "Presupuesto",
      venue: "Lugar",
      guestCount: "Número esperado de invitados",
      weddingStyle: "Estilo de boda",
      
      // Main Features
      guestManagement: "Gestión de invitados",
      timeline: "Cronología",
      budgetTracker: "Seguimiento del presupuesto",
      vendorHub: "Centro de proveedores",
      inspirationBoard: "Tablero de inspiración",
      
      // Common Actions
      save: "Guardar",
      cancel: "Cancelar",
      edit: "Editar",
      delete: "Eliminar",
      add: "Agregar",
      upload: "Subir",
      next: "Siguiente",
      previous: "Anterior",
      finish: "Finalizar",
      
      // Messages
      requiredField: "Este campo es obligatorio",
      invalidEmail: "Por favor ingresa un email válido",
      passwordMismatch: "Las contraseñas no coinciden",
      profileSaved: "Perfil guardado exitosamente",
      
      // Wedding Planning
      daysUntilWedding: "Días hasta la boda",
      planningProgress: "Progreso de planificación",
      quickActions: "Acciones rápidas",
      weddingOverview: "Resumen de la boda",
      
      // Utility Messages
      infoUtility: {
        personalInfo: "Esta información nos ayuda a personalizar tu experiencia y crear una cronología de boda que se adapte a tus necesidades.",
        weddingDetails: "Estos detalles son esenciales para planificar tu día perfecto y gestionar tu presupuesto de manera efectiva.",
        preferences: "Tus preferencias nos ayudan a sugerir proveedores, temas e ideas que coincidan con tu visión."
      }
    }
  },
  de: {
    translation: {
      // Auth & Welcome
      welcome: "Willkommen bei",
      appName: "The Wedding Planist",
      tagline: "Ihre Traumhochzeit, perfekt geplant",
      signIn: "Anmelden",
      createAccount: "Konto erstellen",
      email: "E-Mail",
      password: "Passwort",
      firstName: "Vorname",
      lastName: "Nachname",
      confirmPassword: "Passwort bestätigen",
      forgotPassword: "Passwort vergessen?",
      
      // Navigation & Menu
      home: "Startseite",
      profile: "Profil",
      settings: "Einstellungen",
      logout: "Abmelden",
      menu: "Menü",
      
      // User Profile Setup
      personalInfo: "Persönliche Informationen",
      weddingDetails: "Hochzeitsdetails",
      preferences: "Präferenzen",
      dateOfBirth: "Geburtsdatum",
      weddingDate: "Hochzeitsdatum",
      budget: "Budget",
      venue: "Veranstaltungsort",
      guestCount: "Erwartete Gästeanzahl",
      weddingStyle: "Hochzeitsstil",
      
      // Main Features
      guestManagement: "Gästeverwaltung",
      timeline: "Zeitplan",
      budgetTracker: "Budget-Tracker",
      vendorHub: "Anbieter-Hub",
      inspirationBoard: "Inspirations-Board",
      
      // Common Actions
      save: "Speichern",
      cancel: "Abbrechen",
      edit: "Bearbeiten",
      delete: "Löschen",
      add: "Hinzufügen",
      upload: "Hochladen",
      next: "Weiter",
      previous: "Zurück",
      finish: "Fertig",
      
      // Messages
      requiredField: "Dieses Feld ist erforderlich",
      invalidEmail: "Bitte geben Sie eine gültige E-Mail ein",
      passwordMismatch: "Passwörter stimmen nicht überein",
      profileSaved: "Profil erfolgreich gespeichert",
      
      // Wedding Planning
      daysUntilWedding: "Tage bis zur Hochzeit",
      planningProgress: "Planungsfortschritt",
      quickActions: "Schnellaktionen",
      weddingOverview: "Hochzeitsübersicht",
      
      // Utility Messages
      infoUtility: {
        personalInfo: "Diese Informationen helfen uns, Ihre Erfahrung zu personalisieren und einen Hochzeitszeitplan zu erstellen, der Ihren Bedürfnissen entspricht.",
        weddingDetails: "Diese Details sind wichtig für die Planung Ihres perfekten Tages und die effektive Verwaltung Ihres Budgets.",
        preferences: "Ihre Präferenzen helfen uns, Anbieter, Themen und Ideen vorzuschlagen, die Ihrer Vision entsprechen."
      }
    }
  },
  it: {
    translation: {
      // Auth & Welcome
      welcome: "Benvenuto su",
      appName: "The Wedding Planist",
      tagline: "Il tuo matrimonio da sogno, perfettamente pianificato",
      signIn: "Accedi",
      createAccount: "Crea account",
      email: "Email",
      password: "Password",
      firstName: "Nome",
      lastName: "Cognome",
      confirmPassword: "Conferma password",
      forgotPassword: "Password dimenticata?",
      
      // Navigation & Menu
      home: "Home",
      profile: "Profilo",
      settings: "Impostazioni",
      logout: "Esci",
      menu: "Menu",
      
      // User Profile Setup
      personalInfo: "Informazioni personali",
      weddingDetails: "Dettagli del matrimonio",
      preferences: "Preferenze",
      dateOfBirth: "Data di nascita",
      weddingDate: "Data del matrimonio",
      budget: "Budget",
      venue: "Location",
      guestCount: "Numero di ospiti previsto",
      weddingStyle: "Stile del matrimonio",
      
      // Main Features
      guestManagement: "Gestione ospiti",
      timeline: "Timeline",
      budgetTracker: "Tracker budget",
      vendorHub: "Hub fornitori",
      inspirationBoard: "Board ispirazione",
      
      // Common Actions
      save: "Salva",
      cancel: "Annulla",
      edit: "Modifica",
      delete: "Elimina",
      add: "Aggiungi",
      upload: "Carica",
      next: "Avanti",
      previous: "Indietro",
      finish: "Finisci",
      
      // Messages
      requiredField: "Questo campo è obbligatorio",
      invalidEmail: "Inserisci un'email valida",
      passwordMismatch: "Le password non corrispondono",
      profileSaved: "Profilo salvato con successo",
      
      // Wedding Planning
      daysUntilWedding: "Giorni al matrimonio",
      planningProgress: "Progresso pianificazione",
      quickActions: "Azioni rapide",
      weddingOverview: "Panoramica matrimonio",
      
      // Utility Messages
      infoUtility: {
        personalInfo: "Queste informazioni ci aiutano a personalizzare la tua esperienza e creare una timeline del matrimonio adatta alle tue esigenze.",
        weddingDetails: "Questi dettagli sono essenziali per pianificare il tuo giorno perfetto e gestire efficacemente il tuo budget.",
        preferences: "Le tue preferenze ci aiutano a suggerire fornitori, temi e idee che corrispondono alla tua visione."
      }
    }
  },
  pt: {
    translation: {
      // Auth & Welcome
      welcome: "Bem-vindo ao",
      appName: "The Wedding Planist",
      tagline: "Seu casamento dos sonhos, perfeitamente planejado",
      signIn: "Entrar",
      createAccount: "Criar conta",
      email: "Email",
      password: "Senha",
      firstName: "Nome",
      lastName: "Sobrenome",
      confirmPassword: "Confirmar senha",
      forgotPassword: "Esqueceu a senha?",
      
      // Navigation & Menu
      home: "Início",
      profile: "Perfil",
      settings: "Configurações",
      logout: "Sair",
      menu: "Menu",
      
      // User Profile Setup
      personalInfo: "Informações pessoais",
      weddingDetails: "Detalhes do casamento",
      preferences: "Preferências",
      dateOfBirth: "Data de nascimento",
      weddingDate: "Data do casamento",
      budget: "Orçamento",
      venue: "Local",
      guestCount: "Número esperado de convidados",
      weddingStyle: "Estilo do casamento",
      
      // Main Features
      guestManagement: "Gestão de convidados",
      timeline: "Cronograma",
      budgetTracker: "Rastreador de orçamento",
      vendorHub: "Hub de fornecedores",
      inspirationBoard: "Quadro de inspiração",
      
      // Common Actions
      save: "Salvar",
      cancel: "Cancelar",
      edit: "Editar",
      delete: "Excluir",
      add: "Adicionar",
      upload: "Enviar",
      next: "Próximo",
      previous: "Anterior",
      finish: "Finalizar",
      
      // Messages
      requiredField: "Este campo é obrigatório",
      invalidEmail: "Por favor, insira um email válido",
      passwordMismatch: "As senhas não coincidem",
      profileSaved: "Perfil salvo com sucesso",
      
      // Wedding Planning
      daysUntilWedding: "Dias até o casamento",
      planningProgress: "Progresso do planejamento",
      quickActions: "Ações rápidas",
      weddingOverview: "Visão geral do casamento",
      
      // Utility Messages
      infoUtility: {
        personalInfo: "Essas informações nos ajudam a personalizar sua experiência e criar um cronograma de casamento que atenda às suas necessidades.",
        weddingDetails: "Esses detalhes são essenciais para planejar seu dia perfeito e gerenciar seu orçamento de forma eficaz.",
        preferences: "Suas preferências nos ajudam a sugerir fornecedores, temas e ideias que correspondam à sua visão."
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: Localization.locale.split('-')[0] || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
