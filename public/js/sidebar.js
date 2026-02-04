/* ===========================================
   Sistema de Escola Conectada - MED Angola
   Sidebar JavaScript
   =========================================== */

/**
 * Controlador da Sidebar
 */
const SidebarController = {
  sidebar: null,
  overlay: null,
  mainContent: null,
  toggleBtn: null,
  mobileToggle: null,
  closeBtn: null,

  /**
   * Inicializar sidebar
   */
  init: function() {
    this.sidebar = document.querySelector('.sidebar');
    this.overlay = document.querySelector('.sidebar-overlay');
    this.mainContent = document.querySelector('.main-content');
    this.toggleBtn = document.querySelector('.sidebar-toggle');
    this.mobileToggle = document.querySelector('.mobile-toggle');
    this.closeBtn = document.querySelector('.sidebar-close');

    if (!this.sidebar) return;

    // Restaurar estado salvo
    this.restoreState();

    // Event listeners
    this.bindEvents();
  },

  /**
   * Vincular eventos
   */
  bindEvents: function() {
    const self = this;

    // Toggle desktop
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', function() {
        self.toggle();
      });
    }

    // Toggle mobile
    if (this.mobileToggle) {
      this.mobileToggle.addEventListener('click', function() {
        self.openMobile();
      });
    }

    // Close button mobile
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', function() {
        self.closeMobile();
      });
    }

    // Overlay click
    if (this.overlay) {
      this.overlay.addEventListener('click', function() {
        self.closeMobile();
      });
    }

    // Keyboard shortcut (Ctrl + B)
    document.addEventListener('keydown', function(e) {
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        if (window.innerWidth > 991) {
          self.toggle();
        } else {
          if (self.sidebar.classList.contains('mobile-open')) {
            self.closeMobile();
          } else {
            self.openMobile();
          }
        }
      }
    });

    // Escape key to close mobile
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && self.sidebar.classList.contains('mobile-open')) {
        self.closeMobile();
      }
    });

    // Window resize handler
    window.addEventListener('resize', function() {
      if (window.innerWidth > 991) {
        self.closeMobile();
      }
    }, 250);
  },

  /**
   * Toggle sidebar (desktop)
   */
  toggle: function() {
    this.sidebar.classList.toggle('collapsed');
    if (this.mainContent) {
      this.mainContent.classList.toggle('sidebar-collapsed');
    }
    this.saveState();
  },

  /**
   * Abrir sidebar (mobile)
   */
  openMobile: function() {
    this.sidebar.classList.add('mobile-open');
    if (this.overlay) {
      this.overlay.classList.add('active');
      this.overlay.style.display = 'block';
    }
    document.body.style.overflow = 'hidden';
  },

  /**
   * Fechar sidebar (mobile)
   */
  closeMobile: function() {
    this.sidebar.classList.remove('mobile-open');
    if (this.overlay) {
      this.overlay.classList.remove('active');
      setTimeout(() => {
        this.overlay.style.display = 'none';
      }, 250);
    }
    document.body.style.overflow = '';
  },

  /**
   * Salvar estado no localStorage
   */
  saveState: function() {
    const isCollapsed = this.sidebar.classList.contains('collapsed');
    localStorage.setItem('sidebarCollapsed', isCollapsed);
  },

  /**
   * Restaurar estado do localStorage
   */
  restoreState: function() {
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed && window.innerWidth > 991) {
      this.sidebar.classList.add('collapsed');
      if (this.mainContent) {
        this.mainContent.classList.add('sidebar-collapsed');
      }
    }
  },

  /**
   * Expandir sidebar
   */
  expand: function() {
    this.sidebar.classList.remove('collapsed');
    if (this.mainContent) {
      this.mainContent.classList.remove('sidebar-collapsed');
    }
    this.saveState();
  },

  /**
   * Colapsar sidebar
   */
  collapse: function() {
    this.sidebar.classList.add('collapsed');
    if (this.mainContent) {
      this.mainContent.classList.add('sidebar-collapsed');
    }
    this.saveState();
  }
};

/**
 * Gerar HTML da Sidebar baseado no perfil
 */
function gerarSidebar(perfil) {
  const menuItens = {
    admin: [
      { grupo: 'Principal', itens: [
        { icon: 'dashboard', texto: 'Dashboard', link: 'dashboard.html' }
      ]},
      { grupo: 'Comunicação', itens: [
        { icon: 'megaphone', texto: 'Avisos', link: 'avisos.html', badge: 2 }
      ]},
      { grupo: 'Conta', itens: [
        { icon: 'user', texto: 'Meu Perfil', link: 'perfil.html' },
        { icon: 'logout', texto: 'Sair', link: '../login.html' }
      ]}
    ],
    professor: [
      { grupo: 'Principal', itens: [
        { icon: 'dashboard', texto: 'Dashboard', link: 'dashboard.html' }
      ]},
      { grupo: 'Académico', itens: [
        { icon: 'users', texto: 'Minhas Turmas', link: 'turmas.html' },
        { icon: 'clipboard', texto: 'Mini-Pauta', link: 'mini-pauta.html' },
        { icon: 'calendar-x', texto: 'Faltas', link: 'faltas.html' }
      ]},
      { grupo: 'Comunicação', itens: [
        { icon: 'megaphone', texto: 'Avisos', link: 'avisos.html', badge: 3 }
      ]},
      { grupo: 'Conta', itens: [
        { icon: 'user', texto: 'Meu Perfil', link: 'perfil.html' },
        { icon: 'logout', texto: 'Sair', link: '../login.html' }
      ]}
    ],
    aluno: [
      { grupo: 'Principal', itens: [
        { icon: 'dashboard', texto: 'Dashboard', link: 'dashboard.html' }
      ]},
      { grupo: 'Académico', itens: [
        { icon: 'grade', texto: 'Minhas Notas', link: 'notas.html' },
        { icon: 'chart', texto: 'Desempenho', link: 'desempenho.html' },
        { icon: 'calendar-x', texto: 'Faltas', link: 'faltas.html' }
      ]},
      { grupo: 'Comunicação', itens: [
        { icon: 'megaphone', texto: 'Avisos', link: 'avisos.html', badge: 2 }
      ]},
      { grupo: 'Conta', itens: [
        { icon: 'user', texto: 'Meu Perfil', link: 'perfil.html' },
        { icon: 'logout', texto: 'Sair', link: '../login.html' }
      ]}
    ],
    encarregado: [
      { grupo: 'Principal', itens: [
        { icon: 'dashboard', texto: 'Dashboard', link: 'dashboard.html' }
      ]},
      { grupo: 'Educandos', itens: [
        { icon: 'users', texto: 'Meus Educandos', link: 'filhos.html' },
        { icon: 'grade', texto: 'Notas', link: 'notas.html' },
        { icon: 'calendar-x', texto: 'Faltas', link: 'faltas.html' }
      ]},
      { grupo: 'Comunicação', itens: [
        { icon: 'megaphone', texto: 'Avisos', link: 'avisos.html', badge: 2 }
      ]},
      { grupo: 'Conta', itens: [
        { icon: 'user', texto: 'Meu Perfil', link: 'perfil.html' },
        { icon: 'logout', texto: 'Sair', link: '../login.html' }
      ]}
    ]
  };

  const perfisNomes = {
    admin: 'Administração',
    professor: 'Professor',
    aluno: 'Aluno',
    encarregado: 'Encarregado'
  };

  const menu = menuItens[perfil] || menuItens.aluno;

  return menu;
}

/**
 * Obter ícone SVG
 */
function getIcon(nome) {
  const icons = {
    dashboard: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
    users: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    clipboard: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>`,
    'calendar-x': `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="10" y1="14" x2="14" y2="18"/><line x1="14" y1="14" x2="10" y2="18"/></svg>`,
    megaphone: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 11 18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>`,
    user: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    logout: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
    grade: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
    chart: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
    settings: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v10"/><path d="m4.93 4.93 4.24 4.24m5.66 5.66 4.24 4.24"/><path d="M1 12h6m6 0h10"/><path d="m4.93 19.07 4.24-4.24m5.66-5.66 4.24-4.24"/></svg>`,
    chevronLeft: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,
    menu: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
    close: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
  };

  return icons[nome] || icons.dashboard;
}

/**
 * Inicializar quando DOM estiver pronto
 */
document.addEventListener('DOMContentLoaded', function() {
  SidebarController.init();
});

// Exportar para uso global
window.SidebarController = SidebarController;
window.gerarSidebar = gerarSidebar;
window.getIcon = getIcon;
