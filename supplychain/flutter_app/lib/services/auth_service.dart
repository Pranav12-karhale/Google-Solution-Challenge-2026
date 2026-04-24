import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:flutter/foundation.dart' show kIsWeb;

/// Centralized authentication service wrapping Firebase Auth.
/// Handles Google OAuth, GitHub OAuth, and email/password flows.
class AuthService {
  static final FirebaseAuth _auth = FirebaseAuth.instance;

  // Google Sign-In instance (web scopes)
  static final GoogleSignIn _googleSignIn = GoogleSignIn(
    scopes: ['email', 'profile'],
  );

  /// Current user (null if signed out)
  static User? get currentUser => _auth.currentUser;

  /// Stream of auth state changes — fires on sign-in, sign-out, and app start
  static Stream<User?> get authStateChanges => _auth.authStateChanges();

  /// Get the current user's ID token for API authorization
  static Future<String?> getIdToken() async {
    return await _auth.currentUser?.getIdToken();
  }

  // ──────────────────────────────────────────────────────────────
  // Google Sign-In
  // ──────────────────────────────────────────────────────────────

  static Future<UserCredential> signInWithGoogle() async {
    if (kIsWeb) {
      // Web: use popup flow
      final GoogleAuthProvider googleProvider = GoogleAuthProvider();
      googleProvider.addScope('email');
      googleProvider.addScope('profile');
      return await _auth.signInWithPopup(googleProvider);
    } else {
      // Mobile: use native Google Sign-In
      final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
      if (googleUser == null) {
        throw Exception('Google sign-in was cancelled');
      }

      final GoogleSignInAuthentication googleAuth =
          await googleUser.authentication;

      final credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      return await _auth.signInWithCredential(credential);
    }
  }

  // ──────────────────────────────────────────────────────────────
  // GitHub Sign-In (Web popup flow)
  // ──────────────────────────────────────────────────────────────

  static Future<UserCredential> signInWithGitHub() async {
    final GithubAuthProvider githubProvider = GithubAuthProvider();
    githubProvider.addScope('read:user');
    githubProvider.addScope('user:email');

    if (kIsWeb) {
      return await _auth.signInWithPopup(githubProvider);
    } else {
      return await _auth.signInWithProvider(githubProvider);
    }
  }

  // ──────────────────────────────────────────────────────────────
  // Email / Password Sign-In
  // ──────────────────────────────────────────────────────────────

  static Future<UserCredential> signInWithEmail(
    String email,
    String password,
  ) async {
    return await _auth.signInWithEmailAndPassword(
      email: email,
      password: password,
    );
  }

  // ──────────────────────────────────────────────────────────────
  // Email / Password Sign-Up
  // ──────────────────────────────────────────────────────────────

  static Future<UserCredential> signUpWithEmail(
    String email,
    String password,
    String displayName,
  ) async {
    final credential = await _auth.createUserWithEmailAndPassword(
      email: email,
      password: password,
    );

    // Update profile with display name
    await credential.user?.updateDisplayName(displayName);
    await credential.user?.reload();

    return credential;
  }

  // ──────────────────────────────────────────────────────────────
  // Password Reset
  // ──────────────────────────────────────────────────────────────

  static Future<void> sendPasswordReset(String email) async {
    await _auth.sendPasswordResetEmail(email: email);
  }

  // ──────────────────────────────────────────────────────────────
  // Sign Out
  // ──────────────────────────────────────────────────────────────

  static Future<void> signOut() async {
    await Future.wait([
      _auth.signOut(),
      _googleSignIn.signOut(),
    ]);
  }

  /// Convert Firebase auth errors to user-friendly messages
  static String getErrorMessage(dynamic error) {
    if (error is FirebaseAuthException) {
      switch (error.code) {
        case 'user-not-found':
          return 'No account found with this email.';
        case 'wrong-password':
          return 'Incorrect password. Please try again.';
        case 'email-already-in-use':
          return 'An account already exists with this email.';
        case 'invalid-email':
          return 'Please enter a valid email address.';
        case 'weak-password':
          return 'Password must be at least 6 characters.';
        case 'too-many-requests':
          return 'Too many attempts. Please try again later.';
        case 'user-disabled':
          return 'This account has been disabled.';
        case 'operation-not-allowed':
          return 'This sign-in method is not enabled.';
        case 'account-exists-with-different-credential':
          return 'An account already exists with a different sign-in method.';
        case 'popup-closed-by-user':
          return 'Sign-in popup was closed. Please try again.';
        case 'cancelled-popup-request':
          return 'Sign-in was cancelled.';
        default:
          return error.message ?? 'An authentication error occurred.';
      }
    }
    return error.toString().replaceFirst('Exception: ', '');
  }
}
