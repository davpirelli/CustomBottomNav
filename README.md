# Custom Bottom Navigation Card

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=davpirelli&repository=CustomBottomNav&category=plugin)

Una card personalizzata per Home Assistant che aggiunge una barra di navigazione inferiore (o superiore) al tuo dashboard Lovelace.

## Installazione

### HACS (Raccomandato)

1. Apri HACS nel tuo Home Assistant
2. Vai su "Frontend"
3. Clicca sul pulsante "+" 
4. Cerca "Custom Bottom Navigation"
5. Installa

### Manuale

1. Scarica `custom-bottom-nav.js` dalla cartella `dist`
2. Copialo nella cartella `config/www` del tuo Home Assistant
3. Aggiungi la risorsa nel tuo Lovelace:

```yaml
resources:
  - url: /local/custom-bottom-nav.js
    type: module
```

## Configurazione

### Esempio Base

```yaml
type: custom:custom-bottom-nav
routes:
  - path: /lovelace/0
    icon: mdi:home
    label: Home
  - path: /lovelace/1
    icon: mdi:lightbulb
    label: Luci
  - path: /lovelace/2
    icon: mdi:thermometer
    label: Clima
  - path: /lovelace/3
    icon: mdi:cog
    label: Impostazioni
```

### Opzioni di Configurazione

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `routes` | Array | **Richiesto** | Array di oggetti route |
| `show_labels` | Boolean | `true` | Mostra/nascondi le etichette |
| `position` | String | `bottom` | Posizione della navbar (`bottom` o `top`) |

### Configurazione Route

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `path` | String | **Richiesto** | Percorso della vista Lovelace |
| `icon` | String | **Richiesto** | Icona MDI da mostrare |
| `label` | String | - | Etichetta da mostrare sotto l'icona |
| `active_icon` | String | - | Icona da mostrare quando la route è attiva |

### Esempio Avanzato

```yaml
type: custom:custom-bottom-nav
position: bottom
show_labels: true
routes:
  - path: /lovelace/0
    icon: mdi:home-outline
    active_icon: mdi:home
    label: Home
  - path: /lovelace/1
    icon: mdi:lightbulb-outline
    active_icon: mdi:lightbulb
    label: Luci
  - path: /lovelace/2
    icon: mdi:thermometer-lines
    active_icon: mdi:thermometer
    label: Clima
  - path: /lovelace/3
    icon: mdi:cog-outline
    active_icon: mdi:cog
    label: Settings
```

## Sviluppo

### Setup

```bash
npm install
```

### Build

```bash
npm run build
```

### Development

```bash
npm run watch
```

## Licenza

MIT

