import React, { useState } from 'react';
import { 
  Shield, 
  Copy, 
  ArrowRight, 
  FolderDown, 
  Monitor, 
  Settings, 
  Wifi, 
  Lock, 
  Check, 
  X,
  Zap,
  Power,
  User,
  KeyRound,
  LogOut,
  Mail,
  Eye,
  EyeOff,
  Edit3
} from 'lucide-react';

export default function App() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('rithvik@falcon.io');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [userProfile] = useState({
    name: 'Rithvik Krishna',
    email: 'rithvik@falcon.io',
    organization: 'Acme Enterprise Corp',
  });

  // Permanent Device Credentials Only (No temporary IDs/passwords)
  const [permanentId] = useState('849 204 192');
  const [permanentAlias, setPermanentAlias] = useState('rithvik-desktop-main');
  const [permanentPassword, setPermanentPassword] = useState('Falcon#Secure2026!');
  const [showPermanentModal, setShowPermanentModal] = useState(false);

  // Partner Connection State
  const [partnerId, setPartnerId] = useState('');
  const [partnerPassword, setPartnerPassword] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [copiedAlias, setCopiedAlias] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [activeSession, setActiveSession] = useState<string | null>(null);

  // Saved Permanent Devices List
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
    navigator.clipboard.writeText(permanentId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyAlias = () => {
    navigator.clipboard.writeText(permanentAlias);
    setCopiedAlias(true);
    setTimeout(() => setCopiedAlias(false), 2000);
  };

  const handleCopyPass = () => {
    navigator.clipboard.writeText(permanentPassword);
    setCopiedPass(true);
    setTimeout(() => setCopiedPass(false), 2000);
  };

  const handleConnect = () => {
    if (!partnerId) {
      setActiveSession('rithvik-desktop-main');
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
            <span style={{ fontSize: '10px', color: '#06B6D4', fontWeight: '600', marginLeft: '8px' }}>PERMANENT ACCESS ENGINE</span>
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
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Falcon Enterprise Permanent Access</span>
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
                Log in to view and manage your permanent device access codes.
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
                Sign In with Enterprise Single Sign-On (SSO / SAML) ➔
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
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>1080p @ 60 FPS • H.264 NAL • Permanent Password Authenticated</span>
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
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Real-time WebRTC DataChannel Stream Active • Authenticated via Permanent Access Code</p>
            </div>
          </div>
        </div>
      ) : (
        /* SCREEN 3: Authenticated Permanent Code Dashboard */
        <main style={{ flex: 1, padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            
            {/* Left Column: Exclusive Permanent Device Code & Password */}
            <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-indigo)', marginBottom: '4px' }}>
                  <Shield size={20} />
                  <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>PERMANENT ACCESS CREDENTIALS</span>
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: '700' }}>Your Permanent Device Access</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  This device is assigned a permanent ID, custom alias, and permanent password for 24/7 remote connection.
                </p>
              </div>

              {/* Permanent ID & Permanent Alias Box */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'rgba(15, 23, 42, 0.7)', border: '1px solid var(--border-color)', padding: '20px', borderRadius: '14px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700', letterSpacing: '0.5px' }}>PERMANENT FALCON DEVICE ID</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: '700', color: '#60A5FA' }}>{permanentId}</span>
                    <button onClick={handleCopyId} className="btn-secondary" style={{ padding: '8px 12px' }}>
                      {copiedId ? <Check size={16} color="#10B981" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700', letterSpacing: '0.5px' }}>PERMANENT DEVICE ALIAS</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: '700', color: 'white' }}>{permanentAlias}</span>
                    <button onClick={handleCopyAlias} className="btn-secondary" style={{ padding: '6px 10px' }}>
                      {copiedAlias ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700', letterSpacing: '0.5px' }}>PERMANENT ACCESS PASSWORD</span>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: '700', color: '#34D399', marginTop: '4px' }}>{permanentPassword}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={handleCopyPass} className="btn-secondary" style={{ padding: '6px 10px' }}>
                        {copiedPass ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                      </button>
                      <button onClick={() => setShowPermanentModal(true)} className="btn-secondary" style={{ padding: '6px 10px' }} title="Edit Permanent Password">
                        <Edit3 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ padding: '14px', backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }}></div>
                <span style={{ fontSize: '12px', color: '#34D399', fontWeight: '600' }}>● Permanent Unattended Service Ready (24/7 Active)</span>
              </div>
            </div>

            {/* Right Column: Connect to Remote Computer */}
            <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', marginBottom: '4px' }}>
                  <Monitor size={20} />
                  <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>REMOTE CONTROL</span>
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: '700' }}>Connect to Partner Device</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Enter partner's permanent Falcon ID or permanent alias to connect.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '6px', display: 'block' }}>PERMANENT FALCON ID / ALIAS</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Enter Permanent ID (e.g. 849 204 192) or Alias" 
                    value={partnerId} 
                    onChange={(e) => setPartnerId(e.target.value)}
                    style={{ fontSize: '15px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '6px', display: 'block' }}>PERMANENT ACCESS PASSWORD</label>
                  <input 
                    type="password" 
                    className="input-field" 
                    placeholder="Enter Partner's Permanent Password" 
                    value={partnerPassword} 
                    onChange={(e) => setPartnerPassword(e.target.value)}
                    style={{ fontSize: '15px' }}
                  />
                </div>
              </div>

              <button className="btn-connect" style={{ justifyContent: 'center' }} onClick={handleConnect}>
                Connect to Remote Computer <ArrowRight size={18} />
              </button>

              {/* Saved Permanent Devices List */}
              <div style={{ marginTop: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '700', display: 'block', marginBottom: '10px' }}>PERMANENT SAVED DEVICES</span>
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

          {/* Modal: Edit Permanent Credentials */}
          {showPermanentModal && (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
              <div className="glass-panel" style={{ width: '480px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Edit Permanent Credentials</h3>
                  <button onClick={() => setShowPermanentModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <X size={20} />
                  </button>
                </div>

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
                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '4px', display: 'block' }}>PERMANENT ACCESS PASSWORD</label>
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
                    Save Credentials
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
