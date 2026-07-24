import 'package:flutter_test/flutter_test.dart';
import '../lib/core/storage/secure_storage.dart';
import '../lib/core/services/feature_flag_client.dart';

void main() {
  test('Secure Storage Token Save & Retrieval Roundtrip', () async {
    final storage = SecureTokenStorage();
    await storage.saveTokens(accessToken: 'access_123', refreshToken: 'refresh_456');

    final access = await storage.getAccessToken();
    final refresh = await storage.getRefreshToken();

    expect(access, equals('access_123'));
    expect(refresh, equals('refresh_456'));
  });

  test('Feature Flag Client Parsing Test', () {
    final client = FeatureFlagClient();
    client.updateFlags({
      'featureAv1Codec': true,
      'featureClipboardSync': false,
    });

    expect(client.flags.featureAv1Codec, isTrue);
    expect(client.flags.featureClipboardSync, isFalse);
  });
}
