import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Settings, Layers, Moon, Sun, Command, Bell } from 'lucide-react';
import DashboardWidgets from './components/DashboardWidgets';
import AppCatalog from './components/AppCatalog';
import AdminPanel from './components/AdminPanel';

// Intricate geometric logo in Siltstone palette
const PrecisionLogo = () => (
  <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <motion.rect initial={{ scale: 0, rotate: 45 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} width="100" height="100" rx="24" fill="url(#paint0_linear)" />
    <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }} d="M30 50L45 65L70 35" stroke="#1A150D" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
    <defs>
      <linearGradient id="paint0_linear" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="var(--silt-cream)" />
        <stop offset="1" stopColor="var(--silt-gold)" />
      </linearGradient>
    </defs>
  </svg>
);

function App() {
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );
  
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('catalog');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(data => {
        setUsers(data);
        if (data.length > 0) setCurrentUser(data[0]);
      })
      .catch(e => console.error(e));
  }, []);

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="app-layout">
      {/* Hyper-detailed Floating Nav */}
      <div style={{ position: 'fixed', top: '16px', left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 100 }}>
        <motion.header 
          initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className="glass-panel"
          style={{ height: '56px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px 0 20px', width: 'calc(100% - 32px)', maxWidth: '1000px', borderRadius: '100px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <PrecisionLogo />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h1 style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1 }}>Canvas</h1>
                <span style={{ fontSize: '9px', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Enterprise</span>
              </div>
            </div>
            
            <div style={{ width: '1px', height: '24px', background: 'var(--border-glass)' }} />
            
            <nav style={{ display: 'flex', gap: '8px' }}>
              <NavItem icon={<Layers size={14}/>} label="Catalog" active={activeTab === 'catalog'} onClick={() => setActiveTab('catalog')} />
              <NavItem icon={<LayoutDashboard size={14}/>} label="Metrics" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
              {isAdmin && <NavItem icon={<Settings size={14}/>} label="Deploy" active={activeTab === 'admin'} onClick={() => setActiveTab('admin')} />}
            </nav>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            
            {/* Small Detail: Notification Bell with Ping */}
            <div style={{ position: 'relative', cursor: 'pointer' }}>
               <Bell size={16} color="var(--text-muted)" />
               <div style={{ position: 'absolute', top: -2, right: -2 }} className="status-dot" />
            </div>

            <div style={{ width: '1px', height: '24px', background: 'var(--border-glass)' }} />

            <select 
              value={currentUser?.id || ''} 
              onChange={e => setCurrentUser(users.find(u => u.id === parseInt(e.target.value)))}
              style={{ background: 'transparent', color: 'var(--text-main)', border: 'none', outline: 'none', fontSize: '12px', cursor: 'pointer', fontWeight: 500 }}>
              {users.map(u => (
                 <option key={u.id} value={u.id}>{u.username.split(' ')[0]} ({u.role})</option>
              ))}
            </select>
            
            <button className="btn-secondary" style={{ padding: '6px', borderRadius: '50%', display: 'flex', background: 'transparent' }} onClick={toggleTheme}>
              {theme === 'light' ? <Moon size={16} color="var(--text-muted)" /> : <Sun size={16} color="var(--text-muted)" />}
            </button>
          </div>
        </motion.header>
      </div>

      <main style={{ marginTop: '100px', flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '1000px', padding: '40px 20px', position: 'relative' }}>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.98, filter: 'blur(8px)' }}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            >
              {activeTab === 'catalog' && <AppCatalog />}
              {activeTab === 'dashboard' && <DashboardWidgets user={currentUser} />}
              {activeTab === 'admin' && <AdminPanel />}
            </motion.div>
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <motion.button 
      whileHover={{ backgroundColor: 'var(--border-glass)' }}
      onClick={onClick}
      style={{
        background: active ? 'var(--text-main)' : 'transparent', 
        border: 'none', cursor: 'pointer',
        fontSize: '12px', fontWeight: 600, letterSpacing: '0.01em',
        color: active ? 'var(--bg-base)' : 'var(--text-muted)',
        padding: '6px 12px', borderRadius: '100px',
        display: 'flex', alignItems: 'center', gap: '6px',
        transition: 'all 0.2s ease', boxShadow: active ? 'var(--shadow-micro)' : 'none'
      }}>
      {React.cloneElement(icon, { color: active ? 'var(--silt-cream)' : 'currentColor' })}
      {label}
    </motion.button>
  );
}

export default App;
