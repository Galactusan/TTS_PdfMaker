import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';
import PDFGenerator from './components/PDFGenerator';
import PDFViewer from './components/PDFViewer';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/generate" element={<PDFGenerator />} />
        <Route path="/view" element={<PDFViewer />} />
      </Routes>
    </Router>
  );
}

export default App;
