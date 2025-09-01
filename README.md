# NetScope

> Et omfattende netværksdiagnostik værktøj med både Python desktop-version og moderne web-interface til netværkstest, ping, DNS-opslag, geolokation og WiFi-information.

---

## 🚀 Versioner

### 🖥️ **Desktop Version (Python)**
Kraftfuld kommandolinje-værktøj med fuld systemadgang

### 🌐 **Web Version (HTML/CSS/JS)**
Moderne browser-baseret interface med avancerede indstillinger

---

## ✨ Funktioner

### **🌐 Netværksværktøjer:**
- **Ping Test**: Domæne/IP med valgbare antal forsøg og timeout
- **DNS Opslag**: Konverter domæner til IP-adresser
- **IP Geolokation**: Find geografisk placering af IP-adresser
- **Lokal IP**: Vis din nuværende lokale IP-adresse
- **Standard Servere**: Overvåg forbindelse til almindelige internet-services

### **📶 WiFi Værktøjer (kun desktop version):**
- Vis WiFi-navn og password for nuværende netværk
- Se alle synlige WiFi-netværk (SSID'er)
- Detaljeret info om WiFi-netværk (signalstyrke, sikkerhed, m.m.)
- Hent gemte WiFi-passwords

### **⚙️ Web Version - Avancerede Indstillinger:**

#### 🎨 **Udseende**
- **Tema**: Mørkt, lyst eller automatisk
- **Accent farver**: 6 forskellige farver (blå, grøn, rød, gul, lilla, pink)

#### ⚡ **Ydeevne**
- Kontrollerbare samtidige pings (1-10)
- DNS caching med konfigurerbar varighed
- Baggrundsovervågning af netværksstatus

#### 🔔 **Notifikationer**
- Browser notifikationer for netværksproblemer
- Konfigurerbare timeout-grænser
- Lyd alarmer med justerbar lydstyrke

#### 🛡️ **Sikkerhed & Privatliv**
- IP anonymisering i logs
- Automatisk data sletning ved lukning
- Blokering af mistænkelige domæner
- Konfigurerbar geolokation præcision

#### ♿ **Tilgængelighed**
- Høj kontrast tilstand
- Skalerbare skriftstørrelser
- Reducerede animationer for tilgængelighed

#### 👨‍💻 **Udviklerindstillinger**
- Debug tilstand med detaljerede logs
- Brugerdefinerede API endpoints
- Rådata eksport
- Konfigurerbart logging niveau

---

## 📋 Krav

### Desktop Version:
- Python 3.x
- Windows (for WiFi-funktioner)
- Internetforbindelse

### Web Version:
- Moderne webbrowser
- Internetforbindelse
- JavaScript aktiveret

---

## 📥 Installation

### Desktop Version:
1. Klon repository:
   ```powershell
   git clone https://github.com/MrFawsDK/NetScope.git
   ```
2. Skift til mappen:
   ```powershell
   cd NetScope
   ```
3. Kør programmet:
   ```powershell
   python advanced_pingtool.py
   ```

### Web Version:
1. Naviger til `web/` mappen
2. Åbn `index.html` i din browser
3. Eller host filen på en webserver for fuld funktionalitet

---

## 🎯 Brug

### Desktop Version:
Kør programmet med:
```powershell
python advanced_pingtool.py
```

Du får en interaktiv menu:

```
=== NetScope Menu ===
1. Ping domæne/IP
2. DNS-opslag (find IP fra domæne)
3. Geolokation for IP
4. Vis lokal IP
5. Vis standard-servere
6. Vis WiFi-navn og password for nuværende netværk (kun Windows)
7. Vis alle synlige WiFi-netværk (kun Windows)
8. Vis detaljeret info om synlige WiFi-netværk (kun Windows)
9. Vælg gemt WiFi-netværk og se password (kun Windows)
10. Afslut
=====================
```

### Web Version:
1. Åbn `web/index.html` i din browser
2. Naviger med sidebar-menuen:
   - **Dashboard**: Oversigt og statistikker
   - **Ping Test**: Test netværksforbindelser
   - **DNS Lookup**: Konverter domæner til IP'er
   - **IP Geolocation**: Find geografisk placering
   - **Local IP**: Se din lokale IP
   - **Standard Servers**: Overvåg almindelige services
   - **WiFi Tools**: WiFi information (begrænset i browser)
   - **Indstillinger**: Omfattende konfigurations-muligheder

### Indstillinger (Web Version):
- **Tema & Farver**: Tilpas udseendet efter dine præferencer
- **Ydeevne**: Optimer hastighed og ressourceforbrug
- **Notifikationer**: Konfigurer alarmer og advarsler
- **Sikkerhed**: Kontroller data-privatliv og anonymisering
- **Tilgængelighed**: Tilpas for bedre brugbarhed
- **Udvikler**: Avancerede funktioner til debugging

Alle indstillinger gemmes automatisk i din browser og huskes mellem sessioner.

---

## Eksempler på output

**Ping:**
```
Pinger google.com...
DNS-opslag: google.com -> 142.250.74.206
Geolokation: 142.250.74.206 -> Copenhagen, DK
Ping-resultat for google.com (142.250.74.206): Min: 12 ms, Avg: 15 ms, Max: 18 ms, Pakketab: 0%
---
```

**WiFi:**
```
Synlige WiFi-netværk:
- HomeNetwork
- GuestNetwork

## 📖 Eksempler

### Desktop Version Eksempler:

**Ping Test:**
```
=== PING RESULTATER ===
Target: google.com
Sent: 4, Received: 4, Loss: 0.0%
Min: 12ms, Avg: 15ms, Max: 19ms
```

**WiFi Information:**
```
WiFi-navn: HomeNetwork
WiFi-password: hemmeligtpassword123
```

**Geolokation:**
```
IP: 8.8.8.8
Land: United States
By: Mountain View
ISP: Google LLC
```

### Web Version Features:

**Dashboard:**
- Real-time netværksstatus
- Aktivitetslog med timestamps
- Hurtige statistikker

**Avancerede Indstillinger:**
- Persistent lagring i localStorage
- Import/export af konfigurationer
- Real-time tema skift
- Tilgængelighedstilpasninger

---

## 🏗️ Projektstruktur

```
NetScope/
├── advanced_pingtool.py    # Hovedprogram (desktop)
├── network_utils.py        # Netværksfunktioner
├── wifi_utils.py          # WiFi funktioner (Windows)
├── web/                   # Web version
│   ├── index.html         # Hovedside
│   ├── style.css          # Styling og temaer
│   ├── script.js          # Funktionalitet og indstillinger
│   └── README.md          # Web-specifik dokumentation
├── README.md              # Denne fil
└── LICENSE                # Licens information
```

---

## 🔧 Tilpasning

### Desktop Version:
- Modificer `SERVERS` listen i `advanced_pingtool.py`
- Tilføj nye netværksfunktioner i `network_utils.py`
- Udvid WiFi-funktioner i `wifi_utils.py`

### Web Version:
- Tilpas farver og tema i `style.css`
- Tilføj nye funktioner i `script.js`
- Konfigurer API endpoints i indstillinger

---

## 🤝 Bidrag

Vi velkommer bidrag! Åbn gerne en issue eller submit en pull request.

---

## 📄 Licens

Se LICENSE-filen for detaljer.

---

## 👨‍💻 Udviklet af

**FawsDev**
- Website: [fawsdev.dk](https://fawsdev.dk)
- GitHub: [@MrFawsDK](https://github.com/MrFawsDK)

---

## 📊 Version History

- **v2.0.0**: Web interface med avancerede indstillinger
- **v1.0.0**: Initial Python desktop version

---

## Kontakt

Spørgsmål eller forslag? Kontakt [MrFawsDK](https://github.com/MrFawsDK).
