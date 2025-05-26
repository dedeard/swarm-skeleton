import type { Meta, StoryObj } from '@storybook/react'
import MarkdownRenderer from './MarkdownRenderer'

const meta: Meta<typeof MarkdownRenderer> = {
  title: 'ChatMarkdown/Markdown Content Examples',
  component: MarkdownRenderer,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Markdown content examples for the MarkdownRenderer component, showcasing various markdown syntax and formatting options.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    content: {
      description: 'Markdown content to render',
      control: { type: 'text' },
    },
    className: {
      description: 'Additional CSS classes',
      control: { type: 'text' },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const BasicMarkdownSyntax: Story = {
  name: 'Basic Markdown Syntax',
  args: {
    content: `# Heading Level 1

## Heading Level 2

### Heading Level 3

#### Heading Level 4

##### Heading Level 5

###### Heading Level 6

## Text Formatting

This is a paragraph with **bold text**, *italic text*, and ***bold italic text***.

You can also use __bold text__ and _italic text_ with underscores.

Here's some ~~strikethrough text~~ and \`inline code\`.

## Links and References

- [External link](https://example.com)
- [Link with title](https://example.com "Example Website")
- [Reference link][ref1]
- <https://example.com> (automatic link)
- <email@example.com> (automatic email link)

[ref1]: https://example.com "Reference link example"

## Line Breaks and Paragraphs

This is the first paragraph.

This is the second paragraph with a  
line break (two spaces at the end).

This is the third paragraph.

---

## Horizontal Rules

Above and below this text are horizontal rules created with three dashes.

***

You can also use three asterisks.

___

Or three underscores.`,
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic markdown syntax including headings, text formatting, links, and horizontal rules.',
      },
    },
  },
}

export const ListsAndQuotes: Story = {
  name: 'Lists and Blockquotes',
  args: {
    content: `# Lists and Blockquotes

## Unordered Lists

- First item
- Second item
- Third item
  - Nested item 1
  - Nested item 2
    - Deeply nested item
    - Another deeply nested item
- Fourth item

Alternative syntax:

* Item with asterisk
* Another item
  * Nested with asterisk
  * Another nested item

+ Item with plus
+ Another item
  + Nested with plus

## Ordered Lists

1. First item
2. Second item
3. Third item
   1. Nested numbered item
   2. Another nested numbered item
      1. Deeply nested item
      2. Another deeply nested item
4. Fourth item

## Mixed Lists

1. First ordered item
2. Second ordered item
   - Unordered sub-item
   - Another unordered sub-item
     1. Nested ordered item
     2. Another nested ordered item
3. Third ordered item

## Task Lists

- [x] Completed task
- [x] Another completed task
- [ ] Incomplete task
- [ ] Another incomplete task
  - [x] Nested completed task
  - [ ] Nested incomplete task

## Blockquotes

> This is a simple blockquote.

> This is a blockquote
> that spans multiple lines
> and continues here.

> ## Blockquote with heading
> 
> This blockquote contains a heading and multiple paragraphs.
> 
> - It can also contain lists
> - And other markdown elements
> 
> > This is a nested blockquote
> > inside another blockquote.

> **Note:** Blockquotes can contain any markdown formatting including **bold**, *italic*, and \`code\`.`,
  },
  parameters: {
    docs: {
      description: {
        story: 'Various list types including unordered, ordered, nested, task lists, and blockquotes.',
      },
    },
  },
}

export const CodeAndSyntaxHighlighting: Story = {
  name: 'Code and Syntax Highlighting',
  args: {
    content: `# Code Examples

## Inline Code

Use \`backticks\` to create inline code. You can also use \`console.log()\` or \`npm install\`.

## Code Blocks

### Plain Code Block

\`\`\`
This is a plain code block
without syntax highlighting.
It preserves formatting and spacing.
\`\`\`

### JavaScript

\`\`\`javascript
// JavaScript example
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);

// ES6 features
const greet = (name = 'World') => \`Hello, \${name}!\`;
console.log(greet('Developer'));
\`\`\`

### TypeScript

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
  isActive?: boolean;
}

class UserService {
  private users: User[] = [];

  addUser(user: User): void {
    this.users.push(user);
  }

  findUser(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  getActiveUsers(): User[] {
    return this.users.filter(user => user.isActive !== false);
  }
}

const userService = new UserService();
\`\`\`

### Python

\`\`\`python
# Python example
def fibonacci(n):
    """Calculate fibonacci number recursively."""
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# List comprehension
squares = [x**2 for x in range(10)]

# Class definition
class Calculator:
    def __init__(self):
        self.history = []
    
    def add(self, a, b):
        result = a + b
        self.history.append(f"{a} + {b} = {result}")
        return result

calc = Calculator()
print(calc.add(5, 3))
\`\`\`

### CSS

\`\`\`css
/* CSS example */
.markdown-renderer {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.markdown-renderer h1 {
  border-bottom: 2px solid #eee;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.markdown-renderer code {
  background: #f5f5f5;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-family: 'Monaco', 'Consolas', monospace;
}

@media (max-width: 768px) {
  .markdown-renderer {
    padding: 1rem;
  }
}
\`\`\``,
  },
  parameters: {
    docs: {
      description: {
        story: 'Code blocks with syntax highlighting for various programming languages.',
      },
    },
  },
}

export const TablesAndData: Story = {
  name: 'Tables and Data',
  args: {
    content: `# Tables and Data Presentation

## Basic Table

| Name | Age | City | Occupation |
|------|-----|------|------------|
| John Doe | 30 | New York | Developer |
| Jane Smith | 25 | San Francisco | Designer |
| Bob Johnson | 35 | Chicago | Manager |

## Table with Alignment

| Left Aligned | Center Aligned | Right Aligned |
|:-------------|:--------------:|--------------:|
| Left | Center | Right |
| This text | is centered | $1,234.56 |
| is left | in the | $567.89 |
| aligned | middle | $2,345.67 |

## Complex Table

| Feature | Basic Plan | Pro Plan | Enterprise |
|---------|:----------:|:--------:|:----------:|
| **Storage** | 10 GB | 100 GB | Unlimited |
| **Users** | 1 | 10 | Unlimited |
| **Support** | Email | Email + Chat | 24/7 Phone |
| **API Access** | ❌ | ✅ | ✅ |
| **Custom Domain** | ❌ | ✅ | ✅ |
| **Analytics** | Basic | Advanced | Enterprise |
| **Price** | Free | $9/month | $99/month |

## Table with Code and Links

| Technology | Description | Documentation | Status |
|------------|-------------|---------------|--------|
| React | UI Library | [Docs](https://reactjs.org) | ✅ Active |
| TypeScript | Type Safety | [Docs](https://typescriptlang.org) | ✅ Active |
| Storybook | Component Docs | [Docs](https://storybook.js.org) | ✅ Active |
| \`react-markdown\` | Markdown Parser | [GitHub](https://github.com/remarkjs/react-markdown) | ✅ Active |`,
  },
  parameters: {
    docs: {
      description: {
        story: 'Various table formats including basic tables, aligned columns, and complex data presentation.',
      },
    },
  },
}

export const ImagesAndMedia: Story = {
  name: 'Images and Media',
  args: {
    content: `# Images and Media

## Basic Images

![Sample Image](https://via.placeholder.com/400x200/0066cc/ffffff?text=Sample+Image)

## Image with Alt Text and Title

![Responsive Design Example](https://via.placeholder.com/600x300/28a745/ffffff?text=Responsive+Design "This is a tooltip title")

## Multiple Images

Here are some example images:

![Small Image](https://via.placeholder.com/200x150/ff6b6b/ffffff?text=Small)
![Medium Image](https://via.placeholder.com/300x200/4ecdc4/ffffff?text=Medium)
![Large Image](https://via.placeholder.com/500x300/45b7d1/ffffff?text=Large)

## Images with Captions

![Architecture Diagram](https://via.placeholder.com/600x400/6c5ce7/ffffff?text=System+Architecture)
*Figure 1: System architecture overview showing the main components and their relationships.*

## Reference-style Images

Here's an image using reference-style syntax:

![React Logo][react-logo]

And here's another one:

![TypeScript Logo][ts-logo]

[react-logo]: https://via.placeholder.com/200x200/61dafb/000000?text=React "React JavaScript Library"
[ts-logo]: https://via.placeholder.com/200x200/3178c6/ffffff?text=TS "TypeScript Language"

## Linked Images

Click on the image below to visit the documentation:

[![Documentation](https://via.placeholder.com/400x200/9b59b6/ffffff?text=Click+for+Docs)](https://example.com/docs)`,
  },
  parameters: {
    docs: {
      description: {
        story: 'Various image formats and usage patterns including basic images, galleries, linked images, and media presentation.',
      },
    },
  },
}

export const AdvancedFormatting: Story = {
  name: 'Advanced Formatting',
  args: {
    content:
      `# Advanced Markdown Formatting

## Emphasis and Strong Emphasis

This text has *emphasis* and this has **strong emphasis**.

You can also use _underscores for emphasis_ and __double underscores for strong__.

***This text is both strong and emphasized.***

## Strikethrough and Highlighting

~~This text is struck through~~

You can combine ~~strikethrough~~ with **bold** and *italic* text.

## Escape Characters

You can escape special characters with backslashes:

- \\* This asterisk is literal
- \\# This hash is literal  
- \\[This bracket is literal\\]
- \\` +
      '`' +
      `This backtick is literal\\` +
      '`' +
      `

## Line Breaks and Spacing

This line ends with two spaces  
So this line appears below it.

This paragraph has a normal line break.

This paragraph is separated by a blank line.

## Mixed Content Examples

Here's a complex example combining multiple elements:

> ### Important Note
> 
> This blockquote contains:
> 
> 1. A **heading**
> 2. A numbered list
> 3. Some \`inline code\`
> 4. A [link](https://example.com)
> 
> \`\`\`javascript
> // And even a code block
> const message = "Markdown is powerful!";
> console.log(message);
> \`\`\`

## Special Characters and Symbols

### Currency Symbols
- Dollar: $
- Euro: €
- Pound: £
- Yen: ¥

### Mathematical Symbols
- Plus/Minus: ±
- Multiplication: ×
- Division: ÷
- Infinity: ∞

### Arrows and Symbols
- Right Arrow: →
- Left Arrow: ←
- Up Arrow: ↑
- Down Arrow: ↓
- Check Mark: ✓
- Cross Mark: ✗
- Star: ★
- Heart: ♥`,
  },
  parameters: {
    docs: {
      description: {
        story: 'Advanced markdown formatting including special characters and complex nested structures.',
      },
    },
  },
}

export const DocumentationExample: Story = {
  name: 'Documentation Example',
  args: {
    content: `# MarkdownRenderer Component Documentation

## Overview

The \`MarkdownRenderer\` component is a comprehensive React component for rendering markdown content with support for custom blocks, syntax highlighting, and HTML content.

## Installation

\`\`\`bash
npm install @your-org/markdown-renderer
\`\`\`

## Quick Start

\`\`\`tsx
import { MarkdownRenderer } from '@your-org/markdown-renderer';

function App() {
  const content = \`# Hello World

This is **markdown** content!\`;

  return <MarkdownRenderer content={content} />;
}
\`\`\`

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`content\` | \`string\` | \`""\` | The markdown content to render |
| \`className\` | \`string\` | \`undefined\` | Additional CSS classes |

### Example Usage

\`\`\`tsx
<MarkdownRenderer 
  content="# Hello World\\n\\nThis is **markdown**!" 
  className="custom-markdown"
/>
\`\`\`

## Features

### ✅ Supported Features

- [x] **Basic Markdown**: Headers, paragraphs, emphasis
- [x] **Lists**: Ordered, unordered, and task lists
- [x] **Code Blocks**: With syntax highlighting
- [x] **Tables**: With alignment support
- [x] **Links and Images**: Including reference-style
- [x] **Blockquotes**: With nested support
- [x] **HTML Content**: Safe HTML rendering
- [x] **Custom Blocks**: Video, HTML, and markdown blocks

### 🚧 Planned Features

- [ ] **Math Support**: LaTeX-style mathematical expressions
- [ ] **Mermaid Diagrams**: Flowcharts and diagrams
- [ ] **Emoji Support**: GitHub-style emoji shortcuts
- [ ] **Table of Contents**: Auto-generated navigation

## Configuration

### Basic Configuration

\`\`\`tsx
const config = {
  sanitize: true,
  allowedTags: ['h1', 'h2', 'h3', 'p', 'strong', 'em'],
  syntaxHighlighting: true
};
\`\`\`

## Custom Blocks

### Video Block

\`\`\`markdown
!#block#!{"type":"video","content":{"src":"video.mp4","alt":"Demo video"}}!#/block#!
\`\`\`

### HTML Block

\`\`\`markdown
!#block#!{"type":"html","content":"<div class=\\"custom\\">Custom HTML</div>"}!#/block#!
\`\`\`

## Performance

### Bundle Size

| Component | Size (gzipped) |
|-----------|----------------|
| Core | 15KB |
| Syntax Highlighting | 25KB |
| Video Support | 5KB |
| **Total** | **45KB** |

### Optimization Tips

1. **Code Splitting**: Load syntax highlighting only when needed
2. **Lazy Loading**: Use React.lazy for video components
3. **Memoization**: Wrap in React.memo for static content

\`\`\`tsx
const OptimizedRenderer = React.memo(MarkdownRenderer);
\`\`\`

## Troubleshooting

### Common Issues

#### Issue: Syntax highlighting not working

**Solution**: Make sure you have the required CSS imported:

\`\`\`tsx
import 'highlight.js/styles/github.css';
\`\`\`

#### Issue: Custom blocks not rendering

**Solution**: Check the block syntax and ensure proper JSON formatting:

\`\`\`markdown
// ❌ Incorrect
!#block#!{type:"video"}!#/block#!

// ✅ Correct  
!#block#!{"type":"video","content":{"src":"video.mp4"}}!#/block#!
\`\`\`

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](https://docs.example.com)
- 🐛 [Issues](https://github.com/your-org/markdown-renderer/issues)
- 💬 [Discussions](https://github.com/your-org/markdown-renderer/discussions)`,
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete documentation example showing how to document a component with markdown.',
      },
    },
  },
}
