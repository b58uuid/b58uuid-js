import { encode, decode, generate } from '../src/index';
import { InvalidB58Error } from '../src/index';

describe('b58uuid', () => {
  const testVectors = [
    {
      name: 'Standard UUID with hyphens',
      uuid: '550e8400-e29b-41d4-a716-446655440000',
      b58: 'BWBeN28Vb7cMEx7Ym8AUzs',
    },
    {
      name: 'UUID without hyphens',
      uuid: '550e8400e29b41d4a716446655440000',
      b58: 'BWBeN28Vb7cMEx7Ym8AUzs',
    },
    {
      name: 'Nil UUID (all zeros)',
      uuid: '00000000-0000-0000-0000-000000000000',
      b58: '1111111111111111111111',
    },
    {
      name: 'Max UUID (all Fs)',
      uuid: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
      b58: 'YcVfxkQb6JRzqk5kF2tNLv',
    },
  ];

  describe('encode', () => {
    testVectors.forEach(({ name, uuid, b58 }) => {
      it(`should encode ${name}`, () => {
        expect(encode(uuid)).toBe(b58);
      });
    });

    it('should throw on invalid UUID', () => {
      expect(() => encode('invalid')).toThrow();
      expect(() => encode('')).toThrow();
    });
  });

  describe('decode', () => {
    testVectors.forEach(({ name, uuid, b58 }) => {
      it(`should decode ${name}`, () => {
        const result = decode(b58);
        // Normalize both to canonical format (with hyphens) for comparison
        const canonicalUuid = uuid.length === 32 ? 
          `${uuid.substring(0, 8)}-${uuid.substring(8, 12)}-${uuid.substring(12, 16)}-${uuid.substring(16, 20)}-${uuid.substring(20)}` :
          uuid;
        expect(result.toLowerCase()).toBe(canonicalUuid.toLowerCase());
      });
    });

    it('should throw on invalid b58uuid', () => {
      expect(() => decode('0000000000000000')).toThrow(); // Contains 0
      expect(() => decode('OOOOOOOOOOOOOOOO')).toThrow(); // Contains O
      expect(() => decode('')).toThrow(); // Empty
    });
  });

  describe('round-trip', () => {
    testVectors.forEach(({ name, uuid }) => {
      it(`should round-trip ${name}`, () => {
        const encoded = encode(uuid);
        const decoded = decode(encoded);
        // Normalize both to canonical format (with hyphens) for comparison
        const canonicalUuid = uuid.length === 32 ? 
          `${uuid.substring(0, 8)}-${uuid.substring(8, 12)}-${uuid.substring(12, 16)}-${uuid.substring(16, 20)}-${uuid.substring(20)}` :
          uuid;
        expect(decoded.toLowerCase()).toBe(canonicalUuid.toLowerCase());
      });
    });
  });

  describe('generate', () => {
    it('should generate a valid b58uuid', () => {
      const b58 = generate();
      expect(b58).toHaveLength(22);
      expect(() => decode(b58)).not.toThrow();
    });

    it('should generate unique values', () => {
      const b58_1 = generate();
      const b58_2 = generate();
      expect(b58_1).not.toBe(b58_2);
    });

    it('should generate UUIDs with correct version and variant', () => {
      for (let i = 0; i < 100; i++) {
        const b58 = generate();
        const uuid = decode(b58);
        const bytes = Buffer.from(uuid.replace(/-/g, ''), 'hex');
        
        // Check version 4 (bits 0100 in byte 6)
        const version = (bytes[6] & 0xF0) >> 4;
        expect(version).toBe(4);
        
        // Check variant (bits 10 in byte 8)
        const variant = (bytes[8] & 0xC0) >> 6;
        expect(variant).toBe(2);
      }
    });
  });

  describe('output length', () => {
    it('should always produce 22-character output', () => {
      const testUUIDs = [
        '00000000-0000-0000-0000-000000000000',
        'ffffffff-ffff-ffff-ffff-ffffffffffff',
        '550e8400-e29b-41d4-a716-446655440000',
        'deadbeef-cafe-babe-0123-456789abcdef',
        '00000000-0000-0000-0000-000000000001',
      ];

      testUUIDs.forEach(uuid => {
        const encoded = encode(uuid);
        expect(encoded).toHaveLength(22);
      });
    });
  });

  describe('overflow detection', () => {
    it('should detect overflow on decode', () => {
      // Create a Base58 string that would overflow u128
      const overflowStr = 'zzzzzzzzzzzzzzzzzzzzzz'; // 22 'z' characters
      expect(() => decode(overflowStr)).toThrow(InvalidB58Error);
      expect(() => decode(overflowStr)).toThrow(/overflow|Invalid Base58/i);
    });
  });
});

  describe('exports and aliases', () => {
    it('should export new_ as alias for generate', () => {
      const { new_ } = require('../src/index');
      const result = new_();
      expect(result).toHaveLength(22);
      expect(() => decode(result)).not.toThrow();
    });

    it('should export mustEncode as alias for encode', () => {
      const { mustEncode } = require('../src/index');
      const result = mustEncode('550e8400-e29b-41d4-a716-446655440000');
      expect(result).toBe('BWBeN28Vb7cMEx7Ym8AUzs');
    });

    it('should export mustDecode as alias for decode', () => {
      const { mustDecode } = require('../src/index');
      const result = mustDecode('BWBeN28Vb7cMEx7Ym8AUzs');
      expect(result.toLowerCase()).toBe('550e8400-e29b-41d4-a716-446655440000');
    });

    it('should export default object with all functions', () => {
      const b58uuid = require('../src/index').default;
      expect(b58uuid.encode).toBeDefined();
      expect(b58uuid.decode).toBeDefined();
      expect(b58uuid.generate).toBeDefined();
    });
  });
