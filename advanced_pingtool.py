import subprocess
import platform
import sys
import socket
import json
import urllib.request
# Optional imports for security tools
try:
    import whois
except ImportError:
    whois = None
try:
    import nmap
except ImportError:
    nmap = None
import ssl
import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed

SERVERS = [
    "google.com",
    "cloudflare.com",
    "1.1.1.1",
    "8.8.8.8",
    "github.com"
]

def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = "N/A"
    finally:
        s.close()
    return ip

def get_ip_location(ip):
    try:
        with urllib.request.urlopen(f"https://ipinfo.io/{ip}/json") as url:
            data = json.loads(url.read().decode())
            return data.get("city", "Unknown"), data.get("country", "Unknown")
    except Exception:
        return "Unknown", "Unknown"

def parse_ping_output(output):
    min_time = max_time = avg_time = loss = None
    if platform.system().lower() == "windows":
        for line in output.splitlines():
            if "Minimum" in line and "Maximum" in line:
                # Eksempel: Minimum = 12ms, Maximum = 18ms, Average = 15ms
                try:
                    parts = line.replace('=', '').replace('ms', '').replace(',', '').split()
                    min_time = int(parts[1])
                    max_time = int(parts[3])
                    avg_time = int(parts[5])
                except Exception:
                    min_time = max_time = avg_time = None
            if "Lost" in line and "%" in line:
                # Eksempel: Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)
                try:
                    percent = line.split("(")[1].split("%") [0]
                    loss = float(percent.strip())
                except Exception:
                    loss = None
    else:
        for line in output.splitlines():
            if "min/avg/max" in line:
                try:
                    stats = line.split('=')[1].split()[0].split('/')
                    min_time, avg_time, max_time = map(float, stats[:3])
                except Exception:
                    min_time = avg_time = max_time = None
            if "packet loss" in line:
                try:
                    loss = float(line.split('%')[0].split()[-1])
                except Exception:
                    loss = None
    return min_time, avg_time, max_time, loss

def ping(host, count=4):
    param = "-n" if platform.system().lower() == "windows" else "-c"
    command = ["ping", param, str(count), host]
    try:
        output = subprocess.check_output(command, universal_newlines=True)
        min_time, avg_time, max_time, loss = parse_ping_output(output)
        return min_time, avg_time, max_time, loss, output
    except Exception as e:
        return None, None, None, None, str(e)

def main():
    print("Din lokale IP:", get_local_ip())
    print()
    for server in SERVERS:
        print(f"Pinger {server}...")
        min_time, avg_time, max_time, loss, output = ping(server)
        try:
            ip = socket.gethostbyname(server)
        except:
            ip = "N/A"
        city, country = get_ip_location(ip)
        print(f"IP: {ip} ({city}, {country})")
        print(f"Min: {min_time} ms, Avg: {avg_time} ms, Max: {max_time} ms, Pakketab: {loss}")
        print("---")
    print("\nTjek domæner og ping mellem IP'er kan tilføjes efter behov.")

def menu():
    print("\n=== PingTool Menu ===")
    print("1. Ping domæne/IP")
    print("2. DNS-opslag (find IP fra domæne)")
    print("3. Geolokation for IP")
    print("4. Vis lokal IP")
    print("5. Vis standard-servere")
    print("6. Vis WiFi-navn og password for nuværende netværk (kun Windows)")
    print("7. Vis alle synlige WiFi-netværk (kun Windows)")
    print("8. Vis detaljeret info om synlige WiFi-netværk (kun Windows)")
    print("9. Vælg gemt WiFi-netværk og se password (kun Windows)")
    print("10. Afslut")
    print("11. Sikkerhed & Netværksanalyse")

def security_menu():
    print("\n=== Sikkerhed & Netværksanalyse ===")
    print("1. Portscanner (socket/nmap)")
    print("2. Traceroute (Windows tracert / Linux/Mac traceroute)")
    print("3. Reverse DNS (IP -> host)")
    print("4. Whois-opslag (domæne)")
    print("5. SSL/TLS-certifikatcheck (udsteder + udløb)")
    print("6. Check for IPv6 (AAAA)")
    print("7. Tilbage")
    print("====================================")

# --- Sikkerhedsfunktioner ---
def security_portscan(target: str, port_start: int = 1, port_end: int = 1024, timeout: float = 0.5, workers: int = 200) -> list[tuple[int, str]]:
    """Scanner TCP-porte på target. Returnerer liste over åbne porte og service."""
    open_ports = []
    def scan_port(port):
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.settimeout(timeout)
            result = s.connect_ex((target, port))
            s.close()
            if result == 0:
                try:
                    service = socket.getservbyport(port)
                except Exception:
                    service = "ukendt"
                return (port, service)
        except Exception:
            pass
        return None
    # Nmap support
        try:
            import nmap
            nm = nmap.PortScanner()
            nm.scan(target, f"{port_start}-{port_end}")
            for proto in nm[target].all_protocols():
                for port in nm[target][proto]:
                    service = nm[target][proto][port].get('name', 'ukendt')
                    open_ports.append((port, service))
            if open_ports:
                return open_ports
        except ImportError:
            print("Nmap-biblioteket er ikke installeret. Socket bruges som fallback. Installer med: pip install python-nmap")
        except Exception as e:
            print(f"Nmap fejlede, bruger socket fallback: {e}")
    # Socket fallback
    with ThreadPoolExecutor(max_workers=workers) as executor:
        futures = {executor.submit(scan_port, p): p for p in range(port_start, port_end+1)}
        for f in as_completed(futures):
            res = f.result()
            if res:
                open_ports.append(res)
    return open_ports

def security_traceroute(target: str, max_hops: int = 30, timeout: int = 2) -> list[dict]:
    """Kører traceroute/tracert til target. Returnerer liste af hops."""
    system = platform.system().lower()
    if system == "windows":
        cmd = ["tracert", "-h", str(max_hops), target]
    else:
        cmd = ["traceroute", "-m", str(max_hops), "-w", str(timeout), target]
    try:
        output = subprocess.check_output(cmd, universal_newlines=True)
    except FileNotFoundError:
        print(f"Værktøjet {'tracert' if system=='windows' else 'traceroute'} ikke fundet. Installer det via systemets pakkehåndtering.")
        return []
    except Exception as e:
        print(f"Traceroute fejlede: {e}")
        return []
    hops = []
    for line in output.splitlines():
        if system == "windows":
            if line.strip().startswith(str(len(hops)+1)):
                parts = line.split()
                if len(parts) >= 4:
                    ip = parts[-1] if parts[-1].count('.')==3 else None
                    rtt = None
                    for p in parts[1:-1]:
                        if "ms" in p:
                            try:
                                rtt = float(p.replace("ms", ""))
                            except:
                                rtt = None
                    hops.append({"hop": len(hops)+1, "ip": ip, "rtt_ms": rtt})
        else:
            if line.strip() and line[0].isdigit():
                parts = line.split()
                hop = int(parts[0])
                ip = None
                rtt = None
                for p in parts[1:]:
                    if p.count('.')==3:
                        ip = p
                    if "ms" in p:
                        try:
                            rtt = float(p.replace("ms", ""))
                        except:
                            rtt = None
                hops.append({"hop": hop, "ip": ip, "rtt_ms": rtt})
    return hops

def security_reverse_dns(ip: str) -> str | None:
    """Reverse DNS opslag for IP. Returnerer hostnavn eller None."""
    try:
        return socket.gethostbyaddr(ip)[0]
    except Exception:
        return None

def security_whois(domain: str) -> dict:
    """Whois-opslag for domæne. Returnerer dict med nøgler."""
    result = {}
    if whois:
        try:
            w = whois.whois(domain)
            result = {
                "registrar": getattr(w, "registrar", None),
                "creation_date": str(getattr(w, "creation_date", "")),
                "expiry_date": str(getattr(w, "expiration_date", "")),
                "name_servers": list(getattr(w, "name_servers", []) or [])
            }
            return result
        except Exception as e:
            print(f"python-whois fejlede, prøver CLI: {e}")
    # CLI fallback
    try:
        output = subprocess.check_output(["whois", domain], universal_newlines=True)
        for line in output.splitlines():
            if line.lower().startswith("registrar"):
                result["registrar"] = line.split(":",1)[-1].strip()
            if "creation date" in line.lower():
                result["creation_date"] = line.split(":",1)[-1].strip()
            if "expiry" in line.lower() or "expiration" in line.lower():
                result["expiry_date"] = line.split(":",1)[-1].strip()
            if "name server" in line.lower():
                ns = line.split(":",1)[-1].strip()
                result.setdefault("name_servers", []).append(ns)
        return result
    except FileNotFoundError:
        print("whois CLI ikke fundet. Installer med: apt install whois / brew install whois")
        return result
    except Exception as e:
        print(f"Whois-opslag fejlede: {e}")
        return result

def security_ssl_check(host: str, port: int = 443, timeout: float = 3.0) -> dict:
    """SSL/TLS-certifikatcheck. Returnerer dict med issuer, CN, SAN, udløb."""
    info = {}
    try:
        ctx = ssl.create_default_context()
        with socket.create_connection((host, port), timeout=timeout) as sock:
            with ctx.wrap_socket(sock, server_hostname=host) as ssock:
                cert = ssock.getpeercert()
                info["issuer"] = ", ".join([f"{x[0]}={x[1]}" for x in cert.get("issuer", [])])
                info["subject"] = ", ".join([f"{x[0]}={x[1]}" for x in cert.get("subject", [])])
                info["notBefore"] = cert.get("notBefore")
                info["notAfter"] = cert.get("notAfter")
                # Beregn dage til udløb
                if info["notAfter"]:
                    dt = datetime.datetime.strptime(info["notAfter"], "%b %d %H:%M:%S %Y %Z")
                    days_left = (dt - datetime.datetime.utcnow()).days
                    info["days_left"] = days_left
    except Exception as e:
        print(f"SSL/TLS-check fejlede: {e}")
        return info
    return info

def security_has_ipv6(host: str) -> tuple[bool, list[str]]:
    """Tjekker om host har IPv6. Returnerer (bool, liste af IPv6-adresser)."""
    ipv6s = []
    try:
        infos = socket.getaddrinfo(host, None, socket.AF_UNSPEC)
        for info in infos:
            if info[0] == socket.AF_INET6:
                ipv6s.append(info[4][0])
        return (bool(ipv6s), ipv6s)
    except Exception:
        return (False, [])

def show_visible_wifi_details():
    if platform.system().lower() != "windows":
        print("Denne funktion virker kun på Windows.")
        return
    try:
        result = subprocess.check_output(["netsh", "wlan", "show", "networks", "mode=bssid"], universal_newlines=True)
        print("Detaljeret info om synlige WiFi-netværk:")
        print(result)
    except Exception as e:
        print(f"[FEJL] Kunne ikke hente detaljeret WiFi-info: {e}")
def show_visible_wifi():
    if platform.system().lower() != "windows":
        print("Denne funktion virker kun på Windows.")
        return
    try:
        result = subprocess.check_output(["netsh", "wlan", "show", "networks"], universal_newlines=True)
        ssids = set()
        for line in result.splitlines():
            if "SSID" in line and "BSSID" not in line:
                ssid = line.split(":",1)[1].strip()
                if ssid:
                    ssids.add(ssid)
        if not ssids:
            print("Ingen synlige WiFi-netværk fundet.")
        else:
            print("Synlige WiFi-netværk:")
            for ssid in ssids:
                print(f"- {ssid}")
    except Exception as e:
        print(f"[FEJL] Kunne ikke hente synlige WiFi-netværk: {e}")

def choose_saved_wifi_and_show_password():
    if platform.system().lower() != "windows":
        print("Denne funktion virker kun på Windows.")
        return
    try:
        result = subprocess.check_output(["netsh", "wlan", "show", "profiles"], universal_newlines=True)
        profiles = []
        for line in result.splitlines():
            if "All User Profile" in line:
                profile = line.split(":",1)[1].strip()
                profiles.append(profile)
        if not profiles:
            print("Ingen gemte WiFi-profiler fundet.")
            return
        print("Gemte WiFi-netværk:")
        for i, ssid in enumerate(profiles, 1):
            print(f"{i}. {ssid}")
        valg = input("Vælg nummer på netværk for at se password: ").strip()
        try:
            idx = int(valg) - 1
            if idx < 0 or idx >= len(profiles):
                print("Ugyldigt valg.")
                return
            ssid = profiles[idx]
            pw_result = subprocess.check_output(["netsh", "wlan", "show", "profile", ssid, "key=clear"], universal_newlines=True)
            password = None
            for pw_line in pw_result.splitlines():
                if "Key Content" in pw_line:
                    password = pw_line.split(":",1)[1].strip()
                    break
            print(f"WiFi-navn: {ssid}")
            if password:
                print(f"WiFi-password: {password}")
            else:
                print("WiFi-password ikke fundet eller er ikke gemt.")
        except Exception as e:
            print(f"[FEJL] Kunne ikke hente password: {e}")
    except Exception as e:
        print(f"[FEJL] Kunne ikke hente WiFi-profiler: {e}")
    print("=====================")
def show_all_wifi_passwords():
    if platform.system().lower() != "windows":
        print("Denne funktion virker kun på Windows.")
        return
    try:
        result = subprocess.check_output(["netsh", "wlan", "show", "profiles"], universal_newlines=True)
        profiles = []
        for line in result.splitlines():
            if "All User Profile" in line:
                profile = line.split(":",1)[1].strip()
                profiles.append(profile)
        if not profiles:
            print("Ingen gemte WiFi-profiler fundet.")
            return
        for ssid in profiles:
            print(f"\nWiFi-navn: {ssid}")
            try:
                pw_result = subprocess.check_output(["netsh", "wlan", "show", "profile", ssid, "key=clear"], universal_newlines=True)
                password = None
                for pw_line in pw_result.splitlines():
                    if "Key Content" in pw_line:
                        password = pw_line.split(":",1)[1].strip()
                        break
                if password:
                    print(f"WiFi-password: {password}")
                else:
                    print("WiFi-password ikke fundet eller er ikke gemt.")
            except Exception as e:
                print(f"[FEJL] Kunne ikke hente password for {ssid}: {e}")
    except Exception as e:
        print(f"[FEJL] Kunne ikke hente WiFi-profiler: {e}")
def get_wifi_info():
    if platform.system().lower() != "windows":
        print("WiFi password-funktion virker kun på Windows.")
        return
    try:
        # Find SSID
        result = subprocess.check_output(["netsh", "wlan", "show", "interfaces"], universal_newlines=True)
        ssid = None
        for line in result.splitlines():
            if "SSID" in line and "BSSID" not in line:
                ssid = line.split(":",1)[1].strip()
                break
        if not ssid:
            print("Kunne ikke finde WiFi-navn (SSID).")
            return
        # Find password
        result = subprocess.check_output(["netsh", "wlan", "show", "profile", ssid, "key=clear"], universal_newlines=True)
        password = None
        for line in result.splitlines():
            if "Key Content" in line:
                password = line.split(":",1)[1].strip()
                break
        print(f"WiFi-navn: {ssid}")
        if password:
            print(f"WiFi-password: {password}")
        else:
            print("WiFi-password ikke fundet eller er ikke gemt.")
    except Exception as e:
        print(f"[FEJL] Kunne ikke hente WiFi-info: {e}")

if __name__ == "__main__":

    print("[DEBUG] Starter PingTool...")
    while True:
        menu()
        valg = input("Vælg handling (1-11): ").strip()
        if valg == "1":
            # ...eksisterende kode...
            targets = input("Indtast domæner/IP'er (kommasepareret, Enter for standard): ").strip()
            if not targets:
                targets = ",".join(SERVERS)
            targets = [x.strip() for x in targets.split(",") if x.strip()]
            try:
                count = int(input("Antal ping-forsøg pr. server (standard: 4): ").strip())
                if count < 1:
                    count = 4
            except:
                count = 4
            for server in targets:
                print(f"Pinger {server}...")
                min_time, avg_time, max_time, loss, output = ping(server, count)
                try:
                    ip = socket.gethostbyname(server)
                    print(f"DNS-opslag: {server} -> {ip}")
                except Exception as e:
                    print(f"[FEJL] DNS-opslag fejlede for {server}: {e}\nMulige årsager: Domænet findes ikke, eller der er ingen internetforbindelse.")
                    ip = "N/A"
                try:
                    city, country = get_ip_location(ip) if ip != "N/A" else ("Unknown", "Unknown")
                    print(f"Geolokation: {ip} -> {city}, {country}")
                except Exception as e:
                    print(f"[FEJL] Geolokation fejlede for {ip}: {e}\nMulige årsager: IP-adressen er ugyldig, eller der er ingen internetforbindelse.")
                    city, country = "Unknown", "Unknown"
                if min_time is not None:
                    print(f"Ping-resultat for {server} ({ip}): Min: {min_time} ms, Avg: {avg_time} ms, Max: {max_time} ms, Pakketab: {loss}%")
                else:
                    print(f"[FEJL] Ping fejlede for {server} ({ip}) eller ingen svar.\nMulige årsager: IP-adressen svarer ikke på ping, er beskyttet af firewall, eller er offline.")
                    print(f"Rå ping-output:\n{output}")
                print("---")
        elif valg == "2":
            # ...eksisterende kode...
            dom = input("Indtast domæne: ").strip()
            if dom:
                try:
                    ip = socket.gethostbyname(dom)
                    print(f"IP for {dom}: {ip}")
                except Exception as e:
                    print(f"[FEJL] DNS-opslag fejlede for {dom}: {e}\nMulige årsager: Domænet findes ikke, eller der er ingen internetforbindelse.")
            else:
                print("Du skal indtaste et domæne!")
        elif valg == "3":
            # ...eksisterende kode...
            ip = input("Indtast IP-adresse: ").strip()
            if ip:
                try:
                    city, country = get_ip_location(ip)
                    print(f"Geolokation for {ip}: {city}, {country}")
                except Exception as e:
                    print(f"[FEJL] Geolokation fejlede for {ip}: {e}\nMulige årsager: IP-adressen er ugyldig, eller der er ingen internetforbindelse.")
            else:
                print("Du skal indtaste en IP-adresse!")
        elif valg == "4":
            # ...eksisterende kode...
            try:
                print(f"Din lokale IP: {get_local_ip()}")
            except Exception as e:
                print(f"Fejl ved hentning af lokal IP: {e}")
        elif valg == "5":
            # ...eksisterende kode...
            print("Standard-servere:")
            for s in SERVERS:
                print(f"- {s}")
        elif valg == "6":
            get_wifi_info()
        elif valg == "7":
            show_visible_wifi()
        elif valg == "8":
            show_visible_wifi_details()
        elif valg == "9":
            choose_saved_wifi_and_show_password()
        elif valg == "10":
            print("Farvel!")
            break
        elif valg == "11":
            while True:
                security_menu()
                svalg = input("Vælg handling (1-7): ").strip()
                if svalg == "1":
                    target = input("Mål (IP/domæne): ").strip()
                    try:
                        port_start = int(input("Startport (standard 1): ").strip() or "1")
                        port_end = int(input("Slutport (standard 1024): ").strip() or "1024")
                        timeout = float(input("Timeout pr. port (sek, standard 0.5): ").strip() or "0.5")
                        workers = int(input("Antal tråde (standard 200): ").strip() or "200")
                    except Exception:
                        port_start, port_end, timeout, workers = 1, 1024, 0.5, 200
                    print(f"Scanner porte på {target} fra {port_start} til {port_end}...")
                    ports = security_portscan(target, port_start, port_end, timeout, workers)
                    if ports:
                        print("Åbne porte:")
                        for p, s in ports:
                            print(f"- {p} ({s})")
                    else:
                        print(f"Ingen åbne porte fundet i intervallet {port_start}-{port_end}.")
                elif svalg == "2":
                    target = input("Mål (IP/domæne): ").strip()
                    print(f"Traceroute til {target}...")
                    hops = security_traceroute(target)
                    if hops:
                        print("Hop | IP           | RTT (ms)")
                        print("-------------------------------")
                        for h in hops:
                            hop = h.get("hop")
                            ip = h.get("ip") or "*"
                            rtt = h.get("rtt_ms")
                            rtt_str = f"{rtt:.1f}" if rtt else "*"
                            print(f"{hop:>3} | {ip:<13} | {rtt_str:>7}")
                    else:
                        print("Ingen hops fundet eller traceroute fejlede.")
                elif svalg == "3":
                    ip = input("IP-adresse: ").strip()
                    host = security_reverse_dns(ip)
                    if host:
                        print(f"Reverse DNS for {ip}: {host}")
                    else:
                        print(f"Ingen reverse DNS fundet for {ip}.")
                elif svalg == "4":
                    domain = input("Domæne: ").strip()
                    info = security_whois(domain)
                    if info:
                        print(f"Registrar: {info.get('registrar','?')}")
                        print(f"Oprettet: {info.get('creation_date','?')}")
                        print(f"Udløber: {info.get('expiry_date','?')}")
                        ns = info.get('name_servers',[])
                        if ns:
                            print(f"Nameservers: {', '.join(ns[:5])}{'...' if len(ns)>5 else ''}")
                    else:
                        print("Ingen whois-info fundet eller opslag fejlede.")
                elif svalg == "5":
                    host = input("Host (domæne/IP): ").strip()
                    try:
                        port = int(input("Port (standard 443): ").strip() or "443")
                    except:
                        port = 443
                    info = security_ssl_check(host, port)
                    if info:
                        issuer = info.get("issuer", "?")
                        notAfter = info.get("notAfter", "?")
                        days_left = info.get("days_left", None)
                        print(f"Udsteder: {issuer} | Gyldig til: {notAfter}")
                        if days_left is not None:
                            if days_left < 0:
                                print(f"Certifikatet ER udløbet!")
                            elif days_left < 14:
                                print(f"Certifikatet udløber om {days_left} dage!")
                            else:
                                print(f"({days_left} dage tilbage)")
                    else:
                        print("Ingen certifikat-info fundet eller check fejlede.")
                elif svalg == "6":
                    host = input("Host (domæne/IP): ").strip()
                    has_ipv6, ipv6s = security_has_ipv6(host)
                    if has_ipv6:
                        print(f"Har IPv6: Ja, eksempel: {ipv6s[0]}")
                    else:
                        print("Har IPv6: Nej")
                elif svalg == "7":
                    break
                else:
                    print("Ugyldigt valg. Prøv igen.")
