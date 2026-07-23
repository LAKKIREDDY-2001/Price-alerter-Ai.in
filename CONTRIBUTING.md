# Contributing to AI Shopping Price Alert Assistant

Thank you for your interest in contributing! We welcome contributions from the community.

## 🎯 Ways to Contribute

- 🐛 **Bug Reports**: Found a bug? Let us know!
- 💡 **Feature Requests**: Have an idea? Share it!
- 📝 **Documentation**: Help improve our docs
- 🔧 **Code Contributions**: Fix bugs, add features
- 🧪 **Testing**: Help us test new features
- 🌐 **Translations**: Help translate the app

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 14+
- Git
- Firebase account (for full testing)

### Development Setup

1. **Fork the repository**
   ```bash
   fork button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOURUSERNAME/price-alerter.git
   cd price-alerter
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **Set up development environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

5. **Make your changes**

6. **Test your changes**
   ```bash
   python -m pytest tests/
   ```

7. **Commit and push**
   ```bash
   git add .
   git commit -m "Add amazing feature"
   git push origin feature/amazing-feature
   ```

8. **Create a Pull Request**

## 📋 Pull Request Guidelines

- **Follow the coding style** (PEP 8 for Python, ES6+ for JavaScript)
- **Add tests** for new functionality
- **Update documentation** as needed
- **Keep PRs focused** - one feature per PR
- **Write clear commit messages**

### Code Style

#### Python
```python
# Use meaningful variable names
user_price_alert = PriceAlert()

# Write docstrings
def track_price(url: str) -> float:
    """Track the current price of a product."""
    pass
```

#### JavaScript
```javascript
// Use const/let instead of var
const trackPrice = async (url) => {
    // Use async/await
    const price = await fetchPrice(url);
    return price;
};
```

#### CSS
```css
/* Use BEM naming convention */
.price-alert__button--primary {
    background-color: #4CAF50;
}
```

## 🐛 Bug Reports

When filing a bug report, include:

1. **Clear title** describing the issue
2. **Steps to reproduce** the bug
3. **Expected behavior** vs actual behavior
4. **Screenshots** if applicable
5. **Environment details** (OS, Python version, etc.)

## 💡 Feature Requests

For new features:

1. **Describe the feature** clearly
2. **Explain the use case**
3. **Provide examples** if possible
4. **Consider alternatives**

## 📖 Documentation

Help improve our documentation by:

- Fixing typos and grammar
- Adding code examples
- Improving explanations
- Translating to other languages

## 🧪 Testing

We use pytest for Python and manual testing for frontend:

```bash
# Run Python tests
python -m pytest

# Run with coverage
python -m pytest --cov=.
```

## 💬 Community

- **Discord**: [Join our community](https://discord.gg/pricealerter)
- **Issues**: [GitHub Issues](https://github.com/yourusername/price-alerter/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/price-alerter/discussions)

## 📜 Code of Conduct

Please note that this project follows our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

## 🙏 Recognition

Contributors will be recognized in:
- Our README.md contributors section
- Release notes
- Our community channels

Thank you for contributing! 🎉

