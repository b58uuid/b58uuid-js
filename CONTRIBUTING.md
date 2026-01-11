# Contributing to B58UUID for JavaScript

Thank you for your interest in contributing to B58UUID! This document provides guidelines for contributing to the project.

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Your environment (Node.js version, OS, etc.)
- Code samples if applicable

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- A clear and descriptive title
- A detailed description of the proposed functionality
- Examples of how the enhancement would be used
- Why this enhancement would be useful

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Run linter (`npm run lint`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

#### Pull Request Guidelines

- Follow the existing code style
- Write clear commit messages
- Include tests for new functionality
- Update documentation as needed
- Ensure all tests pass
- Keep PRs focused on a single feature or fix

## Development Setup

### Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher

### Setup

```bash
# Clone the repository
git clone https://github.com/b58uuid/b58uuid-js.git
cd b58uuid-js

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linter
npm run lint

# Type check
npm run type-check
```

## Project Structure

```
b58uuid-js/
├── src/
│   ├── index.ts       # Main entry point
│   └── base58.ts      # Base58 encoding/decoding
├── tests/
│   ├── index.test.ts  # Main test suite
│   └── edge-cases.test.ts  # Edge case tests
├── dist/              # Compiled output (generated)
├── package.json       # Package configuration
├── tsconfig.json      # TypeScript configuration
├── jest.config.js     # Jest configuration
└── .eslintrc.js       # ESLint configuration
```

## Coding Standards

### TypeScript

- Use TypeScript for all source code
- Enable strict mode
- Provide type annotations for function parameters and return types
- Avoid `any` type unless absolutely necessary

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons at the end of statements
- Maximum line length: 120 characters
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### Testing

- Write tests for all new functionality
- Maintain 100% code coverage
- Use descriptive test names
- Group related tests using `describe` blocks
- Test edge cases and error conditions

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add support for custom alphabets
fix: handle overflow in decode function
docs: update README with new examples
test: add edge case tests for nil UUID
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Place tests in the `tests/` directory
- Use `.test.ts` extension for test files
- Follow the existing test structure
- Test both success and failure cases
- Include edge cases

Example test:
```typescript
describe('encode', () => {
  it('should encode a valid UUID', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000';
    const result = encode(uuid);
    expect(result).toBe('BWBeN28Vb7cMEx7Ym8AUzs');
  });

  it('should throw on invalid UUID', () => {
    expect(() => encode('invalid')).toThrow(InvalidUUIDError);
  });
});
```

## Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for public APIs
- Update CHANGELOG.md following Keep a Changelog format
- Include code examples in documentation

## Release Process

Releases are managed by project maintainers:

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create a git tag
4. Push to GitHub
5. Publish to npm

## Questions?

If you have questions, feel free to:

- Open an issue on GitHub
- Start a discussion in GitHub Discussions
- Contact the maintainers

## License

By contributing to B58UUID, you agree that your contributions will be licensed under the MIT License.
