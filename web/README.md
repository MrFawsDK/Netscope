# NetScope Web Version

Moderne browser-baseret netværksdiagnostik værktøj med avancerede indstillinger og responsivt design.

## ✨ Funktioner

### 🌐 **Netværksværktøjer:**
- **Ping Test**: Simuleret ping til domæner og IP-adresser med konfigurerbare indstillinger
- **DNS Lookup**: Find IP-adresser for domæner med caching support
- **IP Geolocation**: Find geografisk placering med konfigurerbar præcision
- **Local IP**: Hent din lokale IP-adresse (browser-begrænset)
- **Standard Servers**: Overvåg forbindelse til almindelige services

### ⚙️ **Avancerede Indstillinger:**

#### 🎨 **Udseende & Tema**
- **Tema**: Mørkt, lyst eller automatisk baseret på system
- **Accent Farver**: 6 forskellige farvetemaer
- **Kompakt Tilstand**: Reduceret spacing for større skærme

#### ⚡ **Ydeevne Indstillinger**
- **Maksimale Samtidige Pings**: 1-10 samtidige forbindelser
- **DNS Caching**: Gem resultater for hurtigere opslag
- **Cache Varighed**: Konfigurerbar 1-60 minutter
- **Baggrundsovervågning**: Kontinuerlig netværksovervågning

#### 🔔 **Notifikationer**
- **Browser Notifikationer**: Alerts ved netværksproblemer
- **Timeout Grænser**: Konfigurerbare advarselsgrænser
- **Lyd Alarmer**: Audio feedback med justerbar lydstyrke

#### 🛡️ **Sikkerhed & Privatliv**
- **IP Anonymisering**: Skjul dele af IP-adresser i logs
- **Data Rydning**: Automatisk sletning ved browser lukning
- **Mistænkelige Domæner**: Blokering af kendte skadelige sites
- **Geolokation Præcision**: By, region eller land-niveau

#### ♿ **Tilgængelighed**
- **Høj Kontrast**: Øget synlighed for synsnedsatte
- **Skriftstørrelser**: Lille, normal, stor og ekstra stor
- **Reducerede Animationer**: Minimal bevægelse for tilgængelighed

#### 👨‍💻 **Udviklerindstillinger**
- **Debug Mode**: Detaljerede logs og fejlinformation
- **Brugerdefinerede API**: Konfigurer egne endpoints
- **Rådata Eksport**: Download alle data som JSON
- **Console Logging**: Konfigurerbare log-niveauer

### 📊 **Dashboard & Monitoring**
- **Real-time Status**: Live netværksstatus opdateringer
- **Aktivitetslog**: Detaljeret historie med timestamps
- **Statistikker**: Netværks ydeevne metrics
- **Auto-refresh**: Automatisk opdatering hvert 30. sekund

## 🚀 Sådan bruges det

1. **Åbn**: `index.html` i din moderne browser
2. **Naviger**: Brug sidebar-menuen til at vælge værktøjer
3. **Konfigurer**: Juster indstillinger efter dine behov
4. **Overvåg**: Se real-time resultater på dashboard

## 🛠️ Tekniske Detaljer

### 📁 **Fil Struktur:**
- `index.html` - Hovedstruktur med moderne UI komponenter
- `style.css` - Avanceret styling med CSS custom properties og responsivt design
- `script.js` - Omfattende JavaScript med modulær arkitektur og avancerede funktioner

### 🔧 **Teknologier:**
- **HTML5**: Moderne semantisk markup med accessibility support
- **CSS3**: Custom properties, Grid/Flexbox layout, responsive design
- **JavaScript ES6+**: Modulær kode, localStorage, async/await
- **Font Awesome**: Ikonesystem for konsistent UI
- **LocalStorage API**: Persistent indstillingslagring

### 📱 **Browser Kompatibilitet:**
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### 🚀 **Ydeevne Optimering:**
- CSS Grid og Flexbox for effektiv layout
- Debounced input handling
- Efficient DOM manipulation
- Lazy loading af komponenter

## ⚠️ **Browser Begrænsninger:**

### **Simulerede Funktioner:**
- **Ping**: Browsere kan ikke udføre rigtige ICMP ping (viser realistiske latency-værdier)
- **DNS Opslag**: Bruger foruddefinerede IP-mappings for kendte domæner
- **Geolokation**: Bruger database af kendte IP-ranges og locations

### **Reelle Funktioner:**
- **WebRTC IP Discovery**: Find lokal IP hvor browseren tillader det
- **Fetch API**: HTTP requests til tilgængelige services
- **Notification API**: Browser notifikationer (med bruger-tilladelse)
- **Responsive Design**: Automatisk tilpasning til alle enheder

### **Ikke Tilgængelige:**
- **WiFi Information**: Browser-sikkerhed blokerer adgang til WiFi interfaces
- **System Network Commands**: Ingen adgang til OS-niveau kommandoer
- **Raw Sockets**: ICMP ping kræver privilegeret adgang

## 💾 **Data Lagring:**

### **LocalStorage:**
- Alle brugerindstillinger gemmes persistent
- Aktivitetslog (med konfigurerbar grænse)
- Tema og farve præferencer
- Performance indstillinger

### **Session Data:**
- Midlertidige netværks resultater
- Cache for DNS lookups
- Geolocation data

### **Export/Import:**
- JSON export af alle indstillinger
- Backup og restore funktionalitet
- Cross-browser kompatibilitet

## 🎯 **Hosting Anbefalinger:**

### **Lokal Brug:**
- Åbn direkte i browser (file:// protocol)
- Begrænsede funktioner på grund af CORS

### **HTTP Server:**
- Fuld funktionalitet tilgængelig
- Bedre fejlhåndtering
- CORS support for API calls

### **HTTPS:**
- Påkrævet for Notification API
- WebRTC fungerer bedst med HTTPS
- Moderne browser funktioner aktiveret

## 🛠️ **For Udviklere:**

### **Udvidelsesmuligheder:**
- Server-side implementering for rigtige ping-kommandoer
- API-integration for reelle geolokationstjenester
- WebSocket-forbindelser for realtidsdata
- Progressive Web App (PWA) funktionalitet

### **Kodearkeitektur:**
- Modulær JavaScript struktur
- CSS custom properties for tema-system
- Event-driven design patterns
- Async/await for asynkron kode

---

**💡 Pro Tip:** For fuld funktionalitet og rigtige netværkskommandoer, brug desktop-versionen af NetScope.
