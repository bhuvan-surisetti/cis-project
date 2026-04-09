import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Fingerprint, HardDrive, ShieldCheck, Box } from 'lucide-react';

export default function AppCatalog() {
  const [apps, setApps] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(`/api/apps?search=${search}`)
      .then(r => r.json())
      .then(setApps);
  }, [search]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Hyper-styled Centered Hero */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ textAlign: 'center', marginBottom: '60px', maxWidth: '600px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--border-glass)', padding: '6px 12px', borderRadius: '100px', marginBottom: '24px' }}>
           <div className="status-dot" />
           <span className="overline" style={{ letterSpacing: '0.05em' }}>System Online</span>
        </div>
        <h1 style={{ fontSize: '56px', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: '20px', color: 'var(--text-main)' }}>
          Enterprise internal <span style={{ background: 'linear-gradient(135deg, var(--silt-orange) 0%, var(--silt-gold) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ecosystem.</span>
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: 1.6, fontWeight: 500 }}>
          Search instantly across all verified internal dependencies, frameworks, and deployment interfaces using <kbd>⌘</kbd> <kbd>K</kbd>.
        </p>
      </motion.div>

      {/* Advanced Glass Search Bar */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="glass-panel" style={{ width: '100%', maxWidth: '640px', marginBottom: '80px', position: 'relative', borderRadius: '16px', display: 'flex', alignItems: 'center', padding: '4px' }}>
        <Search color="var(--silt-gold)" size={20} style={{ margin: '0 16px' }} />
        <input 
          type="text" placeholder="Search the canvas..." value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: '16px 0', background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', fontSize: '15px', fontWeight: 500 }}
        />
        <div style={{ display: 'flex', gap: '4px', margin: '0 16px' }}>
           <kbd>⌘</kbd><kbd>K</kbd>
        </div>
      </motion.div>

      {/* Premium Glass Grid */}
      <motion.div layout style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        <AnimatePresence mode='popLayout'>
          {apps.map((app, i) => (
            <motion.div
              layout initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              whileHover={{ y: -8, scale: 1.02 }} transition={{ type: 'spring', damping: 20, stiffness: 300, delay: i * 0.05 }}
              key={app.id} className="glass-panel"
              style={{ padding: '24px', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--silt-gold)' }}>
                     <Box size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>{app.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                       <span className="overline" style={{ color: 'var(--silt-orange)' }}>Stable</span>
                       <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'var(--text-faint)' }} />
                       <span className="overline">v{app.version}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ flexGrow: 1, marginBottom: '24px' }}>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                  High-performance computing block engineered for <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{app.category}</span>.
                </p>
                
                {/* Meta details with tiny icons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-faint)', fontWeight: 500 }}>
                    <HardDrive size={12} /> Requires: {app.dependencies || 'None'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-faint)', fontWeight: 500 }}>
                    <ShieldCheck size={12} /> SOC2 Compliant
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {app.tags.split(',').map(tag => (
                   <span key={tag} style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', border: '1px solid var(--border-glass)', padding: '4px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.3)' }}>
                     {tag.trim().toUpperCase()}
                   </span>
                ))}
              </div>

              <div className="hairline" style={{ margin: '0 0 16px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-faint)', fontWeight: 500 }}>{app.usage.toLocaleString()} internal users</span>
                <motion.button whileHover={{ x: 4 }} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '8px' }}>
                  Open <ArrowRight size={14} />
                </motion.button>
              </div>

            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      
      {apps.length === 0 && (
         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: 'var(--text-faint)', marginTop: '40px', fontSize: '13px', fontWeight: 500 }}>
           No matches found.
         </motion.div>
      )}

    </div>
  );
}
