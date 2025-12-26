import { Link } from 'react-router-dom';
import './Homepage.css';

function Homepage() {
  return (
    <div className="homepage">
      <div className="homepage-container">
        <h1 className="homepage-title">PDF Maker</h1>
        <p className="homepage-subtitle">
          Create professional PDF documents from your text or HTML content
        </p>
        <div className="homepage-features">
          <div className="feature-card">
            <h3>📝 Plain Text Support</h3>
            <p>Write your content in plain text format</p>
          </div>
          <div className="feature-card">
            <h3>🎨 HTML Support</h3>
            <p>Use HTML for rich formatting and styling</p>
          </div>
          <div className="feature-card">
            <h3>👁️ Live Preview</h3>
            <p>Preview your PDF before downloading</p>
          </div>
          <div className="feature-card">
            <h3>🔍 View by ID</h3>
            <p>Retrieve and view existing PDFs by their ID</p>
          </div>
        </div>
        <div className="homepage-actions">
          <Link to="/generate" className="cta-button">
            Create PDF Now
          </Link>
          <Link to="/view" className="cta-button secondary">
            View PDF by ID
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Homepage;

