// Standard servers list
const SERVERS = [
    "google.com",
    "cloudflare.com", 
    "1.1.1.1",
    "8.8.8.8",
    "github.com"
];

// Global state
let currentSection = 'dashboard';
let recentActivities = [];

// Navigation functions
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Activate nav item
    const targetNavItem = document.querySelector(`[onclick="showSection('${sectionId}')"]`);
    if (targetNavItem) {
        targetNavItem.classList.add('active');
    }
    
    // Update page title
    updatePageTitle(sectionId);
    currentSection = sectionId;
    
    // Add to recent activities
    addActivity(`Switched to ${getSectionName(sectionId)}`);
}

function updatePageTitle(sectionId) {
    const titleElement = document.getElementById('pageTitle');
    const descriptionElement = document.getElementById('pageDescription');
    
    const titles = {
        dashboard: { title: 'Dashboard', desc: 'Network diagnostics and monitoring tools' },
        ping: { title: 'Ping Test', desc: 'Test network connectivity and measure latency' },
        dns: { title: 'DNS Lookup', desc: 'Resolve domain names to IP addresses' },
        geolocation: { title: 'IP Geolocation', desc: 'Find geographic location of IP addresses' },
        localip: { title: 'Local IP', desc: 'Discover your local network IP address' },
        servers: { title: 'Standard Servers', desc: 'Monitor connectivity to common internet services' },
        wifi: { title: 'WiFi Tools', desc: 'WiFi network management and diagnostics' },
        settings: { title: 'Indstillinger', desc: 'Configure NetScope preferences and appearance' }
    };
    
    const info = titles[sectionId] || titles.dashboard;
    titleElement.textContent = info.title;
    descriptionElement.textContent = info.desc;
}

function getSectionName(sectionId) {
    const names = {
        dashboard: 'Dashboard',
        ping: 'Ping Test',
        dns: 'DNS Lookup',
        geolocation: 'IP Geolocation',
        localip: 'Local IP',
        servers: 'Standard Servers',
        wifi: 'WiFi Tools',
        settings: 'Settings'
    };
    return names[sectionId] || 'Unknown';
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('collapsed');
}

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const themeBtn = document.querySelector('.theme-btn span');
    const themeIcon = document.querySelector('.theme-btn i');
    
    if (newTheme === 'light') {
        themeBtn.textContent = 'Light Mode';
        themeIcon.className = 'fas fa-sun';
    } else {
        themeBtn.textContent = 'Dark Mode';
        themeIcon.className = 'fas fa-moon';
    }
    
    addActivity(`Switched to ${newTheme} theme`);
}

function refreshPage() {
    if (currentSection === 'dashboard') {
        updateDashboard();
    }
    addActivity('Page refreshed');
}

function openSettings() {
    alert('Settings panel coming soon!');
}

// Recent activities
function addActivity(message) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString();
    
    recentActivities.unshift({
        message,
        time: timeStr,
        timestamp: now
    });
    
    // Keep only last 10 activities
    if (recentActivities.length > 10) {
        recentActivities = recentActivities.slice(0, 10);
    }
    
    updateActivityList();
}

function updateActivityList() {
    const activityList = document.getElementById('recentActivity');
    if (!activityList) return;
    
    activityList.innerHTML = recentActivities.map(activity => `
        <div class="activity-item">
            <i class="fas fa-circle activity-dot"></i>
            <span>${activity.message}</span>
            <span class="activity-time">${activity.time}</span>
        </div>
    `).join('');
}

// Dashboard functions
function updateDashboard() {
    // Simulate metrics update
    document.getElementById('avgLatency').textContent = `${Math.floor(Math.random() * 50) + 20}ms`;
    document.getElementById('successRate').textContent = `${Math.floor(Math.random() * 10) + 90}%`;
    document.getElementById('serversOnline').textContent = `${Math.floor(Math.random() * 2) + 4}/5`;
    
    // Get local IP for dashboard
    getLocalIPForDashboard();
}

async function getLocalIPForDashboard() {
    try {
        const ip = await getLocalIPWebRTC();
        document.getElementById('yourIP').textContent = ip;
    } catch {
        document.getElementById('yourIP').textContent = '192.168.1.x';
    }
}

function quickPing() {
    showSection('ping');
    // Auto-fill with Google DNS and start ping
    document.getElementById('pingTargets').value = '8.8.8.8';
    setTimeout(() => performPing(), 500);
}

// Utility functions
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    element.innerHTML = '<span class="loading"></span>Processing...';
    element.className = 'terminal-output';
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    element.className = 'terminal-output error';
    element.textContent = `ERROR: ${message}`;
}

function showSuccess(elementId, message) {
    const element = document.getElementById(elementId);
    element.className = 'terminal-output success';
    element.textContent = message;
}

function showResult(elementId, message) {
    const element = document.getElementById(elementId);
    element.className = 'terminal-output';
    element.textContent = message;
}

function clearResults(elementId) {
    const element = document.getElementById(elementId);
    element.innerHTML = '';
    element.className = 'terminal-output';
}

// Simulation functions
function simulatePing(host) {
    return new Promise((resolve) => {
        const delay = Math.random() * 1000 + 200;
        setTimeout(() => {
            const minTime = Math.floor(Math.random() * 50) + 10;
            const avgTime = minTime + Math.floor(Math.random() * 20);
            const maxTime = avgTime + Math.floor(Math.random() * 30);
            const loss = Math.random() > 0.9 ? Math.floor(Math.random() * 10) : 0;
            
            resolve({
                minTime,
                avgTime,
                maxTime,
                loss,
                success: Math.random() > 0.1
            });
        }, delay);
    });
}

function simulateDNSLookup(domain) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const knownIPs = {
                'google.com': '172.217.16.142',
                'cloudflare.com': '104.16.132.229',
                'github.com': '140.82.112.3',
                '1.1.1.1': '1.1.1.1',
                '8.8.8.8': '8.8.8.8'
            };
            
            if (knownIPs[domain]) {
                resolve(knownIPs[domain]);
            } else if (/^\d+\.\d+\.\d+\.\d+$/.test(domain)) {
                resolve(domain);
            } else {
                const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
                resolve(ip);
            }
        }, 200 + Math.random() * 300);
    });
}

function simulateGeolocation(ip) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const locations = [
                { city: 'Copenhagen', country: 'Denmark' },
                { city: 'Stockholm', country: 'Sweden' },
                { city: 'Oslo', country: 'Norway' },
                { city: 'Helsinki', country: 'Finland' },
                { city: 'Berlin', country: 'Germany' },
                { city: 'London', country: 'United Kingdom' },
                { city: 'Paris', country: 'France' },
                { city: 'Amsterdam', country: 'Netherlands' },
                { city: 'New York', country: 'United States' },
                { city: 'San Francisco', country: 'United States' },
                { city: 'Tokyo', country: 'Japan' },
                { city: 'Singapore', country: 'Singapore' }
            ];
            
            const randomLocation = locations[Math.floor(Math.random() * locations.length)];
            resolve(randomLocation);
        }, 300 + Math.random() * 500);
    });
}

// Tool functions
async function performPing() {
    const targetsInput = document.getElementById('pingTargets').value.trim();
    const count = parseInt(document.getElementById('pingCount').value) || 4;
    
    let targets;
    if (!targetsInput) {
        targets = SERVERS;
    } else {
        targets = targetsInput.split(',').map(t => t.trim()).filter(t => t);
    }
    
    if (targets.length === 0) {
        showError('pingResults', 'No valid targets specified.');
        return;
    }
    
    showLoading('pingResults');
    addActivity(`Started ping test for ${targets.length} target(s)`);
    
    let results = `$ ping test started (${count} attempts per server)\n\n`;
    
    for (const target of targets) {
        results += `PING ${target}...\n`;
        
        try {
            const ip = await simulateDNSLookup(target);
            results += `DNS lookup: ${target} -> ${ip}\n`;
            
            const location = await simulateGeolocation(ip);
            results += `Location: ${ip} -> ${location.city}, ${location.country}\n`;
            
            const pingResult = await simulatePing(target);
            
            if (pingResult.success) {
                results += `PING ${target} (${ip}): min=${pingResult.minTime}ms avg=${pingResult.avgTime}ms max=${pingResult.maxTime}ms loss=${pingResult.loss}%\n`;
            } else {
                results += `PING ${target} (${ip}): Request timeout or host unreachable\n`;
            }
        } catch (error) {
            results += `PING ${target}: Error - ${error.message}\n`;
        }
        
        results += '━'.repeat(60) + '\n';
    }
    
    showResult('pingResults', results);
    addActivity('Ping test completed');
}

async function performDNS() {
    const domain = document.getElementById('dnsInput').value.trim();
    
    if (!domain) {
        showError('dnsResults', 'Please enter a domain name!');
        return;
    }
    
    showLoading('dnsResults');
    addActivity(`DNS lookup for ${domain}`);
    
    try {
        const ip = await simulateDNSLookup(domain);
        const result = `$ nslookup ${domain}\n\nServer: 8.8.8.8\nAddress: 8.8.8.8#53\n\nNon-authoritative answer:\nName: ${domain}\nAddress: ${ip}`;
        showResult('dnsResults', result);
        addActivity(`DNS lookup completed for ${domain}`);
    } catch (error) {
        showError('dnsResults', `DNS lookup failed for ${domain}: ${error.message}`);
    }
}

async function performGeolocation() {
    const ip = document.getElementById('geoInput').value.trim();
    
    if (!ip) {
        showError('geoResults', 'Please enter an IP address!');
        return;
    }
    
    if (!/^\d+\.\d+\.\d+\.\d+$/.test(ip)) {
        showError('geoResults', 'Invalid IP address format!');
        return;
    }
    
    showLoading('geoResults');
    addActivity(`Geolocation lookup for ${ip}`);
    
    try {
        const location = await simulateGeolocation(ip);
        const result = `$ geoip ${ip}\n\nIP Address: ${ip}\nCity: ${location.city}\nCountry: ${location.country}\nISP: Simulated ISP\nTimezone: GMT+1`;
        showResult('geoResults', result);
        addActivity(`Geolocation completed for ${ip}`);
    } catch (error) {
        showError('geoResults', `Geolocation failed for ${ip}: ${error.message}`);
    }
}

async function getLocalIP() {
    showLoading('localipResults');
    addActivity('Getting local IP address');
    
    try {
        const ip = await getLocalIPWebRTC();
        const result = `$ ifconfig\n\nLocal IP Address: ${ip}\nNetwork Interface: eth0\nSubnet Mask: 255.255.255.0\nDefault Gateway: ${ip.split('.').slice(0, 3).join('.')}.1`;
        showResult('localipResults', result);
        addActivity('Local IP retrieved successfully');
    } catch (error) {
        const simulatedIP = `192.168.1.${Math.floor(Math.random() * 254) + 1}`;
        const result = `$ ifconfig (simulated)\n\nLocal IP Address: ${simulatedIP}\nNetwork Interface: eth0\nSubnet Mask: 255.255.255.0\nDefault Gateway: 192.168.1.1\n\nNote: Browser security restrictions limit real IP access.\nUse desktop version for accurate results.`;
        showResult('localipResults', result);
        addActivity('Local IP simulated (browser limitation)');
    }
}

function getLocalIPWebRTC() {
    return new Promise((resolve, reject) => {
        const RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
        
        if (!RTCPeerConnection) {
            reject(new Error('WebRTC not supported'));
            return;
        }
        
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });
        
        pc.createDataChannel('');
        
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                const candidate = event.candidate.candidate;
                const ipMatch = candidate.match(/(?:[0-9]{1,3}\.){3}[0-9]{1,3}/);
                if (ipMatch && !ipMatch[0].startsWith('127.') && !ipMatch[0].startsWith('169.254.')) {
                    pc.close();
                    resolve(ipMatch[0]);
                }
            }
        };
        
        pc.createOffer()
            .then(offer => pc.setLocalDescription(offer))
            .catch(reject);
        
        setTimeout(() => {
            pc.close();
            reject(new Error('Timeout'));
        }, 5000);
    });
}

async function pingAllServers() {
    showLoading('serversResults');
    addActivity('Testing all standard servers');
    
    let results = `$ ping all standard servers\n\n`;
    
    // Update server cards
    const serverCards = document.querySelectorAll('.server-card');
    
    for (let i = 0; i < SERVERS.length; i++) {
        const server = SERVERS[i];
        const card = serverCards[i];
        
        results += `Testing ${server}...\n`;
        
        try {
            const ip = await simulateDNSLookup(server);
            const location = await simulateGeolocation(ip);
            const pingResult = await simulatePing(server);
            
            if (pingResult.success) {
                results += `✓ ${server} (${ip}) - ${location.city}, ${location.country}\n`;
                results += `  Latency: min=${pingResult.minTime}ms avg=${pingResult.avgTime}ms max=${pingResult.maxTime}ms\n`;
                
                // Update server card
                if (card) {
                    card.querySelector('.server-status').className = 'server-status online';
                    card.querySelector('.server-latency').textContent = `${pingResult.avgTime}ms`;
                }
            } else {
                results += `✗ ${server} (${ip}) - Request timeout\n`;
                
                if (card) {
                    card.querySelector('.server-status').className = 'server-status offline';
                    card.querySelector('.server-latency').textContent = 'timeout';
                }
            }
        } catch (error) {
            results += `✗ ${server} - Error: ${error.message}\n`;
            
            if (card) {
                card.querySelector('.server-status').className = 'server-status offline';
                card.querySelector('.server-latency').textContent = 'error';
            }
        }
        
        results += '━'.repeat(50) + '\n';
    }
    
    showResult('serversResults', results);
    addActivity('Server testing completed');
    updateDashboard(); // Update dashboard metrics
}

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Update theme button
    const themeBtn = document.querySelector('.theme-btn span');
    const themeIcon = document.querySelector('.theme-btn i');
    if (savedTheme === 'light') {
        themeBtn.textContent = 'Light Mode';
        themeIcon.className = 'fas fa-sun';
    }
    
    // Show dashboard by default
    showSection('dashboard');
    updateDashboard();
    
    // Add initial activity
    addActivity('Application started');
    
    // Add enter key support for input fields
    document.getElementById('pingTargets').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performPing();
    });
    
    document.getElementById('dnsInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performDNS();
    });
    
    document.getElementById('geoInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performGeolocation();
    });
    
    // Mobile sidebar handling
    if (window.innerWidth <= 768) {
        document.querySelector('.sidebar').classList.add('collapsed');
    }
    
    // Update dashboard periodically
    setInterval(updateDashboard, 30000); // Update every 30 seconds
});

// Ping functionality
async function performPing() {
    const targetsInput = document.getElementById('pingTargets').value.trim();
    const count = parseInt(document.getElementById('pingCount').value) || 4;
    
    let targets;
    if (!targetsInput) {
        targets = SERVERS;
    } else {
        targets = targetsInput.split(',').map(t => t.trim()).filter(t => t);
    }
    
    if (targets.length === 0) {
        showError('pingResults', 'Ingen gyldige mål angivet.');
        return;
    }
    
    showLoading('pingResults');
    
    let results = `Ping resultater (${count} forsøg pr. server):\n\n`;
    
    for (const target of targets) {
        results += `Pinger ${target}...\n`;
        
        try {
            // Simulate DNS lookup
            const ip = await simulateDNSLookup(target);
            results += `DNS-opslag: ${target} -> ${ip}\n`;
            
            // Simulate geolocation
            const location = await simulateGeolocation(ip);
            results += `Geolokation: ${ip} -> ${location.city}, ${location.country}\n`;
            
            // Simulate ping
            const pingResult = await simulatePing(target);
            
            if (pingResult.success) {
                results += `Ping-resultat for ${target} (${ip}): Min: ${pingResult.minTime} ms, Avg: ${pingResult.avgTime} ms, Max: ${pingResult.maxTime} ms, Pakketab: ${pingResult.loss}%\n`;
            } else {
                results += `[FEJL] Ping fejlede for ${target} (${ip}) eller ingen svar.\nMulige årsager: IP-adressen svarer ikke på ping, er beskyttet af firewall, eller er offline.\n`;
            }
        } catch (error) {
            results += `[FEJL] Fejl ved ping af ${target}: ${error.message}\n`;
        }
        
        results += '---\n';
    }
    
    showResult('pingResults', results);
}

// DNS lookup simulation
function simulateDNSLookup(domain) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate some common IPs for known domains
            const knownIPs = {
                'google.com': '172.217.16.142',
                'cloudflare.com': '104.16.132.229',
                'github.com': '140.82.112.3',
                '1.1.1.1': '1.1.1.1',
                '8.8.8.8': '8.8.8.8'
            };
            
            if (knownIPs[domain]) {
                resolve(knownIPs[domain]);
            } else if (/^\d+\.\d+\.\d+\.\d+$/.test(domain)) {
                // If it's already an IP
                resolve(domain);
            } else {
                // Generate a random IP for unknown domains
                const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
                resolve(ip);
            }
        }, 200 + Math.random() * 300);
    });
}

// DNS lookup functionality
async function performDNS() {
    const domain = document.getElementById('dnsInput').value.trim();
    
    if (!domain) {
        showError('dnsResults', 'Du skal indtaste et domæne!');
        return;
    }
    
    showLoading('dnsResults');
    
    try {
        const ip = await simulateDNSLookup(domain);
        showSuccess('dnsResults', `IP for ${domain}: ${ip}`);
    } catch (error) {
        showError('dnsResults', `DNS-opslag fejlede for ${domain}: ${error.message}\nMulige årsager: Domænet findes ikke, eller der er ingen internetforbindelse.`);
    }
}

// Geolocation simulation
function simulateGeolocation(ip) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const locations = [
                { city: 'Copenhagen', country: 'Denmark' },
                { city: 'Stockholm', country: 'Sweden' },
                { city: 'Oslo', country: 'Norway' },
                { city: 'Helsinki', country: 'Finland' },
                { city: 'Berlin', country: 'Germany' },
                { city: 'London', country: 'United Kingdom' },
                { city: 'Paris', country: 'France' },
                { city: 'Amsterdam', country: 'Netherlands' },
                { city: 'New York', country: 'United States' },
                { city: 'San Francisco', country: 'United States' },
                { city: 'Tokyo', country: 'Japan' },
                { city: 'Singapore', country: 'Singapore' }
            ];
            
            const randomLocation = locations[Math.floor(Math.random() * locations.length)];
            resolve(randomLocation);
        }, 300 + Math.random() * 500);
    });
}

// Geolocation functionality
async function performGeolocation() {
    const ip = document.getElementById('geoInput').value.trim();
    
    if (!ip) {
        showError('geoResults', 'Du skal indtaste en IP-adresse!');
        return;
    }
    
    // Basic IP validation
    if (!/^\d+\.\d+\.\d+\.\d+$/.test(ip)) {
        showError('geoResults', 'Ugyldig IP-adresse format!');
        return;
    }
    
    showLoading('geoResults');
    
    try {
        const location = await simulateGeolocation(ip);
        showSuccess('geoResults', `Geolokation for ${ip}: ${location.city}, ${location.country}`);
    } catch (error) {
        showError('geoResults', `Geolokation fejlede for ${ip}: ${error.message}\nMulige årsager: IP-adressen er ugyldig, eller der er ingen internetforbindelse.`);
    }
}

// Local IP functionality
async function getLocalIP() {
    showLoading('localipResults');
    
    try {
        // Try to get local IP using WebRTC
        const ip = await getLocalIPWebRTC();
        showSuccess('localipResults', `Din lokale IP: ${ip}`);
    } catch (error) {
        // Fallback to simulated IP
        const simulatedIP = `192.168.1.${Math.floor(Math.random() * 254) + 1}`;
        showResult('localipResults', `Din lokale IP (simuleret): ${simulatedIP}\n\nBemærk: Browsere begrænser adgang til lokal IP af sikkerhedshensyn.\nFor præcis lokal IP, brug desktop-versionen.`);
    }
}

// Get local IP using WebRTC
function getLocalIPWebRTC() {
    return new Promise((resolve, reject) => {
        const RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
        
        if (!RTCPeerConnection) {
            reject(new Error('WebRTC not supported'));
            return;
        }
        
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });
        
        pc.createDataChannel('');
        
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                const candidate = event.candidate.candidate;
                const ipMatch = candidate.match(/(?:[0-9]{1,3}\.){3}[0-9]{1,3}/);
                if (ipMatch && !ipMatch[0].startsWith('127.') && !ipMatch[0].startsWith('169.254.')) {
                    pc.close();
                    resolve(ipMatch[0]);
                }
            }
        };
        
        pc.createOffer()
            .then(offer => pc.setLocalDescription(offer))
            .catch(reject);
        
        // Timeout after 5 seconds
        setTimeout(() => {
            pc.close();
            reject(new Error('Timeout'));
        }, 5000);
    });
}

// Ping all servers
async function pingAllServers() {
    showLoading('serversResults');
    
    let results = 'Ping resultater for standard servere:\n\n';
    
    for (const server of SERVERS) {
        results += `Pinger ${server}...\n`;
        
        try {
            const ip = await simulateDNSLookup(server);
            results += `DNS-opslag: ${server} -> ${ip}\n`;
            
            const location = await simulateGeolocation(ip);
            results += `Geolokation: ${ip} -> ${location.city}, ${location.country}\n`;
            
            const pingResult = await simulatePing(server);
            
            if (pingResult.success) {
                results += `Ping-resultat: Min: ${pingResult.minTime} ms, Avg: ${pingResult.avgTime} ms, Max: ${pingResult.maxTime} ms, Pakketab: ${pingResult.loss}%\n`;
            } else {
                results += `[FEJL] Ping fejlede for ${server}\n`;
            }
        } catch (error) {
            results += `[FEJL] Fejl ved ping af ${server}: ${error.message}\n`;
        }
        
        results += '---\n';
    }
    
    showResult('serversResults', results);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Show menu by default
    showMenu();
    
    // Add enter key support for input fields
    document.getElementById('pingTargets').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performPing();
    });
    
    document.getElementById('dnsInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performDNS();
    });
    
    document.getElementById('geoInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performGeolocation();
    });
    
    // Load settings on page load
    loadSettings();
});

// Settings functionality
const DEFAULT_SETTINGS = {
    theme: 'dark',
    accentColor: '#007acc',
    pingCount: 4,
    timeout: 3000,
    autoRefresh: false,
    showTimestamps: true,
    activityLogLimit: 100,
    compactMode: false,
    // Performance settings
    maxConcurrentPings: 3,
    cacheDns: true,
    cacheDuration: 15,
    backgroundMonitoring: false,
    // Notification settings
    enableNotifications: false,
    notificationTimeoutThreshold: 5000,
    soundAlerts: false,
    alertVolume: 50,
    // Advanced network settings
    ipv6Support: false,
    dnsServers: '8.8.8.8\n1.1.1.1\n208.67.222.222',
    retryAttempts: 2,
    connectionTestInterval: 60,
    // Security & privacy settings
    anonymizeIPs: false,
    clearDataOnClose: false,
    geolocationPrecision: 'region',
    blockMaliciousDomains: true,
    // Accessibility settings
    highContrast: false,
    fontSize: 'normal',
    reduceMotion: false,
    // Developer settings
    debugMode: false,
    apiEndpoints: '',
    consoleLogging: 'info'
};

let userSettings = { ...DEFAULT_SETTINGS };

function loadSettings() {
    const saved = localStorage.getItem('netscope-settings');
    if (saved) {
        try {
            userSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
        } catch (e) {
            console.error('Error loading settings:', e);
            userSettings = { ...DEFAULT_SETTINGS };
        }
    }
    
    // Apply loaded settings
    applySettings();
    updateSettingsUI();
}

function saveSettings() {
    localStorage.setItem('netscope-settings', JSON.stringify(userSettings));
    addActivity('Settings saved');
}

function applySettings() {
    // Apply theme
    if (userSettings.theme === 'light') {
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
    }
    
    // Apply accent color
    document.documentElement.style.setProperty('--accent-color', userSettings.accentColor);
    
    // Apply compact mode
    if (userSettings.compactMode) {
        document.body.classList.add('compact-mode');
    } else {
        document.body.classList.remove('compact-mode');
    }
    
    // Apply high contrast mode
    if (userSettings.highContrast) {
        document.body.classList.add('high-contrast');
    } else {
        document.body.classList.remove('high-contrast');
    }
    
    // Apply font size
    document.body.classList.remove('font-small', 'font-normal', 'font-large', 'font-extra-large');
    document.body.classList.add(`font-${userSettings.fontSize.replace('-', '-')}`);
    
    // Apply reduce motion
    if (userSettings.reduceMotion) {
        document.body.classList.add('reduce-motion');
    } else {
        document.body.classList.remove('reduce-motion');
    }
    
    // Setup background monitoring if enabled
    if (userSettings.backgroundMonitoring) {
        startBackgroundMonitoring();
    }
}

function updateSettingsUI() {
    document.getElementById('theme-select').value = userSettings.theme;
    document.getElementById('accent-color').value = userSettings.accentColor;
    document.getElementById('ping-count').value = userSettings.pingCount;
    document.getElementById('timeout-setting').value = userSettings.timeout;
    document.getElementById('auto-refresh').checked = userSettings.autoRefresh;
    document.getElementById('show-timestamps').checked = userSettings.showTimestamps;
    document.getElementById('activity-log-limit').value = userSettings.activityLogLimit;
    document.getElementById('compact-mode').checked = userSettings.compactMode;
    
    // Performance settings
    document.getElementById('max-concurrent-pings').value = userSettings.maxConcurrentPings;
    document.getElementById('cache-dns').checked = userSettings.cacheDns;
    document.getElementById('cache-duration').value = userSettings.cacheDuration;
    document.getElementById('background-monitoring').checked = userSettings.backgroundMonitoring;
    
    // Notification settings
    document.getElementById('enable-notifications').checked = userSettings.enableNotifications;
    document.getElementById('notification-timeout-threshold').value = userSettings.notificationTimeoutThreshold;
    document.getElementById('sound-alerts').checked = userSettings.soundAlerts;
    document.getElementById('alert-volume').value = userSettings.alertVolume;
    document.getElementById('volume-display').textContent = userSettings.alertVolume + '%';
    
    // Advanced network settings
    document.getElementById('ipv6-support').checked = userSettings.ipv6Support;
    document.getElementById('dns-servers').value = userSettings.dnsServers;
    document.getElementById('retry-attempts').value = userSettings.retryAttempts;
    document.getElementById('connection-test-interval').value = userSettings.connectionTestInterval;
    
    // Security & privacy settings
    document.getElementById('anonymize-ips').checked = userSettings.anonymizeIPs;
    document.getElementById('clear-data-on-close').checked = userSettings.clearDataOnClose;
    document.getElementById('geolocation-precision').value = userSettings.geolocationPrecision;
    document.getElementById('block-malicious-domains').checked = userSettings.blockMaliciousDomains;
    
    // Accessibility settings
    document.getElementById('high-contrast').checked = userSettings.highContrast;
    document.getElementById('font-size').value = userSettings.fontSize;
    document.getElementById('reduce-motion').checked = userSettings.reduceMotion;
    
    // Developer settings
    document.getElementById('debug-mode').checked = userSettings.debugMode;
    document.getElementById('api-endpoints').value = userSettings.apiEndpoints;
    document.getElementById('console-logging').value = userSettings.consoleLogging;
}

function changeTheme(theme) {
    userSettings.theme = theme;
    applySettings();
    saveSettings();
    addActivity(`Theme changed to ${theme}`);
}

function changeAccentColor(color) {
    userSettings.accentColor = color;
    applySettings();
    saveSettings();
    addActivity(`Accent color changed`);
}

function savePingCount(count) {
    userSettings.pingCount = parseInt(count);
    saveSettings();
    addActivity(`Default ping count set to ${count}`);
}

function saveTimeout(timeout) {
    userSettings.timeout = parseInt(timeout);
    saveSettings();
    addActivity(`Timeout set to ${timeout}ms`);
}

function toggleAutoRefresh(enabled) {
    userSettings.autoRefresh = enabled;
    saveSettings();
    
    if (enabled) {
        startAutoRefresh();
        addActivity('Auto-refresh enabled');
    } else {
        stopAutoRefresh();
        addActivity('Auto-refresh disabled');
    }
}

function toggleTimestamps(enabled) {
    userSettings.showTimestamps = enabled;
    saveSettings();
    addActivity(`Timestamps ${enabled ? 'enabled' : 'disabled'}`);
}

function setActivityLogLimit(limit) {
    userSettings.activityLogLimit = parseInt(limit);
    
    // Trim activity log if needed
    if (recentActivities.length > userSettings.activityLogLimit) {
        recentActivities = recentActivities.slice(-userSettings.activityLogLimit);
        updateActivityLog();
    }
    
    saveSettings();
    addActivity(`Activity log limit set to ${limit}`);
}

function toggleCompactMode(enabled) {
    userSettings.compactMode = enabled;
    applySettings();
    saveSettings();
    addActivity(`Compact mode ${enabled ? 'enabled' : 'disabled'}`);
}

function exportSettings() {
    const dataStr = JSON.stringify(userSettings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'netscope-settings.json';
    link.click();
    
    addActivity('Settings exported');
}

function importSettings(input) {
    const file = input.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            userSettings = { ...DEFAULT_SETTINGS, ...imported };
            applySettings();
            updateSettingsUI();
            saveSettings();
            addActivity('Settings imported successfully');
        } catch (error) {
            alert('Error importing settings: Invalid file format');
            addActivity('Failed to import settings');
        }
    };
    reader.readAsText(file);
    
    // Reset input
    input.value = '';
}

function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to default?')) {
        userSettings = { ...DEFAULT_SETTINGS };
        applySettings();
        updateSettingsUI();
        saveSettings();
        addActivity('Settings reset to default');
    }
}

function clearActivityLog() {
    if (confirm('Are you sure you want to clear the activity log?')) {
        recentActivities = [];
        updateActivityLog();
        addActivity('Activity log cleared');
    }
}

// Auto-refresh functionality
let autoRefreshInterval = null;

function startAutoRefresh() {
    if (autoRefreshInterval) return;
    
    autoRefreshInterval = setInterval(() => {
        if (currentSection === 'dashboard') {
            refreshDashboard();
        }
    }, 30000); // 30 seconds
}

function stopAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
    }
}

function refreshDashboard() {
    // Simulate dashboard refresh
    addActivity('Dashboard auto-refreshed');
}

// Performance Settings Functions
function setMaxConcurrentPings(count) {
    userSettings.maxConcurrentPings = parseInt(count);
    saveSettings();
    addActivity(`Max concurrent pings set to ${count}`);
}

function toggleDnsCache(enabled) {
    userSettings.cacheDns = enabled;
    saveSettings();
    addActivity(`DNS caching ${enabled ? 'enabled' : 'disabled'}`);
}

function setCacheDuration(minutes) {
    userSettings.cacheDuration = parseInt(minutes);
    saveSettings();
    addActivity(`Cache duration set to ${minutes} minutes`);
}

function toggleBackgroundMonitoring(enabled) {
    userSettings.backgroundMonitoring = enabled;
    saveSettings();
    addActivity(`Background monitoring ${enabled ? 'enabled' : 'disabled'}`);
    
    if (enabled) {
        startBackgroundMonitoring();
    } else {
        stopBackgroundMonitoring();
    }
}

// Notification Settings Functions
function toggleNotifications(enabled) {
    userSettings.enableNotifications = enabled;
    saveSettings();
    
    if (enabled) {
        requestNotificationPermission();
    }
    addActivity(`Notifications ${enabled ? 'enabled' : 'disabled'}`);
}

function setNotificationThreshold(threshold) {
    userSettings.notificationTimeoutThreshold = parseInt(threshold);
    saveSettings();
    addActivity(`Notification threshold set to ${threshold}ms`);
}

function toggleSoundAlerts(enabled) {
    userSettings.soundAlerts = enabled;
    saveSettings();
    addActivity(`Sound alerts ${enabled ? 'enabled' : 'disabled'}`);
}

function setAlertVolume(volume) {
    userSettings.alertVolume = parseInt(volume);
    document.getElementById('volume-display').textContent = volume + '%';
    saveSettings();
    addActivity(`Alert volume set to ${volume}%`);
}

// Advanced Network Settings Functions
function toggleIPv6Support(enabled) {
    userSettings.ipv6Support = enabled;
    saveSettings();
    addActivity(`IPv6 support ${enabled ? 'enabled' : 'disabled'}`);
}

function setDnsServers(servers) {
    userSettings.dnsServers = servers;
    saveSettings();
    addActivity('Custom DNS servers updated');
}

function setRetryAttempts(attempts) {
    userSettings.retryAttempts = parseInt(attempts);
    saveSettings();
    addActivity(`Retry attempts set to ${attempts}`);
}

function setConnectionTestInterval(interval) {
    userSettings.connectionTestInterval = parseInt(interval);
    saveSettings();
    addActivity(`Connection test interval set to ${interval} seconds`);
}

// Security & Privacy Settings Functions
function toggleIPAnonymization(enabled) {
    userSettings.anonymizeIPs = enabled;
    saveSettings();
    addActivity(`IP anonymization ${enabled ? 'enabled' : 'disabled'}`);
}

function toggleClearDataOnClose(enabled) {
    userSettings.clearDataOnClose = enabled;
    saveSettings();
    addActivity(`Clear data on close ${enabled ? 'enabled' : 'disabled'}`);
    
    if (enabled) {
        setupClearDataOnClose();
    }
}

function setGeolocationPrecision(precision) {
    userSettings.geolocationPrecision = precision;
    saveSettings();
    addActivity(`Geolocation precision set to ${precision} level`);
}

function toggleMaliciousDomainBlocking(enabled) {
    userSettings.blockMaliciousDomains = enabled;
    saveSettings();
    addActivity(`Malicious domain blocking ${enabled ? 'enabled' : 'disabled'}`);
}

// Accessibility Settings Functions
function toggleHighContrast(enabled) {
    userSettings.highContrast = enabled;
    applySettings();
    saveSettings();
    addActivity(`High contrast mode ${enabled ? 'enabled' : 'disabled'}`);
}

function setFontSize(size) {
    userSettings.fontSize = size;
    applySettings();
    saveSettings();
    addActivity(`Font size set to ${size}`);
}

function toggleReduceMotion(enabled) {
    userSettings.reduceMotion = enabled;
    applySettings();
    saveSettings();
    addActivity(`Reduce motion ${enabled ? 'enabled' : 'disabled'}`);
}

// Developer Settings Functions
function toggleDebugMode(enabled) {
    userSettings.debugMode = enabled;
    saveSettings();
    addActivity(`Debug mode ${enabled ? 'enabled' : 'disabled'}`);
    
    if (enabled) {
        console.log('NetScope Debug Mode Enabled');
        addActivity('Debug mode activated - check browser console for detailed logs');
    }
}

function setCustomAPIEndpoints(endpoints) {
    try {
        if (endpoints.trim()) {
            JSON.parse(endpoints); // Validate JSON
        }
        userSettings.apiEndpoints = endpoints;
        saveSettings();
        addActivity('Custom API endpoints updated');
    } catch (e) {
        alert('Invalid JSON format for API endpoints');
        addActivity('Failed to update API endpoints - invalid JSON');
    }
}

function exportRawData() {
    const rawData = {
        settings: userSettings,
        activities: recentActivities,
        timestamp: new Date().toISOString(),
        version: '2.0.0'
    };
    
    const dataStr = JSON.stringify(rawData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `netscope-rawdata-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    addActivity('Raw data exported');
}

function setConsoleLogging(level) {
    userSettings.consoleLogging = level;
    saveSettings();
    addActivity(`Console logging level set to ${level}`);
}

// Helper Functions for New Features
function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification('NetScope Notifications Enabled', {
                    body: 'You will now receive network status notifications',
                    icon: '/favicon.ico'
                });
            }
        });
    }
}

function setupClearDataOnClose() {
    window.addEventListener('beforeunload', () => {
        if (userSettings.clearDataOnClose) {
            localStorage.removeItem('netscope-settings');
            localStorage.removeItem('netscope-activities');
        }
    });
}

let backgroundMonitoringInterval = null;

function startBackgroundMonitoring() {
    if (backgroundMonitoringInterval) return;
    
    backgroundMonitoringInterval = setInterval(() => {
        // Simulate background network monitoring
        if (userSettings.debugMode) {
            console.log('Background monitoring check');
        }
    }, userSettings.connectionTestInterval * 1000);
}

function stopBackgroundMonitoring() {
    if (backgroundMonitoringInterval) {
        clearInterval(backgroundMonitoringInterval);
        backgroundMonitoringInterval = null;
    }
}

// Enhanced openSettings function
function openSettings() {
    showSection('settings');
}
