import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  SafeAreaView, 
  StatusBar,
  Dimensions,
  Alert
} from 'react-native';

const { width } = Dimensions.get('window');

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [activeTab, setActiveTab] = useState('fleet'); // 'fleet', 'remote', 'credentials', 'audit'
  const [activeDevice, setActiveDevice] = useState(null);

  // Device Data
  const devices = [
    { id: 'dev-001', name: 'Primary Workstation', alias: 'rithvik-desktop-main', os: 'Windows 11 Pro', ip: '192.168.1.104', cpu: 14, ram: 44, latency: 12, isOnline: true },
    { id: 'dev-002', name: 'Production Build Server', alias: 'build-server-corp-02', os: 'Windows Server 2022', ip: '10.0.4.88', cpu: 4, ram: 28, latency: 18, isOnline: true },
    { id: 'dev-003', name: 'Design Studio Mac', alias: 'mac-studio-design', os: 'macOS Sonoma', ip: '192.168.1.150', cpu: 8, ram: 52, latency: 8, isOnline: true },
  ];

  const handleLaunchSession = (device) => {
    setActiveDevice(device);
    setActiveTab('remote');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0F19" />
      
      {/* Header Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>🦅</Text>
          </View>
          <View>
            <Text style={styles.appName}>FALCON MOBILE</Text>
            <Text style={styles.appSub}>ENTERPRISE v1.0</Text>
          </View>
        </View>

        <View style={styles.userBadge}>
          <View style={styles.onlineDot} />
          <Text style={styles.userText}>Rithvik K.</Text>
        </View>
      </View>

      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity 
          style={[styles.navTab, activeTab === 'fleet' && styles.navTabActive]} 
          onPress={() => setActiveTab('fleet')}
        >
          <Text style={[styles.navTabText, activeTab === 'fleet' && styles.navTabTextActive]}>💻 Fleet</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navTab, activeTab === 'remote' && styles.navTabActive]} 
          onPress={() => setActiveTab('remote')}
        >
          <Text style={[styles.navTabText, activeTab === 'remote' && styles.navTabTextActive]}>📱 Viewer</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navTab, activeTab === 'credentials' && styles.navTabActive]} 
          onPress={() => setActiveTab('credentials')}
        >
          <Text style={[styles.navTabText, activeTab === 'credentials' && styles.navTabTextActive]}>🔑 Passwords</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navTab, activeTab === 'audit' && styles.navTabActive]} 
          onPress={() => setActiveTab('audit')}
        >
          <Text style={[styles.navTabText, activeTab === 'audit' && styles.navTabTextActive]}>🛡️ Audit</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <ScrollView style={styles.content}>
        
        {/* TAB 1: FLEET DASHBOARD */}
        {activeTab === 'fleet' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Managed Unattended Fleet</Text>
            <Text style={styles.sectionDesc}>Sub-second P2P Remote Control via WebRTC DataChannel</Text>

            {devices.map((device) => (
              <View key={device.id} style={styles.deviceCard}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.deviceName}>{device.name}</Text>
                    <Text style={styles.deviceAlias}>{device.alias} • {device.os}</Text>
                  </View>
                  <View style={styles.statusBadge}>
                    <View style={styles.onlineDot} />
                    <Text style={styles.statusText}>ONLINE</Text>
                  </View>
                </View>

                <View style={styles.metricsRow}>
                  <View style={styles.metricBox}>
                    <Text style={styles.metricLabel}>CPU LOAD</Text>
                    <Text style={styles.metricVal}>{device.cpu}%</Text>
                  </View>
                  <View style={styles.metricBox}>
                    <Text style={styles.metricLabel}>RAM LOAD</Text>
                    <Text style={styles.metricVal}>{device.ram}%</Text>
                  </View>
                  <View style={styles.metricBox}>
                    <Text style={styles.metricLabel}>LATENCY</Text>
                    <Text style={[styles.metricVal, { color: '#06B6D4' }]}>{device.latency}ms</Text>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.connectBtn} 
                  onPress={() => handleLaunchSession(device)}
                >
                  <Text style={styles.connectBtnText}>⚡ Launch Remote Control</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* TAB 2: LIVE REMOTE VIEWPORT */}
        {activeTab === 'remote' && (
          <View style={styles.tabContent}>
            <View style={styles.sessionHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.onlineDot} />
                <Text style={styles.sessionTitle}>
                  {activeDevice ? activeDevice.name : 'Primary Workstation'}
                </Text>
              </View>
              <Text style={styles.sessionMeta}>1080p @ 60 FPS • AES-256-GCM</Text>
            </View>

            {/* Remote Desktop Canvas Frame */}
            <View style={styles.viewportCanvas}>
              <Text style={styles.viewportIcon}>🖥️</Text>
              <Text style={styles.viewportText}>Live Mobile WebRTC Touch Viewport</Text>
              <Text style={styles.viewportSub}>
                Direct Touch & Gesture Ingestion -> DXGI Frame Pipeline Active
              </Text>
            </View>

            {/* Controls Bar */}
            <View style={styles.controlsRow}>
              <TouchableOpacity style={styles.controlBtn} onPress={() => Alert.alert('Clipboard', 'Clipboard Synced!')}>
                <Text style={styles.controlBtnText}>📋 Clipboard</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.controlBtn} onPress={() => Alert.alert('Keyboard', 'Virtual Keyboard Opened')}>
                <Text style={styles.controlBtnText}>⌨️ Keyboard</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.controlBtn, { backgroundColor: '#EF4444' }]} onPress={() => setActiveTab('fleet')}>
                <Text style={[styles.controlBtnText, { color: '#FFF' }]}>🔴 End</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* TAB 3: PERMANENT CREDENTIALS */}
        {activeTab === 'credentials' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Permanent Access Credentials</Text>
            <Text style={styles.sectionDesc}>Permanent Device Code & Custom Password (No Temporary Passwords)</Text>

            <View style={styles.credCard}>
              <Text style={styles.credLabel}>PERMANENT DEVICE ID</Text>
              <Text style={styles.credValueId}>849 204 192</Text>

              <View style={styles.divider} />

              <Text style={styles.credLabel}>PERMANENT ALIAS</Text>
              <Text style={styles.credValue}>rithvik-desktop-main</Text>

              <View style={styles.divider} />

              <Text style={styles.credLabel}>PERMANENT UNATTENDED PASSWORD</Text>
              <Text style={styles.credValuePass}>Falcon#Secure2026!</Text>

              <View style={styles.unattendedBanner}>
                <View style={styles.onlineDot} />
                <Text style={styles.unattendedText}>24/7 Unattended Remote Service Active</Text>
              </View>
            </View>
          </View>
        )}

        {/* TAB 4: AUDIT LOGS */}
        {activeTab === 'audit' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Cryptographic Audit Trail</Text>
            <Text style={styles.sectionDesc}>SHA-256 Tamper-Proof Hash-Chained Log History</Text>

            <View style={styles.auditCard}>
              <Text style={styles.auditHeader}>Verified Audit Chain</Text>

              <View style={styles.auditItem}>
                <Text style={styles.auditTime}>10:45:12 AM</Text>
                <Text style={styles.auditEvent}>SESSION_STARTED • Primary Workstation</Text>
                <Text style={styles.auditHash}>e3b0c44298fc1c149afbf4c8996fb92427ae41e...</Text>
              </View>

              <View style={styles.auditItem}>
                <Text style={styles.auditTime}>10:12:00 AM</Text>
                <Text style={styles.auditEvent}>HEARTBEAT_ACK • Production Build Server</Text>
                <Text style={styles.auditHash}>8f434346648f6b96df89dda901c5176b10a6d8...</Text>
              </View>
            </View>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  header: {
    height: 60,
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 20,
  },
  appName: {
    color: '#F8FAFC',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: -0.3,
  },
  appSub: {
    color: '#06B6D4',
    fontWeight: '600',
    fontSize: 10,
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  userText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '600',
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 4,
  },
  navTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  navTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#6366F1',
  },
  navTabText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  navTabTextActive: {
    color: '#A5B4FC',
    fontWeight: '700',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  tabContent: {
    gap: 16,
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
  },
  sectionDesc: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 8,
  },
  deviceCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  deviceName: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  deviceAlias: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    color: '#34D399',
    fontSize: 10,
    fontWeight: '700',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    padding: 10,
    borderRadius: 10,
  },
  metricBox: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '700',
  },
  metricVal: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  connectBtn: {
    backgroundColor: '#6366F1',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  connectBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 10,
  },
  sessionTitle: {
    color: '#34D399',
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 6,
  },
  sessionMeta: {
    color: '#94A3B8',
    fontSize: 10,
  },
  viewportCanvas: {
    height: 320,
    backgroundColor: '#000',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 8,
  },
  viewportIcon: {
    fontSize: 48,
  },
  viewportText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  viewportSub: {
    color: '#94A3B8',
    fontSize: 11,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  controlBtn: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  controlBtnText: {
    color: '#F8FAFC',
    fontWeight: '600',
    fontSize: 12,
  },
  credCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  credLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
  },
  credValueId: {
    color: '#60A5FA',
    fontSize: 24,
    fontWeight: '700',
  },
  credValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  credValuePass: {
    color: '#34D399',
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 4,
  },
  unattendedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  unattendedText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '600',
  },
  auditCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  auditHeader: {
    color: '#34D399',
    fontSize: 14,
    fontWeight: '700',
  },
  auditItem: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    paddingBottom: 8,
    gap: 2,
  },
  auditTime: {
    color: '#94A3B8',
    fontSize: 10,
  },
  auditEvent: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '600',
  },
  auditHash: {
    color: '#06B6D4',
    fontSize: 10,
  },
});
