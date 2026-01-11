/**
 * b58uuid - High-performance Base58-encoded UUID library
 * Provides concise, unambiguous, and URL-safe UUIDs with zero dependencies
 */

import { randomBytes } from 'crypto';
import { encode as base58Encode, decode as base58Decode } from './base58';

// Custom error types
export class B58UUIDError extends Error {
  constructor(message: string, public readonly originalError?: Error) {
    super(message);
    this.name = 'B58UUIDError';
    if (originalError) {
      this.stack = originalError.stack;
    }
  }
}

export class InvalidUUIDError extends B58UUIDError {
  constructor(uuidStr: string, originalError?: Error) {
    super(`Invalid UUID format: ${uuidStr}`, originalError);
    this.name = 'InvalidUUIDError';
  }
}

export class InvalidB58Error extends B58UUIDError {
  constructor(b58Str: string, originalError?: Error) {
    super(`Invalid Base58 format: ${b58Str}`, originalError);
    this.name = 'InvalidB58Error';
  }
}

/**
 * Generates a random UUID v4
 */
function generateUUIDv4(): Uint8Array {
  const bytes = randomBytes(16);
  
  // Set version 4 (bits 12-15 of time_hi_and_version)
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  
  // Set variant (bits 6-7 of clock_seq_hi_and_reserved)
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  
  return new Uint8Array(bytes);
}

/**
 * Manual UUID parser that handles all edge cases
 */
function parseUUID(uuidStr: string): Uint8Array {
  try {
    // Remove hyphens and convert to lowercase
    const cleanUUID = uuidStr.replace(/-/g, '').toLowerCase();
    
    if (cleanUUID.length !== 32) {
      throw new Error(`Invalid UUID length: expected 32 hex characters, got ${cleanUUID.length}`);
    }
    
    // Check if valid hex
    if (!/^[0-9a-f]{32}$/.test(cleanUUID)) {
      throw new Error('Invalid UUID format: must contain only hexadecimal characters');
    }
    
    // Convert hex string to bytes
    const bytes = new Uint8Array(16);
    for (let i = 0; i < 16; i++) {
      const hexByte = cleanUUID.substring(i * 2, i * 2 + 2);
      const byteValue = parseInt(hexByte, 16);
      if (isNaN(byteValue)) {
        throw new Error(`Invalid hex byte at position ${i}: ${hexByte}`);
      }
      bytes[i] = byteValue;
    }
    
    return bytes;
  } catch (error) {
    if (error instanceof Error) {
      throw error; // Preserve original error
    }
    throw new Error('Unknown error during UUID parsing');
  }
}

/**
 * Manual UUID stringifier that handles all edge cases
 */
function stringifyUUID(bytes: Uint8Array, includeHyphens: boolean = true): string {
  try {
    if (!bytes || bytes.length !== 16) {
      throw new Error(`Invalid bytes array: expected 16 bytes, got ${bytes?.length || 0}`);
    }
    
    // Convert bytes to hex string
    const hex = Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    if (includeHyphens) {
      return `${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20)}`;
    }
    
    return hex;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error during UUID stringification');
  }
}

/**
 * Encodes a standard UUID string to a Base58-encoded string
 * @param uuidStr The UUID string (with or without hyphens)
 * @returns The Base58-encoded string
 * @throws InvalidUUIDError if the UUID format is invalid
 */
export function encode(uuidStr: string): string {
  try {
    const bytes = parseUUID(uuidStr);
    return base58Encode(bytes);
  } catch (error) {
    if (error instanceof InvalidUUIDError) {
      throw error;
    }
    if (error instanceof Error) {
      throw new InvalidUUIDError(uuidStr, error);
    }
    throw new InvalidUUIDError(uuidStr);
  }
}

/**
 * Decodes a Base58-encoded string back to a standard UUID string
 * @param b58 The Base58-encoded string
 * @returns The UUID string in canonical format (with hyphens)
 * @throws InvalidB58Error if the Base58 string is invalid
 */
export function decode(b58: string): string {
  try {
    const buffer = base58Decode(b58);
    // Convert Buffer to Uint8Array for stringifyUUID
    const bytes = new Uint8Array(buffer);
    return stringifyUUID(bytes, true);
  } catch (error) {
    if (error instanceof InvalidB58Error) {
      throw error;
    }
    if (error instanceof Error) {
      // Check if it's an overflow error
      if (error.message.toLowerCase().includes('overflow')) {
        throw new InvalidB58Error(b58, error);
      }
      throw new InvalidB58Error(b58, error);
    }
    throw new InvalidB58Error(b58);
  }
}

/**
 * Generates a new random UUID and returns its Base58-encoded representation
 * @returns The Base58-encoded UUID
 */
export function generate(): string {
  const bytes = generateUUIDv4();
  return base58Encode(bytes);
}

/**
 * Alias for generate()
 */
export function new_(): string {
  return generate();
}

export { encode as mustEncode, decode as mustDecode };
export default { encode, decode, generate };
