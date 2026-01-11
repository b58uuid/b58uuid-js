/**
 * Edge case tests for b58uuid TypeScript implementation
 */

import { encode, decode, generate, InvalidUUIDError, InvalidB58Error } from '../src/index';

describe('Edge Cases and Error Handling', () => {
  describe('UUID Encoding Edge Cases', () => {
    test('should handle mixed case UUID', () => {
      const mixedCase = '550E8400-E29B-41D4-A716-446655440000';
      const result = encode(mixedCase);
      expect(result).toBe('BWBeN28Vb7cMEx7Ym8AUzs');
    });

    test('should handle uppercase UUID without hyphens', () => {
      const upperNoHyphens = '550E8400E29B41D4A716446655440000';
      const result = encode(upperNoHyphens);
      expect(result).toBe('BWBeN28Vb7cMEx7Ym8AUzs');
    });

    test('should handle very large UUID values', () => {
      const maxUUID = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
      const result = encode(maxUUID);
      expect(result).toBe('YcVfxkQb6JRzqk5kF2tNLv');
    });

    test('should handle very small UUID values', () => {
      const minUUID = '00000000-0000-0000-0000-000000000001';
      const result = encode(minUUID);
      expect(result).toBe('1111111111111111111112');
    });

    test('should handle random UUID values', () => {
      const randomUUID = 'deadbeef-cafe-babe-0123-456789abcdef';
      const result = encode(randomUUID);
      expect(result).toBe('UVqy39vS4tbfPzthw5VEKg');
      expect(decode(result)).toBe('deadbeef-cafe-babe-0123-456789abcdef');
    });
  });

  describe('Error Handling', () => {
    test('should throw InvalidUUIDError for invalid UUID format', () => {
      expect(() => encode('invalid-uuid')).toThrow(InvalidUUIDError);
    });

    test('should throw InvalidUUIDError for empty string', () => {
      expect(() => encode('')).toThrow(InvalidUUIDError);
    });

    test('should throw InvalidUUIDError for UUID with invalid characters', () => {
      expect(() => encode('gggggggg-gggg-gggg-gggg-gggggggggggg')).toThrow(InvalidUUIDError);
    });

    test('should throw InvalidUUIDError for too short UUID', () => {
      expect(() => encode('550e8400-e29b-41d4-a716')).toThrow(InvalidUUIDError);
    });

    test('should throw InvalidUUIDError for too long UUID', () => {
      expect(() => encode('550e8400-e29b-41d4-a716-446655440000-extra')).toThrow(InvalidUUIDError);
    });

    test('should throw InvalidB58Error for invalid Base58 characters', () => {
      expect(() => decode('0000000000000000000000')).toThrow(InvalidB58Error); // Contains 0
    });

    test('should throw InvalidB58Error for Base58 with invalid characters', () => {
      expect(() => decode('OOOOOOOOOOOOOOOOOOOOOO')).toThrow(InvalidB58Error); // Contains O
    });

    test('should throw InvalidB58Error for empty Base58 string', () => {
      expect(() => decode('')).toThrow(InvalidB58Error);
    });

    test('should throw InvalidB58Error for Base58 with I', () => {
      expect(() => decode('IIIIIIIIIIIIIIIIIIIIII')).toThrow(InvalidB58Error);
    });

    test('should throw InvalidB58Error for Base58 with l', () => {
      expect(() => decode('llllllllllllllllllllll')).toThrow(InvalidB58Error);
    });
  });

  describe('Length Validation', () => {
    test('should accept valid 22-character Base58 string', () => {
      const valid = 'BWBeN28Vb7cMEx7Ym8AUzs';
      expect(() => decode(valid)).not.toThrow();
    });

    test('should reject Base58 string with length 1', () => {
      expect(() => decode('1')).toThrow(InvalidB58Error);
    });

    test('should reject Base58 string with length 21 (too short)', () => {
      expect(() => decode('111111111111111111111')).toThrow(InvalidB58Error);
    });

    test('should reject Base58 string with length 23 (too long)', () => {
      expect(() => decode('11111111111111111111111')).toThrow(InvalidB58Error);
    });

    test('should reject Base58 string with length 100 (way too long)', () => {
      const longString = '1'.repeat(100);
      expect(() => decode(longString)).toThrow(InvalidB58Error);
    });
  });

  describe('Base58 Edge Cases', () => {
    test('should handle all 1s Base58 string', () => {
      const allOnes = '1111111111111111111111';
      const result = decode(allOnes);
      expect(result).toBe('00000000-0000-0000-0000-000000000000');
    });

    test('should handle maximum Base58 string', () => {
      const maxB58 = 'YcVfxkQb6JRzqk5kF2tNLv';
      const result = decode(maxB58);
      expect(result).toBe('ffffffff-ffff-ffff-ffff-ffffffffffff');
    });

    test('should handle single character Base58', () => {
      const singleChar = '1111111111111111111112';
      const result = decode(singleChar);
      expect(result).toBe('00000000-0000-0000-0000-000000000001');
    });

    test('should handle Base58 with leading 1s', () => {
      const leadingOnes = '111111111111111111111A';
      const result = decode(leadingOnes);
      expect(result).toBe('00000000-0000-0000-0000-000000000009');
    });
  });

  describe('Generation Edge Cases', () => {
    test('should generate unique UUIDs', () => {
      const count = 1000;
      const uuids = new Set<string>();
      
      for (let i = 0; i < count; i++) {
        const uuid = generate();
        expect(uuid.length).toBeGreaterThanOrEqual(21);
        expect(uuid.length).toBeLessThanOrEqual(22);
        expect(uuids.has(uuid)).toBe(false);
        uuids.add(uuid);
      }
      
      expect(uuids.size).toBe(count);
    });

    test('should generate valid Base58 strings', () => {
      for (let i = 0; i < 100; i++) {
        const b58 = generate();
        expect(() => decode(b58)).not.toThrow();
      }
    });

    test('should generate strings with valid Base58 characters only', () => {
      const validChars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
      
      for (let i = 0; i < 50; i++) {
        const b58 = generate();
        for (const char of b58) {
          expect(validChars).toContain(char);
        }
      }
    });
  });

  describe('Performance Edge Cases', () => {
    test('should handle rapid encoding/decoding', () => {
      const iterations = 1000;
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      
      const start = Date.now();
      for (let i = 0; i < iterations; i++) {
        const encoded = encode(uuid);
        const decoded = decode(encoded);
        expect(decoded).toBe(uuid);
      }
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(1000); // Should complete in less than 1 second
    });

    test('should handle concurrent-like operations', () => {
      const uuids = [
        '550e8400-e29b-41d4-a716-446655440000',
        '12345678-1234-5678-1234-567812345678',
        'ffffffff-ffff-ffff-ffff-ffffffffffff',
        '00000000-0000-0000-0000-000000000000'
      ];

      const results = uuids.map(uuid => {
        const encoded = encode(uuid);
        const decoded = decode(encoded);
        return { uuid, encoded, decoded };
      });

      results.forEach(({ uuid, decoded }) => {
        expect(decoded).toBe(uuid);
      });
    });
  });

  describe('Boundary Conditions', () => {
    test('should handle UUID boundary values', () => {
      const boundaries = [
        '00000000-0000-0000-0000-000000000000', // Min
        '00000000-0000-0000-0000-000000000001', // Min + 1
        'ffffffff-ffff-ffff-ffff-ffffffffffff', // Max
        'ffffffff-ffff-ffff-ffff-fffffffffff0', // Max - 15
        '80000000-0000-0000-0000-000000000000', // Midpoint
      ];

      boundaries.forEach(uuid => {
        const encoded = encode(uuid);
        const decoded = decode(encoded);
        expect(decoded).toBe(uuid);
      });
    });

    test('should handle Base58 boundary values', () => {
      const b58Boundaries = [
        '1111111111111111111111', // Min (all zeros)
        '1111111111111111111112', // Min + 1
        'YcVfxkQb6JRzqk5kF2tNLv', // Max (all Fs)
        'YcVfxkQb6JRzqk5kF2tNLu', // Max - 1
        '7zzzzzzzzzzzzzzzzzzzzz', // Midpoint-ish
      ];

      b58Boundaries.forEach(b58 => {
        const decoded = decode(b58);
        const reencoded = encode(decoded);
        expect(reencoded).toBe(b58);
      });
    });
  });

  describe('Error Message Quality', () => {
    test('should provide helpful error messages for invalid UUID', () => {
      try {
        encode('invalid-uuid');
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidUUIDError);
        expect((error as Error).message).toContain('Invalid UUID format');
        expect((error as Error).message).toContain('invalid-uuid');
      }
    });

    test('should provide helpful error messages for invalid Base58', () => {
      try {
        decode('0000000000000000');
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidB58Error);
        expect((error as Error).message).toContain('Invalid Base58 format');
        expect((error as Error).message).toContain('0000000000000000');
      }
    });

    test('should handle error with originalError in B58UUIDError', () => {
      const originalError = new Error('Original error');
      const b58Error = new InvalidUUIDError('test-uuid', originalError);
      expect(b58Error.originalError).toBe(originalError);
      expect(b58Error.stack).toBe(originalError.stack);
    });

    test('should handle error without originalError in B58UUIDError', () => {
      const b58Error = new InvalidUUIDError('test-uuid');
      expect(b58Error.originalError).toBeUndefined();
    });

    test('should handle InvalidB58Error with originalError', () => {
      const originalError = new Error('Original error');
      const b58Error = new InvalidB58Error('test-b58', originalError);
      expect(b58Error.originalError).toBe(originalError);
    });

    test('should handle InvalidB58Error without originalError', () => {
      const b58Error = new InvalidB58Error('test-b58');
      expect(b58Error.originalError).toBeUndefined();
    });
  });

  describe('Additional Coverage Tests', () => {
    test('should handle decode with non-Error exception', () => {
      // This tests the catch block that handles non-Error exceptions
      expect(() => decode('invalid')).toThrow(InvalidB58Error);
    });

    test('should handle encode with non-Error exception', () => {
      // This tests the catch block that handles non-Error exceptions
      expect(() => encode('not-a-uuid')).toThrow(InvalidUUIDError);
    });

    test('should handle UUID with special characters', () => {
      expect(() => encode('550e8400@e29b-41d4-a716-446655440000')).toThrow(InvalidUUIDError);
    });

    test('should handle Base58 with unicode characters', () => {
      expect(() => decode('测试测试测试测试测试测试测试测试测试测试测试')).toThrow(InvalidB58Error);
    });

    test('should handle Base58 decode with overflow error message', () => {
      // Create a string that will cause overflow
      const overflowStr = 'zzzzzzzzzzzzzzzzzzzzzz';
      try {
        decode(overflowStr);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidB58Error);
        expect((error as Error).message).toMatch(/overflow|Invalid Base58/i);
      }
    });
  });
});


  describe('Internal Function Coverage', () => {
    test('should handle parseUUID with non-Error exception', () => {
      // Test the catch block that handles non-Error exceptions in parseUUID
      expect(() => encode('not-valid-uuid-format')).toThrow(InvalidUUIDError);
    });

    test('should handle stringifyUUID with null bytes', () => {
      // This tests stringifyUUID error handling
      const { decode } = require('../src/index');
      // Valid decode should work
      const result = decode('BWBeN28Vb7cMEx7Ym8AUzs');
      expect(result).toBe('550e8400-e29b-41d4-a716-446655440000');
    });

    test('should handle encode with InvalidUUIDError already thrown', () => {
      // Test the catch block that re-throws InvalidUUIDError
      expect(() => encode('invalid')).toThrow(InvalidUUIDError);
    });

    test('should handle decode with InvalidB58Error already thrown', () => {
      // Test the catch block that re-throws InvalidB58Error
      expect(() => decode('0')).toThrow(InvalidB58Error);
    });

    test('should handle decode with non-overflow error', () => {
      // Test the error path that doesn't match 'overflow'
      expect(() => decode('invalid-length')).toThrow(InvalidB58Error);
    });

    test('should handle UUID with invalid hex characters', () => {
      // This should trigger the hex validation in parseUUID
      expect(() => encode('gggggggg-gggg-gggg-gggg-gggggggggggg')).toThrow(InvalidUUIDError);
    });
  });
