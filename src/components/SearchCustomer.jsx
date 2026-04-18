import React, { useState } from 'react';
import { Search as SearchIcon, Calendar, User, Hash, Filter } from 'lucide-react';
import { searchCustomer } from '../services/api';
import CustomerCard from './CustomerCard';

const MODES = [
  { id: 'name',  label: 'Name / ID',    icon: User,     placeholder: 'Search by name, number or ID…' },
  { id: 'entry', label: 'Entry Date',   icon: Calendar, placeholder: null },
  { id: 'ready', label: 'Ready Date',   icon: Calendar, placeholder: null },
];

const SearchCustomer = () => {
  const [mode, setMode]           = useState('name');
  const [query, setQuery]         = useState('');
  const [dateVal, setDateVal]     = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults]     = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    const searchVal = mode === 'name' ? query.trim() : (dateVal ? `:date:${mode}:${dateVal}` : '');
    if (!searchVal) return;

    setIsSearching(true);
    setHasSearched(true);
    const response = await searchCustomer(searchVal);
    setResults(response.success ? (response.data || []) : []);
    setIsSearching(false);
  };

  const activeMode = MODES.find(m => m.id === mode);

  const tabStyle = (id) => ({
    flex: 1, padding: '10px 6px',
    border: 'none', cursor: 'pointer',
    borderRadius: '12px', fontSize: '12px', fontWeight: '600',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
    transition: 'all 0.2s ease',
    background: mode === id ? 'rgba(129,140,248,0.18)' : 'transparent',
    color: mode === id ? '#818CF8' : '#475569',
    boxShadow: mode === id ? 'inset 0 0 0 1px rgba(129,140,248,0.35)' : 'none',
  });

  const inputStyle = {
    width: '100%',
    background: 'rgba(15,23,42,0.6)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '14px',
    padding: '14px 16px 14px 48px',
    color: '#F8FAFC',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.25s ease',
  };

  return (
    <div style={{ animation: 'fadeUp 0.5s ease-out' }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        marginBottom: '16px', padding: '16px 18px',
        background: 'linear-gradient(135deg,rgba(79,70,229,0.18),rgba(16,185,129,0.06))',
        borderRadius: '16px', border: '1px solid rgba(129,140,248,0.18)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position:'absolute', top:'-20px', right:'-20px', width:'80px', height:'80px', borderRadius:'50%', background:'rgba(16,185,129,0.1)', filter:'blur(20px)', pointerEvents:'none' }} />
        <div style={{ width: '38px', height: '38px', borderRadius: '11px', flexShrink: 0, background: 'linear-gradient(135deg,#10B981,#34d399)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(16,185,129,0.4)' }}>
          <SearchIcon size={20} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: '19px', marginBottom: '1px' }}>Find Customer</h1>
          <p style={{ fontSize: '13px', color: '#64748B' }}>Search by name, ID or date</p>
        </div>
      </div>

      {/* Mode selector tabs */}
      <div style={{ display: 'flex', gap: '6px', padding: '6px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', marginBottom: '12px' }}>
        {MODES.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => { setMode(id); setResults([]); setHasSearched(false); }} style={tabStyle(id)}>
            <Icon size={15} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Search form card */}
      <div style={{ background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px' }}>
        <div style={{ height: '3px', background: 'linear-gradient(90deg,#10B981,#818CF8)' }} />
        <form onSubmit={handleSearch} style={{ padding: '16px' }}>
          {mode === 'name' ? (
            <div style={{ position: 'relative' }}>
              <SearchIcon size={18} color="#475569" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text" value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={activeMode.placeholder}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor='rgba(129,140,248,0.5)'; e.target.style.boxShadow='0 0 0 3px rgba(79,70,229,0.15)'; }}
                onBlur={e => { e.target.style.borderColor='rgba(255,255,255,0.08)'; e.target.style.boxShadow='none'; }}
              />
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              <Calendar size={18} color="#475569" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }} />
              <input
                type="date" value={dateVal}
                onChange={e => setDateVal(e.target.value)}
                style={{ ...inputStyle, colorScheme: 'dark' }}
                onFocus={e => { e.target.style.borderColor='rgba(16,185,129,0.5)'; e.target.style.boxShadow='0 0 0 3px rgba(16,185,129,0.15)'; }}
                onBlur={e => { e.target.style.borderColor='rgba(255,255,255,0.08)'; e.target.style.boxShadow='none'; }}
              />
            </div>
          )}

          <button type="submit" disabled={isSearching} style={{
            width: '100%', padding: '14px', marginTop: '14px',
            background: 'linear-gradient(135deg,#10B981,#059669)',
            border: 'none', borderRadius: '14px',
            color: '#fff', fontSize: '15px', fontWeight: '700',
            cursor: isSearching ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            boxShadow: '0 6px 20px rgba(16,185,129,0.35)',
            transition: 'all 0.2s ease',
          }}>
            {isSearching
              ? <><span className="loader" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></span> Searching…</>
              : <><SearchIcon size={18} /> Search {activeMode.label}</>
            }
          </button>
        </form>
      </div>

      {/* Results */}
      {isSearching && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1,2].map(i => (
            <div key={i} style={{ borderRadius: '20px', overflow: 'hidden', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', animation: 'shimmer 1.6s ease-in-out infinite' }}>
              <div style={{ height: '120px', background: 'rgba(255,255,255,0.04)' }} />
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ height: '16px', width: '55%', borderRadius: '8px', background: 'rgba(255,255,255,0.06)' }} />
                <div style={{ height: '13px', width: '75%', borderRadius: '8px', background: 'rgba(255,255,255,0.04)' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isSearching && hasSearched && results.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '48px 24px',
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '22px',
        }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 0 32px rgba(99,102,241,0.15)' }}>
            <Filter size={32} color="#818CF8" />
          </div>
          <h2 style={{ fontSize: '20px', marginBottom: '8px', color: '#fff', WebkitTextFillColor: 'unset', background: 'none' }}>No results found</h2>
          <p style={{ color: '#475569', fontSize: '14px' }}>Try a different name, ID or date.</p>
        </div>
      )}

      {!isSearching && results.map((customer, index) => (
        <CustomerCard key={index} customer={customer} index={index} />
      ))}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes fade-in {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes shimmer {
          0%,100% { opacity:1; }
          50%      { opacity:0.5; }
        }
      `}} />
    </div>
  );
};

export default SearchCustomer;
