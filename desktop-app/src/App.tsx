import React, { useState } from 'react';
import { 
  Shield, 
  Copy, 
  RotateCcw, 
  ArrowRight, 
  FolderDown, 
  Monitor, 
  Settings, 
  Wifi, 
  Lock, 
  Check, 
  X,
  Zap,
  Cpu,
  Power,
  Maximize2
} from 'lucide-react';

export default function App() {
  const [myId] = useState('849 204 192');
  const [myPassword, setMyPassword] = useState('fx94-k92a');
  const [partnerId, setPartnerId] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [activeSession, setActiveSession] = useState<string | null>(null);

  const handleCopyId = () => {
    navigator.clipboard.writeText(myId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyPass = () => {
    navigator.clipboard.writeText(myPassword);
    setCopiedPass(true);
    setTimeout(() => setCopiedPass(false), 2000);
  };

  const handleRefreshPassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let newPass = '';
    for (let i = 0; i < 4; i++) newPass += chars.charAt(Math.floor(Math.random() * chars.length));
    newPass += '-';
    for (let i = 0; i < 4; i++) newPass += chars.charAt(Math.floor(Math.random() * chars.length));
    setMyPassword(newPass);
  };

  const handleConnect = () => {
    if (!partnerId) {
      setActiveSession('912 384 501');
    } else {
      setActiveSession(partnerId);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#0B0F19' }}>
      {/* Title Bar / Header */}
      <header style={{ 
        height: '48px', 
        backgroundColor: '#0F172A', 
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        WebkitAppRegion: 'drag' as any
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            width: '28px', 
            height: '28px', 
            borderRadius: '6px', 
            background: 'linear-gradient(135deg, #6366F1, #06B6D4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Shield size={16} color="white" />
          </div>
          <span style={{ fontWeight: '700', fontSize: '15px', letterSpacing: '-0.3px' }}>Falcon Remote Client</span>
          <span style={{ fontSize: '11px', color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)', fontWeight: '600' }}>v1.0.0</span>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }}></span>
            Signaling Online (WSS)
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Wifi size={14} color="#06B6D4" /> 12ms P2P
          </span>
        </div>
      </header>

      {/* App Body */}
      {activeSession ? (
        /* Live WebRTC Remote Session Viewport */
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#000' }}>
          <div style={{ height: '48px', backgroundColor: '#1E293B', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: '#34D399', fontWeight: '600', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#34D399' }}></span>
                CONNECTED TO {activeSession}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>1080p @ 60 FPS • H.264 NAL • AES-256-GCM</span>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: 'white', border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Copy size={14} /> Clipboard
              </button>
              <button style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: 'white', border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FolderDown size={14} /> Send File
              </button>
              <button style={{ backgroundColor: '#EF4444', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => setActiveSession(null)}>
                <Power size={14} /> End Session
              </button>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ textAlign: 'center' }}>
              <Monitor size={72} color="#6366F1" style={{ marginBottom: '16px' }} />
              <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>Partner Desktop Viewport ({activeSession})</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Real-time WebRTC DataChannel Stream Active • Mouse & Keyboard Direct Injection Active</p>
            </div>
          </div>
        </div>
      ) : (
        /* TeamViewer/AnyDesk Main Control Panel */
        <main style={{ flex: 1, padding: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'center', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
          
          {/* Left Box: Allow Remote Control */}
          <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-indigo)', marginBottom: '4px' }}>
                <Shield size={20} />
                <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>ALLOW REMOTE CONTROL</span>
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: '700' }}>Your Device Credentials</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Share this ID and temporary password with your partner to allow them to access your computer.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '6px', display: 'block' }}>YOUR FALCON ID</span>
                <div className="id-badge" style={{ width: '100%', justifyContent: 'space-between' }}>
                  <span>{myId}</span>
                  <button onClick={handleCopyId} style={{ background: 'none', border: 'none', color: '#60A5FA', cursor: 'pointer' }} title="Copy ID">
                    {copiedId ? <Check size={20} color="#10B981" /> : <Copy size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '6px', display: 'block' }}>ONE-TIME PASSWORD</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="password-badge" style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{myPassword}</span>
                    <button onClick={handleCopyPass} style={{ background: 'none', border: 'none', color: '#34D399', cursor: 'pointer' }} title="Copy Password">
                      {copiedPass ? <Check size={18} color="#10B981" /> : <Copy size={18} />}
                    </button>
                  </div>
                  <button onClick={handleRefreshPassword} style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', color: 'white', padding: '10px', borderRadius: '8px', cursor: 'pointer' }} title="Generate New Password">
                    <RotateCcw size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div style={{ padding: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }}></div>
              <span style={{ fontSize: '12px', color: '#34D399', fontWeight: '500' }}>Ready for incoming WebRTC session</span>
            </div>
          </div>

          {/* Right Box: Control Remote Computer */}
          <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', marginBottom: '4px' }}>
                <Monitor size={20} />
                <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>CONTROL REMOTE COMPUTER</span>
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: '700' }}>Connect to Partner</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Enter your partner's 9-digit Falcon ID to initiate a sub-second remote control session.
              </p>
            </div>

            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '6px', display: 'block' }}>PARTNER FALCON ID</span>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. 912 384 501" 
                value={partnerId} 
                onChange={(e) => setPartnerId(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-connect" style={{ flex: 1, justifyContent: 'center' }} onClick={handleConnect}>
                Connect <ArrowRight size={18} />
              </button>
              <button style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '10px', cursor: 'pointer' }} title="Transfer Files">
                <FolderDown size={20} />
              </button>
            </div>

            <div style={{ marginTop: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600', display: 'block', marginBottom: '8px' }}>RECENT CONNECTIONS</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ padding: '10px 14px', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setActiveSession('912 384 501')}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: '600' }}>912 384 501 (Workstation)</span>
                  <ArrowRight size={14} color="var(--text-secondary)" />
                </div>
              </div>
            </div>
          </div>

        </main>
      )}
    </div>
  );
}
