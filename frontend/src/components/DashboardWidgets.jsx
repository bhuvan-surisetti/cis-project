import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Star, Zap } from 'lucide-react';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 10, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } } };

export default function DashboardWidgets({ user }) {
  const [popular, setPopular] = useState([]);
  const [recommended, setRecommended] = useState({ department: '', apps: [] });

  useEffect(() => {
    fetch('/api/analytics').then(r => r.json()).then(setPopular);
  }, []);

  useEffect(() => {
    if (user) {
      fetch(`/api/recommend?user_id=${user.id}`)
        .then(r => r.json())
        .then(setRecommended);
    }
  }, [user]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '60px', width: '100%', alignItems: 'center' }}>
      
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ textAlign: 'center', marginBottom: '20px' }}>
         <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--border-glass)', padding: '6px 12px', borderRadius: '100px', marginBottom: '24px' }}>
            <Zap size={12} color="var(--silt-orange)"/>
            <span className="overline" style={{ letterSpacing: '0.05em' }}>Real-time Telemetry</span>
         </div>
         <h1 style={{ fontSize: '48px', fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--text-main)' }}>Platform <span style={{ background: 'linear-gradient(135deg, var(--silt-orange) 0%, var(--silt-gold) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Analytics.</span></h1>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px', width: '100%' }}>
        
        {/* Glow Popular Box */}
        <motion.div variants={item} className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <div style={{ padding: '8px', background: 'rgba(255, 177, 110, 0.2)', borderRadius: '10px' }}>
               <Activity size={20} color="var(--silt-orange)" />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>Highest Velocity</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {popular.map((app, i) => (
              <motion.div 
                key={app.id} whileHover={{ x: 6, backgroundColor: 'rgba(255,255,255,0.8)' }}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: 'var(--surface-primary)', borderRadius: '16px', border: '1px solid var(--border-glass)', cursor: 'default', transition: 'background 0.2s' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-faint)', width: '20px', fontWeight: 600 }}>0{i+1}</div>
                  <h4 style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-main)' }}>{app.name}</h4>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: 500 }}>{app.usage.toLocaleString()} reqs</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Precision Recommendation Box */}
        <motion.div variants={item} className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <div style={{ padding: '8px', background: 'rgba(204, 162, 90, 0.2)', borderRadius: '10px' }}>
               <Star size={20} color="var(--silt-gold)" />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>{recommended.department} Topology</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recommended.apps.map((app) => (
              <motion.div 
                key={app.id} whileHover={{ scale: 1.02 }}
                style={{ padding: '24px', background: 'var(--bg-base)', borderRadius: '16px', border: '1px solid var(--border-glass)', position: 'relative', overflow: 'hidden', boxShadow: 'var(--shadow-micro)' }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px', background: 'linear-gradient(to bottom, var(--silt-orange), var(--silt-gold))' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ fontWeight: 600, fontSize: '16px', color: 'var(--text-main)', marginBottom: '4px' }}>{app.name}</h4>
                    <span className="overline">v{app.version}</span>
                  </div>
                  <button className="btn-secondary" style={{ padding: '6px 16px', fontSize: '12px' }}>Deploy</button>
                </div>
                <div className="hairline" style={{ margin: '16px 0' }} />
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {app.tags.split(',').map(tag => (
                     <span key={tag} style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, background: 'var(--surface-primary)', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-glass)' }}>#{tag.trim()}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
