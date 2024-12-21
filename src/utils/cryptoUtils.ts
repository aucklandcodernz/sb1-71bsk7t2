// Cryptographic utilities for secure data handling

export const generateKeyPair = async () => {
  return await window.crypto.subtle.generateKey(
    {
      name: 'ECDSA',
      namedCurve: 'P-256',
    },
    true,
    ['sign', 'verify']
  );
};

export const exportKey = async (key: CryptoKey) => {
  const exported = await window.crypto.subtle.exportKey('jwk', key);
  return JSON.stringify(exported);
};

export const encryptData = async (data: any, key: CryptoKey) => {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(JSON.stringify(data));

  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encoded
  );

  return {
    encrypted: Array.from(new Uint8Array(encrypted)),
    iv: Array.from(iv),
  };
};

export const decryptData = async (
  encryptedData: { encrypted: number[]; iv: number[] },
  key: CryptoKey
) => {
  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: new Uint8Array(encryptedData.iv),
    },
    key,
    new Uint8Array(encryptedData.encrypted)
  );

  const decoder = new TextDecoder();
  return JSON.parse(decoder.decode(decrypted));
};

export const hashPassword = async (password: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await window.crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};