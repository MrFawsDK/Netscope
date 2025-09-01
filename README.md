# NetScope

> Et avanceret Python-værktøj med interaktiv menu til netværkstest, ping, DNS-opslag, geolokation og WiFi-information.

---

## Funktioner

**Netværk:**
- Ping domæne/IP (vælg selv mål og antal forsøg)
- DNS-opslag (find IP fra domæne)
- Geolokation for IP-adresser
- Vis din lokale IP
- Vis standard-servere

**WiFi (kun Windows):**
- Vis WiFi-navn og password for nuværende netværk
- Se alle synlige WiFi-netværk (SSID'er)
- Se detaljeret info om alle synlige WiFi-netværk (signalstyrke, sikkerhed, m.m.)
- Vælg et gemt netværk og se dets password

**Generelt:**
- Pinger og viser min/avg/max svartider og pakketab
- Henter geolokation for IP-adresser
- Viser detaljerede og brugervenlige fejlmeddelelser
- Understøtter både Windows og Linux/Mac (WiFi-funktioner kun Windows)

---

## Krav

- Python 3.x
- Internetforbindelse

---

## Installation

1. Download eller klon dette repository:
   ```powershell
   git clone https://github.com/MrFawsDK/NetScope.git
   ```
2. Skift til mappen:
   ```powershell
   cd NetScope
   ```

---

## Brug

Kør programmet med:
```powershell
python advanced_pingtool.py
```

Du får en interaktiv menu, hvor du kan vælge:

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

Ved fejl får du tydelige beskeder med forslag til løsning.

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

Detaljeret info om synlige WiFi-netværk:
SSID 1 : HomeNetwork
    Network type            : Infrastructure
    Authentication          : WPA2-Personal
    Encryption              : CCMP
    Signal                  : 85%
    ...
```

**Gemte WiFi-netværk:**
```
Gemte WiFi-netværk:
1. HomeNetwork
2. GuestNetwork
Vælg nummer på netværk for at se password: 1
WiFi-navn: HomeNetwork
WiFi-password: hemmeligtpassword123
```

---

## Tilpasning

- Tilføj eller fjern servere i listen `SERVERS` i `advanced_pingtool.py`
- Udvid med flere funktioner efter behov

---

## Licens

Se LICENSE-filen for detaljer.

---

## Kontakt

Spørgsmål eller forslag? Kontakt [MrFawsDK](https://github.com/MrFawsDK).
