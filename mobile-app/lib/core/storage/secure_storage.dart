class SecureTokenStorage {
  static const String _accessTokenKey = 'falcon_access_token';
  static const String _refreshTokenKey = 'falcon_refresh_token';

  final Map<String, String> _mockMemoryVault = {};

  Future<void> saveTokens({required String accessToken, required String refreshToken}) async {
    _mockMemoryVault[_accessTokenKey] = accessToken;
    _mockMemoryVault[_refreshTokenKey] = refreshToken;
  }

  Future<String?> getAccessToken() async {
    return _mockMemoryVault[_accessTokenKey];
  }

  Future<String?> getRefreshToken() async {
    return _mockMemoryVault[_refreshTokenKey];
  }

  Future<void> clearTokens() async {
    _mockMemoryVault.remove(_accessTokenKey);
    _mockMemoryVault.remove(_refreshTokenKey);
  }
}
