import React, { useState, useEffect, useContext } from 'react';
import { CalendarCheck, Clock } from 'lucide-react';
import { searchCustomer } from '../services/api';
import CustomerCard from './CustomerCard';
import { RefreshContext } from '../App';

const TodaysOrders = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState([]);
  const { refreshKey } = useContext(RefreshContext);

  useEffect(() => {
    const fetchToday = async () => {
      setIsLoading(true);
      try {
        const response = await searchCustomer(':today:');
        if (response.success) setResults(response.data || []);
        else setResults([]);
      } catch (error) {
        console.error("Failed to load today's orders:", error);
        setResults([]);
      }
      setIsLoading(false);
    };
    fetchToday();
  }, [refreshKey]);

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ animation: 'fadeUp 0.5s ease-out' }}>

      {/* Header Banner */}
      <div style={{
        position: 'relative', borderRadius: '24px', overflow: 'hidden',
        marginBottom: '16px', padding: '16px 18px',
        background: 'linear-gradient(135deg, rgba(79,70,229,0.2), rgba(16,185,129,0.08))',
        border: '1px solid rgba(129,140,248,0.2)',
      }}>
        <div style={{ position:'absolute', top:'-20px', right:'-20px', width:'120px', height:'120px', borderRadius:'50%', background:'rgba(99,102,241,0.15)', filter:'blur(30px)', pointerEvents:'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '13px',
            background: 'linear-gradient(135deg,#4F46E5,#818CF8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(79,70,229,0.4)', flexShrink: 0,
          }}>
            <CalendarCheck size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '19px', marginBottom: '1px' }}>Today's Orders</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '13px' }}>
              <Clock size={13} /> {dateStr}
            </div>
          </div>
        </div>
        {!isLoading && (
          <div style={{
            position: 'absolute', top: '20px', right: '20px',
            background: results.length > 0 ? 'rgba(16,185,129,0.15)' : 'rgba(100,116,139,0.15)',
            border: `1px solid ${results.length > 0 ? 'rgba(16,185,129,0.3)' : 'rgba(100,116,139,0.2)'}`,
            color: results.length > 0 ? '#10B981' : '#64748B',
            borderRadius: '20px', padding: '4px 12px',
            fontSize: '13px', fontWeight: '700',
          }}>
            {results.length} order{results.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1,2].map(i => (
            <div key={i} style={{
              borderRadius: '20px', overflow: 'hidden',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              animation: 'shimmer 1.6s ease-in-out infinite',
            }}>
              <div style={{ height: '130px', background: 'rgba(255,255,255,0.04)' }} />
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ height: '18px', width: '60%', borderRadius: '8px', background: 'rgba(255,255,255,0.06)' }} />
                <div style={{ height: '14px', width: '80%', borderRadius: '8px', background: 'rgba(255,255,255,0.04)' }} />
              </div>
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '56px 24px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '24px',
        }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '24px',
            background: 'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(99,102,241,0.05))',
            border: '1px solid rgba(99,102,241,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 0 40px rgba(99,102,241,0.15)',
          }}>
            <CalendarCheck size={38} color="#818CF8" />
          </div>
          <h2 style={{ fontSize: '22px', marginBottom: '8px', color: '#fff', WebkitTextFillColor: 'unset', background: 'none' }}>All Caught Up! 🎉</h2>
          <p style={{ color: '#64748B', fontSize: '15px', maxWidth: '260px', margin: '0 auto', lineHeight: '1.6' }}>
            No orders are scheduled for collection today. Enjoy the quiet!
          </p>
        </div>
      ) : (
        <div>
          {results.map((customer, index) => (
            <CustomerCard key={index} customer={customer} index={index} />
          ))}
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes shimmer {
          0%,100% { opacity:1; }
          50%      { opacity:0.5; }
        }
        @keyframes fade-in {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}} />
    </div>
  );
};

export default TodaysOrders;
