import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TerminalSquare } from 'lucide-react';

export default function AdminPanel() {
  const [formData, setFormData] = useState({
    name: '', version: '', category: '', dependencies: '', tags: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/apps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    setFormData({name: '', version: '', category: '', dependencies: '', tags: ''});
    alert('Application Initialized.');
  }

  return (
    <motion.div 
      initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
      transition={{ duration: 0.8 }}
      style={{ maxWidth: '640px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', padding: '16px', background: 'var(--border-glass)', borderRadius: '24px', marginBottom: '24px', boxShadow: 'var(--shadow-micro)' }}>
           <TerminalSquare size={32} color="var(--silt-orange)" />
        </div>
        <h2 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-main)', marginBottom: '8px' }}>Launch Architecture</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>Register a verified executable into the master enterprise canvas. Standard CI/CD checks will run immediately.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="overline">App Signature</span>
              <span style={{ fontSize: '10px', color: 'var(--silt-orange)', fontWeight: 600 }}>Required</span>
            </label>
            <input required name="name" value={formData.name} onChange={handleChange} type="text" style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.4)', border: '1px solid var(--border-glass)', borderRadius: '12px', color: 'var(--text-main)', outline: 'none', fontSize: '15px', fontWeight: 500, boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }} placeholder="Nexus Auth Service" />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}><span className="overline">SemVer</span></label>
            <input required name="version" value={formData.version} onChange={handleChange} type="text" style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.4)', border: '1px solid var(--border-glass)', borderRadius: '12px', color: 'var(--text-main)', outline: 'none', fontSize: '15px', fontWeight: 500 }} placeholder="2.0.1" />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}><span className="overline">Pipeline Category</span></label>
            <input required name="category" value={formData.category} onChange={handleChange} type="text" style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.4)', border: '1px solid var(--border-glass)', borderRadius: '12px', color: 'var(--text-main)', outline: 'none', fontSize: '15px', fontWeight: 500 }} placeholder="Infrastructure" />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}><span className="overline">Node Dependencies</span></label>
            <input name="dependencies" value={formData.dependencies} onChange={handleChange} type="text" style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.4)', border: '1px solid var(--border-glass)', borderRadius: '12px', color: 'var(--text-main)', outline: 'none', fontSize: '14px', fontWeight: 500 }} placeholder="e.g. Postgres, Redis cluster" />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="overline">Tags (CSV)</span>
              <kbd>⌘</kbd>
            </label>
            <input required name="tags" value={formData.tags} onChange={handleChange} type="text" style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.4)', border: '1px solid var(--border-glass)', borderRadius: '12px', color: 'var(--text-main)', outline: 'none', fontSize: '14px', fontWeight: 500 }} placeholder="scale, internal, core" />
          </div>
        </div>

        <div className="hairline" style={{ margin: '0' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-faint)', fontSize: '12px', fontWeight: 500 }}>
             <Sparkles size={14} color="var(--silt-gold)"/> AI Verification Active
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" className="btn-primary" style={{ padding: '14px 28px', fontSize: '14px' }}>
            Commit Deployment
          </motion.button>
        </div>
      </form>

    </motion.div>
  );
}
