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
  User,
  KeyRound,
  LogOut,
  Mail,
  Building,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function App() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('rithvik@falcon.io');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'Rithvik Krishna',
    email: 'rithvik@falcon.io',
    organization: 'Acme Enterprise Corp',
  });

  // Device Credentials State
  const [myId] = useState('849 204 192');
  const [myPassword, setMyPassword] = useState('fx94-k92a');
  const [permanentAlias, setPermanentAlias] = useState('rithvik-desktop-main');
  const [permanentPassword, setPermanentPassword] = useState('Falcon#Secure2026!');
  const [isUnattendedEnabled, setIsUnattendedEnabled] = useState(true);
  const [showPermanentModal, setShowPermanentModal] = useState(false);

  // Partner Connection State
  const [partnerId, setPartnerId] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [copiedAlias, setCopiedAlias] = useState(false);
  const [activeSession, setActiveSession] = useState<string | null>(null);

  // Saved Unattended Devices
  const [mySavedDevices] = useState([
    { id: 'dev-001', code: 'rithvik-desktop-main', name: 'Primary Workstation (This PC)', status: 'ONLINE', ip: '192.168.1.104' },
    { id: 'dev-002', code: 'build-server-corp-02', name: 'Production Build Node', status: 'ONLINE', ip: '10.0.4.88' },
    { id: 'dev-003', code: 'mac-studio-design', name: 'Design Studio Workstation', status: 'ONLINE', ip: '192.168.1.150' },
  ]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(myId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyAlias = () => {
    navigator.clipboard.writeText(permanentAlias);
    setCopiedAlias(true);
    setTimeout(() => setCopiedAlias(false), 2000);
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
      
      {/* Top Application Title Bar */}
      <header style={{ 
        height: '52px', 
        backgroundColor: '#0F172A', 
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '8px', 
            background: 'linear-gradient(135deg, #6366F1, #06B6D4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(99, 102, 241, 0.4)'
          }}>
            <Shield size={18} color="white" />
          </div>
          <div>
            <span style={{ fontWeight: '700', fontSize: '15px', letterSpacing: '-0.3px' }}>Falcon Remote Client</span>
            <span style={{ fontSize: '10px', color: '#06B6D4', fontWeight: '600', marginLeft: '8px' }}>v1.0 ENTERPRISE</span>
          </div>
        </div>

        {isLoggedIn ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '4px 12px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700' }}>
                {userProfile.name.charAt(0)}
              </div>
              <span style={{ fontSize: '13px', fontWeight: '600' }}>{userProfile.name}</span>
              <span style={{ fontSize: '11px', color: 'var(--accent-cyan)' }}>({userProfile.organization})</span>
            </div>

            <button 
              onClick={() => setIsLoggedIn(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
              title="Sign Out"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        ) : (
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Falcon Secure Authentication Service</span>
        )}
      </header>

      {/* Main View Area */}
      {!isLoggedIn ? (
        /* SCREEN 1: User Login Screen */
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '420px', padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '14px', 
                background: 'linear-gradient(135deg, #6366F1, #06B6D4)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                boxShadow: '0 0 24px rgba(99, 102, 241, 0.5)'
              }}>
                <Shield size={32} color="white" />
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Sign In to Falcon</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Access permanent unattended devices and remote control sessions.
              </p>
            </div>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '6px', display: 'block' }}>ACCOUNT EMAIL</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="email" 
                    className="input-field" 
                    value={loginEmail} 
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    style={{ paddingLeft: '42px', fontSize: '14px' }}
                  />
                  <Mail size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '6px', display: 'block' }}>PASSWORD</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    className="input-field" 
                    value={loginPassword} 
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    style={{ paddingLeft: '42px', paddingRight: '42px', fontSize: '14px' }}
                  />
                  <KeyRound size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '14px', top: '14px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-connect" style={{ marginTop: '8px', justifyContent: 'center' }}>
                Sign In <ArrowRight size={18} />
              </button>
            </form>

            <div style={{ textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <button 
                onClick={() => setIsLoggedIn(true)}
                style={{ background: 'none', border: 'none', color: 'var(--accent-indigo)', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
              >
                Continue with Enterprise Single Sign-On (SSO / SAML) ➔
              </button>
            </div>
          </div>
        </div>
      ) : activeSession ? (
        /* SCREEN 2: Live WebRTC Remote Session Viewport */
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
                <Copy size={14} /> Clipboard Sync
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
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Real-time WebRTC DataChannel Stream Active • Unattended Permanent Password Authenticated</p>
            </div>
          </div>
        </div>
      ) : (
        /* SCREEN 3: Authenticated Dashboard (Permanent Code & Unattended Devices) */
        <main style={{ flex: 1, padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            
            {/* Left Column: Your Credentials & Permanent Unattended Access Code */}
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-indigo)', marginBottom: '4px' }}>
                  <Shield size={18} />
                  <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>DEVICE CREDENTIALS</span>
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '700' }}>Your Local Computer Access</h3>
              </div>

              {/* Dynamic 9-Digit ID & Temporary Password */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>ONE-TIME FALCON ID</span>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: '700', color: '#60A5FA' }}>{myId}</p>
                  </div>
                  <button onClick={handleCopyId} className="btn-secondary" style={{ padding: '8px 12px' }}>
                    {copiedId ? <Check size={16} color="#10B981" /> : <Copy size={16} />}
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>TEMPORARY PASSWORD</span>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: '700', color: '#34D399' }}>{myPassword}</p>
                  </div>
                  <button onClick={handleRefreshPassword} className="btn-secondary" style={{ padding: '8px' }} title="Generate New Password">
                    <RotateCcw size={16} />
                  </button>
                </div>
              </div>

              {/* Permanent Unattended Code & Password Box */}
              <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#A5B4FC', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <KeyRound size={16} /> PERMANENT UNATTENDED CODE
                  </span>
                  <span style={{ fontSize: '11px', color: '#34D399', fontWeight: '600', backgroundColor: 'rgba(16, 185, 129, 0.2)', padding: '2px 8px', borderRadius: '10px' }}>ENABLED</span>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Permanent Alias / Device Code:</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: '700', color: 'white' }}>{permanentAlias}</span>
                    <button onClick={handleCopyAlias} style={{ background: 'none', border: 'none', color: '#A5B4FC', cursor: 'pointer' }}>
                      {copiedAlias ? <Check size={16} color="#10B981" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Permanent Unattended Password:</span>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: '#34D399', fontWeight: '600', marginTop: '2px' }}>{permanentPassword}</p>
                </div>

                <button 
                  onClick={() => setShowPermanentModal(true)}
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: 'white', border: '1px solid var(--border-color)', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', marginTop: '4px' }}
                >
                  Configure Permanent Unattended Password ➔
                </button>
              </div>

            </div>

            {/* Right Column: Connect to Partner & Unattended Devices */}
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', marginBottom: '4px' }}>
                  <Monitor size={18} />
                  <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>REMOTE CONTROL</span>
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '700' }}>Connect to Partner or Device</h3>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '6px', display: 'block' }}>PARTNER CODE / PERMANENT ALIAS</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Enter 9-Digit ID or Permanent Alias (e.g. build-server-corp-02)" 
                  value={partnerId} 
                  onChange={(e) => setPartnerId(e.target.value)}
                  style={{ fontSize: '15px' }}
                />
              </div>

              <button className="btn-connect" style={{ justifyContent: 'center' }} onClick={handleConnect}>
                Connect to Partner <ArrowRight size={18} />
              </button>

              {/* Saved Unattended Devices List */}
              <div style={{ marginTop: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '700', display: 'block', marginBottom: '10px' }}>MY UNATTENDED SAVED DEVICES</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {mySavedDevices.map((dev) => (
                    <div 
                      key={dev.id}
                      onClick={() => setActiveSession(dev.code)}
                      style={{ 
                        padding: '12px 16px', 
                        backgroundColor: 'rgba(15, 23, 42, 0.6)', 
                        border: '1px solid var(--border-color)', 
                        borderRadius: '10px', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div>
                        <p style={{ fontWeight: '600', fontSize: '13px' }}>{dev.name}</p>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>{dev.code} • {dev.ip}</span>
                      </div>
                      <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '11px' }}>
                        1-Click Connect ➔
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Modal: Permanent Password Configuration */}
          {showPermanentModal && (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
              <div className="glass-panel" style={{ width: '480px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Configure Permanent Password</h3>
                  <button onClick={() => setShowPermanentModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <X size={20} />
                  </button>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Set a custom permanent password to access this computer remotely even when no user is sitting in front of it.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '4px', display: 'block' }}>PERMANENT DEVICE ALIAS</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      value={permanentAlias} 
                      onChange={(e) => setPermanentAlias(e.target.value)}
                      style={{ fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '4px', display: 'block' }}>CUSTOM PERMANENT PASSWORD</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      value={permanentPassword} 
                      onChange={(e) => setPermanentPassword(e.target.value)}
                      style={{ fontSize: '14px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowPermanentModal(false)}>
                    Save Permanent Credentials
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      )}
    </div>
  );
}
