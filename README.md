# Vite & HeroUI Template

This is a template for creating applications using Vite and HeroUI (v2).

[Try it on CodeSandbox](https://githubbox.com/frontio-ai/vite-template)

## Technologies Used

- [Vite](https://vitejs.dev/guide/)
- [HeroUI](https://heroui.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org)
- [Framer Motion](https://www.framer.com/motion)
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [React Router](https://reactrouter.com/) - Routing
- [Supabase](https://supabase.com/) - Authentication

## How to Use

To clone the project, run the following command:

```bash
git clone https://github.com/frontio-ai/vite-template.git
```

### Install dependencies

You can use one of them `npm`, `yarn`, `pnpm`, `bun`, Example using `npm`:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Setup pnpm (optional)

If you are using `pnpm`, you need to add the following code to your `.npmrc` file:

```bash
public-hoist-pattern[]=*@heroui/*
```

After modifying the `.npmrc` file, you need to run `pnpm install` again to ensure that the dependencies are installed correctly.

## Project Architecture

This project follows a clean, modular architecture designed for maintainability and scalability. Key architectural features include:

- **Centralized API Client**: All API requests go through a single client for consistent error handling and authentication
- **Custom Hooks**: Reusable hooks for common patterns like data fetching and authentication
- **Organized State Management**: Zustand stores organized by domain
- **Type Safety**: Comprehensive TypeScript types throughout the codebase
- **Consistent Error Handling**: Centralized error handling utilities

For more details, see the [ARCHITECTURE.md](./ARCHITECTURE.md) file.

## Project Structure

```
src/
├── components/       # Reusable UI components
├── config/           # Configuration files
├── hooks/            # Custom React hooks
├── layouts/          # Page layouts
├── pages/            # Page components
├── router/           # Routing configuration
├── services/         # API services
├── store/            # State management
├── styles/           # Global styles
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── boot.tsx          # Application bootstrap
└── main.tsx          # Application entry point
```

## License

Licensed under the [MIT license](https://github.com/frontio-ai/vite-template/blob/main/LICENSE).
