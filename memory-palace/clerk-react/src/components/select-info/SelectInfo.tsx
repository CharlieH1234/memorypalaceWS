import { useState, FormEvent, useRef } from 'react'
import * as cheerio from 'cheerio'
import { useMemoryPalace } from '../../context/MemoryPalaceContext'
import './SelectInfo.css'

export const SelectInfo = () => {
  const { setSourceText, setCurrentStep, data } = useMemoryPalace()
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const isValidUrl = (urlString: string): boolean => {
    try {
      new URL(urlString)
      return true
    } catch {
      return false
    }
  }

  const extractPoem = async (url: string): Promise<string> => {
    console.log('Fetching URL:', url)
    const proxyUrl = `http://localhost:3001/proxy?url=${encodeURIComponent(url)}`
    console.log('Proxy URL:', proxyUrl)

    const response = await fetch(proxyUrl)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('Response data:', data)
    
    const $ = cheerio.load(data.html)
    console.log('Loaded HTML with Cheerio')
    
    // For Poetry Foundation, extract content
    if (url.includes('poetryfoundation.org')) {
      // First, remove elements we definitely don't want
      $('script, style, noscript, iframe').remove()
      
      // Get the title
      const title = $('h1').first().text().trim()
      console.log('Title:', title)
      
      // Get the author
      let author = ''
      const authorElement = $('.c-txt_attribution, .byline').first()
      if (authorElement.length) {
        author = authorElement.text().trim()
        if (author && !author.toLowerCase().startsWith('by')) {
          author = 'By ' + author
        }
      }
      console.log('Author:', author)
      
      // Clean approach to get ONLY the formatted poem
      let poemText = ''
      
      // DIRECT TARGET: Poetry Foundation's standard poem format
      const oPoem = $('.o-poem')
      if (oPoem.length) {
        console.log('Found standard poem container')
        // Process each line with proper spacing
        oPoem.find('div').each((_, element) => {
          const line = $(element).text().trim()
          poemText += line + '\n'
        })
        
        // Clean up any excess line breaks
        poemText = poemText.trim().replace(/\n{3,}/g, '\n\n')
      } else {
        console.log('No standard poem container found, trying alternative approaches')
        
        // Look specifically for well-formatted poem paragraphs
        let foundFormattedPoem = false
        
        $('.c-feature-bd p, article p, main p, .c-feature p').each((_, element) => {
          const content = $(element).text().trim()
          
          // Only use content that has proper line breaks and looks like a poem
          // (contains multiple line breaks and is substantial in length)
          if (content.includes('\n') && content.length > 100 && !foundFormattedPoem) {
            console.log('Found formatted poem in paragraph')
            poemText = content
            foundFormattedPoem = true
          }
        })
        
        // If still no content, try one more approach with the article body
        if (!poemText) {
          console.log('Trying article body extraction')
          
          const articleBody = $('.o-body, article, .c-feature-bd').first()
          if (articleBody.length) {
            // Get content, filtering out non-poem elements
            const relevantText = articleBody.clone()
            
            // Remove elements that are definitely not part of the poem
            relevantText.find('.o-share, .c-feature-sub, nav, header, footer, .c-meta, .c-feature__footer').remove()
            
            // Also try to find content in specifically formatted divs
            relevantText.find('div.u-text-format-center').each((_, element) => {
              const text = $(element).text().trim()
              if (text.length > 100 && !poemText) {
                poemText = text
              }
            })
            
            // If still no content, get the whole article text as a last resort
            if (!poemText) {
              poemText = relevantText.text().trim()
                .replace(/\s+/g, ' ') // Normalize spaces first
                .replace(/\. /g, '.\n') // Add breaks after sentences
                .replace(/\? /g, '?\n')
                .replace(/! /g, '!\n')
                .replace(/; /g, ';\n')
            }
          }
        }
      }
      
      // Process the poem text to fix formatting issues
      if (poemText) {
        // Fix common formatting issues:
        
        // 1. Add proper line breaks for common poetic structures
        if (!poemText.includes('\n')) {
          poemText = poemText
            .replace(/([.!?]) ([A-Z])/g, '$1\n\n$2') // Add paragraph breaks
            .replace(/([,:;]) ([a-z])/g, '$1\n$2') // Add line breaks at punctuation
        }
        
        // 2. Handle any special formatting
        poemText = poemText
          .replace(/_([^_]+)_/g, '$1') // Remove underscores (might indicate italics)
          .replace(/\t/g, '    ') // Convert tabs to spaces
          .replace(/\n{3,}/g, '\n\n') // Normalize line breaks (max 2)
      }
      
      // Assemble the final text with proper spacing
      const parts = []
      if (title) parts.push(title)
      if (author) parts.push(author)
      if (poemText) parts.push(poemText)
      
      const finalText = parts.join('\n\n')
      console.log('Final extracted text:', finalText)
      return finalText.trim()
    }
    
    // Default return for unsupported websites
    return 'Text extraction not supported for this website. Please try a Poetry Foundation URL or paste text directly.'
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    console.log('Form submitted with URL:', url)

    // Check if it's a URL or direct text input
    const isUrlInput = url.trim().startsWith('http')

    if (isUrlInput) {
      if (!isValidUrl(url)) {
        setError('Please enter a valid URL')
        return
      }

      try {
        setLoading(true)
        const extractedText = await extractPoem(url)
        console.log('Final extracted text:', extractedText)

        if (!extractedText.trim()) {
          throw new Error('No text content found')
        }

        // If the extracted text is just the URL, something went wrong
        if (extractedText.trim() === url.trim()) {
          throw new Error('Failed to extract poem text')
        }

        setSourceText(extractedText)
        setCurrentStep(1) // Move to next step (Chunk-info)
      } catch (err) {
        console.error('Error details:', err)
        setError(err instanceof Error ? err.message : 'Failed to extract text from URL')
      } finally {
        setLoading(false)
      }
    } else {
      // Direct text input - use as is
      setSourceText(url.trim())
      setCurrentStep(1) // Move to next step (Chunk-info)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }, 100)
  }

  const saveEdit = () => {
    if (textareaRef.current) {
      setSourceText(textareaRef.current.value)
    }
    setIsEditing(false)
  }

  const clearForm = () => {
    setUrl('')
    setError('')
  }

  const copyToClipboard = () => {
    if (data.sourceText) {
      navigator.clipboard.writeText(data.sourceText)
    }
  }

  // Helper function to format poem text with proper HTML markup
  const formatPoemText = (text: string): React.ReactNode => {
    if (!text) return null;
    
    return <pre className="poem-display">{text}</pre>;
  };

  return (
    <div className="select-info">
      <h2>Enter URL to Extract Text</h2>
      <form onSubmit={handleSubmit} className="url-form">
        <div className="input-group">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL to extract text or paste text directly"
            className={error ? 'error' : ''}
            disabled={loading}
            data-testid="url-input"
          />
          {url && (
            <button 
              type="button" 
              className="clear-button"
              onClick={clearForm}
            >
              ✕
            </button>
          )}
          {error && <div className="error-message" data-testid="error-message">{error}</div>}
        </div>
        <button 
          type="submit" 
          disabled={loading || !url.trim()}
          data-testid="submit-button"
        >
          {loading ? 'Extracting...' : url.trim().startsWith('http') ? 'Extract Text' : 'Use This Text'}
        </button>
      </form>
      
      {data.sourceText && (
        <div className="extracted-text">
          <h3>Extracted Text:</h3>
          {isEditing ? (
            <div className="edit-controls">
              <textarea
                ref={textareaRef}
                defaultValue={data.sourceText}
                className="edit-textarea"
              />
              <div className="edit-buttons">
                <button onClick={saveEdit}>Save</button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <pre>
                {formatPoemText(data.sourceText)}
              </pre>
              <div className="text-controls">
                <button onClick={handleEdit}>Edit</button>
                <button onClick={copyToClipboard}>Copy</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
