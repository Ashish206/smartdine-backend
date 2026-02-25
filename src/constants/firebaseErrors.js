export const FIREBASE_AUTH_ERRORS = {
  // Authentication
  'auth/claims-too-large': 'Claims payload exceeds maximum size of 1000 bytes.',
  'auth/email-already-exists': 'Email address already in use.',
  'auth/id-token-expired': 'The provided Firebase ID token is expired.',
  'auth/id-token-revoked': 'The Firebase ID token has been revoked.',
  'auth/insufficient-permission': 'Insufficient permissions for Admin SDK operation.',
  'auth/invalid-argument': 'An invalid argument was provided to an Authentication method.',
  'auth/invalid-claims':
    'The custom claim attributes provided to setCustomUserClaims() are invalid.',
  'auth/invalid-creation-time': 'The creation time must be a valid UTC date string.',
  'auth/invalid-disabled-field': 'The provided value for the disabled user property is invalid.',
  'auth/invalid-display-name': 'The provided display name is invalid.',
  'auth/invalid-email-verified': 'The provided email verification status is invalid.',
  'auth/invalid-email': 'The provided email is invalid.',
  'auth/invalid-hash-algorithm':
    'The hash algorithm must match one of the strings in the list of supported algorithms.',
  'auth/invalid-hash-block-size': 'The hash block size must be a valid number.',
  'auth/invalid-hash-derived-key-length': 'The hash derived key length must be a valid number.',
  'auth/invalid-hash-key': 'The hash key must a valid byte buffer.',
  'auth/invalid-hash-memory-cost': 'The hash memory cost must be a valid number.',
  'auth/invalid-hash-parallelization': 'The hash parallelization must be a valid number.',
  'auth/invalid-hash-rounds': 'The hash rounds must be a valid number.',
  'auth/invalid-hash-salt-separator': 'Hash salt separator must be a valid byte buffer.',
  'auth/invalid-id-token': 'The provided ID token is not a valid Firebase ID token.',
  'auth/invalid-last-sign-in-time': 'The last sign-in time must be a valid UTC date string.',
  'auth/invalid-page-token': 'The provided next page token is invalid.',
  'auth/invalid-password':
    'The provided password is invalid. It must be a string with at least 6 characters.',
  'auth/invalid-password-hash': 'The password hash must be a valid byte buffer.',
  'auth/invalid-password-salt': 'The password salt must be a valid byte buffer.',
  'auth/invalid-photo-url': 'The provided photo URL is invalid.',
  'auth/invalid-provider-data': 'The providerData must be a valid array of UserInfo objects.',
  'auth/invalid-provider-id':
    'The providerId must be a valid supported provider identifier string.',
  'auth/invalid-session-cookie-duration':
    'Session cookie duration must be between 5 minutes and 2 weeks.',
  'auth/invalid-uid': 'The provided uid must be a non-empty string with at most 128 characters.',
  'auth/invalid-user-import': 'The user record to import is invalid.',
  'auth/maximum-user-count-exceeded':
    'The maximum allowed number of users to import has been exceeded.',
  'auth/missing-android-pkg-name': 'Android Package Name required for app installation.',
  'auth/missing-continue-uri': 'A valid continue URL must be provided in the request.',
  'auth/missing-hash-algorithm': 'Hashing algorithm and parameters required for user import.',
  'auth/missing-ios-bundle-id': 'The request is missing a Bundle ID.',
  'auth/missing-uid': 'A uid identifier is required for the current operation.',
  'auth/operation-not-allowed': 'Sign-in provider is disabled for this project.',
  'auth/phone-number-already-exists':
    'The provided phone number is already in use by an existing user.',
  'auth/project-not-found': 'No Firebase project found for the provided credentials.',
  'auth/reserved-claims':
    'One or more custom user claims provided to setCustomUserClaims() are reserved.',
  'auth/session-cookie-expired': 'The provided Firebase session cookie is expired.',
  'auth/session-cookie-revoked': 'The Firebase session cookie has been revoked.',
  'auth/too-many-requests': 'The number of requests exceeds the maximum allowed.',
  'auth/uid-already-exists': 'The provided uid is already in use by an existing user.',
  'auth/unauthorized-continue-uri': 'The domain of the continue URL is not whitelisted.',
  'auth/user-not-found': 'There is no user record corresponding to the provided identifier.',

  // Client-side specific errors
  'auth/popup-blocked': 'The popup was blocked by the browser.',
  'auth/popup-closed-by-user': 'The popup was closed by the user before finalizing the sign-in.',
  'auth/cancelled-popup-request': 'The popup sign-in was cancelled by the user.',
  'auth/weak-password': 'Password must have 8+ chars with uppercase, lowercase & number.',
  'auth/network-request-failed': 'Network error. Check your internet connection.',
  'auth/internal-error': 'An internal error occurred. Please try again later.',
  'auth/invalid-verification-code': 'The verification code is invalid.',
  'auth/invalid-verification-id': 'The verification ID is invalid.',
  'auth/expired-action-code': 'The action code has expired. Please request a new one.',
  'auth/invalid-action-code': 'The action code is invalid. Please check the link and try again.',
  'auth/quota-exceeded': 'The quota for this operation has been exceeded. Please try again later.',
  'auth/captcha-check-failed': 'The reCAPTCHA response is invalid. Please try again.',
  'auth/account-exists-with-different-credential':
    'Account exists with same email but different credentials.',
  'auth/credential-already-in-use': 'Credential already linked to another account.',
  'auth/requires-recent-login': 'This operation requires a recent login. Please sign in again.',
  'auth/provider-already-linked': 'The account is already linked with another provider.',
  'auth/email-already-in-use': 'The email address is already in use by another account.',
  'auth/web-storage-unsupported': 'Web storage is not supported or is disabled.',
};

// Utility function to get error message
export const getFirebaseErrorMessage = (errorCode) => {
  return FIREBASE_AUTH_ERRORS[errorCode] || 'An unexpected error occurred. Please try again.';
};
