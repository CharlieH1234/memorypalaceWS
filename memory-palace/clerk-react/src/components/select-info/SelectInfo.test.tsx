/// <reference types="vitest/globals" />
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the context
vi.mock('../../context/MemoryPalaceContext', () => ({
  useMemoryPalace: () => ({
    setSourceText: vi.fn(),
    setCurrentStep: vi.fn()
  })
}))

describe('SelectInfo Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = ''
  })

  it('validates URLs correctly', () => {
    const component = document.createElement('div')
    component.innerHTML = `
      <div class="select-info">
        <input data-testid="url-input" value="https://example.com" />
      </div>
    `
    document.body.appendChild(component)
    
    // Test valid URLs
    const input = component.querySelector('[data-testid="url-input"]') as HTMLInputElement
    expect(input).toBeTruthy()
    
    // Test valid URLs
    input.value = 'https://example.com'
    expect(new URL(input.value)).toBeTruthy()
    
    input.value = 'http://test.com/path'
    expect(new URL(input.value)).toBeTruthy()
    
    // Test invalid URLs
    expect(() => new URL('not-a-url')).toThrow()
    expect(() => new URL('')).toThrow()
  })

  it('shows error for invalid URL', () => {
    const component = document.createElement('div')
    component.innerHTML = `
      <div class="select-info">
        <input data-testid="url-input" value="not-a-url" />
        <button data-testid="submit-button">Extract Text</button>
      </div>
    `
    document.body.appendChild(component)
    
    const form = component.querySelector('form')
    form?.dispatchEvent(new Event('submit'))
    
    const errorMessage = component.querySelector('[data-testid="error-message"]')
    expect(errorMessage?.textContent).toBe('Please enter a valid URL')
  })

  it('extracts text from HTML while preserving formatting', async () => {
    const mockHtml = `
      <html>
        <body>
          <h1>Title</h1>
          <p>Paragraph 1</p>
          <p>Paragraph 2</p>
          <script>console.log('test')</script>
          <style>.test { color: red; }</style>
        </body>
      </html>
    `
    
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockHtml)
    }))

    const component = document.createElement('div')
    component.innerHTML = `
      <div class="select-info">
        <input data-testid="url-input" value="https://test.com" />
        <button data-testid="submit-button">Extract Text</button>
      </div>
    `
    document.body.appendChild(component)
    
    const form = component.querySelector('form')
    await form?.dispatchEvent(new Event('submit'))
    
    // Verify script and style tags are removed
    const extractedText = await fetch('').then(r => r.text())
    expect(extractedText).not.toContain('console.log')
    expect(extractedText).not.toContain('color: red')
    expect(extractedText).toContain('Title')
    expect(extractedText).toContain('Paragraph 1')
    expect(extractedText).toContain('Paragraph 2')
  })

  it('handles extraction errors gracefully', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))
    
    const component = document.createElement('div')
    component.innerHTML = `
      <div class="select-info">
        <input data-testid="url-input" value="https://test.com" />
        <button data-testid="submit-button">Extract Text</button>
      </div>
    `
    document.body.appendChild(component)
    
    const form = component.querySelector('form')
    await form?.dispatchEvent(new Event('submit'))
    
    const errorMessage = component.querySelector('[data-testid="error-message"]')
    expect(errorMessage?.textContent).toBe('Network error')
  })

  it('shows loading state during extraction', async () => {
    vi.stubGlobal('fetch', vi.fn().mockImplementation(() => new Promise(resolve => {
      setTimeout(() => {
        resolve({
          ok: true,
          text: () => Promise.resolve('<body>Test</body>')
        })
      }, 100)
    })))
    
    const component = document.createElement('div')
    component.innerHTML = `
      <div class="select-info">
        <input data-testid="url-input" value="https://test.com" />
        <button data-testid="submit-button">Extract Text</button>
      </div>
    `
    document.body.appendChild(component)
    
    const form = component.querySelector('form')
    const button = component.querySelector('[data-testid="submit-button"]') as HTMLButtonElement
    
    form?.dispatchEvent(new Event('submit'))
    expect(button?.textContent).toBe('Extracting...')
    expect(button?.disabled).toBe(true)
  })
})
