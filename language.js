// ==================== LANGUAGE SWITCHER FUNCTIONALITY ====================

// Comprehensive language list with flags and native names
const LANGUAGES = {
    'en': { name: 'English', flag: '🇺🇸', nativeName: 'English' },
    'es': { name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
    'fr': { name: 'French', flag: '🇫🇷', nativeName: 'Français' },
    'de': { name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
    'it': { name: 'Italian', flag: '🇮🇹', nativeName: 'Italiano' },
    'pt': { name: 'Portuguese', flag: '🇵🇹', nativeName: 'Português' },
    'ru': { name: 'Russian', flag: '🇷🇺', nativeName: 'Русский' },
    'ja': { name: 'Japanese', flag: '🇯🇵', nativeName: '日本語' },
    'zh': { name: 'Chinese (Simplified)', flag: '🇨🇳', nativeName: '简体中文' },
    'ko': { name: 'Korean', flag: '🇰🇷', nativeName: '한국어' },
    'ar': { name: 'Arabic', flag: '🇸🇦', nativeName: 'العربية' },
    'hi': { name: 'Hindi', flag: '🇮🇳', nativeName: 'हिन्दी' },
    'tr': { name: 'Turkish', flag: '🇹🇷', nativeName: 'Türkçe' },
    'nl': { name: 'Dutch', flag: '🇳🇱', nativeName: 'Nederlands' },
    'pl': { name: 'Polish', flag: '🇵🇱', nativeName: 'Polski' },
    'sv': { name: 'Swedish', flag: '🇸🇪', nativeName: 'Svenska' },
    'da': { name: 'Danish', flag: '🇩🇰', nativeName: 'Dansk' },
    'no': { name: 'Norwegian', flag: '🇳🇴', nativeName: 'Norsk' },
    'fi': { name: 'Finnish', flag: '🇫🇮', nativeName: 'Suomi' },
    'el': { name: 'Greek', flag: '🇬🇷', nativeName: 'Ελληνικά' },
    'cs': { name: 'Czech', flag: '🇨🇿', nativeName: 'Čeština' },
    'hu': { name: 'Hungarian', flag: '🇭🇺', nativeName: 'Magyar' },
    'ro': { name: 'Romanian', flag: '🇷🇴', nativeName: 'Română' },
    'bg': { name: 'Bulgarian', flag: '🇧🇬', nativeName: 'Български' },
    'uk': { name: 'Ukrainian', flag: '🇺🇦', nativeName: 'Українська' },
    'th': { name: 'Thai', flag: '🇹🇭', nativeName: 'ไทย' },
    'vi': { name: 'Vietnamese', flag: '🇻🇳', nativeName: 'Tiếng Việt' },
    'id': { name: 'Indonesian', flag: '🇮🇩', nativeName: 'Bahasa Indonesia' },
    'ms': { name: 'Malay', flag: '🇲🇾', nativeName: 'Bahasa Melayu' },
    'tl': { name: 'Filipino', flag: '🇵🇭', nativeName: 'Filipino' },
    'he': { name: 'Hebrew', flag: '🇮🇱', nativeName: 'עברית' },
    'fa': { name: 'Persian', flag: '🇮🇷', nativeName: 'فارسی' }
};

// Translation dictionary - Add more translations as needed
const TRANSLATIONS = {
    'en': {
        'Home': 'Home',
        'Services': 'Services',
        'About': 'About',
        'Contact': 'Contact',
        'Login': 'Login',
        'Logout': 'Logout',
        'Profile': 'Profile',
        'Settings': 'Settings',
        'Admin': 'Admin',
        'Collection': 'Collection',
        'Recycling': 'Recycling',
        'Location': 'Location',
        'AI Helpdesk': 'AI Helpdesk',
        'CO Detector': 'CO Detector',
        'Social': 'Social',
        'SMART WASTE': 'SMART WASTE',
        'Our Services': 'Our Services',
        'Request Collection': 'Request Collection',
        'Preview': 'Preview',
        'View on Map': 'View on Map',
        'Ask Me': 'Ask Me',
        'Monitor CO': 'Monitor CO',
        'Join Community': 'Join Community'
    },
    'es': {
        'Home': 'Inicio',
        'Services': 'Servicios',
        'About': 'Acerca de',
        'Contact': 'Contacto',
        'Login': 'Iniciar Sesión',
        'Logout': 'Cerrar Sesión',
        'Profile': 'Perfil',
        'Settings': 'Configuración',
        'Admin': 'Administrador',
        'Collection': 'Recolección',
        'Recycling': 'Reciclaje',
        'Location': 'Ubicación',
        'AI Helpdesk': 'Centro de Ayuda IA',
        'CO Detector': 'Detector de CO',
        'Social': 'Social',
        'SMART WASTE': 'SMART WASTE',
        'Our Services': 'Nuestros Servicios',
        'Request Collection': 'Solicitar Recolección',
        'Preview': 'Vista Previa',
        'View on Map': 'Ver en Mapa',
        'Ask Me': 'Pregúntame',
        'Monitor CO': 'Monitorear CO',
        'Join Community': 'Unirse a la Comunidad'
    },
    'fr': {
        'Home': 'Accueil',
        'Services': 'Services',
        'About': 'À propos',
        'Contact': 'Contact',
        'Login': 'Connexion',
        'Logout': 'Déconnexion',
        'Profile': 'Profil',
        'Settings': 'Paramètres',
        'Admin': 'Administrateur',
        'Collection': 'Collecte',
        'Recycling': 'Recyclage',
        'Location': 'Localisation',
        'AI Helpdesk': 'Centre d\'aide IA',
        'CO Detector': 'Détecteur de CO',
        'Social': 'Social',
        'SMART WASTE': 'SMART WASTE',
        'Our Services': 'Nos Services',
        'Request Collection': 'Demander une Collecte',
        'Preview': 'Aperçu',
        'View on Map': 'Voir sur la Carte',
        'Ask Me': 'Posez-moi une Question',
        'Monitor CO': 'Surveiller le CO',
        'Join Community': 'Rejoindre la Communauté'
    },
    'de': {
        'Home': 'Startseite',
        'Services': 'Dienstleistungen',
        'About': 'Über uns',
        'Contact': 'Kontakt',
        'Login': 'Anmelden',
        'Logout': 'Abmelden',
        'Profile': 'Profil',
        'Settings': 'Einstellungen',
        'Admin': 'Administrator',
        'Collection': 'Sammlung',
        'Recycling': 'Recycling',
        'Location': 'Standort',
        'AI Helpdesk': 'KI-Helpdesk',
        'CO Detector': 'CO-Detektor',
        'Social': 'Sozial',
        'SMART WASTE': 'SMART WASTE',
        'Our Services': 'Unsere Dienstleistungen',
        'Request Collection': 'Sammlung anfordern',
        'Preview': 'Vorschau',
        'View on Map': 'Auf Karte anzeigen',
        'Ask Me': 'Frag mich',
        'Monitor CO': 'CO überwachen',
        'Join Community': 'Gemeinschaft beitreten'
    },
    'pt': {
        'Home': 'Início',
        'Services': 'Serviços',
        'About': 'Sobre',
        'Contact': 'Contato',
        'Login': 'Login',
        'Logout': 'Sair',
        'Profile': 'Perfil',
        'Settings': 'Configurações',
        'Admin': 'Administrador',
        'Collection': 'Coleta',
        'Recycling': 'Reciclagem',
        'Location': 'Localização',
        'AI Helpdesk': 'Central de Ajuda IA',
        'CO Detector': 'Detector de CO',
        'Social': 'Social',
        'SMART WASTE': 'SMART WASTE',
        'Our Services': 'Nossos Serviços',
        'Request Collection': 'Solicitar Coleta',
        'Preview': 'Visualizar',
        'View on Map': 'Ver no Mapa',
        'Ask Me': 'Pergunte-me',
        'Monitor CO': 'Monitorar CO',
        'Join Community': 'Participar da Comunidade'
    },
    'ja': {
        'Home': 'ホーム',
        'Services': 'サービス',
        'About': '概要',
        'Contact': 'お問い合わせ',
        'Login': 'ログイン',
        'Logout': 'ログアウト',
        'Profile': 'プロフィール',
        'Settings': '設定',
        'Admin': '管理者',
        'Collection': '収集',
        'Recycling': 'リサイクル',
        'Location': '場所',
        'AI Helpdesk': 'AIヘルプデスク',
        'CO Detector': 'CO検出器',
        'Social': 'ソーシャル',
        'SMART WASTE': 'SMART WASTE',
        'Our Services': '当社のサービス',
        'Request Collection': '収集をリクエスト',
        'Preview': 'プレビュー',
        'View on Map': '地図で表示',
        'Ask Me': '質問する',
        'Monitor CO': 'COを監視',
        'Join Community': 'コミュニティに参加'
    },
    'zh': {
        'Home': '首页',
        'Services': '服务',
        'About': '关于',
        'Contact': '联系',
        'Login': '登录',
        'Logout': '退出',
        'Profile': '个人资料',
        'Settings': '设置',
        'Admin': '管理员',
        'Collection': '收集',
        'Recycling': '回收',
        'Location': '位置',
        'AI Helpdesk': '人工智能帮助台',
        'CO Detector': '一氧化碳检测器',
        'Social': '社交',
        'SMART WASTE': 'SMART WASTE',
        'Our Services': '我们的服务',
        'Request Collection': '请求收集',
        'Preview': '预览',
        'View on Map': '在地图上查看',
        'Ask Me': '问我',
        'Monitor CO': '监测一氧化碳',
        'Join Community': '加入社区'
    },
    'ko': {
        'Home': '홈',
        'Services': '서비스',
        'About': '소개',
        'Contact': '연락처',
        'Login': '로그인',
        'Logout': '로그아웃',
        'Profile': '프로필',
        'Settings': '설정',
        'Admin': '관리자',
        'Collection': '수집',
        'Recycling': '재활용',
        'Location': '위치',
        'AI Helpdesk': 'AI 헬프데스크',
        'CO Detector': 'CO 감지기',
        'Social': '소셜',
        'SMART WASTE': 'SMART WASTE',
        'Our Services': '당사 서비스',
        'Request Collection': '수집 요청',
        'Preview': '미리보기',
        'View on Map': '지도에서 보기',
        'Ask Me': '물어보기',
        'Monitor CO': 'CO 모니터링',
        'Join Community': '커뮤니티 참여'
    },
    'ar': {
        'Home': 'الرئيسية',
        'Services': 'الخدمات',
        'About': 'حول',
        'Contact': 'اتصال',
        'Login': 'تسجيل الدخول',
        'Logout': 'تسجيل الخروج',
        'Profile': 'الملف الشخصي',
        'Settings': 'الإعدادات',
        'Admin': 'المسؤول',
        'Collection': 'الجمع',
        'Recycling': 'إعادة التدوير',
        'Location': 'الموقع',
        'AI Helpdesk': 'مكتب المساعدة بالذكاء الاصطناعي',
        'CO Detector': 'كاشف أول أكسيد الكربون',
        'Social': 'اجتماعي',
        'SMART WASTE': 'SMART WASTE',
        'Our Services': 'خدماتنا',
        'Request Collection': 'طلب جمع',
        'Preview': 'معاينة',
        'View on Map': 'عرض على الخريطة',
        'Ask Me': 'اسأل',
        'Monitor CO': 'مراقبة CO',
        'Join Community': 'الانضمام إلى المجتمع'
    },
    'hi': {
        'Home': 'होम',
        'Services': 'सेवाएं',
        'About': 'के बारे में',
        'Contact': 'संपर्क',
        'Login': 'लॉगिन',
        'Logout': 'लॉगआउट',
        'Profile': 'प्रोफाइल',
        'Settings': 'सेटिंग्स',
        'Admin': 'प्रशासक',
        'Collection': 'संग्रह',
        'Recycling': 'पुनर्चक्रण',
        'Location': 'स्थान',
        'AI Helpdesk': 'एआई हेल्पडेस्क',
        'CO Detector': 'CO डिटेक्टर',
        'Social': 'सामाजिक',
        'SMART WASTE': 'SMART WASTE',
        'Our Services': 'हमारी सेवाएं',
        'Request Collection': 'संग्रह का अनुरोध करें',
        'Preview': 'पूर्वावलोकन',
        'View on Map': 'मानचित्र पर देखें',
        'Ask Me': 'मुझसे पूछें',
        'Monitor CO': 'CO की निगरानी करें',
        'Join Community': 'समुदाय में शामिल हों'
    }
};

// Current language
let currentLanguage = localStorage.getItem('selectedLanguage') || 'en';

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeLanguageSwitcher();
    applyLanguage(currentLanguage);
});

// Initialize language dropdown
function initializeLanguageSwitcher() {
    const dropdown = document.getElementById('languageDropdown');
    if (!dropdown) return;
    
    let html = '';
    for (const [code, lang] of Object.entries(LANGUAGES)) {
        html += `
            <button class="language-option" onclick="changeLanguage('${code}')" style="
                display: block;
                width: 100%;
                padding: 0.75rem;
                border: none;
                background: ${currentLanguage === code ? '#e8f5e9' : 'white'};
                color: #333;
                text-align: left;
                cursor: pointer;
                font-size: 0.95rem;
                transition: all 0.2s;
            " onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='${currentLanguage === code ? '#e8f5e9' : 'white'}'">
                ${lang.flag} ${lang.name} (${lang.nativeName})
            </button>
        `;
    }
    dropdown.innerHTML = html;
}

// Toggle language dropdown
function toggleLanguageDropdown() {
    const dropdown = document.getElementById('languageDropdown');
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    }
}

// Change language
function changeLanguage(code) {
    currentLanguage = code;
    localStorage.setItem('selectedLanguage', code);
    applyLanguage(code);
    
    // Update button
    const button = document.getElementById('languageBtnBefore');
    if (button) {
        const lang = LANGUAGES[code];
        button.textContent = `${lang.flag} ${code.toUpperCase()}`;
    }
    
    // Close dropdown
    const dropdown = document.getElementById('languageDropdown');
    if (dropdown) {
        dropdown.style.display = 'none';
    }
    
    // Reinitialize dropdown
    initializeLanguageSwitcher();
}

// Apply language translation
function applyLanguage(code) {
    const translations = TRANSLATIONS[code] || TRANSLATIONS['en'];
    
    // Translate text nodes
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    let node;
    while (node = walker.nextNode()) {
        const text = node.textContent.trim();
        if (translations[text]) {
            node.textContent = translations[text];
        }
    }
    
    // Set page direction for RTL languages
    if (['ar', 'he', 'fa'].includes(code)) {
        document.documentElement.dir = 'rtl';
        document.body.dir = 'rtl';
    } else {
        document.documentElement.dir = 'ltr';
        document.body.dir = 'ltr';
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('languageDropdown');
    const button = document.getElementById('languageBtnBefore');
    
    if (dropdown && button && !button.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none';
    }
});
