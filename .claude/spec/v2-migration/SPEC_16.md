# SPEC-16: Test Coverage

## Context

This spec defines the testing strategy for V2 components, including unit tests, integration tests, and accessibility tests. Comprehensive test coverage ensures reliability and catches regressions during development.

## Prerequisites

- SPEC-01 through SPEC-15 completed (all V2 components and routes ready)
- Bun test runner configured
- Testing Library installed
- happy-dom configured for DOM testing

## Requirements

### 1. Test Configuration

Update `apps/web/bunfig.toml`:

```toml
[test]
preload = ["./test/setup.ts"]
timeout = 30000

[test.coverage]
enabled = true
reporter = ["text", "lcov"]
exclude = [
  "**/*.stories.tsx",
  "**/types.ts",
  "**/index.ts",
  "test/**",
]
```

Create `apps/web/test/setup.ts`:

```typescript
import { afterEach } from "bun:test";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  }),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = () => {};
  disconnect = () => {};
  unobserve = () => {};
}
Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: MockIntersectionObserver,
});
```

### 2. Test Utilities

Create `apps/web/test/utils.tsx`:

```typescript
import { render, type RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import type { ReactElement, ReactNode } from "react";

interface WrapperProps {
  children: ReactNode;
}

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
}

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  initialEntries?: string[];
  queryClient?: QueryClient;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    initialEntries = ["/"],
    queryClient = createTestQueryClient(),
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: WrapperProps) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </QueryClientProvider>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  };
}

export * from "@testing-library/react";
export { renderWithProviders as render };
```

### 3. Component Unit Tests

#### Header Component Tests

Create `apps/web/src/components/v2/Header/__tests__/Header.test.tsx`:

```typescript
import { describe, test, expect, mock } from "bun:test";
import { screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { render } from "@test/utils";
import { V2Header } from "../index";

describe("V2Header", () => {
  test("renders logo with link to home", () => {
    render(<V2Header />);

    const logo = screen.getByLabelText("Home");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("href", "/");
  });

  test("renders navigation links", () => {
    render(<V2Header />);

    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Posts" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contact" })).toBeInTheDocument();
  });

  test("mobile menu is hidden by default", () => {
    render(<V2Header />);

    const mobileMenu = screen.queryByRole("navigation", {
      name: "Mobile navigation",
    });
    expect(mobileMenu).not.toBeInTheDocument();
  });

  test("toggles mobile menu on button click", async () => {
    const user = userEvent.setup();
    render(<V2Header />);

    const toggleButton = screen.getByLabelText("Toggle navigation menu");
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");

    await user.click(toggleButton);

    expect(toggleButton).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("navigation", { name: "Mobile navigation" })
    ).toBeInTheDocument();
  });

  test("applies scrolled class when transparent prop is false", () => {
    const { container } = render(<V2Header transparent={false} />);

    const header = container.querySelector(".v2-header");
    expect(header).toHaveClass("v2-header--scrolled");
  });

  test("does not apply scrolled class when transparent prop is true", () => {
    const { container } = render(<V2Header transparent={true} />);

    const header = container.querySelector(".v2-header");
    expect(header).not.toHaveClass("v2-header--scrolled");
  });
});
```

#### Footer Component Tests

Create `apps/web/src/components/v2/Footer/__tests__/Footer.test.tsx`:

```typescript
import { describe, test, expect } from "bun:test";
import { screen } from "@testing-library/react";

import { render } from "@test/utils";
import { V2Footer } from "../index";

describe("V2Footer", () => {
  test("renders logo with link to home", () => {
    render(<V2Footer />);

    const logo = screen.getByRole("link", { name: /arc-jr/i });
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("href", "/");
  });

  test("renders navigation sections", () => {
    render(<V2Footer />);

    expect(screen.getByText("Navigation")).toBeInTheDocument();
    expect(screen.getByText("Resources")).toBeInTheDocument();
  });

  test("renders social media links", () => {
    render(<V2Footer />);

    expect(screen.getByLabelText("Visit our GitHub profile")).toBeInTheDocument();
    expect(screen.getByLabelText("Follow us on Twitter")).toBeInTheDocument();
    expect(screen.getByLabelText("Connect on LinkedIn")).toBeInTheDocument();
  });

  test("social links open in new tab", () => {
    render(<V2Footer />);

    const githubLink = screen.getByLabelText("Visit our GitHub profile");
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("renders current year in copyright", () => {
    render(<V2Footer />);

    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`${currentYear}`))).toBeInTheDocument();
  });
});
```

#### Home Page Tests

Create `apps/web/src/components/v2/Home/__tests__/Home.test.tsx`:

```typescript
import { describe, test, expect, mock } from "bun:test";
import { screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";

import { render } from "@test/utils";
import { V2HomePage } from "../index";

// Mock posts data
const mockPosts = [
  {
    id: "1",
    title: "Test Post 1",
    description: "Description 1",
    date: "2024-01-01",
    tags: ["react"],
  },
  {
    id: "2",
    title: "Test Post 2",
    description: "Description 2",
    date: "2024-01-02",
    tags: ["typescript"],
  },
];

// Mock the posts hook
mock.module("@/hooks/usePosts", () => ({
  useGetPosts: () => ({
    data: mockPosts,
    isLoading: false,
    isError: false,
    promise: Promise.resolve(mockPosts),
  }),
}));

describe("V2HomePage", () => {
  test("renders hero section", async () => {
    render(<V2HomePage />);

    await waitFor(() => {
      expect(screen.getByText("Engineering the Future")).toBeInTheDocument();
    });
  });

  test("renders featured posts section", async () => {
    render(<V2HomePage />);

    await waitFor(() => {
      expect(screen.getByText("Latest Posts")).toBeInTheDocument();
    });
  });

  test("renders post cards", async () => {
    render(<V2HomePage />);

    await waitFor(() => {
      expect(screen.getByText("Test Post 1")).toBeInTheDocument();
      expect(screen.getByText("Test Post 2")).toBeInTheDocument();
    });
  });

  test("hero CTA links to posts page", async () => {
    render(<V2HomePage />);

    await waitFor(() => {
      const ctaLink = screen.getByRole("link", { name: /read the blog/i });
      expect(ctaLink).toHaveAttribute("href", "/posts");
    });
  });
});
```

#### Posts Page Tests

Create `apps/web/src/components/v2/Posts/__tests__/Posts.test.tsx`:

```typescript
import { describe, test, expect, mock } from "bun:test";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { render } from "@test/utils";
import { V2PostsPage } from "../index";

const mockPosts = [
  {
    id: "1",
    title: "React Post",
    description: "About React",
    date: "2024-01-01",
    tags: ["react", "frontend"],
  },
  {
    id: "2",
    title: "TypeScript Post",
    description: "About TypeScript",
    date: "2024-01-02",
    tags: ["typescript"],
  },
  {
    id: "3",
    title: "Another React Post",
    description: "More React content",
    date: "2024-01-03",
    tags: ["react"],
  },
];

mock.module("@/hooks/usePosts", () => ({
  useGetPosts: () => ({
    data: mockPosts,
    isLoading: false,
    isError: false,
    promise: Promise.resolve(mockPosts),
  }),
}));

describe("V2PostsPage", () => {
  test("renders page title", async () => {
    render(<V2PostsPage />);

    await waitFor(() => {
      expect(screen.getByText("Blog Posts")).toBeInTheDocument();
    });
  });

  test("renders all posts initially", async () => {
    render(<V2PostsPage />);

    await waitFor(() => {
      expect(screen.getByText("React Post")).toBeInTheDocument();
      expect(screen.getByText("TypeScript Post")).toBeInTheDocument();
      expect(screen.getByText("Another React Post")).toBeInTheDocument();
    });
  });

  test("filters posts by tag", async () => {
    const user = userEvent.setup();
    render(<V2PostsPage />);

    await waitFor(() => {
      expect(screen.getByText("React Post")).toBeInTheDocument();
    });

    const typescriptTag = screen.getByRole("button", { name: "typescript" });
    await user.click(typescriptTag);

    expect(screen.getByText("TypeScript Post")).toBeInTheDocument();
    expect(screen.queryByText("React Post")).not.toBeInTheDocument();
  });

  test("filters posts by search query", async () => {
    const user = userEvent.setup();
    render(<V2PostsPage />);

    await waitFor(() => {
      expect(screen.getByText("React Post")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search posts...");
    await user.type(searchInput, "TypeScript");

    await waitFor(() => {
      expect(screen.getByText("TypeScript Post")).toBeInTheDocument();
      expect(screen.queryByText("React Post")).not.toBeInTheDocument();
    });
  });

  test("shows empty state when no posts match", async () => {
    const user = userEvent.setup();
    render(<V2PostsPage />);

    await waitFor(() => {
      expect(screen.getByText("React Post")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search posts...");
    await user.type(searchInput, "nonexistent query xyz");

    await waitFor(() => {
      expect(screen.getByText("No posts found")).toBeInTheDocument();
    });
  });
});
```

#### Contact Form Tests

Create `apps/web/src/components/v2/Contact/__tests__/ContactForm.test.tsx`:

```typescript
import { describe, test, expect, mock } from "bun:test";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { render } from "@test/utils";
import ContactFormView from "../components/ContactForm/View";

describe("ContactForm", () => {
  const mockOnSubmit = mock(() => Promise.resolve());

  const defaultProps = {
    onSubmit: mockOnSubmit,
    isSubmitting: false,
    submitError: null,
    submitSuccess: false,
  };

  test("renders all form fields", () => {
    render(<ContactFormView {...defaultProps} />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  test("shows validation errors for empty fields", async () => {
    const user = userEvent.setup();
    render(<ContactFormView {...defaultProps} />);

    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Please select a subject")).toBeInTheDocument();
      expect(screen.getByText("Message is required")).toBeInTheDocument();
    });
  });

  test("validates email format", async () => {
    const user = userEvent.setup();
    render(<ContactFormView {...defaultProps} />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "invalid-email");

    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Please enter a valid email")).toBeInTheDocument();
    });
  });

  test("validates message minimum length", async () => {
    const user = userEvent.setup();
    render(<ContactFormView {...defaultProps} />);

    const messageInput = screen.getByLabelText(/message/i);
    await user.type(messageInput, "short");

    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Message must be at least 20 characters")
      ).toBeInTheDocument();
    });
  });

  test("submits form with valid data", async () => {
    const user = userEvent.setup();
    render(<ContactFormView {...defaultProps} />);

    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.selectOptions(screen.getByLabelText(/subject/i), "general");
    await user.type(
      screen.getByLabelText(/message/i),
      "This is a test message that is long enough."
    );

    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        subject: "general",
        message: "This is a test message that is long enough.",
      });
    });
  });

  test("shows loading state when submitting", () => {
    render(<ContactFormView {...defaultProps} isSubmitting={true} />);

    const submitButton = screen.getByRole("button", { name: /sending/i });
    expect(submitButton).toBeDisabled();
  });

  test("shows error message on submit failure", () => {
    render(
      <ContactFormView {...defaultProps} submitError="Failed to send message" />
    );

    expect(screen.getByText("Failed to send message")).toBeInTheDocument();
  });

  test("shows success state after successful submission", () => {
    render(<ContactFormView {...defaultProps} submitSuccess={true} />);

    expect(screen.getByText("Message Sent!")).toBeInTheDocument();
  });
});
```

### 4. Accessibility Tests

Create `apps/web/test/accessibility.test.tsx`:

```typescript
import { describe, test, expect } from "bun:test";
import { screen, within } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";

import { render } from "./utils";
import { V2Header } from "@/components/v2/Header";
import { V2Footer } from "@/components/v2/Footer";

expect.extend(toHaveNoViolations);

describe("Accessibility", () => {
  describe("V2Header", () => {
    test("has no accessibility violations", async () => {
      const { container } = render(<V2Header />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("navigation has proper landmark role", () => {
      render(<V2Header />);

      const nav = screen.getByRole("navigation", { name: "Primary navigation" });
      expect(nav).toBeInTheDocument();
    });

    test("mobile menu button has proper aria attributes", () => {
      render(<V2Header />);

      const button = screen.getByLabelText("Toggle navigation menu");
      expect(button).toHaveAttribute("aria-expanded");
    });
  });

  describe("V2Footer", () => {
    test("has no accessibility violations", async () => {
      const { container } = render(<V2Footer />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("uses semantic footer element", () => {
      const { container } = render(<V2Footer />);
      expect(container.querySelector("footer")).toBeInTheDocument();
    });

    test("social links have accessible names", () => {
      render(<V2Footer />);

      expect(screen.getByLabelText("Visit our GitHub profile")).toBeInTheDocument();
      expect(screen.getByLabelText("Follow us on Twitter")).toBeInTheDocument();
    });
  });
});
```

### 5. Integration Tests

Create `apps/web/test/integration/navigation.test.tsx`:

```typescript
import { describe, test, expect } from "bun:test";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import routes from "@/router/routes";

function renderApp(initialPath = "/") {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const router = createMemoryRouter(routes, {
    initialEntries: [initialPath],
  });

  return {
    user: userEvent.setup(),
    ...render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    ),
    router,
  };
}

describe("Navigation Integration", () => {
  test("navigates from home to posts", async () => {
    const { user } = renderApp("/");

    await waitFor(() => {
      expect(screen.getByText("Engineering the Future")).toBeInTheDocument();
    });

    const postsLink = screen.getByRole("link", { name: "Posts" });
    await user.click(postsLink);

    await waitFor(() => {
      expect(screen.getByText("Blog Posts")).toBeInTheDocument();
    });
  });

  test("navigates from posts to post detail", async () => {
    const { user } = renderApp("/posts");

    await waitFor(() => {
      const postCard = screen.getAllByRole("article")[0];
      expect(postCard).toBeInTheDocument();
    });

    const firstPostLink = screen.getAllByRole("link", { name: /read more/i })[0];
    await user.click(firstPostLink);

    await waitFor(() => {
      expect(screen.getByRole("article")).toBeInTheDocument();
    });
  });

  test("shows 404 for unknown routes", async () => {
    renderApp("/unknown-route");

    await waitFor(() => {
      expect(screen.getByText(/not found/i)).toBeInTheDocument();
    });
  });
});
```

### 6. Test Script Updates

Update `apps/web/package.json`:

```json
{
  "scripts": {
    "test": "bun test",
    "test:watch": "bun test --watch",
    "test:coverage": "bun test --coverage",
    "test:ui": "bun test --ui"
  }
}
```

## Test Coverage Requirements

| Component/Feature | Minimum Coverage |
|------------------|------------------|
| V2 Header | 90% |
| V2 Footer | 90% |
| V2 Home Page | 85% |
| V2 Posts Page | 85% |
| V2 Post Detail | 85% |
| V2 About Page | 80% |
| V2 Contact Page | 90% |
| Form Components | 95% |
| Router/Navigation | 85% |

## Acceptance Criteria

- [ ] All V2 components have unit tests
- [ ] Test utilities set up with proper providers
- [ ] Mock modules working for data hooks
- [ ] Accessibility tests passing with no violations
- [ ] Integration tests covering navigation flows
- [ ] Form validation thoroughly tested
- [ ] Coverage meets minimum thresholds
- [ ] Tests run in CI pipeline
- [ ] Watch mode working for development

## Notes

- Use `bun test` for running tests
- happy-dom provides DOM simulation
- Testing Library for component testing
- jest-axe for accessibility testing
- Mock external dependencies (API calls, hooks)
- Test both success and error states
- Test loading states where applicable
- Use userEvent over fireEvent for realistic interactions

## Verification

```bash
# Run all tests
bun test

# Run with coverage
bun test --coverage

# Run specific test file
bun test src/components/v2/Header/__tests__/Header.test.tsx

# Run in watch mode
bun test --watch
```
