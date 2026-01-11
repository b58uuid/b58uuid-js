# B58UUID for JavaScript/TypeScript

[![npm version](https://img.shields.io/npm/v/b58uuid.svg)](https://www.npmjs.com/package/b58uuid)
[![CI](https://github.com/b58uuid/b58uuid-js/workflows/CI/badge.svg)](https://github.com/b58uuid/b58uuid-js/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

High-performance Base58-encoded UUID library for **JavaScript** and **TypeScript** with zero runtime dependencies.

> **39% shorter** than standard UUIDs • **URL-safe** • **Unambiguous** • **Fast**

## Features

- ✅ **39% more compact**: 22 characters instead of 36
- ✅ **URL-safe**: No special characters that need escaping
- ✅ **Unambiguous**: Uses Bitcoin's Base58 alphabet (excludes 0, O, I, l)
- ✅ **Fast**: Optimized encoding/decoding with BigInt
- ✅ **Zero dependencies**: No external runtime dependencies
- ✅ **TypeScript support**: Full type definitions included
- ✅ **Cross-platform**: Works in Node.js and browsers (with bundler)
- ✅ **100% test coverage**: Comprehensive test suite
- ✅ **Error handling**: Custom error types for better debugging

## Quick Comparison

```
Standard UUID:  550e8400-e29b-41d4-a716-446655440000  (36 characters)
B58UUID:        BWBeN28Vb7cMEx7Ym8AUzs                (22 characters)
                                                       ↑ 39% shorter!
```

## Installation

```bash
npm install b58uuid
```

## Usage

### JavaScript

```javascript
const { generate, encode, decode } = require('b58uuid');

// Generate a new UUID
const b58 = generate();
console.log(b58); // Output: 3FfGK34vwMvVFDedyb2nkf

// Encode existing UUID
const encoded = encode('550e8400-e29b-41d4-a716-446655440000');
console.log(encoded); // Output: BWBeN28Vb7cMEx7Ym8AUzs

// Decode back to UUID
const uuid = decode('BWBeN28Vb7cMEx7Ym8AUzs');
console.log(uuid); // Output: 550e8400-e29b-41d4-a716-446655440000
```

### TypeScript

```typescript
import { generate, encode, decode } from 'b58uuid';

// Generate a new UUID
const b58 = generate();
console.log(b58); // Output: 3FfGK34vwMvVFDedyb2nkf

// Encode existing UUID
const encoded = encode('550e8400-e29b-41d4-a716-446655440000');
console.log(encoded); // Output: BWBeN28Vb7cMEx7Ym8AUzs

// Decode back to UUID
const uuid = decode('BWBeN28Vb7cMEx7Ym8AUzs');
console.log(uuid); // Output: 550e8400-e29b-41d4-a716-446655440000
```

## API

### Functions

#### `generate(): string`
Generate a new random UUID v4 and return its Base58 encoding.

```typescript
import { generate } from 'b58uuid';

const id = generate();
console.log(id); // "3FfGK34vwMvVFDedyb2nkf"
```

#### `encode(uuidStr: string): string`
Encode a standard UUID string to Base58 format.

```typescript
import { encode } from 'b58uuid';

const b58 = encode('550e8400-e29b-41d4-a716-446655440000');
console.log(b58); // "BWBeN28Vb7cMEx7Ym8AUzs"
```

**Parameters:**
- `uuidStr`: UUID string (with or without hyphens)

**Returns:** Base58-encoded string (exactly 22 characters)

**Throws:** `InvalidUUIDError` if the UUID format is invalid

#### `decode(b58Str: string): string`
Decode a Base58 string back to standard UUID format.

```typescript
import { decode } from 'b58uuid';

const uuid = decode('BWBeN28Vb7cMEx7Ym8AUzs');
console.log(uuid); // "550e8400-e29b-41d4-a716-446655440000"
```

**Parameters:**
- `b58Str`: Base58-encoded string (must be exactly 22 characters)

**Returns:** UUID string in canonical format (with hyphens)

**Throws:** `InvalidB58Error` if the Base58 string is invalid

### Error Types

#### `B58UUIDError`
Base error class for all b58uuid errors.

```typescript
class B58UUIDError extends Error {
  constructor(message: string, originalError?: Error);
}
```

#### `InvalidUUIDError`
Thrown when an invalid UUID format is provided to `encode()`.

```typescript
class InvalidUUIDError extends B58UUIDError {
  constructor(uuidStr: string, originalError?: Error);
}
```

#### `InvalidB58Error`
Thrown when an invalid Base58 string is provided to `decode()`.

```typescript
class InvalidB58Error extends B58UUIDError {
  constructor(b58Str: string, originalError?: Error);
}
```

### Error Handling Example

```typescript
import { encode, decode, InvalidUUIDError, InvalidB58Error } from 'b58uuid';

try {
  encode('invalid-uuid');
} catch (error) {
  if (error instanceof InvalidUUIDError) {
    console.error('Invalid UUID:', error.message);
  }
}

try {
  decode('0000000000000000000000'); // Contains '0' which is not in Base58
} catch (error) {
  if (error instanceof InvalidB58Error) {
    console.error('Invalid B58:', error.message);
  }
}
```

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Performance

B58UUID is optimized for performance:

- **Encoding**: ~100,000+ ops/sec
- **Decoding**: ~80,000+ ops/sec
- **Generation**: ~50,000+ ops/sec

Benchmarks run on Node.js 20.x on a modern CPU.

## Browser Support

B58UUID works in modern browsers when bundled with tools like:

- Webpack
- Rollup
- Vite
- esbuild

**Note**: Requires a bundler that can polyfill Node.js `crypto` module for browser environments.

## Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details.

## Publishing

See [PUBLISHING.md](./PUBLISHING.md) for instructions on how to publish this package to npm.

**Note**: If you have 2FA enabled on npm, see [2FA_SETUP.md](./2FA_SETUP.md) for automated publishing setup.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for release history.

## License

MIT License - see [LICENSE](./LICENSE) file for details.

## Related Projects

B58UUID is available in multiple languages:

- **Rust**: [b58uuid-rs](https://github.com/b58uuid/b58uuid-rs) - `cargo add b58uuid`
- **Go**: [b58uuid-go](https://github.com/b58uuid/b58uuid-go) - `go get github.com/b58uuid/b58uuid-go`
- **Java**: [b58uuid-java](https://github.com/b58uuid/b58uuid-java) - Maven/Gradle

## Links

- [npm Package](https://www.npmjs.com/package/b58uuid)
- [GitHub Repository](https://github.com/b58uuid/b58uuid-js)
- [Issue Tracker](https://github.com/b58uuid/b58uuid-js/issues)
- [Official Website](https://b58uuid.io)

## Support

- 📖 [Documentation](https://github.com/b58uuid/b58uuid-js#readme)
- 💬 [Discussions](https://github.com/b58uuid/b58uuid-js/discussions)
- 🐛 [Issue Tracker](https://github.com/b58uuid/b58uuid-js/issues)

---

Made with ❤️ by the B58UUID community
