
# Advanced PingTool

Et avanceret Python-værktøj med interaktiv menu til netværkstest, ping, DNS-opslag, geolokation og mere.

## Funktioner
- Interaktiv menu med valg:
  - Ping domæne/IP (vælg selv mål og antal forsøg)
  - DNS-opslag (find IP fra domæne)
  - Geolokation for IP-adresser
  - Vis din lokale IP
  - Vis standard-servere
  - Afslut programmet
- Pinger og viser min/avg/max svartider og pakketab
- Henter geolokation for IP-adresser
- Viser detaljerede og brugervenlige fejlmeddelelser
- Understøtter både Windows og Linux/Mac

## Krav
- Python 3.x
- Internetforbindelse

## Installation
1. Download eller klon dette repository:
   ```powershell
   git clone https://github.com/MrFawsDK/PingTool.git
   ```
2. Skift til mappen:
   ```powershell
   cd PingTool
   ```

## Brug
Kør programmet med:
```powershell
python advanced_pingtool.py
```

## Menu og Output
Du får en menu hvor du kan vælge handling. Eksempel:
```
=== PingTool Menu ===
1. Ping domæne/IP
2. DNS-opslag (find IP fra domæne)
3. Geolokation for IP
4. Vis lokal IP
5. Vis standard-servere
6. Afslut
=====================
Vælg handling (1-6):
```
Ved fejl får du tydelige beskeder med forslag til løsning.

## Tilpasning
- Tilføj eller fjern servere i listen `SERVERS` i `advanced_pingtool.py`
- Udvid med flere funktioner efter behov

## Licens
Se LICENSE-filen for detaljer.

## Kontakt
Spørgsmål eller forslag? Kontakt [MrFawsDK](https://github.com/MrFawsDK).
