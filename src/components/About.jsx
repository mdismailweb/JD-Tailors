import React, { useEffect, useState } from 'react';
import { Scissors, Phone, Mail, Code2, Heart, Sparkles } from 'lucide-react';

const About = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

  return (
    <div style={{ animation: 'fadeUp 0.5s ease-out' }}>

      {/* Hero Banner */}
      <div style={{
        position: 'relative', borderRadius: '22px', overflow: 'hidden',
        marginBottom: '16px', padding: '28px 20px 22px',
        background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
        boxShadow: '0 16px 48px rgba(79,70,229,0.3)', textAlign: 'center',
      }}>
        <div style={{ position:'absolute', top:'-30px', left:'-30px', width:'130px', height:'130px', borderRadius:'50%', background:'rgba(99,102,241,0.25)', filter:'blur(35px)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-20px', right:'-20px', width:'110px', height:'110px', borderRadius:'50%', background:'rgba(16,185,129,0.2)', filter:'blur(30px)', pointerEvents:'none' }} />

        <div style={{ position:'relative', display:'inline-block', marginBottom:'14px' }}>
          <div style={{
            width:'68px', height:'68px', borderRadius:'18px',
            background:'linear-gradient(135deg,#4F46E5,#818CF8)',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 10px 26px rgba(79,70,229,0.5)', margin:'0 auto',
            animation:'pulse 3s ease-in-out infinite',
          }}>
            <Scissors size={32} color="#fff" />
          </div>
          <div style={{ position:'absolute', top:'-3px', right:'-3px', background:'linear-gradient(135deg,#10B981,#34d399)', borderRadius:'50%', width:'20px', height:'20px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 3px 8px rgba(16,185,129,0.5)' }}>
            <Sparkles size={11} color="#fff" />
          </div>
        </div>

        <h1 style={{ fontSize:'26px', fontWeight:'800', background:'linear-gradient(90deg,#fff 0%,#c7d2fe 50%,#a5f3fc 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', letterSpacing:'-0.5px', marginBottom:'4px' }}>JD Tailors</h1>
        <p style={{ color:'#94A3B8', fontSize:'13px', marginBottom:'14px' }}>Customer Management System</p>

        <div style={{ display:'flex', gap:'8px', justifyContent:'center', flexWrap:'wrap' }}>
          {['v1.0.0','React','Google Sheets'].map((tag, i) => (
            <span key={i} style={{ padding:'4px 12px', borderRadius:'20px', fontSize:'11px', fontWeight:'600', background: i===0 ? 'rgba(16,185,129,0.15)' : 'rgba(99,102,241,0.15)', color: i===0 ? '#10B981' : '#818CF8', border:`1px solid ${i===0 ? 'rgba(16,185,129,0.3)' : 'rgba(99,102,241,0.3)'}` }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px', marginBottom:'16px' }}>
        {[
          { label:'Pages', value:'5', color:'#818CF8' },
          { label:'Backend', value:'GAS', color:'#10B981' },
          { label:'Status', value:'Live', color:'#F59E0B' },
        ].map((s, i) => (
          <div key={i} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'14px', padding:'12px 10px', textAlign:'center', backdropFilter:'blur(10px)' }}>
            <div style={{ fontSize:'18px', fontWeight:'800', color:s.color, marginBottom:'3px' }}>{s.value}</div>
            <div style={{ fontSize:'10px', color:'#64748B', fontWeight:'500', textTransform:'uppercase', letterSpacing:'0.5px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Developer Card */}
      <div style={{ position:'relative', borderRadius:'20px', overflow:'hidden', marginBottom:'14px', background:'rgba(15,23,42,0.6)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.08)', boxShadow:'0 6px 30px rgba(0,0,0,0.3)' }}>
        <div style={{ height:'3px', background:'linear-gradient(90deg,#4F46E5,#818CF8,#10B981)' }} />

        <div style={{ padding:'18px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'5px', marginBottom:'16px' }}>
            <Code2 size={14} color="#818CF8" />
            <span style={{ fontSize:'11px', fontWeight:'600', color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.8px' }}>Developer</span>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'18px' }}>
            <div style={{ position:'relative', flexShrink:0 }}>
              <div style={{ width:'56px', height:'56px', borderRadius:'16px', background:'linear-gradient(135deg,#4F46E5 0%,#10B981 100%)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', fontWeight:'800', color:'#fff', boxShadow:'0 6px 18px rgba(79,70,229,0.4)' }}>MI</div>
              <div style={{ position:'absolute', bottom:'-3px', right:'-3px', background:'#10B981', borderRadius:'50%', width:'16px', height:'16px', border:'2px solid #0F172A', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#fff' }} />
              </div>
            </div>
            <div>
              <div style={{ fontSize:'18px', fontWeight:'700', color:'#fff', letterSpacing:'-0.2px' }}>Mohd Ismail</div>
              <div style={{ fontSize:'12px', color:'#818CF8', fontWeight:'500', marginTop:'2px' }}>Full Stack Developer</div>
              <div style={{ display:'flex', gap:'5px', marginTop:'8px' }}>
                {['React','Node','GAS'].map((skill, i) => (
                  <span key={i} style={{ fontSize:'10px', padding:'2px 8px', borderRadius:'20px', fontWeight:'600', background:'rgba(129,140,248,0.12)', color:'#818CF8', border:'1px solid rgba(129,140,248,0.2)' }}>{skill}</span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            <a href="https://wa.me/918181042960" target="_blank" rel="noopener noreferrer"
              style={{ display:'flex', alignItems:'center', gap:'12px', padding:'13px 15px', textDecoration:'none', background:'linear-gradient(135deg,rgba(37,211,102,0.12),rgba(37,211,102,0.04))', border:'1px solid rgba(37,211,102,0.25)', borderRadius:'14px', transition:'all 0.25s ease' }}
              onMouseOver={e => { e.currentTarget.style.background='linear-gradient(135deg,rgba(37,211,102,0.22),rgba(37,211,102,0.1))'; e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(37,211,102,0.18)'; }}
              onMouseOut={e => { e.currentTarget.style.background='linear-gradient(135deg,rgba(37,211,102,0.12),rgba(37,211,102,0.04))'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
            >
              <div style={{ width:'38px', height:'38px', borderRadius:'11px', background:'linear-gradient(135deg,#25D366,#128C7E)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 3px 10px rgba(37,211,102,0.4)', flexShrink:0 }}>
                <Phone size={18} color="#fff" />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:'10px', color:'#64748B', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'2px' }}>WhatsApp</div>
                <div style={{ fontSize:'15px', color:'#25D366', fontWeight:'700' }}>+91 81810 42960</div>
              </div>
              <div style={{ fontSize:'18px', color:'rgba(37,211,102,0.4)' }}>→</div>
            </a>

            <a href="mailto:mdismailzzz02@gmail.com"
              style={{ display:'flex', alignItems:'center', gap:'12px', padding:'13px 15px', textDecoration:'none', background:'linear-gradient(135deg,rgba(99,102,241,0.12),rgba(99,102,241,0.04))', border:'1px solid rgba(99,102,241,0.25)', borderRadius:'14px', transition:'all 0.25s ease' }}
              onMouseOver={e => { e.currentTarget.style.background='linear-gradient(135deg,rgba(99,102,241,0.22),rgba(99,102,241,0.1))'; e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(99,102,241,0.18)'; }}
              onMouseOut={e => { e.currentTarget.style.background='linear-gradient(135deg,rgba(99,102,241,0.12),rgba(99,102,241,0.04))'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
            >
              <div style={{ width:'38px', height:'38px', borderRadius:'11px', background:'linear-gradient(135deg,#4F46E5,#818CF8)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 3px 10px rgba(79,70,229,0.4)', flexShrink:0 }}>
                <Mail size={18} color="#fff" />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:'10px', color:'#64748B', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'2px' }}>Email</div>
                <div style={{ fontSize:'13px', color:'#818CF8', fontWeight:'700' }}>mdismailzzz02@gmail.com</div>
              </div>
              <div style={{ fontSize:'18px', color:'rgba(99,102,241,0.4)' }}>→</div>
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign:'center', padding:'14px', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:'14px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', color:'#475569', fontSize:'13px' }}>
          <span>Crafted with</span>
          <Heart size={13} color="#818CF8" fill="#818CF8" style={{ animation:'heartbeat 1.4s ease-in-out infinite' }} />
          <span>by</span>
          <span style={{ fontWeight:'700', color:'#818CF8' }}>Mohd Ismail</span>
        </div>
        <div style={{ marginTop:'4px', fontSize:'11px', color:'#334155' }}>© 2026 JD Tailors · All rights reserved</div>
      </div>

      <style dangerouslySetInnerHTML={{__html:`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { box-shadow: 0 10px 26px rgba(79,70,229,0.5); } 50% { box-shadow: 0 10px 40px rgba(79,70,229,0.8); } }
        @keyframes heartbeat { 0%,100% { transform:scale(1); } 14% { transform:scale(1.3); } 28% { transform:scale(1); } 42% { transform:scale(1.2); } 56% { transform:scale(1); } }
      `}} />
    </div>
  );
};

export default About;
