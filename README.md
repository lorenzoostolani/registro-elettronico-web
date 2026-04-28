# Registro Elettronico Web

Applicazione web (Next.js + TypeScript) che mostra in modo chiaro i voti provenienti da **ClasseViva / Spaggiari**, con strumenti aggiuntivi per capire l’andamento scolastico e simulare i prossimi voti necessari per raggiungere un obiettivo.

> Progetto pensato per consultazione rapida da mobile/desktop, con dashboard focalizzata su medie, materie e progressi.

---

## Cos’è

**Registro Elettronico Web** è un frontend moderno che si autentica con credenziali ClasseViva, recupera i voti tramite API e li presenta in una UI più leggibile rispetto al registro classico, mostrando medie e statistiche.

L’app include:
- vista “ultimi voti” e vista per periodi (quadrimestri / generale);
- dettaglio materia con medie per tipologia (scritto/orale/pratico);
- simulatore locale per “quanto devo prendere” e impatto sulla media;
- impostazioni personalizzabili (obiettivi, ordinamento, metodo di media).

---

## A cosa serve

Serve a:
- controllare velocemente la situazione scolastica;
- avere una media più comprensibile (pesata o per tipologie);
- impostare obiettivi globali e per singola materia;
- capire quali voti futuri servono per raggiungere una soglia;
- sperimentare scenari senza alterare dati ufficiali.

---

## Come funziona (architettura)

### 1) Autenticazione
1. L’utente inserisce codice utente/password in `/login`.
2. L’API interna `POST /api/auth/login` inoltra la richiesta al repository Spaggiari.
3. Se il provider richiede scelta profilo (genitore), la UI mostra l’elenco e rifà il login con `ident`.
4. In caso di successo vengono impostati cookie httpOnly di sessione (`rv_token`, `rv_student_id`, `rv_ident`, `rv_profile`) con scadenza 4 ore.

### 2) Protezione rotte
- Il middleware controlla il cookie `rv_token`.
- Se non presente, redirige a `/login`.
- Se già autenticato e si visita `/login`, redirige a `/voti`.

### 3) Recupero voti
- Il client chiama `GET /api/grades`.
- La route server legge token+studentId dalla sessione e recupera i voti dal backend Spaggiari.
- In caso di token scaduto (401/403), l’API forza logout e pulizia cookie.

### 4) Elaborazione dati
Le funzioni di dominio calcolano:
- media pesata su tutti i voti;
- media delle 3 medie (scritto/orale/pratico);
- colore stato media rispetto a soglia/obiettivo;
- voto/i necessari per raggiungere un obiettivo.

### 5) Simulazioni e preferenze locali
Su browser vengono salvati in `localStorage`:
- impostazioni utente (`rv_settings`): obiettivo, ordinamento, modalità media, anno, ecc.;
- voti simulati per materia/periodo (`rv_local_grades`);
- override dei pesi voto nel dettaglio materia.

> Le simulazioni sono locali al dispositivo/browser e **non** modificano i dati del registro ufficiale.

---

## Funzionalità principali

- **Panoramica voti**: ultimi voti con card colorate e dettagli rapidi.
- **Filtri periodo**: ultimi, singolo periodo (es. quadrimestre), generale.
- **Elenco materie**: media, stato colore rispetto obiettivo, indicazione voto necessario.
- **Dettaglio materia**:
  - medie per Scritto/Orale/Pratico;
  - barra progresso verso obiettivo;
  - elenco voti con peso modificabile (solo locale);
  - simulatore nuovi voti.
- **Impostazioni avanzate**:
  - obiettivo globale e obiettivi per materia;
  - ordinamento materie crescente/decrescente;
  - scelta metodo di media globale e per materia;
  - anno scolastico;
  - logout.

---

## Stack tecnologico

- **Framework**: Next.js 15 (App Router)
- **Linguaggio**: TypeScript
- **UI**: React 19 + CSS/Tailwind utility
- **Grafici/UI componenti**: Recharts, componenti custom
- **Runtime/API**: Route Handlers Next.js (Node + alcune route Edge)

---

## Struttura del progetto

```text
app/
  (auth)/login/                 # pagina login
  (dashboard)/voti/             # dashboard voti + dettaglio materia
  (dashboard)/impostazioni/     # impostazioni utente
  api/auth/*                    # login, logout, me
  api/grades/                   # endpoint voti autenticato
  api/proxy/[...path]/          # proxy generico verso API remote

lib/
  domain/grades/entities.ts     # tipi + logiche di calcolo medie/obiettivi
  infrastructure/spaggiari/     # client API + repository
  hooks/                        # stato locale (settings, simulazioni)
  utils/                        # sessione, auth guard, utilità

core/api/apiConfig.ts           # configurazione endpoint/header API
middleware.ts                   # protezione accesso alle rotte
```

---

## Avvio in locale

### Prerequisiti
- Node.js 20+
- npm

### Installazione
```bash
npm install
```

### Sviluppo
```bash
npm run dev
```
Apri [http://localhost:3000](http://localhost:3000).

---

## Note importanti

- L’app usa una sessione basata su cookie httpOnly lato server.
- In produzione i cookie vengono marcati `secure`.
- Se la sessione scade, il client viene reindirizzato al login automaticamente.
- Le credenziali non vengono persistite in `localStorage`.
- Le personalizzazioni utente (obiettivi/simulazioni) sono memorizzate solo in locale.

---


## Licenza

Se non diversamente specificato, tutti i diritti sono riservati al proprietario del repository.
