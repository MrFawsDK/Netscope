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
                parts = line.split()
                min_time = int(parts[3].replace("ms,", ""))
                max_time = int(parts[5].replace("ms,", ""))
                avg_time = int(parts[7].replace("ms", ""))
            if "Lost" in line:
                loss = int(line.split(",")[2].split()[0])
    else:
        for line in output.splitlines():
            if "min/avg/max" in line:
                stats = line.split("=")[1].split()[0].split("/")
                min_time, avg_time, max_time = map(float, stats[:3])
            if "packet loss" in line:
                loss = float(line.split("%")[0].split()[-1])
    return min_time, avg_time, max_time, loss

def ping(host):
    param = "-n" if platform.system().lower() == "windows" else "-c"
    command = ["ping", param, "4", host]
    try:
        output = subprocess.check_output(command, universal_newlines=True)
        min_time, avg_time, max_time, loss = parse_ping_output(output)
        return min_time, avg_time, max_time, loss, output
    except subprocess.CalledProcessError as e:
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
    main()
