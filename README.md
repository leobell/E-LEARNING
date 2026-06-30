# Piattaforma di E-Learning (MERN Stack)

Una piattaforma di corsi online completa ed intuitiva (stile Udemy) progettata per permettere a docenti e studenti di interagire in modo semplice e sicuro. I professori possono strutturare i propri corsi in moduli e lezioni, mentre gli studenti possono iscriversi, seguire i contenuti e monitorare i propri progressi in tempo reale.

---

## 🚀 Funzionalità Principali

### Per gli Studenti
* **Catalogo Corsi:** Esplorazione e iscrizione ai corsi disponibili sulla piattaforma.
* **Tracciamento dell'Avanzamento:** Monitoraggio visivo della percentuale di completamento di ciascun corso.
* **Esperienza Fluida:** Interfaccia reattiva per passare facilmente da una lezione all'altra.

### Per i Docenti
* **Gestione Contenuti:** Pannello dedicato per la creazione e la modifica dei corsi.
* **Struttura a Moduli:** Possibilità di organizzare le lezioni in moduli sequenziali per una migliore didattica.
* **Caricamento Lezioni:** Strumenti per inserire e gestire i materiali di studio.

### Sicurezza e Architettura
* **Autenticazione Sicura:** Sistema di registrazione e login con password criptate.
* **Gestione delle Sessioni:** Accesso protetto e persistente tramite JSON Web Tokens (JWT).
* **Controllo dei Ruoli (RBAC):** Autorizzazioni differenziate per garantire un'esperienza d'uso protetta in base al tipo di utente (Studente/Docente).

---

## 🛠️ Tecnologie Utilizzate

Il progetto è interamente sviluppato sfruttando i vantaggi dello **stack MERN**:

* **Frontend:** React.js – Per un'interfaccia utente interattiva, veloce e a componenti riutilizzabili.
* **Backend:** Node.js & Express.js – Per la creazione di una robusta API RESTful e la gestione delle logiche di business.
* **Database:** MongoDB – Database non relazionale (NoSQL) flessibile per la memorizzazione dei dati di utenti, corsi e progressi.
* **Sicurezza:** JWT (JSON Web Tokens) & Bcrypt – Per la crittografia delle password e la protezione delle rotte API.

---
