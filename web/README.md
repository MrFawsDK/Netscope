# NetScope Web Version

Dette er web-versionen af NetScope, implementeret som en moderne HTML/CSS/JavaScript hjemmeside.

## Funktioner

### 🌐 Tilgængelige funktioner:
- **Ping Domæne/IP**: Simuleret ping til domæner og IP-adresser
- **DNS Opslag**: Find IP-adresser for domæner
- **IP Geolokation**: Find geografisk placering for IP-adresser
- **Vis Lokal IP**: Hent din lokale IP-adresse (begrænset af browser-sikkerhed)
- **Standard Servere**: Ping alle standard servere på én gang

### ⚠️ Begrænsninger:
- **WiFi-funktioner**: Ikke tilgængelige i browsere af sikkerhedshensyn
- **Ping**: Simuleret da browsere ikke kan udføre rigtige ping-kommandoer
- **Lokal IP**: Begrænset adgang på grund af browser-sikkerhed

## Sådan bruges det

1. Åbn `index.html` i din browser
2. Vælg en funktion fra hovedmenuen
3. Indtast de nødvendige oplysninger
4. Klik på handlingsknappen for at køre funktionen

## Tekniske detaljer

### Filer:
- `index.html` - Hovedstrukturen og brugergrænsefladen
- `style.css` - Styling og responsive design
- `script.js` - JavaScript funktionalitet og logik

### Funktioner der simuleres:
- Ping-kommandoer (viser realistiske latency-værdier)
- DNS-opslag (bruger foruddefinerede IPs for kendte domæner)
- Geolokation (bruger en liste af common locations)

### Reelle funktioner:
- WebRTC til at finde lokal IP (hvor muligt)
- Responsive design til alle enheder
- Moderne browser APIs

## Browser-kompatibilitet

Fungerer med alle moderne browsere:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## For udviklere

Koden er struktureret modulært og kan nemt udvides med:
- Server-side implementering for rigtige ping-kommandoer
- API-integration for reelle geolokationstjenester
- WebSocket-forbindelser for realtidsdata

## Sikkerhed

Web-versionen respekterer browser-sikkerhedsbegrænsninger:
- Ingen adgang til systemkommandoer
- Begrænset netværksadgang
- Ingen WiFi-interface adgang
- Sandboxed miljø

For fuld funktionalitet, brug desktop-versionen af NetScope.
