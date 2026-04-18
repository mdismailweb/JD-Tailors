import React from 'react';
import { Scissors } from 'lucide-react';

const Header = () => {
  return (
    <header style={{
      position: 'fixed',
      top: 0, left: 0, width: '100%',
      background: 'rgba(9, 12, 28, 0.88)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(129,140,248,0.12)',
      zIndex: 50,
      padding: '0 20px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Glowing icon */}
        <div style={{
          width: '40px', height: '40px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #4F46E5, #818CF8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 16px rgba(99,102,241,0.6), 0 4px 12px rgba(79,70,229,0.4)',
          animation: 'headerPulse 3s ease-in-out infinite',
        }}>
          <Scissors size={22} color="#fff" />
        </div>

        {/* Title block */}
        <div>
          <div style={{
            fontSize: '20px', fontWeight: '800',
            background: 'linear-gradient(90deg, #fff 0%, #c7d2fe 60%, #a5f3fc 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px', lineHeight: 1.1,
          }}>
            JD Tailors
          </div>
          <div style={{
            fontSize: '10px', color: '#64748B', fontWeight: '600',
            letterSpacing: '1.2px', textTransform: 'uppercase', marginTop: '1px',
          }}>
            Customer Management
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes headerPulse {
          0%, 100% { box-shadow: 0 0 16px rgba(99,102,241,0.6), 0 4px 12px rgba(79,70,229,0.4); }
          50%       { box-shadow: 0 0 28px rgba(99,102,241,0.9), 0 4px 20px rgba(79,70,229,0.6); }
        }
      `}} />
    </header>
  );
};

export default Header;
