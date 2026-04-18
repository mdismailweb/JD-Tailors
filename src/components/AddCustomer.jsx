import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw, Upload, CheckCircle } from 'lucide-react';
import { addCustomer } from '../services/api';

const AddCustomer = () => {
  const webcamRef = useRef(null);
  
  const [formData, setFormData] = useState({
    customerId: '',
    name: '',
    number: '',
    creationDate: new Date().toISOString().split('T')[0],
    readyDate: ''
  });
  
  const [image, setImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    setIsCapturing(false);
  }, [webcamRef]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.customerId || !formData.name || !formData.number || !formData.readyDate) {
      setStatus({ type: 'error', message: 'Please fill all required fields.' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    const payload = {
      ...formData,
      image // Base64 string
    };

    const response = await addCustomer(payload);

    if (response.success) {
      setStatus({ type: 'success', message: 'Customer recorded successfully!' });
      // Reset form
      setFormData({
        customerId: '',
        name: '',
        number: '',
        creationDate: new Date().toISOString().split('T')[0],
        readyDate: ''
      });
      setImage(null);
    } else {
      setStatus({ type: 'error', message: response.error || 'Failed to save customer.' });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="glass-card" style={{ animation: 'fade-in 0.5s ease-out' }}>
      <h1>Record Customer</h1>
      
      {status.message && (
        <div style={{
          padding: '12px',
          marginBottom: '20px',
          borderRadius: '8px',
          background: status.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          border: `1px solid ${status.type === 'success' ? '#10B981' : '#EF4444'}`,
          color: status.type === 'success' ? '#34D399' : '#FCA5A5'
        }}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Customer Number *</label>
          <input 
            type="text" 
            name="customerId" 
            value={formData.customerId} 
            onChange={handleChange} 
            placeholder="E.g. JD001"
            required 
          />
        </div>

        <div className="form-group">
          <label>Full Name *</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder="E.g. John Doe"
            required 
          />
        </div>

        <div className="form-group">
          <label>Contact Number *</label>
          <input 
            type="number" 
            name="number" 
            value={formData.number} 
            onChange={handleChange} 
            placeholder="E.g. 9876543210"
            required 
          />
        </div>

        <div className="form-group" style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <label>Creation Date</label>
            <input 
              type="date" 
              name="creationDate" 
              value={formData.creationDate} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>Ready Date *</label>
            <input 
              type="date" 
              name="readyDate" 
              value={formData.readyDate} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>

        <div className="form-group">
          <label>Measurement / Cloth Photo</label>
          
          {!isCapturing && !image && (
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => setIsCapturing(true)}
              style={{ borderStyle: 'dashed', background: 'transparent' }}
            >
              <Camera size={20} />
              Open Camera
            </button>
          )}

          {isCapturing && (
            <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden' }}>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "environment" }}
                style={{ width: '100%', display: 'block' }}
              />
              <button 
                type="button" 
                onClick={capture}
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '60px',
                  height: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
                }}
              >
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '4px solid #4F46E5' }}></div>
              </button>
            </div>
          )}

          {image && (
            <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <img src={image} alt="Captured" style={{ width: '100%', display: 'block' }} />
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => { setImage(null); setIsCapturing(true); }}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: 'auto',
                  padding: '8px',
                  background: 'rgba(0,0,0,0.6)',
                  backdropFilter: 'blur(4px)'
                }}
              >
                <RefreshCw size={16} />
              </button>
            </div>
          )}
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={isSubmitting}
          style={{ marginTop: '24px' }}
        >
          {isSubmitting ? <span className="loader"></span> : <Upload size={20} />}
          {isSubmitting ? 'Saving...' : 'Save Customer Record'}
        </button>
      </form>
    </div>
  );
};

export default AddCustomer;
