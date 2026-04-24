import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../services/auth_service.dart';

/// Provides authentication state to the entire widget tree.
/// Listens to Firebase auth state changes for automatic session restoration.
class AuthProvider extends ChangeNotifier {
  User? _user;
  bool _isLoading = true;
  String? _error;

  AuthProvider() {
    // Listen to auth state — fires immediately with current user (or null)
    AuthService.authStateChanges.listen((User? user) {
      _user = user;
      _isLoading = false;
      _error = null;
      notifyListeners();
    });
  }

  // ── Getters ───────────────────────────────────────────────────

  User? get user => _user;
  bool get isAuthenticated => _user != null;
  bool get isLoading => _isLoading;
  String? get error => _error;

  String get displayName =>
      _user?.displayName ?? _user?.email?.split('@').first ?? 'User';

  String? get email => _user?.email;
  String? get photoUrl => _user?.photoURL;

  // ── Auth Methods ──────────────────────────────────────────────

  Future<bool> signInWithGoogle() async {
    _setLoading(true);
    try {
      await AuthService.signInWithGoogle();
      _error = null;
      return true;
    } catch (e) {
      _error = AuthService.getErrorMessage(e);
      return false;
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> signInWithGitHub() async {
    _setLoading(true);
    try {
      await AuthService.signInWithGitHub();
      _error = null;
      return true;
    } catch (e) {
      _error = AuthService.getErrorMessage(e);
      return false;
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> signInWithEmail(String email, String password) async {
    _setLoading(true);
    try {
      await AuthService.signInWithEmail(email, password);
      _error = null;
      return true;
    } catch (e) {
      _error = AuthService.getErrorMessage(e);
      return false;
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> signUpWithEmail(
    String email,
    String password,
    String displayName,
  ) async {
    _setLoading(true);
    try {
      await AuthService.signUpWithEmail(email, password, displayName);
      _error = null;
      return true;
    } catch (e) {
      _error = AuthService.getErrorMessage(e);
      return false;
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> sendPasswordReset(String email) async {
    _setLoading(true);
    try {
      await AuthService.sendPasswordReset(email);
      _error = null;
      return true;
    } catch (e) {
      _error = AuthService.getErrorMessage(e);
      return false;
    } finally {
      _setLoading(false);
    }
  }

  Future<void> signOut() async {
    _setLoading(true);
    try {
      await AuthService.signOut();
      _error = null;
    } catch (e) {
      _error = AuthService.getErrorMessage(e);
    } finally {
      _setLoading(false);
    }
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }

  void _setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }
}
