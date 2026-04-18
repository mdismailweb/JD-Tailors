import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw, UserPlus, Hash, User, Phone, Calendar, CheckCircle, AlertCircle, Scissors } from 'lucide-react';
import { addCustomer } from '../services/api';

const inp = {
  width: '100%',
  background: 'rgba(15,23,42,0.7)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
  padding: '12px 14px',
  color: '#F8FAFC',
  fontSize: '15px',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

const focusIn  = e => { e.target.style.borderColor='rgba(129,140,248,0.5)'; e.target.style.boxShadow='0 0 0 2px rgba(79,70,229,0.15)'; };
const focusOut = e => { e.target.style.borderColor='rgba(255,255,255,0.08)'; e.target.style.boxShadow='none'; };
const focusInG  = e => { e.target.style.borderColor='rgba(16,185,129,0.5)'; e.target.style.boxShadow='0 0 0 2px rgba(16,185,129,0.15)'; };

const Label = ({ icon: Icon, color, children }) => (
  <label style={{ display:'flex', alignItems:'center', gap:'5px', fontSize:'11px', fontWeight:'700', color:'#64748B', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:'6px' }}>
    {Icon && <Icon size={12} color={color || '#818CF8'} />} {children}
  </label>
);

const AddCustomer = () => {
  const webcamRef = useRef(null);
  const [formData, setFormData] = useState({
    customerId: '', name: '', number: '',
    creationDate: new Date().toISOString().split('T')[0], readyDate: ''
  });
  const [image, setImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const capture = useCallback(() => {
    setImage(webcamRef.current.getScreenshot());
    setIsCapturing(false);
  }, [webcamRef]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.customerId) {
      setStatus({ type: 'error', message: 'Customer Number is required.' });
      return;
    }
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });
    const response = await addCustomer({ ...formData, image });
    if (response.success) {
      setStatus({ type: 'success', message: 'Customer recorded successfully!' });
      setFormData({ customerId: '', name: '', number: '', creationDate: new Date().toISOString().split('T')[0], readyDate: '' });
      setImage(null);
    } else {
      setStatus({ type: 'error', message: response.error || 'Failed to save customer.' });
    }
    setIsSubmitting(false);
  };

  return (
    <div style={{ animation: 'fadeUp 0.4s ease-out' }}>

      {/* Compact header */}
      <div style={{
        display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px',
        padding:'14px 16px',
        background:'linear-gradient(135deg,rgba(79,70,229,0.18),rgba(16,185,129,0.06))',
        borderRadius:'16px', border:'1px solid rgba(129,140,248,0.18)',
        position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute', top:'-20px', right:'-20px', width:'80px', height:'80px', borderRadius:'50%', background:'rgba(99,102,241,0.12)', filter:'blur(20px)', pointerEvents:'none' }} />
        <div style={{ width:'38px', height:'38px', borderRadius:'11px', flexShrink:0, background:'linear-gradient(135deg,#4F46E5,#818CF8)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 14px rgba(79,70,229,0.4)' }}>
          <UserPlus size={20} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize:'19px', marginBottom:'1px' }}>New Customer</h1>
          <p style={{ fontSize:'12px', color:'#64748B' }}>Fill in details to record entry</p>
        </div>
      </div>

      {/* Status */}
      {status.message && (
        <div style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 14px', marginBottom:'12px', borderRadius:'10px', background: status.type==='success' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)', border:`1px solid ${status.type==='success' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`, color: status.type==='success' ? '#34D399' : '#FCA5A5', fontSize:'13px', fontWeight:'500' }}>
          {status.type==='success' ? <CheckCircle size={15}/> : <AlertCircle size={15}/>} {status.message}
        </div>
      )}

      {/* Form card */}
      <div style={{ background:'rgba(15,23,42,0.5)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'18px', overflow:'hidden' }}>
        <div style={{ height:'3px', background:'linear-gradient(90deg,#4F46E5,#818CF8,#10B981)' }} />
        <form onSubmit={handleSubmit} style={{ padding:'18px', display:'flex', flexDirection:'column', gap:'14px' }}>

          <div>
            <Label icon={Hash}>Customer Number *</Label>
            <input type="text" name="customerId" value={formData.customerId} onChange={handleChange}
              placeholder="e.g. JD-001" required style={inp} onFocus={focusIn} onBlur={focusOut} />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
            <div>
              <Label icon={User}>Full Name</Label>
              <input type="text" name="name" value={formData.name} onChange={handleChange}
                placeholder="Ahmed Khan" style={inp} onFocus={focusIn} onBlur={focusOut} />
            </div>
            <div>
              <Label icon={Phone}>Contact</Label>
              <input type="number" name="number" value={formData.number} onChange={handleChange}
                placeholder="9876543210" style={inp} onFocus={focusIn} onBlur={focusOut} />
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
            <div>
              <Label icon={Calendar}>Entry Date</Label>
              <input type="date" name="creationDate" value={formData.creationDate} onChange={handleChange}
                style={{ ...inp, colorScheme:'dark' }} onFocus={focusIn} onBlur={focusOut} />
            </div>
            <div>
              <Label icon={Calendar} color="#10B981">Ready Date</Label>
              <input type="date" name="readyDate" value={formData.readyDate} onChange={handleChange}
                style={{ ...inp, colorScheme:'dark' }} onFocus={focusInG} onBlur={focusOut} />
            </div>
          </div>

          {/* Camera — compact */}
          <div>
            <Label icon={Camera}>Measurement Photo</Label>

            {!isCapturing && !image && (
              <button type="button" onClick={() => setIsCapturing(true)} style={{
                width:'100%', padding:'14px', border:'1.5px dashed rgba(129,140,248,0.3)',
                borderRadius:'12px', background:'rgba(79,70,229,0.05)',
                color:'#818CF8', cursor:'pointer', display:'flex', alignItems:'center',
                justifyContent:'center', gap:'8px', fontSize:'13px', fontWeight:'600',
                transition:'all 0.2s',
              }}
                onMouseOver={e=>{ e.currentTarget.style.background='rgba(79,70,229,0.12)'; e.currentTarget.style.borderColor='rgba(129,140,248,0.5)'; }}
                onMouseOut={e=>{ e.currentTarget.style.background='rgba(79,70,229,0.05)'; e.currentTarget.style.borderColor='rgba(129,140,248,0.3)'; }}
              >
                <Camera size={18} /> Open Camera
              </button>
            )}

            {isCapturing && (
              <div style={{ position:'relative', borderRadius:'14px', overflow:'hidden', border:'1px solid rgba(255,255,255,0.1)' }}>
                <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode:'environment' }} style={{ width:'100%', display:'block', maxHeight:'220px', objectFit:'cover' }} />
                <button type="button" onClick={capture} style={{
                  position:'absolute', bottom:'12px', left:'50%', transform:'translateX(-50%)',
                  background:'#fff', border:'none', borderRadius:'50%', width:'54px', height:'54px',
                  cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                  boxShadow:'0 4px 16px rgba(0,0,0,0.6)',
                }}>
                  <div style={{ width:'44px', height:'44px', borderRadius:'50%', border:'4px solid #4F46E5' }} />
                </button>
              </div>
            )}

            {image && (
              <div style={{ position:'relative', borderRadius:'14px', overflow:'hidden', border:'1px solid rgba(16,185,129,0.3)' }}>
                <img src={image} alt="Captured" style={{ width:'100%', display:'block', maxHeight:'180px', objectFit:'cover' }} />
                <div style={{ position:'absolute', top:'8px', left:'8px', background:'rgba(16,185,129,0.9)', borderRadius:'16px', padding:'3px 10px', fontSize:'11px', fontWeight:'700', color:'#fff', display:'flex', alignItems:'center', gap:'4px' }}>
                  <CheckCircle size={11} /> Captured
                </div>
                <button type="button" onClick={() => { setImage(null); setIsCapturing(true); }} style={{
                  position:'absolute', top:'8px', right:'8px', background:'rgba(0,0,0,0.7)', backdropFilter:'blur(8px)',
                  border:'none', borderRadius:'8px', padding:'6px 10px', color:'#fff', cursor:'pointer',
                  display:'flex', alignItems:'center', gap:'5px', fontSize:'12px',
                }}>
                  <RefreshCw size={13} /> Retake
                </button>
              </div>
            )}
          </div>

          <button type="submit" disabled={isSubmitting} style={{
            width:'100%', padding:'13px',
            background:'linear-gradient(135deg,#4F46E5,#818CF8)',
            border:'none', borderRadius:'12px', color:'#fff', fontSize:'15px', fontWeight:'700',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
            boxShadow:'0 6px 20px rgba(79,70,229,0.4)', opacity: isSubmitting ? 0.8 : 1,
          }}>
            {isSubmitting ? <span className="loader" style={{ width:'18px', height:'18px', borderWidth:'2px' }}></span> : <Scissors size={18}/>}
            {isSubmitting ? 'Saving…' : 'Save Customer Record'}
          </button>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{__html:`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}} />
    </div>
  );
};

export default AddCustomer;
