import React, { useState } from 'react';
import { Search as SearchIcon, User, Phone, Calendar, CheckSquare } from 'lucide-react';
import { searchCustomer } from '../services/api';

const SearchCustomer = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    
    const response = await searchCustomer(query);
    
    if (response.success) {
      setResults(response.data || []);
    } else {
      setResults([]);
    }
    
    setIsSearching(false);
  };

  return (
    <div style={{ animation: 'fade-in 0.5s ease-out' }}>
      <h1 style={{ marginBottom: '16px' }}>Search Customers</h1>
      
      <form onSubmit={handleSearch} style={{ marginBottom: '32px' }}>
        <div style={{ position: 'relative' }}>
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, number, or ID..."
            style={{ 
              paddingLeft: '48px',
              paddingRight: '120px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '24px'
            }}
          />
          <SearchIcon 
            size={20} 
            style={{ 
              position: 'absolute', 
              left: '16px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: '#94A3B8'
            }} 
          />
          <button 
            type="submit"
            className="btn btn-primary"
            style={{
              position: 'absolute',
              right: '4px',
              top: '4px',
              bottom: '4px',
              width: '100px',
              height: 'auto',
              padding: '0',
              borderRadius: '20px'
            }}
            disabled={isSearching}
          >
            {isSearching ? <span className="loader" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></span> : 'Search'}
          </button>
        </div>
      </form>

      <div>
        {isSearching && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <span className="loader" style={{ width: '32px', height: '32px' }}></span>
          </div>
        )}

        {!isSearching && hasSearched && results.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
            <p>No customers found matching "{query}"</p>
          </div>
        )}

        {!isSearching && results.map((customer, index) => (
          <div key={index} className="glass-card" style={{ marginBottom: '16px', animation: `fade-in 0.3s ease-out ${index * 0.1}s forwards`, opacity: 0 }}>
            {customer.ImageUrl && (
              <div style={{ 
                height: '180px', 
                marginBottom: '16px', 
                borderRadius: '12px', 
                overflow: 'hidden',
                background: '#1E293B'
              }}>
                <img 
                  src={customer.ImageUrl} 
                  alt="Customer Capture" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
            )}
            
            <h2 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={20} color="#818CF8" />
              {customer.CustomerName || customer.Name || 'Unknown Name'}
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '14px' }}>
                <Phone size={16} color="#94A3B8" />
                {customer.ContactNumber || customer.Contact || customer.Number || 'N/A'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '14px' }}>
                <CheckSquare size={16} color="#94A3B8" />
                ID: {customer['Customer Number'] || customer['Customer No'] || customer.ID || 'N/A'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '14px' }}>
                <Calendar size={16} color="#94A3B8" />
                Added: {customer.CreationDate ? new Date(customer.CreationDate).toLocaleDateString() : 'N/A'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '14px' }}>
                <Calendar size={16} color="#10B981" />
                Ready: {customer.ReadyDate ? new Date(customer.ReadyDate).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>
        ))}
        
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}} />
      </div>
    </div>
  );
};

export default SearchCustomer;
