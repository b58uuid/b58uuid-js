/**
 * Base58 encoding and decoding for b58uuid
 * Uses the Bitcoin Base58 alphabet
 * Always produces exactly 22 characters for 16-byte UUIDs
 */

const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

// Create reverse lookup table
const REVERSE_ALPHABET = new Uint8Array(256);
REVERSE_ALPHABET.fill(255);
for (let i = 0; i < ALPHABET.length; i++) {
  REVERSE_ALPHABET[ALPHABET.charCodeAt(i)] = i;
}

// Precomputed constants
const BASE58 = 58n;
const MAX_UUID = 0xffffffffffffffffffffffffffffffffn; // 2^128 - 1

/**
 * Encodes a 16-byte UUID to a Base58 string
 * Always returns exactly 22 characters
 * @param data The 16-byte UUID
 * @returns The Base58-encoded string (exactly 22 characters)
 */
export function encode(data: Buffer | Uint8Array): string {
  if (data.length !== 16) {
    throw new Error(`Input must be exactly 16 bytes, got ${data.length}`);
  }

  const bytes = new Uint8Array(data);
  
  // Convert bytes to BigInt
  let num = 0n;
  for (let i = 0; i < 16; i++) {
    num = (num << 8n) | BigInt(bytes[i]);
  }

  // Convert to base58
  const result: number[] = [];
  while (num > 0n) {
    result.push(Number(num % BASE58));
    num = num / BASE58;
  }

  // Reverse the result
  result.reverse();

  // Pad with leading '1' to ensure exactly 22 characters
  while (result.length < 22) {
    result.unshift(0);
  }

  // Convert to string
  return result.map(i => ALPHABET[i]).join('');
}

/**
 * Decodes a Base58 string to a 16-byte UUID
 * @param b58 The Base58-encoded string
 * @returns The 16-byte UUID
 * @throws Error if the string contains invalid characters, is empty, or overflows
 */
export function decode(b58: string): Buffer {
  if (!b58 || b58.length === 0) {
    throw new Error('Empty or invalid Base58 string');
  }

  // Validate length - should be exactly 22 characters for 16-byte UUID
  if (b58.length !== 22) {
    throw new Error(`Invalid Base58 length: expected 22, got ${b58.length}`);
  }

  let num = 0n;
  
  // Convert Base58 to BigInt with overflow checking
  for (let i = 0; i < b58.length; i++) {
    const charCode = b58.charCodeAt(i);
    if (charCode > 255) {
      throw new Error(`Invalid character at position ${i}: ${b58[i]}`);
    }

    const digit = REVERSE_ALPHABET[charCode];
    if (digit === 255) {
      throw new Error(`Invalid Base58 character at position ${i}: ${b58[i]}`);
    }

    num = num * BASE58 + BigInt(digit);
    
    // Check for overflow
    if (num > MAX_UUID) {
      throw new Error('Overflow: value exceeds maximum UUID value');
    }
  }

  // Convert BigInt to bytes
  const bytes: number[] = [];
  for (let i = 0; i < 16; i++) {
    bytes.unshift(Number(num & 0xFFn));
    num = num >> 8n;
  }

  return Buffer.from(bytes);
}

