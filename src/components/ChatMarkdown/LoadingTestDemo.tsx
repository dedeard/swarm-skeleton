import React, { useEffect, useState } from 'react'
import MarkdownRenderer from './MarkdownRenderer'

const LoadingTestDemo: React.FC = () => {
  const [content, setContent] = useState('')
  const [step, setStep] = useState(0)

  const steps = [
    // Step 0: Empty
    '',
    // Step 1: Start of incomplete block
    '# Video Loading Demo\n\n!#block#! {"type": "video"',
    // Step 2: More incomplete JSON
    '# Video Loading Demo\n\n!#block#! {"type": "video", "content": {"src": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"',
    // Step 3: Even more incomplete
    '# Video Loading Demo\n\n!#block#! {"type": "video", "content": {"src": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", "alt": "Loading video..."',
    // Step 4: Complete JSON but no closing tag
    '# Video Loading Demo\n\n!#block#! {"type": "video", "content": {"src": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", "alt": "Loading video...", "additional": {"width": "640", "height": "360", "controls": true}}}',
    // Step 5: Complete block
    '# Video Loading Demo\n\n!#block#! {"type": "video", "content": {"src": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", "alt": "Complete video", "additional": {"width": "640", "height": "360", "controls": true}}} !#/block#!',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => {
        const next = prev + 1
        if (next >= steps.length) {
          clearInterval(interval)
          return prev
        }
        setContent(steps[next])
        return next
      })
    }, 2000) // Change every 2 seconds

    return () => clearInterval(interval)
  }, [])

  const handleReset = () => {
    setStep(0)
    setContent('')
    setTimeout(() => {
      const interval = setInterval(() => {
        setStep((prev) => {
          const next = prev + 1
          if (next >= steps.length) {
            clearInterval(interval)
            return prev
          }
          setContent(steps[next])
          return next
        })
      }, 2000)
    }, 100)
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <h1>Video Block Loading Demo</h1>
        <button
          onClick={handleReset}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Reset Demo
        </button>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3>
          Current Step: {step} / {steps.length - 1}
        </h3>
        <p>
          {step === 0 && 'Starting...'}
          {step === 1 && 'Incomplete block detected - showing loading state'}
          {step === 2 && 'Still incomplete - loading skeleton visible'}
          {step === 3 && 'JSON still incomplete - loading continues'}
          {step === 4 && 'JSON complete but missing closing tag - still loading'}
          {step === 5 && 'Complete block - video player rendered!'}
        </p>
      </div>

      <div
        style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '1rem',
          backgroundColor: '#f9f9f9',
          marginBottom: '2rem',
        }}
      >
        <h4>Raw Markdown Content:</h4>
        <pre
          style={{
            fontSize: '12px',
            overflow: 'auto',
            backgroundColor: '#fff',
            padding: '1rem',
            borderRadius: '4px',
            border: '1px solid #eee',
          }}
        >
          {content || '(empty)'}
        </pre>
      </div>

      <div
        style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '1rem',
          backgroundColor: '#fff',
        }}
      >
        <h4>Rendered Output:</h4>
        <MarkdownRenderer content={content} />
      </div>
    </div>
  )
}

export default LoadingTestDemo
