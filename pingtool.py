import subprocess
import platform
import sys

def ping(host="google.com"):
    param = "-n" if platform.system().lower() == "windows" else "-c"
    command = ["ping", param, "4", host]
    try:
        output = subprocess.check_output(command, universal_newlines=True)
        print(output)
    except subprocess.CalledProcessError as e:
        print(f"Ping failed: {e}")

if __name__ == "__main__":
    host = sys.argv[1] if len(sys.argv) > 1 else "google.com"
    print(f"Pinger {host}...")
    ping(host)
