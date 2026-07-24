import 'package:flutter/material.dart';
import 'core/theme/app_theme.dart';

void main() {
  runApp(const FalconMobileApp());
}

class FalconMobileApp extends StatelessWidget {
  const FalconMobileApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Falcon Remote',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: const Scaffold(
        body: Center(
          child: Text('Falcon Remote Desktop Mobile Engine'),
        ),
      ),
    );
  }
}
