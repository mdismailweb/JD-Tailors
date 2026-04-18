import React, { useState } from 'react';
import { User, Phone, Calendar, CheckSquare, RotateCw, X, ZoomIn, PackageCheck, CheckCircle2, Loader2 } from 'lucide-react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { updateStatus } from '../services/api';

/* ── Stamp overlay component ── */
const Stamp = ({ label, color, borderColor }) => (
  <div style={{
    position: 'absolute', top: '50%', left: '50%',
    transform: 'translate(-50%,-50%) rotate(-22deg)',
    border: `3px solid ${borderColor}`,
    borderRadius: '6px', padding: '4px 14px',
    color, fontSize: '17px', fontWeight: '900',
    letterSpacing: '3px', textTransform: 'uppercase',
    pointerEvents: 'none', whiteSpace: 'nowrap',
    textShadow: `0 0 10px ${color}55`,
    boxShadow: `inset 0 0 10px ${color}15`,
  }}>
    {label}
  </div>
);

/* ── Compact action button ── */
const ActionBtn = ({ label, icon: Icon, color, bg, border, onClick, loading, disabled }) => (
  <button
    onClick={e => { e.stopPropagation(); if (!disabled && !loading) onClick(); }}
    disabled={disabled || loading}
    style={{
      flex: 1, padding: '9px 6px',
      background: disabled ? 'rgba(255,255,255,0.04)' : bg,
      border: `1px solid ${disabled ? 'rgba(255,255,255,0.08)' : border}`,
      borderRadius: '10px', color: disabled ? '#475569' : color,
      fontSize: '13px', fontWeight: '700', cursor: disabled ? 'default' : 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
      transition: 'all 0.2s ease',
    }}
  >
    {loading
      ? <Loader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} />
      : <Icon size={14} />
    }
    {label}
  </button>
);

const CustomerCard = ({ customer, index = 0, onStatusChange, onSaved, onSaveStart, onSaveEnd }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [imageRotation, setImageRotation] = useState(0);
  const [savingStatus, setSavingStatus] = useState(null); // 'Ready' | 'Delivered' | null
  const [localStatus, setLocalStatus] = useState(null);   // overrides backend status

  const formatDate = (ds) => {
    if (!ds) return 'N/A';
    const d = new Date(ds);
    if (isNaN(d)) return ds;
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
  };

  const getVal = (partialKey) => {
    const k = Object.keys(customer).find(k2 =>
      k2.toLowerCase().replace(/ /g,'').includes(partialKey.toLowerCase().replace(/ /g,''))
    );
    return k ? customer[k] : null;
  };

  const name         = getVal('name');
  const contact      = getVal('contact') || getVal('phone') || getVal('number');
  const displayName  = name || 'Unknown';
  const id           = getVal('id') || getVal('customerno') || getVal('customernumber') || 'N/A';
  const creationDate = getVal('creation') || getVal('added') || getVal('entry');
  const readyDate    = getVal('ready');
  const imageUrl     = getVal('image') || getVal('url') || getVal('photo');
  const backendStatus= getVal('status') || '';
  const status       = localStatus ?? backendStatus; // local overrides sheet value

  const isReady     = status.toLowerCase() === 'ready';
  const isDelivered = status.toLowerCase() === 'delivered';

  let displayUrl = imageUrl;
  if (imageUrl?.includes('drive.google.com/uc?id=')) {
    const m = imageUrl.match(/id=([^&]+)/);
    if (m?.[1]) displayUrl = `https://drive.google.com/thumbnail?id=${m[1]}&sz=w1000`;
  }

  const handleUpdate = async (newStatus) => {
    if (savingStatus) return;
    setSavingStatus(newStatus);
    await updateStatus(id, newStatus);  // 1. write to sheet
    await onStatusChange?.();           // 2. parent fetches fresh data from sheet
    setSavingStatus(null);              // 3. clear spinner
  };



  /* ── Status colors ── */
  const stampProps = isDelivered
    ? { label: 'Delivered', color: 'rgba(16,185,129,0.95)', borderColor: 'rgba(16,185,129,0.85)' }
    : { label: 'Ready',     color: 'rgba(245,158,11,0.95)', borderColor: 'rgba(245,158,11,0.85)' };

  const cardBorder = isDelivered
    ? '1px solid rgba(16,185,129,0.22)'
    : isReady
    ? '1px solid rgba(245,158,11,0.22)'
    : '1px solid rgba(255,255,255,0.06)';

  return (
    <>
      {/* ═══════════ LIST CARD (horizontal) ═══════════ */}
      <div
        className="glass-card"
        onClick={() => setIsModalOpen(true)}
        style={{
          marginBottom: '12px', position: 'relative', overflow: 'hidden',
          animation: `fade-in 0.3s ease-out ${index * 0.08}s forwards`, opacity: 0,
          cursor: 'pointer', transition: 'transform 0.2s',
          border: cardBorder, padding: '12px',
        }}
        onMouseOver={e => { if (!savingStatus) e.currentTarget.style.transform='scale(1.01)'; }}
        onMouseOut={e => { e.currentTarget.style.transform='scale(1)'; }}
      >
        {/* ── Top row: info left + image right ── */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>

          {/* Left: text info */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {/* Name + status badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={16} color={isDelivered ? '#10B981' : isReady ? '#F59E0B' : '#818CF8'} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '17px', fontWeight: '700', color: '#F1F5F9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</span>
              {(isReady || isDelivered) && (
                <span style={{
                  fontSize: '9px', fontWeight: '800', letterSpacing: '1px', padding: '2px 7px',
                  border: `1px solid ${isDelivered ? 'rgba(16,185,129,0.5)' : 'rgba(245,158,11,0.5)'}`,
                  borderRadius: '4px', flexShrink: 0,
                  color: isDelivered ? '#10B981' : '#F59E0B',
                  background: isDelivered ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.08)',
                }}>
                  {isDelivered ? 'DELIVERED' : 'READY'}
                </span>
              )}
            </div>

            {/* Info rows */}
            {contact && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94A3B8', fontSize: '14px' }}>
                <Phone size={13} color="#64748B" /> {contact}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94A3B8', fontSize: '14px' }}>
              <CheckSquare size={13} color="#64748B" /> ID: {id}
            </div>
            {creationDate && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94A3B8', fontSize: '14px' }}>
                <Calendar size={13} color="#64748B" /> Added: {formatDate(creationDate)}
              </div>
            )}
            {readyDate && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: isDelivered ? '#10B981' : isReady ? '#F59E0B' : '#94A3B8' }}>
                <Calendar size={13} color={isDelivered ? '#10B981' : isReady ? '#F59E0B' : '#64748B'} /> Ready: {formatDate(readyDate)}
              </div>
            )}
          </div>

          {/* Right: square image */}
          {displayUrl && (
            <div style={{ width: '96px', height: '108px', flexShrink: 0, borderRadius: '12px', overflow: 'hidden', background: '#1E293B', position: 'relative' }}>
              <img src={displayUrl} alt="Customer"
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: (isReady || isDelivered) ? 'brightness(0.5)' : 'none' }}
                onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
              />
              <div style={{ display:'none', position:'absolute', inset:0, alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.5)', color:'#fff', fontSize:'10px', textAlign:'center', padding:'4px' }}>No img</div>
              {(isReady || isDelivered) && (
                <div style={{
                  position:'absolute', top:'50%', left:'50%',
                  transform:'translate(-50%,-50%) rotate(-22deg)',
                  border:`2px solid ${isDelivered ? 'rgba(16,185,129,0.85)' : 'rgba(245,158,11,0.85)'}`,
                  borderRadius:'4px', padding:'2px 6px',
                  color: isDelivered ? 'rgba(16,185,129,0.95)' : 'rgba(245,158,11,0.95)',
                  fontSize:'10px', fontWeight:'900', letterSpacing:'2px',
                  whiteSpace:'nowrap', pointerEvents:'none',
                }}>
                  {isDelivered ? 'DELIVERED' : 'READY'}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Bottom: action buttons full width ── */}
        <div style={{ display:'flex', gap:'8px' }} onClick={e => e.stopPropagation()}>
          <ActionBtn
            label="Mark Ready"
            icon={CheckCircle2}
            color="#F59E0B"
            bg="rgba(245,158,11,0.12)"
            border="rgba(245,158,11,0.35)"
            loading={savingStatus === 'Ready'}
            disabled={isReady || isDelivered}
            onClick={() => handleUpdate('Ready')}
          />
          <ActionBtn
            label="Mark Delivered"
            icon={PackageCheck}
            color="#10B981"
            bg="rgba(16,185,129,0.12)"
            border="rgba(16,185,129,0.35)"
            loading={savingStatus === 'Delivered'}
            disabled={isDelivered}
            onClick={() => handleUpdate('Delivered')}
          />
        </div>
      </div>


      {/* ═══════════ DETAIL MODAL ═══════════ */}
      {isModalOpen && (
        <div style={{ position:'fixed', inset:0, background:'rgba(7,10,22,0.97)', zIndex:1000, animation:'fade-in 0.2s ease-out', display:'flex', flexDirection:'column', overflowY:'auto' }}>
          <div style={{ padding:'14px 16px', display:'flex', justifyContent:'flex-end' }}>
            <button onClick={() => setIsModalOpen(false)} style={{ background:'rgba(255,255,255,0.08)', border:'none', color:'#fff', borderRadius:'50%', width:'34px', height:'34px', cursor:'pointer', fontSize:'16px', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
          </div>

          <div style={{ padding:'0 18px 40px', maxWidth:'600px', margin:'0 auto', width:'100%' }}>

            {/* Status banner */}
            {(isReady || isDelivered) && (
              <div style={{
                display:'flex', alignItems:'center', gap:'8px',
                padding:'10px 14px', marginBottom:'14px', fontSize:'13px', fontWeight:'600', borderRadius:'12px',
                background: isDelivered ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.10)',
                border: `1px solid ${isDelivered ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
                color: isDelivered ? '#10B981' : '#F59E0B',
              }}>
                {isDelivered ? <PackageCheck size={16}/> : <CheckCircle2 size={16}/>}
                {isDelivered ? 'This order has been delivered' : 'Product is ready for collection'}
              </div>
            )}

            {/* Photo */}
            {displayUrl && (
              <div style={{ marginBottom:'16px', background:'#1E293B', borderRadius:'14px', overflow:'hidden', position:'relative', cursor:'pointer' }}
                onClick={() => { setFullscreenImage(displayUrl); setImageRotation(0); }}
              >
                <img src={displayUrl} alt="Measurements"
                  style={{ width:'100%', height:'220px', objectFit:'cover', display:'block', filter: (isReady||isDelivered) ? 'brightness(0.45)' : 'none' }}
                  onError={e => e.target.style.display='none'} />
                {(isReady || isDelivered) && (
                  <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
                    <div style={{
                      border: `4px solid ${isDelivered ? 'rgba(16,185,129,0.9)' : 'rgba(245,158,11,0.9)'}`,
                      borderRadius: '8px', padding: '6px 18px',
                      color: isDelivered ? 'rgba(16,185,129,0.95)' : 'rgba(245,158,11,0.95)',
                      fontSize: '22px', fontWeight: '900', letterSpacing: '4px', transform: 'rotate(-18deg)',
                      textShadow: isDelivered ? '0 0 16px rgba(16,185,129,0.5)' : '0 0 16px rgba(245,158,11,0.5)',
                    }}>
                      {isDelivered ? 'DELIVERED' : 'READY'}
                    </div>
                  </div>
                )}
                {!isReady && !isDelivered && (
                  <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.3)', opacity:0, transition:'opacity 0.2s' }}
                    onMouseOver={e=>e.currentTarget.style.opacity=1}
                    onMouseOut={e=>e.currentTarget.style.opacity=0}>
                    <div style={{ background:'rgba(0,0,0,0.7)', borderRadius:'20px', padding:'8px 18px', display:'flex', gap:'6px', alignItems:'center', color:'#fff', fontSize:'12px' }}>
                      <ZoomIn size={14}/> Tap to expand
                    </div>
                  </div>
                )}
                <div style={{ padding:'8px 14px', borderTop:'1px solid rgba(255,255,255,0.05)' }} onClick={e=>e.stopPropagation()}>
                  <a href={imageUrl} target="_blank" rel="noopener noreferrer" style={{ color:'#818CF8', textDecoration:'underline', fontSize:'12px' }}>Open in Google Drive</a>
                </div>
              </div>
            )}

            <h1 style={{ fontSize:'22px', marginBottom:'5px', color:'#fff' }}>{displayName}</h1>
            <span style={{ display:'inline-block', padding:'3px 12px', background:'rgba(129,140,248,0.15)', color:'#818CF8', borderRadius:'20px', fontSize:'12px', marginBottom:'14px' }}>
              Customer No: {id}
            </span>

            <div className="glass-card" style={{ display:'flex', flexDirection:'column', gap:'12px', marginBottom:'14px', fontSize:'13px' }}>
              {contact && (
                <div style={{ display:'flex', justifyContent:'space-between', borderBottom:'1px solid rgba(255,255,255,0.07)', paddingBottom:'10px' }}>
                  <span style={{ color:'#94A3B8' }}>Contact</span><span style={{ color:'#fff', fontWeight:'500' }}>{contact}</span>
                </div>
              )}
              {creationDate && (
                <div style={{ display:'flex', justifyContent:'space-between', borderBottom:'1px solid rgba(255,255,255,0.07)', paddingBottom:'10px' }}>
                  <span style={{ color:'#94A3B8' }}>Entry Date</span><span style={{ color:'#fff', fontWeight:'500' }}>{formatDate(creationDate)}</span>
                </div>
              )}
              {readyDate && (
                <div style={{ display:'flex', justifyContent:'space-between', borderBottom:'1px solid rgba(255,255,255,0.07)', paddingBottom:'10px' }}>
                  <span style={{ color:'#10B981' }}>Collection Date</span><span style={{ color:'#10B981', fontWeight:'700' }}>{formatDate(readyDate)}</span>
                </div>
              )}
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span style={{ color:'#94A3B8' }}>Status</span>
                <span style={{ fontWeight:'700', color: isDelivered ? '#10B981' : isReady ? '#F59E0B' : '#64748B' }}>
                  {isDelivered ? '✓ Delivered' : isReady ? '✓ Ready' : '— Pending'}
                </span>
              </div>
            </div>

            {/* Modal action buttons */}
            <div style={{ display:'flex', gap:'10px' }}>
              <button
                onClick={() => handleUpdate('Ready')}
                disabled={isReady || isDelivered || savingStatus !== null}
                style={{
                  flex:1, padding:'12px', border:'none', borderRadius:'12px',
                  background: (isReady||isDelivered) ? 'rgba(255,255,255,0.04)' : 'linear-gradient(135deg,#F59E0B,#D97706)',
                  color: (isReady||isDelivered) ? '#475569' : '#fff',
                  fontSize:'14px', fontWeight:'700', cursor: (isReady||isDelivered) ? 'default' : 'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:'7px',
                  boxShadow: (isReady||isDelivered) ? 'none' : '0 5px 16px rgba(245,158,11,0.3)',
                  border: `1px solid ${(isReady||isDelivered) ? 'rgba(255,255,255,0.06)' : 'transparent'}`,
                }}
              >
                {savingStatus === 'Ready' ? <Loader2 size={16} style={{ animation:'spin 0.8s linear infinite' }}/> : <CheckCircle2 size={16}/>}
                {isReady ? '✓ Ready' : 'Mark Ready'}
              </button>
              <button
                onClick={() => handleUpdate('Delivered')}
                disabled={isDelivered || savingStatus !== null}
                style={{
                  flex:1, padding:'12px', border:'none', borderRadius:'12px',
                  background: isDelivered ? 'rgba(255,255,255,0.04)' : 'linear-gradient(135deg,#10B981,#059669)',
                  color: isDelivered ? '#475569' : '#fff',
                  fontSize:'14px', fontWeight:'700', cursor: isDelivered ? 'default' : 'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:'7px',
                  boxShadow: isDelivered ? 'none' : '0 5px 16px rgba(16,185,129,0.3)',
                  border: `1px solid ${isDelivered ? 'rgba(255,255,255,0.06)' : 'transparent'}`,
                }}
              >
                {savingStatus === 'Delivered' ? <Loader2 size={16} style={{ animation:'spin 0.8s linear infinite' }}/> : <PackageCheck size={16}/>}
                {isDelivered ? '✓ Delivered' : 'Mark Delivered'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ FULLSCREEN VIEWER ═══════════ */}
      {fullscreenImage && (
        <div style={{ position:'fixed', inset:0, background:'#000', zIndex:2000, display:'flex', flexDirection:'column', animation:'fade-in 0.2s ease-out' }}>
          <div style={{ position:'absolute', top:0, right:0, display:'flex', padding:'14px', zIndex:2010, gap:'10px' }}>
            <button onClick={() => setImageRotation(p=>p+90)} style={{ background:'rgba(255,255,255,0.18)', border:'none', color:'#fff', borderRadius:'50%', width:'42px', height:'42px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', backdropFilter:'blur(4px)' }}>
              <RotateCw size={20}/>
            </button>
            <button onClick={() => setFullscreenImage(null)} style={{ background:'rgba(255,255,255,0.18)', border:'none', color:'#fff', borderRadius:'50%', width:'42px', height:'42px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', backdropFilter:'blur(4px)' }}>
              <X size={20}/>
            </button>
          </div>
          <div style={{ flex:1, overflow:'hidden' }}>
            <TransformWrapper initialScale={1} minScale={0.5} maxScale={5} centerOnInit>
              {() => (
                <TransformComponent wrapperStyle={{ width:'100%', height:'100%' }} contentStyle={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <img src={fullscreenImage} alt="Fullscreen"
                    style={{ maxWidth:'100vw', maxHeight:'100vh', objectFit:'contain', transform:`rotate(${imageRotation}deg)`, transition:'transform 0.3s ease' }} />
                </TransformComponent>
              )}
            </TransformWrapper>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html:`
        @keyframes fade-in { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}}/>
    </>
  );
};

export default CustomerCard;
