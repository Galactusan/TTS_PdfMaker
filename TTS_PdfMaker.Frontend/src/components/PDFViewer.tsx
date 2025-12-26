import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getPdfById, getPdfMetadata, type PdfMetadata } from '../services/api';
import './PDFViewer.css';

function PDFViewer() {
  const [pdfId, setPdfId] = useState('');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<PdfMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoadPdf = async () => {
    if (!pdfId.trim()) {
      setError('Please enter a PDF ID');
      return;
    }

    // Validate GUID format (basic check)
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!guidRegex.test(pdfId.trim())) {
      setError('Invalid PDF ID format. Please enter a valid GUID.');
      return;
    }

    setLoading(true);
    setError(null);
    setPdfUrl(null);
    setMetadata(null);

    try {
      // Load PDF and metadata in parallel
      const [pdfBlob, pdfMetadata] = await Promise.all([
        getPdfById(pdfId.trim()),
        getPdfMetadata(pdfId.trim())
      ]);

      // Create object URL for PDF display
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      setMetadata(pdfMetadata);
    } catch (err: any) {
      setError(err.message || 'Failed to load PDF');
      setPdfUrl(null);
      setMetadata(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!pdfUrl || !metadata) return;

    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `report-${metadata.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLoadPdf();
    }
  };

  // Cleanup object URL on unmount
  const handleClear = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
    setPdfUrl(null);
    setMetadata(null);
    setError(null);
    setPdfId('');
  };

  return (
    <div className="pdf-viewer">
      <div className="pdf-viewer-container">
        <div className="pdf-viewer-header">
          <h1>View PDF by ID</h1>
          <Link to="/" className="back-link">← Back to Home</Link>
        </div>

        <div className="pdf-viewer-controls">
          <div className="input-group">
            <label htmlFor="pdfId">PDF ID (GUID):</label>
            <div className="input-with-button">
              <input
                id="pdfId"
                type="text"
                value={pdfId}
                onChange={(e) => setPdfId(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter PDF ID (e.g., 123e4567-e89b-12d3-a456-426614174000)"
                className="pdf-id-input"
                disabled={loading}
              />
              <button
                onClick={handleLoadPdf}
                disabled={loading || !pdfId.trim()}
                className="load-button"
              >
                {loading ? 'Loading...' : 'Load PDF'}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p>❌ {error}</p>
          </div>
        )}

        {metadata && (
          <div className="pdf-metadata">
            <h3>PDF Information</h3>
            <div className="metadata-grid">
              <div className="metadata-item">
                <span className="metadata-label">ID:</span>
                <span className="metadata-value">{metadata.id}</span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">Title:</span>
                <span className="metadata-value">{metadata.title}</span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">Content Type:</span>
                <span className="metadata-value">{metadata.contentType}</span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">Created At:</span>
                <span className="metadata-value">
                  {new Date(metadata.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {pdfUrl && (
          <div className="pdf-display-section">
            <div className="pdf-actions">
              <button onClick={handleDownload} className="download-button">
                📥 Download PDF
              </button>
              <button onClick={handleClear} className="clear-button">
                Clear
              </button>
            </div>
            <div className="pdf-embed-container">
              <iframe
                src={pdfUrl}
                title="PDF Viewer"
                className="pdf-iframe"
              />
            </div>
          </div>
        )}

        {!pdfUrl && !loading && !error && (
          <div className="empty-state">
            <p>Enter a PDF ID above to view and download the PDF.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PDFViewer;

