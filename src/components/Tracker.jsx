import React, { useState, useEffect, useContext, useCallback } from 'react';
import { PackageSearch, Clock, AlertTriangle, CalendarClock } from 'lucide-react';
import { searchCustomer } from '../services/api';
import CustomerCard from './CustomerCard';
import { RefreshContext } from '../App';

const TABS = [
  {
    id: 'upcoming',
    query: ':upcoming:',
    label: 'To Be Readied',
    icon: CalendarClock,
    accent: '#818CF8',        // indigo
    accentAlpha: 'rgba(129,140,248,',
    badgeEmpty: 'rgba(129,140,248,0.15)',
    badgeText: '#818CF8',
    badgeBorder: 'rgba(129,140,248,0.3)',
    emptyTitle: 'All clear for next 7 days!',
    emptyDesc: 'No orders are due in the coming week.',
    warningText: (n) => `${n} order${n!==1?'s':''} due for readying in the next 7 days.`,
  },
  {
    id: 'overdue',
    query: ':overdue:',
    label: 'Overdue',
    icon: AlertTriangle,
    accent: '#F87171',        // red
    accentAlpha: 'rgba(248,113,113,',
    badgeEmpty: 'rgba(248,113,113,0.15)',
    badgeText: '#F87171',
    badgeBorder: 'rgba(248,113,113,0.3)',
    emptyTitle: 'No overdue orders! 🎉',
    emptyDesc: 'Every order is on track.',
    warningText: (n) => `${n} order${n!==1?'s':''} past the ready date awaiting collection.`,
  },
];

const SkeletonCard = () => (
  <div style={{ borderRadius:'16px', overflow:'hidden', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', animation:'shimmer 1.6s ease-in-out infinite', marginBottom:'12px' }}>
    <div style={{ height:'94px', background:'rgba(255,255,255,0.04)' }} />
    <div style={{ padding:'14px', display:'flex', flexDirection:'column', gap:'9px' }}>
      <div style={{ height:'14px', width:'52%', borderRadius:'6px', background:'rgba(255,255,255,0.06)' }} />
      <div style={{ height:'11px', width:'72%', borderRadius:'6px', background:'rgba(255,255,255,0.04)' }} />
      <div style={{ display:'flex', gap:'8px' }}>
        <div style={{ flex:1, height:'28px', borderRadius:'8px', background:'rgba(255,255,255,0.04)' }} />
        <div style={{ flex:1, height:'28px', borderRadius:'8px', background:'rgba(255,255,255,0.04)' }} />
      </div>
    </div>
  </div>
);

const Tracker = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [data, setData]           = useState({ upcoming: null, overdue: null });
  const [loading, setLoading]     = useState({ upcoming: false, overdue: false });
  const { refreshKey }            = useContext(RefreshContext);

  const fetchTab = useCallback(async (tabId, query) => {
    setLoading(prev => ({ ...prev, [tabId]: true }));
    try {
      const res = await searchCustomer(query);
      setData(prev => ({ ...prev, [tabId]: res.success ? (res.data || []) : [] }));
    } catch {
      setData(prev => ({ ...prev, [tabId]: [] }));
    }
    setLoading(prev => ({ ...prev, [tabId]: false }));
  }, []);

  // Fetch both tabs on mount & refresh
  useEffect(() => {
    TABS.forEach(t => fetchTab(t.id, t.query));
  }, [fetchTab, refreshKey]);

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  const tab     = TABS.find(t => t.id === activeTab);
  const results = data[activeTab];
  const isLoading = loading[activeTab];

  const tabStyle = (t) => ({
    flex: 1, padding: '9px 6px',
    border: 'none', cursor: 'pointer', borderRadius: '11px',
    fontSize: '12px', fontWeight: '700',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
    transition: 'all 0.2s ease',
    background: activeTab === t.id ? `${t.accentAlpha}0.18)` : 'transparent',
    color: activeTab === t.id ? t.accent : '#475569',
    boxShadow: activeTab === t.id ? `inset 0 0 0 1px ${t.accentAlpha}0.35)` : 'none',
  });

  return (
    <div style={{ animation:'fadeUp 0.5s ease-out' }}>

      {/* Header */}
      <div style={{
        display:'flex', alignItems:'center', gap:'12px',
        marginBottom:'14px', padding:'14px 16px',
        background:'linear-gradient(135deg,rgba(129,140,248,0.15),rgba(248,113,113,0.06))',
        borderRadius:'18px', border:'1px solid rgba(129,140,248,0.18)',
        position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute', top:'-20px', right:'-20px', width:'90px', height:'90px', borderRadius:'50%', background:'rgba(129,140,248,0.12)', filter:'blur(22px)', pointerEvents:'none' }} />
        <div style={{ width:'42px', height:'42px', borderRadius:'12px', flexShrink:0, background:'linear-gradient(135deg,#818CF8,#4F46E5)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 14px rgba(99,102,241,0.4)' }}>
          <PackageSearch size={20} color="#fff" />
        </div>
        <div style={{ flex:1 }}>
          <h1 style={{ fontSize:'19px', marginBottom:'1px' }}>Order Tracker</h1>
          <div style={{ display:'flex', alignItems:'center', gap:'5px', color:'#64748B', fontSize:'12px' }}>
            <Clock size={12}/> {dateStr}
          </div>
        </div>
        {/* Mini badges for both tab counts */}
        <div style={{ display:'flex', gap:'6px', flexShrink:0 }}>
          {TABS.map(t => (
            <div key={t.id} style={{
              borderRadius:'16px', padding:'3px 9px', fontSize:'11px', fontWeight:'700',
              background: data[t.id]?.length > 0 ? `${t.accentAlpha}0.15)` : 'rgba(100,116,139,0.12)',
              border: `1px solid ${data[t.id]?.length > 0 ? `${t.accentAlpha}0.3)` : 'rgba(100,116,139,0.2)'}`,
              color: data[t.id]?.length > 0 ? t.accent : '#64748B',
            }}>
              {data[t.id]?.length ?? '…'}
            </div>
          ))}
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display:'flex', gap:'6px', padding:'6px', background:'rgba(15,23,42,0.6)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'14px', marginBottom:'14px' }}>
        {TABS.map(t => (
          <button key={t.id} style={tabStyle(t)} onClick={() => setActiveTab(t.id)}>
            <t.icon size={16}/>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Warning strip */}
      {!isLoading && results?.length > 0 && (
        <div style={{
          display:'flex', alignItems:'center', gap:'8px',
          padding:'9px 13px', marginBottom:'12px',
          background:`${tab.accentAlpha}0.08)`,
          border:`1px solid ${tab.accentAlpha}0.2)`,
          borderRadius:'11px', color: tab.accent, fontSize:'12px', fontWeight:'500',
        }}>
          <tab.icon size={14}/>
          <span>{tab.warningText(results.length)}</span>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div>{[1,2].map(i => <SkeletonCard key={i}/>)}</div>
      ) : !results?.length ? (
        <div style={{ textAlign:'center', padding:'44px 24px', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:'18px' }}>
          <div style={{
            width:'68px', height:'68px', borderRadius:'18px',
            background:`${tab.accentAlpha}0.1)`,
            border:`1px solid ${tab.accentAlpha}0.2)`,
            display:'flex', alignItems:'center', justifyContent:'center',
            margin:'0 auto 14px',
            boxShadow:`0 0 28px ${tab.accentAlpha}0.12)`,
          }}>
            <tab.icon size={32} color={tab.accent}/>
          </div>
          <h2 style={{ fontSize:'19px', marginBottom:'7px', color:'#fff', WebkitTextFillColor:'unset', background:'none' }}>{tab.emptyTitle}</h2>
          <p style={{ color:'#64748B', fontSize:'13px', lineHeight:'1.6' }}>{tab.emptyDesc}</p>
        </div>
      ) : (
        <div>
          {results.map((customer, index) => (
            <CustomerCard
              key={index}
              customer={customer}
              index={index}
              onStatusChange={() => fetchTab(activeTab, tab.query)}
            />
          ))}
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html:`
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes fade-in { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}}/>
    </div>
  );
};

export default Tracker;
