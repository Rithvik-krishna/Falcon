import 'package:flutter/material.dart';
import '../../widgets/device_card.dart';

class DeviceListScreen extends StatelessWidget {
  const DeviceListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Falcon Devices'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {},
          ),
        ],
      ),
      body: ListView(
        children: [
          DeviceCard(
            deviceName: 'Workstation Desktop',
            hostname: 'FALCON-WIN11-PRO',
            platform: 'Windows 11 (64-bit)',
            isOnline: true,
            cpuUsage: 12.4,
            ramUsage: 42.1,
            onTap: () {
              // Connect to remote session
            },
          ),
          DeviceCard(
            deviceName: 'Home Server PC',
            hostname: 'FALCON-SERVER',
            platform: 'Windows 10 Pro',
            isOnline: false,
            cpuUsage: 0.0,
            ramUsage: 0.0,
            onTap: () {},
          ),
        ],
      ),
    );
  }
}
