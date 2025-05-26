import type { Meta, StoryObj } from '@storybook/react'
import MarkdownRenderer from './MarkdownRenderer'

const meta: Meta<typeof MarkdownRenderer> = {
  title: 'MarkdownProcessor/HTML Content Examples',
  component: MarkdownRenderer,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'HTML content examples for the MarkdownRenderer component, showcasing various HTML elements and structures that can be safely rendered.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    content: {
      description: 'HTML content to render',
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

export const BasicHtmlElements: Story = {
  name: 'Basic HTML Elements',
  args: {
    content: `<div>
  <h1>HTML Elements Showcase</h1>
  
  <h2>Text Formatting</h2>
  <p>This paragraph contains <strong>bold text</strong>, <em>italic text</em>, 
     <u>underlined text</u>, and <code>inline code</code>.</p>
  
  <p>You can also use <mark>highlighted text</mark>, <small>small text</small>, 
     and <del>deleted text</del> with <ins>inserted text</ins>.</p>
  
  <h2>Lists</h2>
  <h3>Unordered List</h3>
  <ul>
    <li>First item</li>
    <li>Second item with <strong>bold text</strong></li>
    <li>Third item
      <ul>
        <li>Nested item 1</li>
        <li>Nested item 2</li>
      </ul>
    </li>
  </ul>
  
  <h3>Ordered List</h3>
  <ol>
    <li>First step</li>
    <li>Second step</li>
    <li>Third step</li>
  </ol>
  
  <h3>Definition List</h3>
  <dl>
    <dt>HTML</dt>
    <dd>HyperText Markup Language</dd>
    <dt>CSS</dt>
    <dd>Cascading Style Sheets</dd>
    <dt>JS</dt>
    <dd>JavaScript</dd>
  </dl>
</div>`,
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic HTML elements including headings, text formatting, and various list types.',
      },
    },
  },
}

export const SemanticHtml: Story = {
  name: 'Semantic HTML Elements',
  args: {
    content: `<article>
  <header>
    <h1>Semantic HTML5 Elements</h1>
    <p>Demonstrating proper semantic structure</p>
  </header>
  
  <nav style="background: #f5f5f5; padding: 1rem; margin: 1rem 0; border-radius: 8px;">
    <h2>Navigation</h2>
    <ul style="list-style: none; padding: 0; display: flex; gap: 1rem; flex-wrap: wrap;">
      <li><a href="#section1" style="color: #007acc; text-decoration: none;">Section 1</a></li>
      <li><a href="#section2" style="color: #007acc; text-decoration: none;">Section 2</a></li>
      <li><a href="#section3" style="color: #007acc; text-decoration: none;">Section 3</a></li>
    </ul>
  </nav>
  
  <main>
    <section id="section1">
      <h2>Main Content Section</h2>
      <p>This is the main content area using semantic HTML5 elements.</p>
      
      <figure style="margin: 1rem 0; text-align: center;">
        <img src="https://via.placeholder.com/400x200/4CAF50/ffffff?text=Figure+Example" 
             alt="Example figure" 
             style="max-width: 100%; height: auto; border-radius: 8px;" />
        <figcaption style="margin-top: 0.5rem; font-style: italic; color: #666;">
          Figure 1: An example image with proper caption
        </figcaption>
      </figure>
    </section>
    
    <section id="section2">
      <h2>Article with Time Elements</h2>
      <article style="border: 1px solid #ddd; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
        <header>
          <h3>Blog Post Title</h3>
          <p style="color: #666; font-size: 0.9rem;">
            Published on <time datetime="2024-01-15">January 15, 2024</time> by 
            <address style="display: inline; font-style: normal;">
              <a href="mailto:author@example.com">John Doe</a>
            </address>
          </p>
        </header>
        
        <p>This is a sample blog post content demonstrating the use of semantic HTML elements 
           like <code>&lt;article&gt;</code>, <code>&lt;time&gt;</code>, and <code>&lt;address&gt;</code>.</p>
        
        <footer style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #eee; font-size: 0.9rem; color: #666;">
          <p>Tags: <span style="background: #e9ecef; padding: 0.25rem 0.5rem; border-radius: 4px; margin-right: 0.5rem;">HTML</span>
                   <span style="background: #e9ecef; padding: 0.25rem 0.5rem; border-radius: 4px; margin-right: 0.5rem;">Semantic</span>
                   <span style="background: #e9ecef; padding: 0.25rem 0.5rem; border-radius: 4px;">Web Development</span></p>
        </footer>
      </article>
    </section>
    
    <section id="section3">
      <h2>Details and Summary</h2>
      <details style="border: 1px solid #ddd; border-radius: 8px; margin: 1rem 0;">
        <summary style="background: #f8f9fa; padding: 1rem; cursor: pointer; border-radius: 8px 8px 0 0;">
          <strong>Click to expand technical details</strong>
        </summary>
        <div style="padding: 1rem;">
          <p>This content is hidden by default and can be expanded using the details/summary elements.</p>
          <ul>
            <li>Accessible by default</li>
            <li>No JavaScript required</li>
            <li>Semantic and meaningful</li>
          </ul>
        </div>
      </details>
    </section>
  </main>
  
  <aside style="background: #f8f9fa; padding: 1rem; margin: 1rem 0; border-radius: 8px; border-left: 4px solid #007acc;">
    <h3>Related Information</h3>
    <p>This sidebar contains supplementary information related to the main content.</p>
    <blockquote style="margin: 1rem 0; padding-left: 1rem; border-left: 3px solid #ccc; font-style: italic;">
      "Semantic HTML improves accessibility and SEO while making code more maintainable."
    </blockquote>
  </aside>
  
  <footer style="margin-top: 2rem; padding: 1rem; background: #f8f9fa; border-radius: 8px; text-align: center;">
    <p style="margin: 0; color: #666;">© 2024 Semantic HTML Example. All rights reserved.</p>
  </footer>
</article>`,
  },
  parameters: {
    docs: {
      description: {
        story: 'Semantic HTML5 elements including article, section, nav, aside, header, footer, figure, and time.',
      },
    },
  },
}

export const DataTables: Story = {
  name: 'Data Tables',
  args: {
    content: `<div>
  <h1>HTML Data Tables</h1>
  
  <h2>Basic Table</h2>
  <table style="width: 100%; border-collapse: collapse; margin: 1rem 0; border: 1px solid #ddd;">
    <caption style="padding: 0.5rem; font-weight: bold; background: #f8f9fa;">
      Employee Information
    </caption>
    <thead>
      <tr style="background: #e9ecef;">
        <th style="border: 1px solid #ddd; padding: 0.75rem; text-align: left;">Name</th>
        <th style="border: 1px solid #ddd; padding: 0.75rem; text-align: left;">Position</th>
        <th style="border: 1px solid #ddd; padding: 0.75rem; text-align: left;">Department</th>
        <th style="border: 1px solid #ddd; padding: 0.75rem; text-align: right;">Salary</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="border: 1px solid #ddd; padding: 0.75rem;">John Smith</td>
        <td style="border: 1px solid #ddd; padding: 0.75rem;">Senior Developer</td>
        <td style="border: 1px solid #ddd; padding: 0.75rem;">Engineering</td>
        <td style="border: 1px solid #ddd; padding: 0.75rem; text-align: right;">$95,000</td>
      </tr>
      <tr style="background: #f8f9fa;">
        <td style="border: 1px solid #ddd; padding: 0.75rem;">Jane Doe</td>
        <td style="border: 1px solid #ddd; padding: 0.75rem;">Product Manager</td>
        <td style="border: 1px solid #ddd; padding: 0.75rem;">Product</td>
        <td style="border: 1px solid #ddd; padding: 0.75rem; text-align: right;">$105,000</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 0.75rem;">Mike Johnson</td>
        <td style="border: 1px solid #ddd; padding: 0.75rem;">UX Designer</td>
        <td style="border: 1px solid #ddd; padding: 0.75rem;">Design</td>
        <td style="border: 1px solid #ddd; padding: 0.75rem; text-align: right;">$80,000</td>
      </tr>
    </tbody>
    <tfoot>
      <tr style="background: #e9ecef; font-weight: bold;">
        <td colspan="3" style="border: 1px solid #ddd; padding: 0.75rem;">Total</td>
        <td style="border: 1px solid #ddd; padding: 0.75rem; text-align: right;">$280,000</td>
      </tr>
    </tfoot>
  </table>
  
  <h2>Complex Table with Merged Cells</h2>
  <table style="width: 100%; border-collapse: collapse; margin: 1rem 0; border: 1px solid #ddd;">
    <caption style="padding: 0.5rem; font-weight: bold; background: #f8f9fa;">
      Quarterly Sales Report
    </caption>
    <thead>
      <tr style="background: #e9ecef;">
        <th rowspan="2" style="border: 1px solid #ddd; padding: 0.75rem; text-align: left; vertical-align: middle;">Product</th>
        <th colspan="4" style="border: 1px solid #ddd; padding: 0.75rem; text-align: center;">Quarters</th>
        <th rowspan="2" style="border: 1px solid #ddd; padding: 0.75rem; text-align: center; vertical-align: middle;">Total</th>
      </tr>
      <tr style="background: #e9ecef;">
        <th style="border: 1px solid #ddd; padding: 0.75rem; text-align: center;">Q1</th>
        <th style="border: 1px solid #ddd; padding: 0.75rem; text-align: center;">Q2</th>
        <th style="border: 1px solid #ddd; padding: 0.75rem; text-align: center;">Q3</th>
        <th style="border: 1px solid #ddd; padding: 0.75rem; text-align: center;">Q4</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="border: 1px solid #ddd; padding: 0.75rem; font-weight: bold;">Widget A</td>
        <td style="border: 1px solid #ddd; padding: 0.75rem; text-align: center;">$25,000</td>
        <td style="border: 1px solid #ddd; padding: 0.75rem; text-align: center;">$30,000</td>
        <td style="border: 1px solid #ddd; padding: 0.75rem; text-align: center;">$28,000</td>
        <td style="border: 1px solid #ddd; padding: 0.75rem; text-align: center;">$35,000</td>
        <td style="border: 1px solid #ddd; padding: 0.75rem; text-align: center; font-weight: bold;">$118,000</td>
      </tr>
      <tr style="background: #f8f9fa;">
        <td style="border: 1px solid #ddd; padding: 0.75rem; font-weight: bold;">Widget B</td>
        <td style="border: 1px solid #ddd; padding: 0.75rem; text-align: center;">$15,000</td>
        <td style="border: 1px solid #ddd; padding: 0.75rem; text-align: center;">$18,000</td>
        <td style="border: 1px solid #ddd; padding: 0.75rem; text-align: center;">$22,000</td>
        <td style="border: 1px solid #ddd; padding: 0.75rem; text-align: center;">$20,000</td>
        <td style="border: 1px solid #ddd; padding: 0.75rem; text-align: center; font-weight: bold;">$75,000</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 0.75rem; font-weight: bold;">Widget C</td>
        <td style="border: 1px solid #ddd; padding: 0.75rem; text-align: center;">$10,000</td>
        <td style="border: 1px solid #ddd; padding: 0.75rem; text-align: center;">$12,000</td>
        <td style="border: 1px solid #ddd; padding: 0.75rem; text-align: center;">$15,000</td>
        <td style="border: 1px solid #ddd; padding: 0.75rem; text-align: center;">$18,000</td>
        <td style="border: 1px solid #ddd; padding: 0.75rem; text-align: center; font-weight: bold;">$55,000</td>
      </tr>
    </tbody>
    <tfoot>
      <tr style="background: #e9ecef; font-weight: bold;">
        <td style="border: 1px solid #ddd; padding: 0.75rem;">Total</td>
        <td style="border: 1px solid #ddd; padding: 0.75rem; text-align: center;">$50,000</td>
        <td style="border: 1px solid #ddd; padding: 0.75rem; text-align: center;">$60,000</td>
        <td style="border: 1px solid #ddd; padding: 0.75rem; text-align: center;">$65,000</td>
        <td style="border: 1px solid #ddd; padding: 0.75rem; text-align: center;">$73,000</td>
        <td style="border: 1px solid #ddd; padding: 0.75rem; text-align: center;">$248,000</td>
      </tr>
    </tfoot>
  </table>
</div>`,
  },
  parameters: {
    docs: {
      description: {
        story: 'Complex HTML tables with captions, headers, footers, and merged cells using rowspan and colspan.',
      },
    },
  },
}

export const MediaElements: Story = {
  name: 'Media Elements',
  args: {
    content: `<div>
  <h1>HTML Media Elements</h1>
  
  <h2>Images with Different Attributes</h2>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin: 1rem 0;">
    <figure>
      <img src="https://via.placeholder.com/300x200/FF6B6B/ffffff?text=Responsive+Image" 
           alt="Responsive image example" 
           style="width: 100%; height: auto; border-radius: 8px;" />
      <figcaption style="text-align: center; margin-top: 0.5rem; font-style: italic;">
        Responsive Image (100% width)
      </figcaption>
    </figure>
    
    <figure>
      <img src="https://via.placeholder.com/300x200/4ECDC4/ffffff?text=Fixed+Size" 
           alt="Fixed size image" 
           width="300" 
           height="200" 
           style="border-radius: 8px; display: block; margin: 0 auto;" />
      <figcaption style="text-align: center; margin-top: 0.5rem; font-style: italic;">
        Fixed Size Image (300x200)
      </figcaption>
    </figure>
  </div>
  
  <h2>Audio Element</h2>
  <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
    <p><strong>Audio Player:</strong></p>
    <audio controls style="width: 100%; margin: 0.5rem 0;">
      <source src="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" type="audio/wav">
      <source src="https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3" type="audio/mpeg">
      Your browser does not support the audio element.
    </audio>
    <p style="font-size: 0.9rem; color: #666; margin: 0;">
      <em>Note: Audio file may not be available in this demo environment.</em>
    </p>
  </div>
  
  <h2>Video Element</h2>
  <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
    <p><strong>Video Player:</strong></p>
    <video controls width="100%" style="max-width: 640px; border-radius: 8px;">
      <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4">
      <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.webm" type="video/webm">
      Your browser does not support the video tag.
    </video>
    <p style="font-size: 0.9rem; color: #666; margin: 0.5rem 0 0 0;">
      <em>Sample video: Big Buck Bunny (Creative Commons)</em>
    </p>
  </div>
  
  <h2>Embedded Content</h2>
  <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
    <h3>Iframe Example</h3>
    <iframe 
      src="https://www.openstreetmap.org/export/embed.html?bbox=-0.004017949104309083%2C51.47612752641776%2C0.00030577182769775396%2C51.478569861898606&layer=mapnik" 
      width="100%" 
      height="300" 
      style="border: 1px solid #ddd; border-radius: 8px;"
      title="OpenStreetMap Embed">
    </iframe>
    <p style="font-size: 0.9rem; color: #666; margin: 0.5rem 0 0 0;">
      <em>Embedded OpenStreetMap (iframe)</em>
    </p>
  </div>
  
  <h2>SVG Graphics</h2>
  <div style="text-align: center; margin: 1rem 0;">
    <svg width="200" height="200" style="border: 1px solid #ddd; border-radius: 8px; background: white;">
      <circle cx="100" cy="100" r="80" fill="#4ECDC4" stroke="#333" stroke-width="2"/>
      <text x="100" y="105" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">
        SVG Circle
      </text>
    </svg>
    <p style="font-size: 0.9rem; color: #666; margin: 0.5rem 0 0 0;">
      <em>Inline SVG Graphics</em>
    </p>
  </div>
</div>`,
  },
  parameters: {
    docs: {
      description: {
        story: 'HTML media elements including images, audio, video, iframes, and SVG graphics.',
      },
    },
  },
}

export const InteractiveElements: Story = {
  name: 'Interactive Elements',
  args: {
    content: `<div>
  <h1>Interactive HTML Elements</h1>
  
  <h2>Progress and Meter Elements</h2>
  <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
    <div style="margin-bottom: 1rem;">
      <label for="progress1" style="display: block; margin-bottom: 0.5rem;">Download Progress:</label>
      <progress id="progress1" value="75" max="100" style="width: 100%; height: 20px;">75%</progress>
      <span style="margin-left: 0.5rem; font-size: 0.9rem;">75%</span>
    </div>
    
    <div style="margin-bottom: 1rem;">
      <label for="meter1" style="display: block; margin-bottom: 0.5rem;">Disk Usage:</label>
      <meter id="meter1" value="0.6" min="0" max="1" style="width: 100%; height: 20px;">60%</meter>
      <span style="margin-left: 0.5rem; font-size: 0.9rem;">60% used</span>
    </div>
    
    <div>
      <label for="meter2" style="display: block; margin-bottom: 0.5rem;">Battery Level:</label>
      <meter id="meter2" value="85" min="0" max="100" low="20" high="80" optimum="90" style="width: 100%; height: 20px;">85%</meter>
      <span style="margin-left: 0.5rem; font-size: 0.9rem;">85% charged</span>
    </div>
  </div>
  
  <h2>Collapsible Content</h2>
  <details style="border: 1px solid #ddd; border-radius: 8px; margin: 1rem 0;">
    <summary style="background: #f8f9fa; padding: 1rem; cursor: pointer; border-radius: 8px 8px 0 0; font-weight: bold;">
      📋 Project Details
    </summary>
    <div style="padding: 1rem;">
      <h4>Project Information</h4>
      <ul>
        <li><strong>Name:</strong> MarkdownRenderer Component</li>
        <li><strong>Status:</strong> In Development</li>
        <li><strong>Progress:</strong> 
          <progress value="80" max="100" style="margin-left: 0.5rem;">80%</progress>
        </li>
      </ul>
      
      <details style="margin-top: 1rem; border: 1px solid #e9ecef; border-radius: 4px;">
        <summary style="background: #f1f3f4; padding: 0.5rem; cursor: pointer; font-weight: bold;">
          🔧 Technical Specifications
        </summary>
        <div style="padding: 0.5rem;">
          <p>Built with React, TypeScript, and Storybook for comprehensive documentation.</p>
          <ul>
            <li>React 18+</li>
            <li>TypeScript 5+</li>
            <li>Storybook 7+</li>
            <li>Tailwind CSS</li>
          </ul>
        </div>
      </details>
    </div>
  </details>
  
  <details style="border: 1px solid #ddd; border-radius: 8px; margin: 1rem 0;">
    <summary style="background: #f8f9fa; padding: 1rem; cursor: pointer; border-radius: 8px 8px 0 0; font-weight: bold;">
      📊 Performance Metrics
    </summary>
    <div style="padding: 1rem;">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        <div style="text-align: center; padding: 1rem; background: #e8f5e8; border-radius: 8px;">
          <h4 style="margin: 0 0 0.5rem 0; color: #2e7d32;">Load Time</h4>
          <div style="font-size: 1.5rem; font-weight: bold; color: #2e7d32;">1.2s</div>
          <meter value="0.8" style="width: 100%; margin-top: 0.5rem;"></meter>
        </div>
        
        <div style="text-align: center; padding: 1rem; background: #fff3e0; border-radius: 8px;">
          <h4 style="margin: 0 0 0.5rem 0; color: #f57c00;">Bundle Size</h4>
          <div style="font-size: 1.5rem; font-weight: bold; color: #f57c00;">45KB</div>
          <meter value="0.6" style="width: 100%; margin-top: 0.5rem;"></meter>
        </div>
        
        <div style="text-align: center; padding: 1rem; background: #e3f2fd; border-radius: 8px;">
          <h4 style="margin: 0 0 0.5rem 0; color: #1976d2;">Accessibility</h4>
          <div style="font-size: 1.5rem; font-weight: bold; color: #1976d2;">95%</div>
          <meter value="0.95" style="width: 100%; margin-top: 0.5rem;"></meter>
        </div>
      </div>
    </div>
  </details>
  
  <h2>Dialog-like Content</h2>
  <div style="border: 2px solid #007acc; border-radius: 12px; padding: 1.5rem; margin: 1rem 0; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);">
    <h3 style="margin-top: 0; color: #007acc;">💡 Information Dialog</h3>
    <p>This demonstrates how dialog-like content can be created using HTML and CSS styling.</p>
    <div style="display: flex; gap: 1rem; margin-top: 1rem; flex-wrap: wrap;">
      <button style="background: #007acc; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
        Accept
      </button>
      <button style="background: #6c757d; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
        Cancel
      </button>
      <button style="background: transparent; color: #007acc; border: 1px solid #007acc; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
        Learn More
      </button>
    </div>
  </div>
</div>`,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive HTML elements including progress bars, meters, collapsible details, and dialog-like content.',
      },
    },
  },
}

export const AccessibilityFeatures: Story = {
  name: 'Accessibility Features',
  args: {
    content: `<div>
  <h1>HTML Accessibility Features</h1>
  
  <h2>ARIA Labels and Roles</h2>
  <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
    <nav role="navigation" aria-label="Main navigation">
      <ul style="list-style: none; padding: 0; display: flex; gap: 1rem; flex-wrap: wrap;">
        <li><a href="#home" aria-current="page" style="color: #007acc; font-weight: bold; text-decoration: none;">Home</a></li>
        <li><a href="#about" style="color: #007acc; text-decoration: none;">About</a></li>
        <li><a href="#services" style="color: #007acc; text-decoration: none;">Services</a></li>
        <li><a href="#contact" style="color: #007acc; text-decoration: none;">Contact</a></li>
      </ul>
    </nav>
  </div>
  
  <h2>Form Accessibility</h2>
  <form style="max-width: 500px; margin: 1rem 0;">
    <fieldset style="border: 1px solid #ddd; border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
      <legend>Contact Information</legend>
      
      <div style="margin-bottom: 1rem;">
        <label for="name-input" style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Full Name:</label>
        <input type="text" id="name-input" name="name" required aria-describedby="name-help" 
               style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;" />
        <small id="name-help" style="color: #666; font-size: 0.8rem;">Enter your first and last name</small>
      </div>
      
      <div style="margin-bottom: 1rem;">
        <label for="email-input" style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Email Address:</label>
        <input type="email" id="email-input" name="email" required aria-describedby="email-help" 
               style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;" />
        <small id="email-help" style="color: #666; font-size: 0.8rem;">We'll never share your email</small>
      </div>
      
      <div style="margin-bottom: 1rem;">
        <label for="message-input" style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Message:</label>
        <textarea id="message-input" name="message" rows="4" required aria-describedby="message-help"
                  style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;"></textarea>
        <small id="message-help" style="color: #666; font-size: 0.8rem;">Minimum 10 characters required</small>
      </div>
    </fieldset>
    
    <button type="submit" style="background: #007acc; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 4px; cursor: pointer;">
      Send Message
    </button>
  </form>
  
  <h2>Skip Links and Focus Management</h2>
  <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
    <a href="#main-content" style="position: absolute; left: -9999px; color: #007acc; text-decoration: none; padding: 0.5rem; background: white; border: 1px solid #ccc;">
      Skip to main content
    </a>
    <div id="main-content" tabindex="-1">
      <h3>Main Content Area</h3>
      <p>This area can be focused programmatically for better accessibility.</p>
    </div>
  </div>
  
  <h2>ARIA Live Regions</h2>
  <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
    <h3>Status Updates</h3>
    <div aria-live="polite" aria-atomic="true" style="background: #d4edda; color: #155724; padding: 0.75rem; border-radius: 4px; margin: 0.5rem 0;">
      ✅ Form saved successfully
    </div>
    <div aria-live="assertive" aria-atomic="true" style="background: #f8d7da; color: #721c24; padding: 0.75rem; border-radius: 4px; margin: 0.5rem 0;">
      ❌ Error: Please check your input
    </div>
  </div>
  
  <h2>Accessible Data Visualization</h2>
  <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
    <h3>Progress Chart</h3>
    <div role="img" aria-labelledby="chart-title" aria-describedby="chart-desc">
      <h4 id="chart-title">Project Completion Status</h4>
      <p id="chart-desc">A visual representation of project completion across different phases</p>
      
      <div style="display: flex; align-items: end; gap: 0.5rem; height: 150px; margin: 1rem 0;">
        <div style="background: #007acc; width: 40px; height: 80%; display: flex; align-items: end; justify-content: center; color: white; font-size: 0.8rem; padding-bottom: 0.25rem;" 
             role="img" aria-label="Planning: 90% complete">90%</div>
        <div style="background: #28a745; width: 40px; height: 60%; display: flex; align-items: end; justify-content: center; color: white; font-size: 0.8rem; padding-bottom: 0.25rem;" 
             role="img" aria-label="Development: 75% complete">75%</div>
        <div style="background: #ffc107; width: 40px; height: 40%; display: flex; align-items: end; justify-content: center; color: black; font-size: 0.8rem; padding-bottom: 0.25rem;" 
             role="img" aria-label="Testing: 50% complete">50%</div>
        <div style="background: #dc3545; width: 40px; height: 20%; display: flex; align-items: end; justify-content: center; color: white; font-size: 0.8rem; padding-bottom: 0.25rem;" 
             role="img" aria-label="Deployment: 25% complete">25%</div>
      </div>
      
      <div style="display: flex; gap: 0.5rem; font-size: 0.8rem;">
        <span>Planning</span>
        <span>Development</span>
        <span>Testing</span>
        <span>Deployment</span>
      </div>
    </div>
  </div>
</div>`,
  },
  parameters: {
    docs: {
      description: {
        story: 'HTML accessibility features including ARIA labels, roles, live regions, and accessible form elements.',
      },
    },
  },
}
