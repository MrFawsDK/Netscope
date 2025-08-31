import subprocess
import platform

def ping(ip_address):
    param = '-n' if platform.system().lower() == 'windows' else '-c'
    command = ['ping', param, '1', ip_address]
    result = subprocess.run(command, capture_output=True, text=True)
    print(result.stdout)
    if result.returncode != 0:
        print(f"Ping til {ip_address} fejlede.")

if __name__ == "__main__":
    ip = input("Indtast IP-adresse: ")
    ping(ip)
