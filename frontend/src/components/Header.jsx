import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Moon, Sun, Menu, ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpeg';

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const userMenuRef = useRef(null);
  const notifRef = useRef(null);

  /* Apply dark mode */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  /* Close menus on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6"
      style={{
        height: '64px',
        background: 'var(--header-bg)',
        borderBottom: '1px solid var(--header-border)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        gap: '1rem',
      }}
    >
      {/* Left — Mobile toggle + Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-2)] transition-all hover:scale-110 active:scale-90"
        >
          <Menu size={20} />
        </button>

        <div className="hidden md:flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--surface-2)', boxShadow: 'var(--shadow-sm)' }}
          >
            {logo
              ? <img src={logo} alt="SF-DGCI" className="w-full h-full object-contain" />
              : <span className="font-bold text-blue-700 text-xs">SF</span>
            }
          </div>
          <div>
            <p className="text-sm font-bold leading-tight" style={{ color: 'var(--text-1)' }}>SF-DGCI</p>
            <p className="text-[10px]" style={{ color: 'var(--text-3)' }}>Guiné-Bissau</p>
          </div>
        </div>
      </div>

      {/* Center — Search */}
      <div className="flex-1 max-w-sm hidden md:block">
        <div className="topbar-search">
          <Search size={15} />
          <input type="text" placeholder="Pesquisar no sistema..." />
        </div>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-1 md:gap-2">
        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg transition-all hover:bg-[var(--surface-hover)] text-[var(--text-2)] hover:text-[var(--text-1)] hover:scale-110 active:scale-90"
          title={darkMode ? 'Modo Claro' : 'Modo Escuro'}
          style={{ transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)' }}
        >
          <span
            style={{
              display: 'inline-flex',
              transform: darkMode ? 'rotate(0deg)' : 'rotate(-30deg)',
              transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
            }}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </span>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="relative p-2 rounded-lg transition-all hover:bg-[var(--surface-hover)] text-[var(--text-2)] hover:text-[var(--text-1)] hover:scale-110 active:scale-90"
            title="Notificações"
            style={{ transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)' }}
          >
            <Bell size={18} />
            <span
              className="notif-dot absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ background: '#ef4444', boxShadow: '0 0 0 2px var(--header-bg)' }}
            />
          </button>

          {showNotif && (
            <div
              className="absolute right-0 mt-2 w-72 rounded-xl overflow-hidden z-50"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-xl)',
                animation: 'slideInDown 0.2s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                <p className="font-bold text-sm" style={{ color: 'var(--text-1)' }}>Notificações</p>
              </div>
              <div className="py-6 text-center">
                <Bell size={28} className="mx-auto mb-2" style={{ color: 'var(--text-3)' }} />
                <p className="text-sm" style={{ color: 'var(--text-3)' }}>Sem notificações recentes</p>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 mx-1" style={{ background: 'var(--border)' }} />

        {/* User menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all hover:bg-[var(--surface-hover)] active:scale-95"
            style={{ transition: 'all 0.15s ease' }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                boxShadow: '0 2px 8px rgba(245,158,11,0.35)',
              }}
            >
              {user?.nome?.charAt(0) || 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--text-1)' }}>
                {user?.nome?.split(' ')[0] || 'Utilizador'}
              </p>
              <p className="text-[10px] capitalize" style={{ color: 'var(--text-3)' }}>
                {user?.perfil || 'admin'}
              </p>
            </div>
            <ChevronDown
              size={14}
              className="hidden sm:block"
              style={{
                color: 'var(--text-3)',
                transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)',
              }}
            />
          </button>

          {/* Dropdown */}
          {showUserMenu && (
            <div
              className="absolute right-0 mt-2 w-52 rounded-xl overflow-hidden z-50"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-xl)',
                animation: 'slideInDown 0.2s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              <div
                className="px-4 py-3 border-b"
                style={{
                  borderColor: 'var(--border)',
                  background: 'linear-gradient(135deg, var(--primary-light), transparent)',
                }}
              >
                <div className="flex items-center gap-3 mb-1">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}
                  >
                    {user?.nome?.charAt(0) || 'U'}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-1)' }}>{user?.nome}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-3)' }}>{user?.email}</p>
                  </div>
                </div>
              </div>
              <div className="py-1.5">
                <button
                  onClick={() => { navigate('/configuracoes'); setShowUserMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all hover:bg-[var(--surface-hover)] active:scale-98"
                  style={{ color: 'var(--text-2)' }}
                >
                  <Settings size={15} />
                  Configurações
                </button>
                <button
                  onClick={() => { logout(); setShowUserMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all hover:bg-red-50 hover:text-red-600"
                  style={{ color: 'var(--text-2)' }}
                >
                  <LogOut size={15} />
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
