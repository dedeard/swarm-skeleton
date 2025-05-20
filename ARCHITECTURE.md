# Application Architecture

This document outlines the architecture of the application, explaining the organization and design patterns used.

## Directory Structure

```
src/
├── components/       # Reusable UI components
│   ├── features/     # Feature-specific components
│   ├── icons/        # Icon components
│   ├── layouts/      # Layout components
│   └── ui/           # Generic UI components
├── config/           # Configuration files
│   └── constants.ts  # Application constants
├── hooks/            # Custom React hooks
│   ├── useApi.ts     # Hook for API data fetching
│   └── useAuth.ts    # Hook for authentication
├── layouts/          # Page layouts
├── pages/            # Page components
├── router/           # Routing configuration
├── services/         # API services
│   ├── api-client.ts # Centralized API client
│   └── *.service.ts  # Service modules
├── store/            # State management
├── styles/           # Global styles
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── boot.tsx          # Application bootstrap
└── main.tsx          # Application entry point
```

## Core Concepts

### API Layer

The API layer is organized around a centralized `api-client.ts` that handles all HTTP requests consistently. This ensures:

- Consistent error handling
- Authentication header management
- Standardized request/response processing

Individual service modules (like `agent.service.ts`) use the API client to make specific API calls, providing a clean interface for the rest of the application.

### State Management

The application uses Zustand for state management. Store modules are organized by domain (auth, agent, etc.) and follow a consistent pattern:

- Clear interface definition
- Documented actions
- Separation of state and actions

### Custom Hooks

Custom hooks abstract common patterns:

- `useApi`: Simplifies data fetching with loading/error states
- `useApiMutation`: Handles create/update/delete operations
- `useAuth`: Provides authentication utilities

### Error Handling

Error handling is centralized in `error-handler.ts`, which provides:

- Custom error classes
- Consistent error parsing
- Helper functions for handling different error types

### Configuration

Application constants are centralized in `constants.ts`, making it easy to:

- Change configuration values in one place
- Group related constants
- Access environment variables consistently

## Best Practices

1. **Type Safety**: Use TypeScript interfaces and types for all data structures
2. **Documentation**: Add JSDoc comments to functions and components
3. **Error Handling**: Handle errors consistently at appropriate levels
4. **Code Organization**: Group related functionality together
5. **Naming Conventions**: Use clear, consistent naming for files and functions

## Common Patterns

### Data Fetching

```tsx
import { useApi } from '@/hooks/useApi'
import { getAgents } from '@/services/agent.service'

function AgentList() {
  const { data: agents, loading, error } = useApi(getAgents)

  if (loading) return <Spinner />
  if (error) return <ErrorMessage error={error} />

  return <div>{agents?.map((agent) => <AgentCard key={agent.id} agent={agent} />)}</div>
}
```

### Authentication

```tsx
import { useAuth } from '@/hooks/useAuth'

function LoginButton() {
  const { signInWithGoogle, loading } = useAuth()

  return (
    <Button onClick={signInWithGoogle} disabled={loading}>
      Sign in with Google
    </Button>
  )
}
```

### API Mutations

```tsx
import { useApiMutation } from '@/hooks/useApi'
import { createAgent } from '@/services/agent.service'

function CreateAgentForm() {
  const { mutate, loading } = useApiMutation(createAgent)

  const handleSubmit = async (data) => {
    try {
      await mutate(data)
      // Handle success
    } catch (error) {
      // Handle error
    }
  }

  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>
}
```
