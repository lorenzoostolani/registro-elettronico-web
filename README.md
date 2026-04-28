# Registro Elettronico Web

Registro Elettronico Web è un frontend moderno per **ClasseViva Spaggiari**, recupera i voti tramite API e li presenta in una UI più leggibile rispetto al registro classico, mostrando medie e statistiche dettagliate.

![Next.js](https://img.shields.io/badge/Next.js_15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-black?style=flat-square&logo=vercel)

👉 **[Apri la web app](https://registro-elettronico-web.vercel.app)**

---

<details>
<summary><strong>Come funziona</strong></summary>
<br>

**1. Autenticazione**
L'utente inserisce le credenziali in `/login`. L'API interna `POST /api/auth/login` le inoltra a Spaggiari. Se è richiesta la selezione profilo (es. genitore), la UI mostra l'elenco e ripete il login con `ident`. In caso di successo vengono impostati cookie `httpOnly` di sessione con scadenza 4 ore.

**2. Protezione rotte**
Il middleware controlla il cookie `rv_token`. Se assente, redirige a `/login`. Se già autenticato, redirige direttamente a `/voti`.

**3. Recupero voti**
Il client chiama `GET /api/grades`. La route legge token e studentId dalla sessione e recupera i dati da Spaggiari. In caso di sessione scaduta (401/403), l'API forza il logout e pulisce i cookie.

**4. Elaborazione dati**
Le funzioni di dominio calcolano media pesata, media per tipologia (scritto/orale/pratico), stato colore rispetto all'obiettivo e voti necessari per raggiungerlo.

**5. Simulazioni e preferenze locali**
In `localStorage` vengono salvate impostazioni (`rv_settings`), voti simulati (`rv_local_grades`) e override dei pesi. Le simulazioni sono locali al browser e non modificano i dati ufficiali.

</details>

---

<details>
<summary><strong>Funzionalità</strong></summary>
<br>

| Funzionalità | Descrizione |
|---|---|
| **Panoramica voti** | Card colorate con ultimi voti e filtro per periodo (quadrimestre / generale) |
| **Elenco materie** | Media per materia, stato colore rispetto all'obiettivo e voto necessario |
| **Dettaglio materia** | Medie per scritto/orale/pratico, barra progresso, pesi modificabili e simulatore |
| **Simulatore** | Calcola quale voto occorre per raggiungere un obiettivo, senza alterare i dati ufficiali |
| **Impostazioni** | Obiettivi globali e per materia, ordinamento, metodo di media, anno scolastico e logout |
| **Metodi di media** | Media pesata su tutti i voti oppure media delle medie per tipologia, configurabile per materia |

</details>

---

<details>
<summary><strong>Stack tecnologico</strong></summary>
<br>

| Ruolo | Tecnologia |
|---|---|
| Framework | Next.js 15 (App Router) |
| Linguaggio | TypeScript |
| UI | React 19 + Tailwind CSS |
| Grafici | Recharts + componenti custom |
| API runtime | Next.js Route Handlers (Node + Edge) |
| Deploy | Vercel |

</details>

---

<details>
<summary><strong>Struttura del progetto</strong></summary>
<br>

```text
app/
  (auth)/login/             # pagina di login
  (dashboard)/voti/         # dashboard voti + dettaglio materia
  (dashboard)/impostazioni/ # impostazioni utente
  api/auth/                 # login, logout, me
  api/grades/               # endpoint voti autenticato
  api/proxy/[...path]/      # proxy verso API remote

lib/
  domain/grades/entities.ts # tipi e logiche di calcolo
  infrastructure/spaggiari/ # client API + repository
  hooks/                    # stato locale (settings, simulazioni)
  utils/                    # sessione, auth guard, utilità

core/
  api/apiConfig.ts          # endpoint e header API

middleware.ts               # protezione accesso alle rotte
```

</details>

---

<details>
<summary><strong>Avvio in locale</strong></summary>
<br>

**Prerequisiti:** Node.js 20+ e npm.

```bash
# Installazione dipendenze
npm install

# Avvio in sviluppo
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser.

</details>

---

<sub>Tutti i diritti riservati al proprietario del repository.</sub>
