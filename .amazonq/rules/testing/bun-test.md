# Testing Rules with Bun Test Runner

## Purpose
Define standards for writing tests using Bun's native test runner with Testing Library for React components.

## Priority
**High**

## Instructions

### Test File Structure

**ALWAYS** place tests in `__tests__/` directory within component folder (ID: TESTS_DIR)

**ALWAYS** name test files with `.test.tsx` or `.test.ts` extension (ID: TEST_EXTENSION)

**ALWAYS** match test filename to component name (ID: MATCH_FILENAME)

```
ComponentName/
├── Component.tsx
├── View.tsx
└── __tests__/
    └── ComponentName.test.tsx
```

### Test Imports

**ALWAYS** import from `bun:test` for test utilities (ID: BUN_TEST_IMPORTS)

**ALWAYS** import from `@testing-library/react` for React testing (ID: TESTING_LIBRARY)

```typescript
import { describe, expect, test } from 'bun:test';
import { render } from '@testing-library/react';
```

### Test Structure

**ALWAYS** use `describe` blocks to group related tests (ID: DESCRIBE_BLOCKS)

**ALWAYS** use descriptive test names with `test()` function (ID: DESCRIPTIVE_NAMES)

**ALWAYS** follow Arrange-Act-Assert pattern (ID: AAA_PATTERN)

```typescript
import { render } from '@testing-library/react';
import { describe, expect, test } from 'bun:test';

import Markdown from '../View';

describe('src/components/Markdown', () => {
  test('Renders markdown content', () => {
    // Arrange
    const markdown = '# Hello World';
    
    // Act
    const { getByText } = render(<Markdown markdown={markdown} />);
    
    // Assert
    expect(getByText('Hello World')).toBeInTheDocument();
  });
});
```

### Testing React Components

**ALWAYS** use `render()` from Testing Library to render components (ID: USE_RENDER)

**ALWAYS** use Testing Library queries (getByText, queryByText, etc.) (ID: USE_QUERIES)

**ALWAYS** wrap components requiring routing with `BrowserRouter` (ID: WRAP_ROUTER)

```typescript
import { BrowserRouter as Router } from 'react-router';

test('Renders header component', () => {
  const { queryByText } = render(
    <Router>
      <Header />
    </Router>
  );
  expect(queryByText(/Home/)).toBeInTheDocument();
});
```

### Testing View Components

**ALWAYS** test View components directly without Container (ID: TEST_VIEWS)

**ALWAYS** mock query results when testing Views (ID: MOCK_QUERIES)

**NEVER** test data fetching logic in View component tests (ID: NO_FETCH_IN_VIEWS)

```typescript
test('Renders markdown view', () => {
  const mockMarkdown = { markdown: '# Test' };
  const { getByText } = render(<MarkdownView markdown={mockMarkdown} />);
  expect(getByText('Test')).toBeInTheDocument();
});
```

### Assertions

**ALWAYS** use `expect()` for assertions (ID: USE_EXPECT)

**ALWAYS** use `.toBeInTheDocument()` for DOM presence checks (ID: TO_BE_IN_DOCUMENT)

**ALWAYS** use `.toBe()` for primitive equality (ID: TO_BE)

**ALWAYS** use `.toEqual()` for object/array equality (ID: TO_EQUAL)

### Test Coverage

**ALWAYS** test happy path scenarios (ID: TEST_HAPPY_PATH)

**ALWAYS** test error states when applicable (ID: TEST_ERRORS)

**ALWAYS** test edge cases and boundary conditions (ID: TEST_EDGE_CASES)

### Running Tests

**ALWAYS** run tests with `bun test` command (ID: BUN_TEST_COMMAND)

**ALWAYS** ensure tests pass before committing (ID: TESTS_PASS)

```bash
# Run all tests
bun test

# Run specific test file
bun test src/components/Header/__tests__/Header.test.tsx

# Run tests in watch mode
bun test --watch
```

### Test Organization

**ALWAYS** group tests by component path in describe block (ID: PATH_IN_DESCRIBE)

**ALWAYS** use nested describe blocks for complex components (ID: NESTED_DESCRIBE)

```typescript
describe('src/components/Posts', () => {
  describe('PostCard', () => {
    test('renders post title', () => {
      // test implementation
    });
  });
  
  describe('PostsList', () => {
    test('renders list of posts', () => {
      // test implementation
    });
  });
});
```

### Mocking

**ALWAYS** mock external dependencies when needed (ID: MOCK_DEPENDENCIES)

**ALWAYS** use Bun's native mocking capabilities (ID: BUN_MOCKING)

**NEVER** test implementation details (ID: NO_IMPLEMENTATION_TESTS)

## Error Handling

Tests should fail with clear error messages. Use descriptive assertions that explain what went wrong.

## Examples

### Complete Component Test

```typescript
import { render } from '@testing-library/react';
import { describe, expect, test } from 'bun:test';
import { BrowserRouter as Router } from 'react-router';

import Header from '../View';

describe('src/components/Header', () => {
  test('Renders header component', () => {
    const { queryByText } = render(
      <Router>
        <Header />
      </Router>
    );
    expect(queryByText(/nickgalante/)).toBeInTheDocument();
    expect(queryByText(/Home/)).toBeInTheDocument();
    expect(queryByText(/Posts/)).toBeInTheDocument();
    expect(queryByText(/About/)).toBeInTheDocument();
    expect(queryByText(/Contact/)).toBeInTheDocument();
  });
});
```

### Testing Markdown Rendering

```typescript
import { render } from '@testing-library/react';
import { describe, expect, test } from 'bun:test';

import Markdown from '../View';

describe('src/components/Markdown', () => {
  test('Renders markdown content', () => {
    const { getByText } = render(<Markdown markdown="# Hello World" />);
    expect(getByText('Hello World')).toBeInTheDocument();
  });
  
  test('Renders code blocks with syntax highlighting', () => {
    const markdown = '```js\nconst x = 1;\n```';
    const { container } = render(<Markdown markdown={markdown} />);
    expect(container.querySelector('code')).toBeInTheDocument();
  });
});
```
