import 'package:flutter/material.dart';

class DeviceCard extends StatelessWidget {
  final String deviceName;
  final String hostname;
  final String platform;
  final bool isOnline;
  final double cpuUsage;
  final double ramUsage;
  final VoidCallback onTap;

  const DeviceCard({
    super.key,
    required this.deviceName,
    required this.hostname,
    required this.platform,
    required this.isOnline,
    required this.cpuUsage,
    required this.ramUsage,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: ListTile(
        onTap: onTap,
        leading: Icon(
          isOnline ? Icons.desktop_windows : Icons.desktop_access_disabled,
          color: isOnline ? Colors.green : Colors.grey,
          size: 32,
        ),
        title: Text(
          deviceName,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Text('$hostname • $platform\nCPU: ${cpuUsage.toStringAsFixed(1)}% | RAM: ${ramUsage.toStringAsFixed(1)}%'),
        trailing: Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          decoration: BoxDecoration(
            color: isOnline ? Colors.green.withOpacity(0.2) : Colors.red.withOpacity(0.2),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Text(
            isOnline ? 'ONLINE' : 'OFFLINE',
            style: TextStyle(
              color: isOnline ? Colors.green : Colors.red,
              fontWeight: FontWeight.bold,
              fontSize: 12,
            ),
          ),
        ),
      ),
    );
  }
}
