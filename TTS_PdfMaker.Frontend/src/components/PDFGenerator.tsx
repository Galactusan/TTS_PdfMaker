import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { generatePDF } from '../services/api';
import './PDFGenerator.css';

function PDFGenerator() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState<'text' | 'html'>('text');
  const [loading, setLoading] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfId, setPdfId] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Please fill in both title and content');
      return;
    }

    setLoading(true);
    setError(null);
    setPdfBlob(null);
    setPdfUrl(null);
    setPdfId(null);
    setCreatedAt(null);

    try {
      const response = await generatePDF({
        title,
        content,
        contentType,
      });

      setPdfBlob(response.blob);
      const url = URL.createObjectURL(response.blob);
      setPdfUrl(url);
      setPdfId(response.pdfId || null);
      setCreatedAt(response.createdAt || null);
      setCopied(false);
      
      // Log for debugging
      if (response.pdfId) {
        console.log('PDF generated with ID:', response.pdfId);
      } else {
        console.warn('PDF ID not found in response headers');
      }
    } catch (err) {
      let errorMessage = 'Failed to generate PDF. Please check your backend connection.';
      
      if (axios.isAxiosError(err)) {
        // Try to parse blob error response
        if (err.response?.data instanceof Blob) {
          try {
            const text = await err.response.data.text();
            const errorData = JSON.parse(text);
            errorMessage = errorData.message || errorMessage;
          } catch (parseErr) {
            // If parsing fails, use status text
            errorMessage = err.response?.statusText || errorMessage;
          }
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        // Add status code info if available
        if (err.response?.status) {
          errorMessage += ` (Status: ${err.response.status})`;
        }
        
        // Check for CORS errors
        if (err.code === 'ERR_NETWORK' || err.message.includes('CORS')) {
          errorMessage = 'Network error. Please check if the backend is running and CORS is configured correctly.';
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      console.error('Error generating PDF:', err);
    } finally {
      setLoading(false);
    }
  };

    const handleDownload = () => {
    if (pdfBlob && pdfUrl) {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = `${title || 'document'}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    };

    const handleLoadSampleText = () => {
        setContentType('text');
        setTitle('Sample Document - Plain Text');
        setContent(`Introduction

This is a sample plain text document that demonstrates how plain text content appears when converted to PDF format.

Section 1: Overview

Plain text is the simplest form of content. It contains no formatting, no styles, and no special elements. When converted to PDF, it maintains its basic structure through line breaks and paragraphs.

Key Features:
- Simple and readable
- No formatting overhead
- Fast to process
- Universal compatibility
- Easily searchable
- Suitable for automated processing
- Compatible with all PDF viewers

Section 2: Use Cases

Plain text is ideal for:
• Documentation
• Reports
• Simple letters
• Code snippets
• Notes and memos
• System logs
• Data export files

Section 3: Best Practices

When writing plain text for PDF conversion:
1. Use clear line breaks between paragraphs
2. Keep paragraphs concise
3. Use consistent spacing
4. Structure content logically
5. Avoid extremely long lines
6. Include numbered or bulleted lists for clarity
7. Maintain consistent indentation for code

Section 4: Sample Code Snippet

Example of a basic algorithm in plain text:

function calculateSum(a, b) {
    return a + b;
}

Section 5: Notes

- Test multi-page content by adding more paragraphs.
- Check how margins, line breaks, and wrapping behave.
- Verify that document ID and creation date display correctly.

Conclusion

Plain text remains one of the most reliable formats for document generation, especially when simplicity, performance, and compatibility are priorities. It is particularly useful for automated workflows and quick reports.`);
        setError(null);
    };

    const handleLoadSampleHTML = () => {
    setContentType('html');
    setTitle('<h1>Sample Document - HTML Format</h1>');
    setContent(`<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        h1 { color: #667eea; border-bottom: 3px solid #667eea; padding-bottom: 10px; }
        h2 { color: #764ba2; margin-top: 30px; }
        .highlight { background-color: #fff3cd; padding: 2px 6px; border-radius: 3px; }
        ul { background-color: #f8f9fa; padding: 15px 30px; border-left: 4px solid #667eea; }
        ol { margin-left: 30px; }
        .code { background-color: #f4f4f4; padding: 10px; border-radius: 5px; font-family: monospace; }
        table { border-collapse: collapse; width: 100%; margin: 15px 0; }
        table, th, td { border: 1px solid #999; }
        th, td { padding: 8px; text-align: left; }
        blockquote { margin: 15px 0; padding: 10px 20px; border-left: 5px solid #667eea; background: #f0f4ff; }
    </style>
</head>
<body>
    <h1>Introduction</h1>
    <p>This is a sample <span class="highlight">HTML document</span> that demonstrates rich formatting capabilities when converted to PDF format. It includes headings, lists, tables, code snippets, and blockquotes.</p>
    
    <h2>Section 1: Overview</h2>
    <p>HTML allows for rich formatting including:</p>
    <ul>
        <li><strong>Bold text</strong> and <em>italic text</em></li>
        <li>Custom colors and styles</li>
        <li>Structured lists and tables</li>
        <li>Embedded CSS styling</li>
        <li>Blockquotes and highlights</li>
    </ul>

    <h2>Section 2: Advanced Features</h2>
    <ol>
        <li>Custom fonts and typography</li>
        <li>Color-coded sections</li>
        <li>Styled tables and lists</li>
        <li>Visual hierarchy through headings</li>
        <li>Multi-page layout testing</li>
    </ol>

    <h2>Section 3: Code Example</h2>
    <div class="code">
        function generatePDF(content) {<br>
        &nbsp;&nbsp;console.log("Generating PDF with content length: " + content.length);<br>
        &nbsp;&nbsp;return "PDF Ready";<br>
        }<br>
        <br>
        // Example of multi-line code to check wrapping<br>
        for (let i = 0; i < 10; i++) {<br>
        &nbsp;&nbsp;console.log(i);<br>
        }
    </div>

    <h2>Section 4: Sample Table</h2>
    <table>
        <tr>
            <th>Feature</th>
            <th>Description</th>
            <th>Importance</th>
        </tr>
        <tr>
            <td>Headings</td>
            <td>Use <code>&lt;h1&gt;-&lt;h6&gt;</code> for structured hierarchy</td>
            <td>High</td>
        </tr>
        <tr>
            <td>Lists</td>
            <td>Ordered and unordered lists for content clarity</td>
            <td>Medium</td>
        </tr>
        <tr>
            <td>Tables</td>
            <td>Display structured tabular data</td>
            <td>Medium</td>
        </tr>
    </table>

    <h2>Section 5: Blockquote Example</h2>
    <blockquote>
        “HTML provides flexible content styling for professional PDF generation. Use this to test multi-page, spacing, and layout consistency.”
    </blockquote>

    <h2>Conclusion</h2>
    <p>HTML provides extensive formatting options for creating <strong>professional PDF documents</strong> with rich visual presentation, allowing for multi-page layout testing, wrapped text, and consistent styles.</p>
</body>
</html>`);
        setError(null);
    };

  return (
    <div className="pdf-generator">
      <div className="pdf-generator-container">
        <div className="pdf-generator-header">
          <Link to="/" className="back-link">
            ← Back to Home
          </Link>
          <h1>PDF Generator</h1>
        </div>

        <div className="pdf-generator-content">
          <div className="input-section">
            <div className="form-group">
              <label htmlFor="title">PDF Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter PDF title..."
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="content-type">Content Type</label>
              <div className="radio-group">
                <label className={`radio-label ${contentType === 'text' ? 'radio-label-active' : ''}`}>
                  <input
                    type="radio"
                    value="text"
                    checked={contentType === 'text'}
                    onChange={(e) => setContentType(e.target.value as 'text' | 'html')}
                  />
                  <span>Plain Text</span>
                </label>
                <label className={`radio-label ${contentType === 'html' ? 'radio-label-active' : ''}`}>
                  <input
                    type="radio"
                    value="html"
                    checked={contentType === 'html'}
                    onChange={(e) => setContentType(e.target.value as 'text' | 'html')}
                  />
                  <span>HTML</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  contentType === 'text'
                    ? 'Enter your text content here...'
                    : 'Enter your HTML content here...'
                }
                className="textarea-field"
                rows={15}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="button-group">
              <button
                onClick={handleGenerate}
                disabled={loading || !title.trim() || !content.trim()}
                className="generate-button"
              >
                {loading ? (
                  <>
                    <span className="button-spinner"></span>
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <span className="button-icon">📄</span>
                    Generate PDF
                  </>
                )}
              </button>
              
              <div className="test-buttons">
                <button
                  onClick={handleLoadSampleText}
                  className="test-button test-button-text"
                  type="button"
                >
                  <span className="test-icon">📝</span>
                  Load Plain Text Sample
                </button>
                <button
                  onClick={handleLoadSampleHTML}
                  className="test-button test-button-html"
                  type="button"
                >
                  <span className="test-icon">🎨</span>
                  Load HTML Sample
                </button>
              </div>
            </div>
          </div>

          <div className="preview-section">
            <h2>Preview</h2>
            {pdfUrl ? (
              <div className="preview-container">
                <div className="pdf-info">
                  {pdfId ? (
                    <>
                      <div className="pdf-info-header">
                        <h3>📋 PDF Information</h3>
                      </div>
                      <div className="pdf-info-item">
                        <strong>PDF ID:</strong>
                        <span className="pdf-id-value">{pdfId}</span>
                        <button
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(pdfId);
                              setCopied(true);
                              setTimeout(() => setCopied(false), 2000);
                            } catch (err) {
                              console.error('Failed to copy:', err);
                              // Fallback for older browsers
                              const textArea = document.createElement('textarea');
                              textArea.value = pdfId;
                              document.body.appendChild(textArea);
                              textArea.select();
                              document.execCommand('copy');
                              document.body.removeChild(textArea);
                              setCopied(true);
                              setTimeout(() => setCopied(false), 2000);
                            }
                          }}
                          className={`copy-button ${copied ? 'copied' : ''}`}
                          title={copied ? 'Copied!' : 'Copy ID'}
                        >
                          {copied ? '✓ Copied!' : '📋 Copy'}
                        </button>
                      </div>
                      {createdAt && (
                        <div className="pdf-info-item">
                          <strong>Created:</strong>
                          <span>{new Date(createdAt).toLocaleString()}</span>
                        </div>
                      )}
                      <Link to={`/view`} target="_blank" className="view-link">
                        🔍 View this PDF by ID →
                      </Link>
                    </>
                  ) : (
                    <div className="pdf-info-item">
                      <span className="pdf-id-warning">
                        ⚠️ PDF ID not available. Check browser console for details.
                      </span>
                    </div>
                  )}
                </div>
                <iframe
                  src={pdfUrl}
                  className="pdf-preview"
                  title="PDF Preview"
                />
                <button onClick={handleDownload} className="download-button">
                  Download PDF
                </button>
              </div>
            ) : (
              <div className="preview-placeholder">
                <p>Your generated PDF will appear here</p>
                <span>📄</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PDFGenerator;

