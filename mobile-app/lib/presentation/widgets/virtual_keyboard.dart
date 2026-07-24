import 'package:flutter/material.dart';

class VirtualKeybar extends StatelessWidget {
  final Function(String key) onKeyPressed;

  const VirtualKeybar({super.key, required this.onKeyPressed});

  @override
  Widget build(BuildContext context) {
    final keys = ['Ctrl', 'Alt', 'Shift', 'Tab', 'Esc', 'Win', 'F5', 'Del'];

    return Container(
      height: 48,
      color: Colors.black.withOpacity(0.8),
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: keys.length,
        itemBuilder: (context, index) {
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 6),
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.grey[800],
                padding: const EdgeInsets.symmetric(horizontal: 12),
              ),
              onPressed: () => onKeyPressed(keys[index]),
              child: Text(keys[index], style: const TextStyle(fontSize: 12, color: Colors.white)),
            ),
          );
        },
      ),
    );
  }
}
