import React, { useState } from 'react';
import './App.css';
import ClickableImages from './components/ClickableImages';
import Navbar from './components/Nav/Navbar';

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (imageName) => {
    setSelectedImage(imageName);
  };

  const images = [];

  return (
    <div className="app">
      <Navbar />
      <div className="content">
        <ClickableImages images={images} onImageClick={handleImageClick} />
      </div>
    </div>
  );
};

export default App;
