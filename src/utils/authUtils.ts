import { User } from '../types';
import { generateKeyPair, exportKey } from './cryptoUtils';

export const AUTH_CONSTANTS = {
  TOKEN_KEY: 'auth_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
};

export const initializeAuth = async () => {
  // Generate key pair for 2FA
  const keyPair = await generateKeyPair();
  const publicKey = await exportKey(keyPair.publicKey);
  return { publicKey };
};

export const validatePassword = (password: string): boolean => {
  // NZ privacy requirements for password strength
  const minLength = 12;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChar
  );
};

export const generate2FASecret = async (user: User) => {
  // Generate TOTP secret
  const secret = await crypto.subtle.generateKey(
    {
      name: 'HMAC',
      hash: { name: 'SHA-256' },
    },
    true,
    ['sign', 'verify']
  );

  return secret;
};

export const validate2FAToken = async (token: string, secret: CryptoKey) => {
  // Validate TOTP token
  // Implementation would go here
  return true;
};

export const createAuditLog = (
  user: User,
  action: string,
  resource: string,
  success: boolean,
  details?: string
) => {
  return {
    userId: user.id,
    action,
    resource,
    timestamp: new Date().toISOString(),
    success,
    details,
    ipAddress: window.clientInformation?.userAgent || 'unknown',
  };
};