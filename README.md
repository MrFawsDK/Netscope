# Advanced PingTool

Et avanceret Python-værktøj til at pinge servere og vise detaljeret information om IP-adresser, svartider og geolokation.

## Funktioner
- Pinger en række foruddefinerede servere (domæner og IP'er)
- Viser lokal IP-adresse
- Viser min/avg/max svartider og pakketab
- Henter geolokation for IP-adresser
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

## Output
Programmet viser:
- Din lokale IP-adresse
- Resultater for hver server: IP, geolokation, min/avg/max svartider og pakketab

Eksempel:
```
Din lokale IP: 192.168.1.100

Pinger google.com...
IP: 142.250.74.206 (Copenhagen, DK)
Min: 12 ms, Avg: 15 ms, Max: 18 ms, Pakketab: 0
---
```

## Tilpasning
- Tilføj eller fjern servere i listen `SERVERS` i `advanced_pingtool.py`
- Udvid med flere funktioner efter behov

## Licens
Se LICENSE-filen for detaljer.

## Kontakt
Spørgsmål eller forslag? Kontakt [MrFawsDK](https://github.com/MrFawsDK).
