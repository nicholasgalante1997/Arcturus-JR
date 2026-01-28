# Arc-Jr Documentation

Complete documentation for the Arc-Jr monorepo and Void Design System.

## 📚 Documentation Index

### Void Design System 
The comprehensive CSS design system powering Arc-Jr.

- **[Void Overview](./void/index.md)** - Introduction and quick start
- **[Complete Guide](./void/README.md)** - Full system documentation
- **[Design Tokens](./void/TOKENS.md)** - Token reference and usage
- **[Component Library](./void/COMPONENTS.md)** - Component development guide
- **[Build System](./void/BUILD-SYSTEM.md)** - Build pipeline and optimization
- **[Migration Guide](./void/MIGRATION.md)** - Migrating from other systems
- **[Quick Reference](./void/QUICK-REFERENCE.md)** - Fast lookup and cheat sheet
- **[Workflows](./void/WORKFLOWS.md)** - Step-by-step development guides

### Project Documentation

- **[Project Instructions](../.claude/CLAUDE.md)** - Development standards and architecture
- **[Contributing](#)** - Contribution guidelines (coming soon)

## 🚀 Quick Start

### For New Developers

1. **Read the project instructions**: Start with [.claude/CLAUDE.md](../.claude/CLAUDE.md) to understand Arc-Jr architecture
2. **Understand Void**: Read the [Void Overview](./void/index.md) to learn the CSS system
3. **Explore examples**: Check Storybook at `http://localhost:6006`
4. **Start building**: Follow the patterns in existing code

### For Void Users

1. **Quick start**: [Void Overview](./void/index.md#getting-started)
2. **Token reference**: [Design Tokens](./void/TOKENS.md)
3. **Build components**: [Component Guide](./void/COMPONENTS.md)
4. **Cheat sheet**: [Quick Reference](./void/QUICK-REFERENCE.md)

### For Migrating Projects

1. **Migration overview**: [Migration Guide](./void/MIGRATION.md)
2. **Step-by-step**: [Incremental Strategy](./void/MIGRATION.md#incremental-migration-strategy)

## 📦 Void Packages

| Package | Description | Documentation |
|---------|-------------|---------------|
| `@arcjr/void-tokens` | Design token definitions | [TOKENS.md](./void/TOKENS.md) |
| `@arcjr/void-css` | Base CSS and Tailwind config | [README.md](./void/README.md) |
| `@arcjr/void-components` | React component library | [COMPONENTS.md](./void/COMPONENTS.md) |
| `@arcjr/postcss-utils` | PostCSS utilities | [BUILD-SYSTEM.md](./void/BUILD-SYSTEM.md) |

## 🛠️ Development Workflow

### Common Commands

```bash
# Development
bun run dev                    # Start dev server
bun run storybook              # Start Storybook

# Building
bun run build                  # Build everything
bun run build:packages         # Build packages only

# Testing
bun test                       # Run all tests
bun run lint                   # Lint code
bun run fmt                    # Format code
```

See [Quick Reference](./void/QUICK-REFERENCE.md#build-commands) for complete command list.

## 📖 Learning Path

### Beginner

1. Read [Void Overview](./void/index.md)
2. Understand [Design Tokens](./void/TOKENS.md)
3. Explore [Component Library](./void/COMPONENTS.md)
4. Try [Creating a Component](./void/WORKFLOWS.md#creating-a-new-component)

### Intermediate

1. Deep dive into [Build System](./void/BUILD-SYSTEM.md)
2. Learn [Optimization Strategies](./void/BUILD-SYSTEM.md#build-optimization-strategies)
3. Master [Component Patterns](./void/COMPONENTS.md#component-architecture)

### Advanced

1. Extend [Token System](./void/WORKFLOWS.md#adding-a-new-design-token)
2. Optimize [Performance](./void/BUILD-SYSTEM.md#build-optimization-strategies)
3. Contribute to Void Design System

## 🔍 Finding What You Need

### Design Questions

- **"What colors are available?"** → [Design Tokens - Colors](./void/TOKENS.md#colors)
- **"What spacing scale should I use?"** → [Design Tokens - Spacing](./void/TOKENS.md#spacing)
- **"What components exist?"** → [Component Catalog](./void/COMPONENTS.md#component-catalog)

### Development Questions

- **"How do I create a component?"** → [Creating New Components](./void/WORKFLOWS.md#creating-a-new-component)
- **"How do I use design tokens?"** → [Token Usage](./void/README.md#using-design-tokens)
- **"How does the build work?"** → [Build Pipeline](./void/BUILD-SYSTEM.md#build-architecture)

### Troubleshooting

- **"Styles not applying"** → [Debugging](./void/WORKFLOWS.md#debugging-build-issues)
- **"Build failing"** → [Build Troubleshooting](./void/BUILD-SYSTEM.md#troubleshooting)
- **"Migration problems"** → [Migration Guide](./void/MIGRATION.md#troubleshooting)

## 🎯 Best Practices Summary

### CSS Architecture

✓ **DO**:
- Use design tokens exclusively
- Follow BEM naming with `void-` prefix
- Co-locate styles with components
- Load CSS in correct order (tokens → reset → components → app)

✗ **DON'T**:
- Use CSS-in-JS
- Hardcode values
- Import CSS in `.tsx` files (except `.stories.tsx`)
- Use generic class names

### Component Development

✓ **DO**:
- Follow Container/View separation
- Extend native HTML props
- Document with JSDoc and Storybook
- Write comprehensive tests
- Use `pipeline(memo)` for optimization

✗ **DON'T**:
- Mix presentation and logic
- Create components without tests
- Skip accessibility attributes
- Import entire package

## 📝 Contributing

### Before Contributing

1. Read the [Project Instructions](../.claude/CLAUDE.md)
2. Understand [Void Architecture](./void/README.md#system-architecture)
3. Follow [Component Patterns](./void/COMPONENTS.md#component-architecture)
4. Write [Tests](./void/COMPONENTS.md#component-layers)

### Contribution Checklist

- [ ] Code follows project patterns
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] Storybook stories created
- [ ] Build succeeds
- [ ] Linting passes

## 🔗 External Resources

### CSS & Design Systems

- [Design Tokens Specification](https://design-tokens.github.io/)
- [BEM Methodology](http://getbem.com/)
- [CSS Architecture](https://philipwalton.com/articles/css-architecture/)

### Build Tools

- [Bun Documentation](https://bun.sh/docs)
- [Turborepo Guide](https://turbo.build/)
- [PostCSS Plugins](https://postcss.org/)
- [Tailwind CSS](https://tailwindcss.com/)

### React & Testing

- [React 19 Documentation](https://react.dev/)
- [React Router 7](https://reactrouter.com/)
- [Testing Library](https://testing-library.com/)
- [Storybook](https://storybook.js.org/)

---

**Last Updated**: January 2025  
**Maintained By**: Arc-Jr Team  
**License**: MIT
