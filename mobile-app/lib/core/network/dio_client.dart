import '../storage/secure_storage.dart';

class ApiClient {
  final SecureTokenStorage _tokenStorage;
  final String baseUrl;

  ApiClient({required this.baseUrl, SecureTokenStorage? tokenStorage})
      : _tokenStorage = tokenStorage ?? SecureTokenStorage();

  Future<Map<String, String>> getAuthHeaders() async {
    final token = await _tokenStorage.getAccessToken();
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }
}
