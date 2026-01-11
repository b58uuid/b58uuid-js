# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-11

### Added
- Initial release of b58uuid for JavaScript/TypeScript
- Core encoding and decoding functions
- UUID v4 generation with Base58 encoding
- Full TypeScript support with type definitions
- Comprehensive test suite with 100% coverage
- Zero runtime dependencies
- Cross-platform support (Node.js and browsers)
- Error handling with custom error types
- Bitcoin Base58 alphabet (excludes 0, O, I, l)
- Always produces exactly 22 characters
- Overflow detection for invalid inputs
- Support for UUIDs with or without hyphens

### Features
- `encode(uuid)` - Convert UUID to Base58
- `decode(b58)` - Convert Base58 to UUID
- `generate()` - Generate new random UUID as Base58
- Custom error types: `B58UUIDError`, `InvalidUUIDError`, `InvalidB58Error`

### Performance
- Optimized BigInt-based encoding/decoding
- Efficient byte manipulation
- Minimal memory allocation

[1.0.0]: https://github.com/b58uuid/b58uuid-js/releases/tag/v1.0.0
