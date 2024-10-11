import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Gallery from './components/Gallery';
import FullScreenImage from './components/FullScreenImage';
import Navigation from './components/Navigation';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<Gallery />} />
          <Route path="/image/:id" element={<FullScreenImage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;