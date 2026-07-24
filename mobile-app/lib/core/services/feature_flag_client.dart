class MobileFeatureFlags {
  final bool featureAv1Codec;
  final bool featureClipboardSync;
  final bool featureFileTransfer;
  final bool featureWakeOnLan;

  const MobileFeatureFlags({
    this.featureAv1Codec = true,
    this.featureClipboardSync = true,
    this.featureFileTransfer = true,
    this.featureWakeOnLan = true,
  });

  factory MobileFeatureFlags.fromJson(Map<String, dynamic> json) {
    return MobileFeatureFlags(
      featureAv1Codec: json['featureAv1Codec'] ?? true,
      featureClipboardSync: json['featureClipboardSync'] ?? true,
      featureFileTransfer: json['featureFileTransfer'] ?? true,
      featureWakeOnLan: json['featureWakeOnLan'] ?? true,
    );
  }
}

class FeatureFlagClient {
  MobileFeatureFlags _flags = const MobileFeatureFlags();

  MobileFeatureFlags get flags => _flags;

  void updateFlags(Map<String, dynamic> json) {
    _flags = MobileFeatureFlags.fromJson(json);
  }
}
