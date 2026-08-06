# E-Learning Platform (MERN Stack)

Una piattaforma di corsi online completa (stile Udemy) che permette a docenti e studenti di interagire in modo semplice e sicuro. I docenti possono creare e strutturare corsi in moduli e lezioni, con contenuti video propri o da YouTube; gli studenti possono esplorare il catalogo, iscriversi, seguire i corsi e monitorare i propri progressi in tempo reale.

## 🚀 Funzionalità Principali

### Per gli Studenti
- **Catalogo Corsi**: ricerca testuale con debounce, filtro per categoria e paginazione dei risultati.
- **Iscrizione e Disiscrizione**: gestione autonoma della propria partecipazione ai corsi.
- **Player del Corso**: sidebar di navigazione tra moduli e lezioni, supporto sia a video caricati (Cloudinary) sia a link YouTube.
- **Tracciamento dell'Avanzamento**: percentuale di completamento per corso, "continua a guardare" dall'ultima lezione vista, badge di corso completato.
- **Recensioni**: valutazione a stelle (1-5) e commento testuale per i corsi a cui si è iscritti; una recensione per corso, modificabile.
- **Dashboard personale**: statistiche di sintesi (corsi iscritti, lezioni completate, corsi completati).

### Per i Docenti
- **Gestione Contenuti**: creazione e modifica di corsi, organizzati in moduli e lezioni sequenziali.
- **Upload Media**: caricamento di immagine di copertina del corso e video delle lezioni su Cloudinary, con sostituzione automatica dei file precedenti.
- **Stato Bozza/Pubblicato**: un corso è visibile agli studenti solo quando il docente lo pubblica esplicitamente.
- **Dashboard Docente**: statistiche sui propri corsi (numero di corsi, studenti totali, lezioni create) e conteggio iscritti per singolo corso.
- **Eliminazione Sicura**: cancellazione di corsi, moduli e lezioni con pulizia a cascata di tutti i dati collegati (iscrizioni, progressi, file su Cloudinary).

### Sicurezza e Architettura
- **Autenticazione**: registrazione e login con password criptate (bcrypt) o tramite **Google OAuth** (Google Identity Services), con scelta del ruolo alla prima registrazione.
- **Sessioni**: gestite tramite JSON Web Token (JWT), con rilevamento automatico della scadenza sessione e reindirizzamento al login.
- **Recupero Password**: flusso completo di reset via email (Nodemailer) per gli account con password.
- **Controllo dei Ruoli (RBAC)**: autorizzazioni differenziate tra Studente, Docente e Admin, con controlli di ownership su ogni risorsa (un docente può modificare solo i propri corsi).
- **Notifiche**: sistema di feedback globale tramite toast per ogni azione di successo o errore.

## 🛠️ Tecnologie Utilizzate

- **Frontend**: React (Vite), React Router, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express.js — API RESTful organizzata per moduli funzionali (users, courses, modules, lessons, progress, reviews)
- **Database**: MongoDB con Mongoose
- **Autenticazione**: JWT, Bcrypt, Google Identity Services (google-auth-library)
- **Media Storage**: Cloudinary (immagini e video)
- **Email**: Nodemailer

## 📂 Struttura del Progetto

Il backend segue un'architettura feature-based: ogni entità (courses, modules, lessons, progress, reviews, users) ha una propria cartella con schema, service, controller e router. Il frontend è organizzato per pagine, componenti riutilizzabili e servizi dedicati alle chiamate API.

## 📄 Licenza

Progetto sviluppato a scopo didattico.
