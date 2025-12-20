# Documentation

Welcome to the project documentation! This directory contains guides and reference materials for working with this application.

## Available Documentation

### [Environment Variables](./environment-variables.md)
Complete guide to configuring environment variables, including:
- How to set up environment variables
- Available configuration options
- Adding new environment variables
- Using configuration in your code
- Best practices and security notes

## Quick Start

1. **Environment Setup**: Start with the [Environment Variables](./environment-variables.md) guide to configure your local development environment.

2. **Development**: Run the development server:
   ```bash
   pnpm dev
   ```

3. **Building**: Build all packages:
   ```bash
   pnpm build
   ```

## Project Structure

```
nest-with-next/
├── docs/                    # Documentation (you are here)
├── packages/
│   ├── client/             # Next.js frontend application
│   ├── server/             # NestJS backend application
│   │   └── src/
│   │       └── config/     # Configuration and validation
│   └── shared/             # Shared types and utilities
└── ...
```

## Contributing

When adding new features or making changes:

1. Update relevant documentation
2. Add environment variables to `.env.example`
3. Update validation schemas if adding new config
4. Keep this README up to date

## Need Help?

- Check the relevant documentation file in this directory
- Review the main [README.md](../README.md) in the project root
- Look at code examples in the codebase

