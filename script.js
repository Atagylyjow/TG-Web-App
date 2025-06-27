// Backend API URL'si
const API_BASE_URL = 'http://localhost:3000/api';

// Telegram Web App Integration
let tg = null;

// Script verilerini sakla
let scripts = {};
let currentStats = {};

// Wait for Telegram WebApp to load
function initializeTelegramWebApp() {
    console.log('🚀 initializeTelegramWebApp başlatılıyor...');
    console.log('🔍 window.Telegram:', typeof window.Telegram);
    console.log('🔍 window.Telegram.WebApp:', typeof window.Telegram?.WebApp);
    
    // Check if Telegram WebApp is available
    if (typeof window.Telegram !== 'undefined' && window.Telegram.WebApp) {
        console.log('✅ Telegram WebApp bulundu, başlatılıyor...');
        
        try {
            tg = window.Telegram.WebApp;
            console.log('📱 Telegram WebApp objesi:', tg);
            
            tg.ready();
            console.log('✅ tg.ready() çağrıldı');
            
            tg.expand();
            console.log('✅ tg.expand() çağrıldı');
            
            // Set theme
            const theme = tg.colorScheme;
            console.log('🎨 Tema:', theme);
            document.documentElement.setAttribute('data-theme', theme);
            
            // Update theme toggle icon
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                const icon = themeToggle.querySelector('i');
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
                console.log('✅ Tema toggle güncellendi');
            }
            
            console.log('✅ Telegram WebApp başarıyla başlatıldı');
        } catch (error) {
            console.error('❌ Telegram WebApp başlatılırken hata:', error);
        }
    } else {
        console.log('ℹ️ Telegram WebApp bulunamadı, normal web modunda çalışıyor');
        // Normal web modu için varsayılan tema
        document.documentElement.setAttribute('data-theme', 'light');
    }
    
    console.log('🔧 AdsGram başlatılıyor...');
    // Initialize AdsGram SDK
    initializeAdsGram();
    
    console.log('📊 İstatistikler yükleniyor...');
    // Load initial stats
    loadStats();
    
    console.log('📝 Scriptler yükleniyor...');
    // Load scripts
    loadScripts();
    
    console.log('👁️ App container kontrol ediliyor...');
    // Show main content
    const appContainer = document.querySelector('.app-container');
    console.log('🔍 App container bulundu:', !!appContainer);
    
    if (appContainer) {
        // Zorla görünür hale getir
        appContainer.style.display = 'flex';
        appContainer.style.visibility = 'visible';
        appContainer.style.opacity = '1';
        appContainer.style.position = 'relative';
        appContainer.style.zIndex = '1';
        
        console.log('✅ App container görünür hale getirildi');
        
        // Ek kontrol
        console.log('🔍 App container display style:', appContainer.style.display);
        console.log('🔍 App container visibility:', appContainer.style.visibility);
        console.log('🔍 App container opacity:', appContainer.style.opacity);
        
        // Body'yi de kontrol et
        document.body.style.background = 'var(--bg-primary)';
        document.body.style.color = 'var(--text-primary)';
        console.log('✅ Body stilleri güncellendi');
        
    } else {
        console.error('❌ App container bulunamadı');
        
        // Alternatif olarak body'ye içerik ekle
        document.body.innerHTML = `
            <div class="app-container" style="display: flex; flex-direction: column; min-height: 100vh; background: var(--bg-primary); color: var(--text-primary);">
                <h1>VPN Script Hub</h1>
                <p>Uygulama yükleniyor...</p>
            </div>
        `;
        console.log('⚠️ Alternatif app container oluşturuldu');
    }
    
    console.log('🎉 initializeTelegramWebApp tamamlandı');
}

// Load scripts from backend
async function loadScripts() {
    try {
        console.log('📝 Backend\'den scriptler yükleniyor...');
        
        const response = await fetch(`${API_BASE_URL}/scripts`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        scripts = await response.json();
        console.log('📋 Backend scriptleri:', scripts);
        
        // UI'yi güncelle
        updateScriptsUI();
        
        console.log('✅ Scriptler backend\'den yüklendi:', Object.keys(scripts).length);
        
    } catch (error) {
        console.error('❌ Backend\'den scriptler yüklenirken hata:', error);
        
        // Fallback: varsayılan scriptler
        console.log('🔄 Fallback scriptleri kullanılıyor...');
        scripts = {
            darktunnel: {
                id: 'darktunnel',
                name: 'DarkTunnel',
                description: 'Gelişmiş tünel teknolojisi ile güvenli bağlantı',
                filename: 'darktunnel.conf',
                downloads: 0
            },
            httpcustom: {
                id: 'httpcustom',
                name: 'HTTP Custom',
                description: 'HTTP/HTTPS protokolü ile özelleştirilebilir bağlantı',
                filename: 'httpcustom.conf',
                downloads: 0
            }
        };
        
        updateScriptsUI();
    }
}

// Update scripts UI
function updateScriptsUI() {
    const scriptsContainer = document.getElementById('scripts-container');
    if (!scriptsContainer) {
        console.error('❌ Scripts container bulunamadı');
        return;
    }
    
    // Clear existing content
    scriptsContainer.innerHTML = '';
    
    // Add scripts dynamically
    Object.values(scripts).forEach(script => {
        const scriptCard = createScriptCard(script);
        scriptsContainer.appendChild(scriptCard);
    });
    
    console.log('✅ Script UI güncellendi:', Object.keys(scripts).length, 'script');
}

// Create script card
function createScriptCard(script) {
    const card = document.createElement('div');
    card.className = 'script-card';
    card.dataset.script = script.id;
    
    // Script icon'u belirle
    let icon = 'fas fa-shield-alt'; // varsayılan
    if (script.id.includes('tunnel') || script.id.includes('dark')) {
        icon = 'fas fa-tunnel';
    } else if (script.id.includes('http') || script.id.includes('custom')) {
        icon = 'fas fa-globe';
    } else if (script.id.includes('wireguard')) {
        icon = 'fas fa-network-wired';
    } else if (script.id.includes('openvpn')) {
        icon = 'fas fa-vpn';
    }
    
    // Feature tag'leri oluştur
    const features = [];
    if (script.description.includes('hızlı') || script.description.includes('fast')) {
        features.push('Hızlı');
    }
    if (script.description.includes('güvenli') || script.description.includes('secure')) {
        features.push('Güvenli');
    }
    if (script.description.includes('kararlı') || script.description.includes('stable')) {
        features.push('Kararlı');
    }
    if (script.description.includes('özelleştirilebilir') || script.description.includes('customizable')) {
        features.push('Özelleştirilebilir');
    }
    if (script.description.includes('protokol') || script.description.includes('protocol')) {
        features.push('Çoklu Protokol');
    }
    if (script.description.includes('kolay') || script.description.includes('easy')) {
        features.push('Kolay Kurulum');
    }
    
    // Varsayılan feature'lar
    if (features.length === 0) {
        features.push('Hızlı', 'Güvenli', 'Kararlı');
    }
    
    const featureTags = features.map(feature => 
        `<span class="feature-tag">${feature}</span>`
    ).join('');
    
    card.innerHTML = `
        <div class="script-icon">
            <i class="${icon}"></i>
        </div>
        <div class="script-info">
            <h3>${script.name}</h3>
            <p>${script.description}</p>
            <div class="script-features">
                ${featureTags}
            </div>
        </div>
        <div class="script-action">
            <button class="btn btn-primary unlock-btn" data-script="${script.id}">
                <i class="fas fa-play"></i>
                Reklam İzle & İndir
            </button>
        </div>
    `;
    
    return card;
}

// Load real-time stats from backend
async function loadStats() {
    try {
        console.log('📊 Backend\'den istatistikler yükleniyor...');
        
        const response = await fetch(`${API_BASE_URL}/stats`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        currentStats = await response.json();
        console.log('📈 Backend istatistikleri:', currentStats);
        
        // UI'yi güncelle
        updateStatsUI();
        
        console.log('✅ İstatistikler backend\'den yüklendi:', currentStats);
        
    } catch (error) {
        console.error('❌ Backend\'den istatistikler yüklenirken hata:', error);
        
        // Fallback: varsayılan değerler
        console.log('🔄 Fallback değerleri kullanılıyor...');
        currentStats = {
            totalDownloads: Math.floor(Math.random() * 1000) + 500,
            activeUsers: Math.floor(Math.random() * 100) + 50,
            scriptCount: Object.keys(scripts).length,
            activeScripts: Object.keys(scripts).length
        };
        
        updateStatsUI();
    }
}

// Update stats UI
function updateStatsUI() {
    const totalDownloadsElement = document.getElementById('total-downloads');
    const activeUsersElement = document.getElementById('active-users');
    const scriptCountElement = document.getElementById('script-count');
    
    if (totalDownloadsElement) {
        totalDownloadsElement.textContent = currentStats.totalDownloads?.toLocaleString() || '0';
    }
    if (activeUsersElement) {
        activeUsersElement.textContent = currentStats.activeUsers?.toLocaleString() || '0';
    }
    if (scriptCountElement) {
        scriptCountElement.textContent = currentStats.activeScripts?.toString() || '0';
    }
}

// Send data to Telegram bot
function sendDataToBot(data) {
    if (tg && tg.sendData) {
        try {
            tg.sendData(JSON.stringify(data));
            console.log('✅ Veri Telegram bot\'a gönderildi:', data);
        } catch (error) {
            console.error('❌ Telegram bot\'a veri gönderilemedi:', error);
        }
    } else {
        console.log('ℹ️ Telegram bot bağlantısı yok, veri gönderilmedi');
    }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTelegramWebApp);
} else {
    initializeTelegramWebApp();
}

// Also try to initialize after a short delay (in case Telegram WebApp loads later)
setTimeout(initializeTelegramWebApp, 1000);

// Periyodik istatistik güncellemesi
setInterval(updateStats, 30000); // Her 30 saniyede bir güncelle

// AdsGram Controller
let AdController = null;

// Initialize AdsGram SDK
function initializeAdsGram() {
    try {
        console.log('🔧 AdsGram SDK başlatılıyor...');
        console.log('📋 Block ID:', 'int-12281');
        
        // 🔥 BURAYA KENDİ BLOCK ID'NİZİ YAZIN 🔥
        // Örnek: "abc123def456" (tırnak işaretleri olmadan)
        // https://partner.adsgram.ai adresinden Block ID'nizi alın
        AdController = window.Adsgram.init({ 
            blockId: "int-12281"  // ← BURAYA KENDİ BLOCK ID'NİZİ YAZIN
        });
        
        console.log('✅ AdsGram SDK başarıyla başlatıldı');
        console.log('🎮 AdController:', AdController);
        
    } catch (error) {
        console.error('❌ AdsGram SDK başlatılamadı:', error);
        console.error('🔍 Hata detayları:', {
            message: error.message,
            stack: error.stack,
            windowAdsgram: !!window.Adsgram
        });
    }
}

// Reklam gösterme fonksiyonu
async function showAd() {
    console.log('🎬 Reklam gösterme başlatılıyor...');
    
    if (!AdController) {
        console.error('❌ AdsGram Controller bulunamadı');
        console.error('🔍 AdController durumu:', AdController);
        return false;
    }
    
    console.log('✅ AdController bulundu, reklam gösteriliyor...');
    
    try {
        console.log('📺 Reklam yükleniyor...');
        const result = await AdController.show();
        
        console.log('📊 Reklam sonucu:', result);
        console.log('📈 Reklam durumu:', {
            done: result.done,
            description: result.description,
            state: result.state,
            error: result.error
        });
        
        if (result.done) {
            console.log('✅ Kullanıcı reklamı tamamladı');
            return true;
        } else {
            console.log('❌ Kullanıcı reklamı tamamlamadı');
            return false;
        }
    } catch (error) {
        console.error('❌ Reklam gösterme hatası:', error);
        console.error('🔍 Hata detayları:', {
            message: error.message,
            stack: error.stack,
            type: error.constructor.name
        });
        return false;
    }
}

// App State
let currentScript = null;
let adTimer = null;
let downloadCount = Math.floor(Math.random() * 1000) + 500; // 500-1500 arası rastgele
let activeUsers = Math.floor(Math.random() * 100) + 50; // 50-150 arası rastgele

// VPN Script Data
const vpnScripts = {
    darktunnel: {
        name: 'DarkTunnel',
        description: 'Gelişmiş tünel teknolojisi ile güvenli bağlantı',
        content: `# DarkTunnel VPN Configuration
# Server: premium.darktunnel.com
# Port: 443
# Protocol: TLS

[General]
loglevel = notify
interface = 127.0.0.1
port = 1080
socks-interface = 127.0.0.1
socks-port = 1081
http-interface = 127.0.0.1
http-port = 1082

[Proxy]
Type = Shadowsocks
Server = premium.darktunnel.com
Port = 443
Method = chacha20-ietf-poly1305
Password = your_password_here

[Proxy Group]
Proxy = select, auto, fallback
auto = url-test, server-tcp, url = http://www.gstatic.com/generate_204
fallback = fallback, server-tcp, url = http://www.gstatic.com/generate_204

[Rule]
DOMAIN-SUFFIX,google.com,Proxy
DOMAIN-SUFFIX,facebook.com,Proxy
DOMAIN-SUFFIX,twitter.com,Proxy
DOMAIN-SUFFIX,instagram.com,Proxy
DOMAIN-SUFFIX,youtube.com,Proxy
DOMAIN-SUFFIX,netflix.com,Proxy
GEOIP,CN,DIRECT
FINAL,DIRECT`,
        filename: 'darktunnel.conf'
    },
    httpcustom: {
        name: 'HTTP Custom',
        description: 'HTTP/HTTPS protokolü ile özelleştirilebilir bağlantı',
        content: `# HTTP Custom Configuration
# Server: http-custom.example.com
# Port: 80
# Protocol: HTTP

[General]
loglevel = notify
interface = 127.0.0.1
port = 1080
socks-interface = 127.0.0.1
socks-port = 1081
http-interface = 127.0.0.1
http-port = 1082

[Proxy]
Type = HTTP
Server = http-custom.example.com
Port = 80
Username = your_username
Password = your_password

[Proxy Group]
Proxy = select, auto, fallback
auto = url-test, server-tcp, url = http://www.gstatic.com/generate_204
fallback = fallback, server-tcp, url = http://www.gstatic.com/generate_204

[Rule]
DOMAIN-SUFFIX,google.com,Proxy
DOMAIN-SUFFIX,facebook.com,Proxy
DOMAIN-SUFFIX,twitter.com,Proxy
DOMAIN-SUFFIX,instagram.com,Proxy
DOMAIN-SUFFIX,youtube.com,Proxy
DOMAIN-SUFFIX,netflix.com,Proxy
GEOIP,CN,DIRECT
FINAL,DIRECT`,
        filename: 'httpcustom.conf'
    }
};

// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const adModal = document.getElementById('ad-modal');
const downloadModal = document.getElementById('download-modal');
const modalClose = document.getElementById('modal-close');
const downloadModalClose = document.getElementById('download-modal-close');
const progressFill = document.getElementById('progress-fill');
const timer = document.getElementById('timer');
const downloadBtn = document.getElementById('download-btn');
const downloadScriptName = document.getElementById('download-script-name');
const downloadScriptDesc = document.getElementById('download-script-desc');
const totalDownloadsElement = document.getElementById('total-downloads');
const activeUsersElement = document.getElementById('active-users');

// Debug DOM elements
console.log('🔍 DOM Elementleri kontrol ediliyor...');
console.log('🎨 Theme toggle:', !!themeToggle);
console.log('📺 Ad modal:', !!adModal);
console.log('📥 Download modal:', !!downloadModal);
console.log('❌ Modal close:', !!modalClose);
console.log('❌ Download modal close:', !!downloadModalClose);
console.log('📊 Progress fill:', !!progressFill);
console.log('⏰ Timer:', !!timer);
console.log('⬇️ Download btn:', !!downloadBtn);
console.log('📝 Download script name:', !!downloadScriptName);
console.log('📄 Download script desc:', !!downloadScriptDesc);
console.log('📈 Total downloads:', !!totalDownloadsElement);
console.log('👥 Active users:', !!activeUsersElement);

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            
            const icon = themeToggle.querySelector('i');
            icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        });
    }
    
    // Unlock button event delegation (for dynamically created elements)
    document.addEventListener('click', function(e) {
        if (e.target.closest('.unlock-btn')) {
            e.preventDefault();
            console.log('🎯 Unlock button tıklandı!');
            const scriptCard = e.target.closest('.script-card');
            console.log('📋 Script card:', scriptCard);
            
            if (scriptCard) {
                const scriptId = scriptCard.dataset.script;
                console.log('📝 Script ID:', scriptId);
                currentScript = scriptId;
                console.log('🎬 Reklam modalı açılıyor...');
                showAdModal();
            } else {
                console.error('❌ Script card bulunamadı!');
            }
        }
    });
});

// Show Ad Modal
function showAdModal() {
    console.log('🎬 showAdModal çağrıldı');
    
    // Direkt AdsGram reklamını göster, modal gösterme
    console.log('🔄 Direkt AdsGram reklamı gösteriliyor...');
    showAdsGramAd();
}

// Hide Ad Modal
function hideAdModal() {
    adModal.classList.remove('show');
    if (adTimer) {
        clearInterval(adTimer);
    }
}

// Show AdsGram Ad
async function showAdsGramAd() {
    try {
        // AdsGram reklamını göster
        const adWatched = await showAd();
        
        if (adWatched) {
            // Kullanıcı reklamı tamamladı
            showNotification('✅ Reklam tamamlandı! Script indiriliyor...', 'success');
            showDownloadModal();
        } else {
            // Kullanıcı reklamı tamamlamadı
            showNotification('❌ Reklam tamamlanmadı. Lütfen tekrar deneyin.', 'error');
        }
    } catch (error) {
        console.error('Reklam gösterme hatası:', error);
        showNotification('❌ Reklam yüklenirken hata oluştu.', 'error');
    }
}

// Show Download Modal
function showDownloadModal() {
    if (!currentScript || !scripts[currentScript]) {
        console.error('❌ Script bilgisi bulunamadı!');
        showNotification('❌ Script bilgisi bulunamadı', 'error');
        return;
    }
    
    const script = scripts[currentScript];
    downloadScriptName.textContent = script.name;
    downloadScriptDesc.textContent = script.description;
    downloadModal.classList.add('show');
}

// Hide Download Modal
function hideDownloadModal() {
    downloadModal.classList.remove('show');
}

// Modal Close Events
modalClose.addEventListener('click', hideAdModal);
downloadModalClose.addEventListener('click', hideDownloadModal);

// Close modals when clicking outside
adModal.addEventListener('click', (e) => {
    if (e.target === adModal) {
        hideAdModal();
    }
});

downloadModal.addEventListener('click', (e) => {
    if (e.target === downloadModal) {
        hideDownloadModal();
    }
});

// Download Button
downloadBtn.addEventListener('click', () => {
    if (currentScript) {
        downloadScript(currentScript);
    } else {
        console.error('❌ Current script bulunamadı!');
        showNotification('❌ Script bilgisi bulunamadı', 'error');
    }
});

// Download Script Function
async function downloadScript(scriptId) {
    try {
        console.log('📥 Script indirme başlatılıyor:', scriptId);
        
        // Backend'den script içeriğini al
        const response = await fetch(`${API_BASE_URL}/scripts/${scriptId}`);
        if (!response.ok) {
            throw new Error(`Script bulunamadı: ${response.status}`);
        }
        
        const result = await response.json();
        const script = result.script;
        
        console.log('📋 Script verisi alındı:', script);
        
        // Dosyayı indir
        const blob = new Blob([script.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = script.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Backend'e indirme verisi gönder
        const userId = tg?.initDataUnsafe?.user?.id || 'unknown';
        
        const downloadResponse = await fetch(`${API_BASE_URL}/download`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                scriptId: scriptId,
                userId: userId,
                timestamp: Date.now()
            })
        });
        
        if (downloadResponse.ok) {
            const downloadResult = await downloadResponse.json();
            console.log('✅ İndirme verisi backend\'e gönderildi:', downloadResult);
            
            // Backend'den güncel istatistikleri ve scriptleri al
            await loadStats();
            await loadScripts();
        }
        
        // Show success message
        showNotification(`${script.name} başarıyla indirildi!`, 'success');
        
        // Send data to Telegram bot
        sendDataToBot({
            action: 'download',
            script: scriptId,
            timestamp: Date.now()
        });
        
    } catch (error) {
        console.error('❌ Script indirme hatası:', error);
        showNotification('❌ Script indirilemedi. Lütfen tekrar deneyin.', 'error');
    }
}

// Show Notification Function
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-card);
        color: var(--text-primary);
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: var(--shadow-hover);
        border: 1px solid var(--border-color);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Update Stats Periodically
async function updateStats() {
    try {
        console.log('📊 İstatistikler güncelleniyor...');
        
        await loadStats();
        await loadScripts();
        
        console.log('✅ İstatistikler ve scriptler güncellendi');
        
    } catch (error) {
        console.error('❌ İstatistikler güncellenirken hata:', error);
    }
}

// Add some interactive effects
document.querySelectorAll('.script-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hideAdModal();
        hideDownloadModal();
    }
});

// Add loading animation for buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function() {
        if (this.classList.contains('unlock-btn')) {
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Yükleniyor...';
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.disabled = false;
            }, 1000);
        }
    });
});

// Add smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.script-card, .instruction-step').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Initialize Telegram Web App settings
if (tg) {
    // Set initial colors
    const currentTheme = document.documentElement.getAttribute('data-theme');
    tg.setHeaderColor(currentTheme === 'dark' ? '#1a1a1a' : '#ffffff');
    tg.setBackgroundColor(currentTheme === 'dark' ? '#1a1a1a' : '#ffffff');
    
    // Enable closing confirmation
    tg.enableClosingConfirmation();
    
    // Set main button if needed
    // tg.MainButton.setText('Ana Menü');
    // tg.MainButton.show();
}

console.log('VPN Script Hub loaded successfully!'); 