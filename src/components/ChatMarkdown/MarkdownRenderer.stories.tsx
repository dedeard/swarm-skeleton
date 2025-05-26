import type { Meta, StoryObj } from '@storybook/react'
import MarkdownRenderer from './MarkdownRenderer'

const meta: Meta<typeof MarkdownRenderer> = {
  title: 'ChatMarkdown/MarkdownRenderer',
  component: MarkdownRenderer,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A comprehensive markdown renderer that supports both markdown and HTML content with syntax highlighting, custom components, and security features.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    content: {
      description: 'Markdown or HTML content to render',
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

// ===== MARKDOWN CONTENT STORIES =====

export const BasicMarkdown: Story = {
  name: 'Basic Markdown',
  args: {
    content: `# Welcome to MarkdownRenderer

This is a **basic markdown** example with various formatting options.

## Features

- **Bold text** and *italic text*
- \`inline code\` and code blocks
- [Links](https://example.com)
- Lists and more!

### Code Example

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet('World');
\`\`\`

> This is a blockquote with some important information.

---

That's all for now!`,
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic markdown content with headers, formatting, lists, code blocks, and blockquotes.',
      },
    },
  },
}

export const AdvancedMarkdown: Story = {
  name: 'Advanced Markdown Features',
  args: {
    content: `# Advanced Markdown Features

## Tables

| Feature | Supported | Notes |
|---------|-----------|-------|
| Headers | ✅ | H1-H6 |
| Lists | ✅ | Ordered & Unordered |
| Code | ✅ | Syntax highlighting |
| Tables | ✅ | With alignment |

## Code Blocks with Different Languages

### JavaScript
\`\`\`javascript
const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
\`\`\`

### Python
\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Generate first 10 fibonacci numbers
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")
\`\`\`

### CSS
\`\`\`css
.markdown-renderer {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  line-height: 1.6;
  color: #333;
}

.markdown-renderer h1 {
  border-bottom: 2px solid #eee;
  padding-bottom: 0.5rem;
}
\`\`\`

## Task Lists

- [x] Implement basic markdown parsing
- [x] Add syntax highlighting
- [ ] Add table support
- [ ] Add emoji support
- [x] Security sanitization

## Nested Lists

1. First level
   - Second level item 1
   - Second level item 2
     - Third level item
       - Fourth level item
2. Back to first level
   1. Nested numbered list
   2. Another numbered item

## Links and Images

Check out [React](https://reactjs.org) for more information.

![Placeholder Image](https://via.placeholder.com/400x200/0066cc/ffffff?text=Sample+Image)`,
  },
  parameters: {
    docs: {
      description: {
        story: 'Advanced markdown features including tables, multiple code languages, task lists, and nested structures.',
      },
    },
  },
}

export const CodeHeavyMarkdown: Story = {
  name: 'Code-Heavy Content',
  args: {
    content: `# Code Documentation Example

## React Component

\`\`\`tsx
import React, { useState, useEffect } from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';

interface DocumentationProps {
  content: string;
  title?: string;
  className?: string;
}

export const Documentation: React.FC<DocumentationProps> = ({
  content,
  title = 'Documentation',
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return <div className="loading">Loading documentation...</div>;
  }
  
  return (
    <div className={\`documentation \${className}\`}>
      <h1>{title}</h1>
      <MarkdownRenderer content={content} />
    </div>
  );
};
\`\`\`

## API Usage

\`\`\`javascript
// Fetch and render documentation
async function loadDocumentation(docId) {
  try {
    const response = await fetch(\`/api/docs/\${docId}\`);
    const { content, title } = await response.json();
    
    const renderer = new MarkdownRenderer({
      content,
      sanitize: true,
      highlightCode: true
    });
    
    return renderer.render();
  } catch (error) {
    console.error('Failed to load documentation:', error);
    return '<p>Error loading documentation</p>';
  }
}
\`\`\`

## Shell Commands

\`\`\`bash
# Install dependencies
npm install react-markdown remark-gfm rehype-highlight

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test -- --coverage
\`\`\`

## SQL Example

\`\`\`sql
-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (username, email) VALUES
  ('john_doe', 'john@example.com'),
  ('jane_smith', 'jane@example.com'),
  ('bob_wilson', 'bob@example.com');
\`\`\``,
  },
  parameters: {
    docs: {
      description: {
        story: 'Code-heavy content showcasing syntax highlighting across multiple programming languages.',
      },
    },
  },
}

// ===== HTML CONTENT STORIES =====

export const BasicHtml: Story = {
  name: 'Basic HTML Content',
  args: {
    content: `<div class="html-content">
  <h1>HTML Content Example</h1>
  
  <p>This is <strong>HTML content</strong> being rendered through the MarkdownRenderer component.</p>
  
  <div style="background: #f5f5f5; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
    <h3>Styled Container</h3>
    <p>This container has custom styling applied directly via HTML.</p>
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
  </div>
  
  <blockquote style="border-left: 4px solid #007acc; padding-left: 1rem; margin: 1rem 0; font-style: italic;">
    This is an HTML blockquote with custom styling.
  </blockquote>
  
  <p>
    <a href="https://example.com" target="_blank" rel="noopener noreferrer">External Link</a> |
    <code>inline code</code> |
    <em>emphasized text</em>
  </p>
</div>`,
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic HTML content with various elements, styling, and formatting.',
      },
    },
  },
}

export const ComplexHtml: Story = {
  name: 'Complex HTML Structure',
  args: {
    content: `<article class="complex-html-example">
  <header>
    <h1>Complex HTML Document</h1>
    <p class="subtitle">Demonstrating various HTML elements and structures</p>
  </header>
  
  <section>
    <h2>Form Elements</h2>
    <form style="background: #f9f9f9; padding: 1rem; border-radius: 8px;">
      <div style="margin-bottom: 1rem;">
        <label for="name" style="display: block; margin-bottom: 0.5rem;">Name:</label>
        <input type="text" id="name" name="name" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;" />
      </div>
      
      <div style="margin-bottom: 1rem;">
        <label for="email" style="display: block; margin-bottom: 0.5rem;">Email:</label>
        <input type="email" id="email" name="email" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;" />
      </div>
      
      <div style="margin-bottom: 1rem;">
        <label for="message" style="display: block; margin-bottom: 0.5rem;">Message:</label>
        <textarea id="message" name="message" rows="4" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;"></textarea>
      </div>
      
      <button type="submit" style="background: #007acc; color: white; padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer;">
        Submit
      </button>
    </form>
  </section>
  
  <section>
    <h2>Data Table</h2>
    <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
      <thead>
        <tr style="background: #f0f0f0;">
          <th style="border: 1px solid #ddd; padding: 0.5rem; text-align: left;">Product</th>
          <th style="border: 1px solid #ddd; padding: 0.5rem; text-align: left;">Price</th>
          <th style="border: 1px solid #ddd; padding: 0.5rem; text-align: left;">Stock</th>
          <th style="border: 1px solid #ddd; padding: 0.5rem; text-align: left;">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="border: 1px solid #ddd; padding: 0.5rem;">Widget A</td>
          <td style="border: 1px solid #ddd; padding: 0.5rem;">$19.99</td>
          <td style="border: 1px solid #ddd; padding: 0.5rem;">150</td>
          <td style="border: 1px solid #ddd; padding: 0.5rem;">
            <span style="background: #28a745; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem;">
              In Stock
            </span>
          </td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 0.5rem;">Widget B</td>
          <td style="border: 1px solid #ddd; padding: 0.5rem;">$29.99</td>
          <td style="border: 1px solid #ddd; padding: 0.5rem;">0</td>
          <td style="border: 1px solid #ddd; padding: 0.5rem;">
            <span style="background: #dc3545; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem;">
              Out of Stock
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
  
  <section>
    <h2>Media Elements</h2>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0;">
      <div>
        <h3>Image</h3>
        <img src="https://via.placeholder.com/300x200/007acc/ffffff?text=Sample+Image" 
             alt="Sample image" 
             style="width: 100%; height: auto; border-radius: 8px;" />
      </div>
      <div>
        <h3>Video Placeholder</h3>
        <div style="background: #333; color: white; padding: 2rem; text-align: center; border-radius: 8px;">
          <p>🎥 Video Content</p>
          <p style="font-size: 0.9rem; opacity: 0.8;">Video would be embedded here</p>
        </div>
      </div>
    </div>
  </section>
  
  <footer style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #eee;">
    <p style="text-align: center; color: #666; font-size: 0.9rem;">
      This is a complex HTML example demonstrating various elements and styling.
    </p>
  </footer>
</article>`,
  },
  parameters: {
    docs: {
      description: {
        story: 'Complex HTML content with forms, tables, media elements, and advanced styling.',
      },
    },
  },
}

export const HtmlFormElements: Story = {
  name: 'HTML Form Elements',
  args: {
    content: `<div>
  <h1>HTML Form Elements Showcase</h1>
  
  <form style="max-width: 600px; margin: 0 auto;">
    <fieldset style="margin-bottom: 1rem; padding: 1rem; border: 1px solid #ddd; border-radius: 8px;">
      <legend>Personal Information</legend>
      
      <div style="margin-bottom: 1rem;">
        <label for="fullname" style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Full Name:</label>
        <input type="text" id="fullname" name="fullname" placeholder="Enter your full name" 
               style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;" />
      </div>
      
      <div style="margin-bottom: 1rem;">
        <label for="email" style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Email:</label>
        <input type="email" id="email" name="email" placeholder="your.email@example.com" 
               style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;" />
      </div>
      
      <div style="margin-bottom: 1rem;">
        <label for="phone" style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Phone:</label>
        <input type="tel" id="phone" name="phone" placeholder="+1 (555) 123-4567" 
               style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;" />
      </div>
    </fieldset>
    
    <fieldset style="margin-bottom: 1rem; padding: 1rem; border: 1px solid #ddd; border-radius: 8px;">
      <legend>Preferences</legend>
      
      <div style="margin-bottom: 1rem;">
        <label for="country" style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Country:</label>
        <select id="country" name="country" style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;">
          <option value="">Select a country</option>
          <option value="us">United States</option>
          <option value="ca">Canada</option>
          <option value="uk">United Kingdom</option>
          <option value="au">Australia</option>
          <option value="de">Germany</option>
        </select>
      </div>
      
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Interests:</label>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.5rem;">
          <label style="display: flex; align-items: center; font-weight: normal;">
            <input type="checkbox" name="interests" value="technology" style="margin-right: 0.5rem;" />
            Technology
          </label>
          <label style="display: flex; align-items: center; font-weight: normal;">
            <input type="checkbox" name="interests" value="design" style="margin-right: 0.5rem;" />
            Design
          </label>
          <label style="display: flex; align-items: center; font-weight: normal;">
            <input type="checkbox" name="interests" value="business" style="margin-right: 0.5rem;" />
            Business
          </label>
          <label style="display: flex; align-items: center; font-weight: normal;">
            <input type="checkbox" name="interests" value="science" style="margin-right: 0.5rem;" />
            Science
          </label>
        </div>
      </div>
      
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Experience Level:</label>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <label style="display: flex; align-items: center; font-weight: normal;">
            <input type="radio" name="experience" value="beginner" style="margin-right: 0.5rem;" />
            Beginner
          </label>
          <label style="display: flex; align-items: center; font-weight: normal;">
            <input type="radio" name="experience" value="intermediate" style="margin-right: 0.5rem;" />
            Intermediate
          </label>
          <label style="display: flex; align-items: center; font-weight: normal;">
            <input type="radio" name="experience" value="advanced" style="margin-right: 0.5rem;" />
            Advanced
          </label>
        </div>
      </div>
    </fieldset>
    
    <div style="text-align: center;">
      <button type="submit" style="background: #007acc; color: white; padding: 0.75rem 2rem; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem;">
        Submit Form
      </button>
    </div>
  </form>
</div>`,
  },
  parameters: {
    docs: {
      description: {
        story: 'Comprehensive HTML form elements including inputs, selects, checkboxes, radio buttons, and fieldsets.',
      },
    },
  },
}

// ===== MIXED CONTENT STORIES =====

export const MixedContent: Story = {
  name: 'Mixed Markdown and HTML',
  args: {
    content: `# Mixed Markdown and HTML Content

This example demonstrates **mixing markdown** with HTML elements seamlessly.

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; border-radius: 12px; margin: 1rem 0;">
  <h2 style="margin-top: 0;">HTML Section</h2>
  <p>This is an HTML section with custom styling embedded within markdown content.</p>
</div>

## Markdown Section

Back to regular markdown with:

- **Bold text**
- *Italic text*
- \`inline code\`

### Code Block

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const users: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];
\`\`\`

<details style="margin: 1rem 0;">
  <summary style="cursor: pointer; padding: 0.5rem; background: #f5f5f5; border-radius: 4px;">
    <strong>Click to expand HTML details</strong>
  </summary>
  <div style="padding: 1rem; border: 1px solid #ddd; border-top: none; border-radius: 0 0 4px 4px;">
    <p>This is collapsible content using HTML details/summary elements.</p>
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
  </div>
</details>

## Another Markdown Section

> This is a markdown blockquote that comes after HTML content.

The seamless integration allows for maximum flexibility in content creation.`,
  },
  parameters: {
    docs: {
      description: {
        story: 'Mixed content combining markdown syntax with HTML elements for maximum flexibility.',
      },
    },
  },
}

// ===== VIDEO BLOCK STORIES =====

const sampleVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
const samplePosterUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg'

export const BasicVideoBlock: Story = {
  name: 'Basic Video Block',
  args: {
    content: `# Video Block Demo

Here's a basic video block:

!#block#!{"type":"video","content":{"src":"${sampleVideoUrl}","alt":"Sample video demonstration","additional":{"autoplay":false,"controls":true,"width":"640","height":"360"}}}!#/block#!

This video block demonstrates the basic functionality of the video player.`,
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic video block with standard controls and configuration.',
      },
    },
  },
}

export const VideoWithPoster: Story = {
  name: 'Video with Poster',
  args: {
    content: `# Video with Poster Image

This video includes a poster image that displays before playback:

!#block#!{"type":"video","content":{"src":"${sampleVideoUrl}","alt":"Video with poster image","additional":{"autoplay":false,"controls":true,"width":"640","height":"360","poster":"${samplePosterUrl}"}}}!#/block#!

The poster image provides a preview of the video content.`,
  },
  parameters: {
    docs: {
      description: {
        story: 'Video block with poster image for better user experience.',
      },
    },
  },
}

export const ResponsiveVideo: Story = {
  name: 'Responsive Video',
  args: {
    content: `# Responsive Video Player

This video player adapts to different screen sizes:

!#block#!{"type":"video","content":{"src":"${sampleVideoUrl}","alt":"Responsive video player","additional":{"autoplay":false,"controls":true,"width":"100%","height":"auto"}}}!#/block#!

The video will scale to fit the container width while maintaining aspect ratio.`,
  },
  parameters: {
    docs: {
      description: {
        story: 'Responsive video that adapts to container size.',
      },
    },
  },
}

// ===== EDGE CASES AND TESTING =====

export const EmptyContent: Story = {
  name: 'Empty Content',
  args: {
    content: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'Testing behavior with empty content.',
      },
    },
  },
}

export const SpecialCharacters: Story = {
  name: 'Special Characters',
  args: {
    content: `# Special Characters & Symbols

## Mathematical Symbols
- α, β, γ, δ, ε (Greek letters)
- ∑, ∏, ∫, ∂ (Mathematical operators)
- ≤, ≥, ≠, ≈, ∞ (Comparison symbols)

## Currency & Numbers
- $1,234.56 (USD)
- €987.65 (EUR)
- ¥12,345 (JPY)
- £543.21 (GBP)

## Arrows & Symbols
- → ← ↑ ↓ (Directional arrows)
- ✓ ✗ ★ ☆ (Check marks and stars)
- © ® ™ (Legal symbols)

## Code with Special Characters

\`\`\`javascript
const specialChars = {
  quotes: '"Hello" & 'World'',
  symbols: '<>&',
  unicode: '🚀 🎉 💻 🔥',
  math: 'x² + y² = z²'
};

// Template literal with special characters
const message = \`
  Welcome to the "special" characters demo!
  Math: 2 + 2 = 4 & 3 × 3 = 9
  Symbols: © 2024 | All rights reserved ®
\`;
\`\`\`

<div style="background: #f0f8ff; padding: 1rem; border-left: 4px solid #0066cc; margin: 1rem 0;">
  <strong>Note:</strong> All special characters should be properly escaped and rendered safely.
</div>`,
  },
  parameters: {
    docs: {
      description: {
        story: 'Testing rendering of special characters, symbols, and Unicode content.',
      },
    },
  },
}

export const CustomStyling: Story = {
  name: 'Custom CSS Classes',
  args: {
    content: `# Custom Styled Content

This example shows how the MarkdownRenderer handles custom CSS classes and styling.

## Default Styling

Regular markdown content with default styling applied.

## Custom Classes

<div class="custom-highlight">
This content should have custom highlighting if CSS classes are properly applied.
</div>

\`\`\`css
.custom-highlight {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  color: white;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
}
\`\`\``,
    className: 'custom-markdown-theme',
  },
  parameters: {
    docs: {
      description: {
        story: 'Testing custom CSS classes and styling integration.',
      },
    },
  },
}
