# Contributing to PhishEye

Thank you for your interest in contributing to PhishEye! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git
- A code editor (VS Code recommended)

### Development Setup

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/your-username/phish-eye.git
   cd phish-eye
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a development branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 📝 Development Guidelines

### Code Style

- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Follow the project's ESLint configuration
- **Prettier**: Use Prettier for code formatting
- **Naming**: Use descriptive, camelCase names for variables and functions

### Component Guidelines

- **Functional Components**: Use React functional components with hooks
- **Props Interface**: Define TypeScript interfaces for component props
- **Default Props**: Use default parameters instead of defaultProps
- **Memoization**: Use React.memo for performance optimization when needed

### File Structure

```
client/src/
├── components/
│   ├── [feature]/          # Feature-specific components
│   └── ui/                 # Reusable UI components
├── pages/                  # Route components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
└── types/                  # TypeScript type definitions
```

### Git Workflow

1. **Create a feature branch** from `main`
2. **Make your changes** with clear, atomic commits
3. **Write tests** for new functionality
4. **Update documentation** if needed
5. **Submit a pull request** with a clear description

### Commit Messages

Use conventional commit format:

```
type(scope): description

feat(analyzer): add bulk URL analysis feature
fix(ui): resolve mobile navigation issue
docs(readme): update installation instructions
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## 🧪 Testing

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

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user workflows

Example test structure:
```typescript
import { render, screen } from '@testing-library/react';
import { AnalyzerPage } from '@/pages/analyzer';

describe('AnalyzerPage', () => {
  it('renders URL input field', () => {
    render(<AnalyzerPage />);
    expect(screen.getByPlaceholderText(/enter url/i)).toBeInTheDocument();
  });
});
```

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Detailed steps to reproduce the bug
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**: Browser, OS, version information
6. **Screenshots**: If applicable

## 💡 Feature Requests

When suggesting features:

1. **Check existing issues** to avoid duplicates
2. **Describe the problem** you're trying to solve
3. **Explain your proposed solution**
4. **Consider alternatives** you've thought about
5. **Provide use cases** and examples

## 🔍 Code Review Process

### For Contributors

1. **Self-review** your code before submitting
2. **Test thoroughly** on different browsers/devices
3. **Update documentation** if needed
4. **Respond to feedback** promptly and constructively

### For Reviewers

1. **Be constructive** and helpful in feedback
2. **Test the changes** locally if possible
3. **Check for security issues** and performance problems
4. **Approve when ready** or request specific changes

## 📚 Documentation

### Code Documentation

- **JSDoc comments** for functions and classes
- **README updates** for new features
- **Type definitions** for all public APIs
- **Inline comments** for complex logic

### API Documentation

- **OpenAPI/Swagger** for API endpoints
- **Request/response examples**
- **Error code documentation**
- **Authentication requirements**

## 🚀 Release Process

### Version Numbering

We use [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests passing
- [ ] Documentation updated
- [ ] Version bumped
- [ ] Changelog updated
- [ ] Release notes prepared

## 🤝 Community Guidelines

### Code of Conduct

- **Be respectful** and inclusive
- **Be constructive** in feedback
- **Be patient** with newcomers
- **Be collaborative** and helpful

### Communication

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and ideas
- **Pull Requests**: For code changes
- **Discord/Slack**: For real-time chat (if available)

## 🛠️ Development Tools

### Recommended VS Code Extensions

- **ES7+ React/Redux/React-Native snippets**
- **TypeScript Importer**
- **Prettier - Code formatter**
- **ESLint**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**

### Useful Commands

```bash
# Type checking
npm run check

# Linting
npm run lint

# Formatting
npm run format

# Build
npm run build

# Clean
npm run clean
```

## 📋 Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added for new functionality
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
- [ ] Responsive design tested
```

## 🎯 Areas for Contribution

### High Priority
- **Performance optimization**
- **Accessibility improvements**
- **Mobile responsiveness**
- **Test coverage**
- **Documentation**

### Medium Priority
- **New OSINT sources**
- **Advanced filtering**
- **Export formats**
- **UI/UX enhancements**
- **Error handling**

### Low Priority
- **Themes and customization**
- **Advanced analytics**
- **Integration features**
- **Developer tools**

## 📞 Getting Help

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and community discussion
- **Email**: dev@phish-eye.com for direct contact
- **Documentation**: Check the wiki for detailed guides

## 🙏 Recognition

Contributors will be recognized in:
- **README.md** contributors section
- **Release notes** for significant contributions
- **GitHub contributors** page
- **Project documentation**

Thank you for contributing to PhishEye! 🎉
