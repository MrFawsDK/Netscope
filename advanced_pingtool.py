import subprocess
import platform
import sys
import socket
import json
import urllib.request

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

if __name__ == "__main__":
    print("[DEBUG] Starter PingTool...")
    try:
        local_ip = get_local_ip()
        print(f"Din lokale IP: {local_ip}")
    except Exception as e:
        print(f"[DEBUG] Fejl ved hentning af lokal IP: {e}")
    print()
    print("Vælg domæner/IP'er du vil ping (kommasepareret, fx google.com,8.8.8.8):")
    try:
        user_input = input("> ").strip()
        print(f"[DEBUG] Input modtaget: {user_input}")
    except Exception as e:
        print(f"[DEBUG] Fejl ved input: {e}")
        user_input = ''
    if not user_input:
        print("[DEBUG] Ingen input modtaget, bruger standard-servere.")
        targets = SERVERS
    else:
        targets = [x.strip() for x in user_input.split(",") if x.strip()]
        print(f"[DEBUG] Targets valgt: {targets}")
    print("Hvor mange ping-forsøg pr. server? (standard: 4)")
    try:
        count_input = input("> ").strip()
        print(f"[DEBUG] Ping count input: {count_input}")
        count = int(count_input)
        if count < 1:
            count = 4
    except Exception as e:
        print(f"[DEBUG] Fejl ved ping count: {e}")
        count = 4
    for server in targets:
        print(f"Pinger {server}...")
        try:
            min_time, avg_time, max_time, loss, output = ping(server, count)
            print(f"[DEBUG] Ping output for {server}:\n{output}")
        except Exception as e:
            print(f"[DEBUG] Fejl ved ping af {server}: {e}")
            min_time = avg_time = max_time = loss = None
        try:
            ip = socket.gethostbyname(server)
            print(f"[DEBUG] DNS-opslag for {server}: {ip}")
        except Exception as e:
            print(f"[DEBUG] Fejl ved DNS-opslag for {server}: {e}")
            ip = "N/A"
        try:
            city, country = get_ip_location(ip) if ip != "N/A" else ("Unknown", "Unknown")
            print(f"[DEBUG] Geolokation for {ip}: {city}, {country}")
        except Exception as e:
            print(f"[DEBUG] Fejl ved geolokation for {ip}: {e}")
            city, country = "Unknown", "Unknown"
        print(f"IP: {ip} ({city}, {country})")
        if min_time is not None:
            print(f"Min: {min_time} ms, Avg: {avg_time} ms, Max: {max_time} ms, Pakketab: {loss}%")
        else:
            print("Ping fejlede eller ingen svar.")
        print("---")
    print("\nDu kan tilføje domæner/IP'er ved at skrive dem i input.")
