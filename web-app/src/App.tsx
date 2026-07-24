import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  ShieldCheck, 
  Activity, 
  Settings, 
  Power, 
  Zap, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Lock, 
  Copy, 
  FolderDown, 
  Terminal, 
  Users, 
  CheckCircle2, 
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Maximize2
} from 'lucide-react';

interface Device {
  id: string;
  name: string;
  hostname: string;
  os: string;
  ip: string;
  isOnline: boolean;
  cpu: number;
  ram: number;
  rttMs: number;
}

export function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'devices' | 'session' | 'audit' | 'settings'>('dashboard');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionFps, setSessionFps] = useState(60);
  const [sessionBitrate, setSessionBitrate] = useState(4800);
  const [clipboardText, setClipboardText] = useState('');
  const [auditFilter, setAuditFilter] = useState('');

  const [devices] = useState<Device[]>([
    {
      id: 'dev-001',
      name: 'Primary Workstation',
      hostname: 'FALCON-WIN11-PRO',
      os: 'Windows 11 Pro 64-bit',
      ip: '192.168.1.104',
      isOnline: true,
      cpu: 14.2,
      ram: 44.8,
      rttMs: 12,
    },
    {
      id: 'dev-002',
      name: 'Production Build Node',
      hostname: 'FALCON-BUILD-SERVER',
      os: 'Windows Server 2022',
      ip: '10.0.4.88',
      isOnline: true,
      cpu: 3.8,
      ram: 28.1,
      rttMs: 18,
    },
    {
      id: 'dev-003',
      name: 'Design Workstation (AV1)',
      hostname: 'FALCON-MAC-STUDIO',
      os: 'macOS Sonoma 14.5',
      ip: '192.168.1.150',
      isOnline: true,
      cpu: 8.5,
      ram: 52.0,
      rttMs: 8,
    },
    {
      id: 'dev-004',
      name: 'Backup Storage PC',
      hostname: 'FALCON-STORAGE',
      os: 'Windows 10 Enterprise',
      ip: '192.168.1.200',
      isOnline: false,
      cpu: 0,
      ram: 0,
      rttMs: 0,
    },
  ]);

  const [featureFlags, setFeatureFlags] = useState({
    av1Codec: true,
    clipboardSync: true,
    fileTransfer: true,
    wakeOnLan: true,
    scimProvisioning: true,
  });

  const auditLogs = [
    { id: 'aud-99', time: '10:45:12 AM', actor: 'admin@falcon.io', action: 'SESSION_STARTED', resource: 'FALCON-WIN11-PRO', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
    { id: 'aud-98', time: '10:44:02 AM', actor: 'system-agent', action: 'HEARTBEAT_INGESTED', resource: 'FALCON-BUILD-SERVER', hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4' },
    { id: 'aud-97', time: '10:30:15 AM', actor: 'sarah.c@corp.com', action: 'FILE_TRANSFERRED', resource: 'FALCON-MAC-STUDIO', hash: '15e2b0d3c33891ebb0f1ef609ec419420c20e320ce94c65fbc8c3312448eb225' },
    { id: 'aud-96', time: '10:12:00 AM', actor: 'scim-bot', action: 'USER_PROVISIONED', resource: 'dev-ops-group', hash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069' },
  ];

  const handleLaunchSession = (device: Device) => {
    setSelectedDevice(device);
    setIsSessionActive(true);
    setActiveTab('session');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar Navigation */}
      <aside style={{ 
        width: '260px', 
        backgroundColor: 'rgba(15, 23, 42, 0.95)', 
        borderRight: '1px solid var(--border-color)',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '8px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '10px', 
            background: 'linear-gradient(135deg, #6366F1, #06B6D4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)'
          }}>
            <Sparkles size={24} color="white" />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '-0.5px' }}>FALCON</h2>
            <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: '600' }}>ENTERPRISE v1.0</span>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`btn-secondary ${activeTab === 'dashboard' ? 'active' : ''}`}
            style={{ 
              justifyContent: 'flex-start',
              backgroundColor: activeTab === 'dashboard' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              borderColor: activeTab === 'dashboard' ? 'var(--accent-indigo)' : 'transparent',
              color: activeTab === 'dashboard' ? '#A5B4FC' : 'var(--text-secondary)'
            }}
          >
            <Activity size={18} /> Overview Dashboard
          </button>

          <button 
            onClick={() => setActiveTab('devices')}
            className={`btn-secondary ${activeTab === 'devices' ? 'active' : ''}`}
            style={{ 
              justifyContent: 'flex-start',
              backgroundColor: activeTab === 'devices' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              borderColor: activeTab === 'devices' ? 'var(--accent-indigo)' : 'transparent',
              color: activeTab === 'devices' ? '#A5B4FC' : 'var(--text-secondary)'
            }}
          >
            <Monitor size={18} /> Device Fleet ({devices.length})
          </button>

          <button 
            onClick={() => setActiveTab('session')}
            className={`btn-secondary ${activeTab === 'session' ? 'active' : ''}`}
            style={{ 
              justifyContent: 'flex-start',
              backgroundColor: activeTab === 'session' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              borderColor: activeTab === 'session' ? 'var(--accent-indigo)' : 'transparent',
              color: activeTab === 'session' ? '#A5B4FC' : 'var(--text-secondary)'
            }}
          >
            <Play size={18} /> Live WebRTC Session
          </button>

          <button 
            onClick={() => setActiveTab('audit')}
            className={`btn-secondary ${activeTab === 'audit' ? 'active' : ''}`}
            style={{ 
              justifyContent: 'flex-start',
              backgroundColor: activeTab === 'audit' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              borderColor: activeTab === 'audit' ? 'var(--accent-indigo)' : 'transparent',
              color: activeTab === 'audit' ? '#A5B4FC' : 'var(--text-secondary)'
            }}
          >
            <ShieldCheck size={18} /> Security & Audit Logs
          </button>

          <button 
            onClick={() => setActiveTab('settings')}
            className={`btn-secondary ${activeTab === 'settings' ? 'active' : ''}`}
            style={{ 
              justifyContent: 'flex-start',
              backgroundColor: activeTab === 'settings' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              borderColor: activeTab === 'settings' ? 'var(--accent-indigo)' : 'transparent',
              color: activeTab === 'settings' ? '#A5B4FC' : 'var(--text-secondary)'
            }}
          >
            <Settings size={18} /> Enterprise Settings
          </button>
        </nav>

        <div style={{ marginTop: 'auto' }} className="glass-card">
          <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div className="pulse-dot" style={{ color: 'var(--accent-emerald)' }}></div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--accent-emerald)' }}>SYSTEM OPERATIONAL</span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Signaling: Native WSS</p>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Relay: Coturn STUN/TURN</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        {/* Top Header */}
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '32px' 
        }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px' }}>
              {activeTab === 'dashboard' && 'Enterprise Dashboard'}
              {activeTab === 'devices' && 'Managed Device Fleet'}
              {activeTab === 'session' && 'WebRTC Remote Desktop Viewer'}
              {activeTab === 'audit' && 'Cryptographic Audit Trail'}
              {activeTab === 'settings' && 'Enterprise Configuration & Feature Flags'}
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Falcon Sub-Second Peer-to-Peer Remote Desktop Control Engine
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-secondary">
              <Wifi size={16} /> Latency: 12ms
            </button>
            <button className="btn-primary" onClick={() => handleLaunchSession(devices[0])}>
              <Zap size={16} /> Quick Connect
            </button>
          </div>
        </header>

        {/* Tab 1: Overview Dashboard */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Metric Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span style={{ fontSize: '13px', fontWeight: '500' }}>Active Fleet Devices</span>
                  <Monitor size={20} color="var(--accent-indigo)" />
                </div>
                <h3 style={{ fontSize: '32px', fontWeight: '700', margin: '12px 0 4px 0' }}>3 / 4</h3>
                <span style={{ fontSize: '12px', color: 'var(--accent-emerald)', fontWeight: '600' }}>75% Online Availability</span>
              </div>

              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span style={{ fontSize: '13px', fontWeight: '500' }}>Average Stream FPS</span>
                  <Zap size={20} color="var(--accent-cyan)" />
                </div>
                <h3 style={{ fontSize: '32px', fontWeight: '700', margin: '12px 0 4px 0' }}>60 FPS</h3>
                <span style={{ fontSize: '12px', color: 'var(--accent-cyan)', fontWeight: '600' }}>H.264 / AV1 Ultra Low Latency</span>
              </div>

              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span style={{ fontSize: '13px', fontWeight: '500' }}>P2P Success Rate</span>
                  <Activity size={20} color="var(--accent-emerald)" />
                </div>
                <h3 style={{ fontSize: '32px', fontWeight: '700', margin: '12px 0 4px 0' }}>99.8%</h3>
                <span style={{ fontSize: '12px', color: 'var(--accent-emerald)', fontWeight: '600' }}>STUN/TURN Fallback Ready</span>
              </div>

              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span style={{ fontSize: '13px', fontWeight: '500' }}>Audit Log Chain</span>
                  <ShieldCheck size={20} color="var(--accent-rose)" />
                </div>
                <h3 style={{ fontSize: '32px', fontWeight: '700', margin: '12px 0 4px 0' }}>Verified</h3>
                <span style={{ fontSize: '12px', color: 'var(--accent-rose)', fontWeight: '600' }}>SHA-256 Tamper Proof</span>
              </div>
            </div>

            {/* Live Devices Summary Table */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Active Device Status</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '13px' }}>
                    <th style={{ padding: '12px' }}>DEVICE NAME</th>
                    <th style={{ padding: '12px' }}>OS PLATFORM</th>
                    <th style={{ padding: '12px' }}>IP ADDRESS</th>
                    <th style={{ padding: '12px' }}>CPU LOAD</th>
                    <th style={{ padding: '12px' }}>RAM LOAD</th>
                    <th style={{ padding: '12px' }}>STATUS</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map((d) => (
                    <tr key={d.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '14px' }}>
                      <td style={{ padding: '16px 12px', fontWeight: '600' }}>{d.name}</td>
                      <td style={{ padding: '16px 12px', color: 'var(--text-secondary)' }}>{d.os}</td>
                      <td style={{ padding: '16px 12px', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>{d.ip}</td>
                      <td style={{ padding: '16px 12px' }}>{d.isOnline ? `${d.cpu}%` : '-'}</td>
                      <td style={{ padding: '16px 12px' }}>{d.isOnline ? `${d.ram}%` : '-'}</td>
                      <td style={{ padding: '16px 12px' }}>
                        <span className={d.isOnline ? 'badge-online' : 'badge-offline'}>
                          <span className="pulse-dot"></span>
                          {d.isOnline ? 'ONLINE' : 'OFFLINE'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                        <button 
                          className="btn-secondary" 
                          disabled={!d.isOnline}
                          onClick={() => handleLaunchSession(d)}
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                        >
                          Connect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Devices Fleet */}
        {activeTab === 'devices' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            {devices.map((device) => (
              <div key={device.id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700' }}>{device.name}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{device.hostname}</p>
                  </div>
                  <span className={device.isOnline ? 'badge-online' : 'badge-offline'}>
                    <span className="pulse-dot"></span>
                    {device.isOnline ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', backgroundColor: 'rgba(0, 0, 0, 0.2)', padding: '12px', borderRadius: '10px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>CPU Usage</span>
                    <p style={{ fontSize: '16px', fontWeight: '600', marginTop: '2px' }}>{device.isOnline ? `${device.cpu}%` : 'N/A'}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>RAM Usage</span>
                    <p style={{ fontSize: '16px', fontWeight: '600', marginTop: '2px' }}>{device.isOnline ? `${device.ram}%` : 'N/A'}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>RTT Latency</span>
                    <p style={{ fontSize: '16px', fontWeight: '600', marginTop: '2px', color: 'var(--accent-cyan)' }}>{device.isOnline ? `${device.rttMs} ms` : 'N/A'}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                  <button 
                    className="btn-primary" 
                    disabled={!device.isOnline}
                    onClick={() => handleLaunchSession(device)}
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    <Play size={16} /> Launch Session
                  </button>
                  <button className="btn-secondary" title="Wake-on-LAN">
                    <Zap size={16} /> WoL
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Live Session Screen */}
        {activeTab === 'session' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Session Toolbar */}
            <div className="glass-card" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span className="badge-online">
                  <span className="pulse-dot"></span> WEBRTC CONNECTED
                </span>
                <span style={{ fontWeight: '600' }}>Target: {selectedDevice ? selectedDevice.name : 'FALCON-WIN11-PRO'}</span>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  {sessionFps} FPS | {sessionBitrate} Kbps | AES-256-GCM
                </span>
                <button className="btn-secondary" onClick={() => setSessionFps(sessionFps === 60 ? 30 : 60)}>
                  <RotateCcw size={14} /> Toggle FPS ({sessionFps})
                </button>
                <button className="btn-secondary">
                  <Copy size={14} /> Sync Clipboard
                </button>
                <button className="btn-primary" style={{ backgroundColor: 'var(--accent-rose)' }} onClick={() => setIsSessionActive(false)}>
                  <Power size={14} /> Disconnect
                </button>
              </div>
            </div>

            {/* Remote Screen Viewport Canvas */}
            <div className="glass-card" style={{ 
              height: '560px', 
              backgroundColor: '#000', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                <Monitor size={64} color="var(--accent-indigo)" style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '20px', color: '#fff', fontWeight: '600' }}>Interactive Remote Desktop Viewport</h3>
                <p style={{ fontSize: '14px', marginTop: '8px' }}>WebRTC DataChannel Streaming • 1080p @ 60 FPS • 12ms Latency</p>
                <div style={{ display: 'inline-flex', gap: '12px', marginTop: '20px' }}>
                  <span className="badge-online">DXGI Desktop Duplication Active</span>
                  <span className="badge-online">Win32 SendInput Engaged</span>
                </div>
              </div>

              <div style={{ position: 'absolute', bottom: '16px', right: '16px' }}>
                <button className="btn-secondary" style={{ padding: '8px' }}>
                  <Maximize2 size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Audit Logs */}
        {activeTab === 'audit' && (
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Cryptographic SHA-256 Tamper-Proof Audit Chain</h3>
              <span className="badge-online"><ShieldCheck size={14} /> CHAIN INTEGRITY VERIFIED</span>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '13px' }}>
                  <th style={{ padding: '12px' }}>TIME</th>
                  <th style={{ padding: '12px' }}>ACTOR</th>
                  <th style={{ padding: '12px' }}>ACTION EVENT</th>
                  <th style={{ padding: '12px' }}>TARGET RESOURCE</th>
                  <th style={{ padding: '12px' }}>CRYPTOGRAPHIC HASH SIGNATURE</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '13px' }}>
                    <td style={{ padding: '14px 12px', color: 'var(--text-secondary)' }}>{log.time}</td>
                    <td style={{ padding: '14px 12px', fontWeight: '600' }}>{log.actor}</td>
                    <td style={{ padding: '14px 12px' }}>
                      <span style={{ 
                        backgroundColor: 'rgba(99, 102, 241, 0.15)', 
                        color: '#A5B4FC', 
                        padding: '4px 8px', 
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px' }}>{log.resource}</td>
                    <td style={{ padding: '14px 12px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontSize: '11px' }}>
                      {log.hash.substring(0, 24)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 5: Settings & Feature Flags */}
        {activeTab === 'settings' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Dynamic Feature Flag Engine</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '600' }}>AV1 Video Codec Engine</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Next-gen high compression video streaming</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={featureFlags.av1Codec} 
                    onChange={(e) => setFeatureFlags({...featureFlags, av1Codec: e.target.checked})}
                    style={{ transform: 'scale(1.3)' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '600' }}>Bidirectional Clipboard Sync</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>10MB max anti-loopback clipboard manager</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={featureFlags.clipboardSync} 
                    onChange={(e) => setFeatureFlags({...featureFlags, clipboardSync: e.target.checked})}
                    style={{ transform: 'scale(1.3)' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '600' }}>Resumable File Transfer</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>64KB chunked Protobuf file streaming</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={featureFlags.fileTransfer} 
                    onChange={(e) => setFeatureFlags({...featureFlags, fileTransfer: e.target.checked})}
                    style={{ transform: 'scale(1.3)' }}
                  />
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Enterprise SSO & SCIM Status</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '12px', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>SAML 2.0 Identity Provider</span>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--accent-emerald)', marginTop: '4px' }}>Okta Verified (Active)</p>
                </div>

                <div style={{ padding: '12px', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>SCIM 2.0 User Provisioning</span>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--accent-cyan)', marginTop: '4px' }}>Sync Active (/api/v1/scim/v2)</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
