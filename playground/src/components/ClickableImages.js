import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './ClickableImages.css';

function importAll(r) {
    let images = [];
    r.keys().forEach((key, index) => {
        images.push({
            id: index + 1,
            filename: key.replace('./', ''),
            name: `Image ${index + 1}`
        });
    });
    return images;
}

const ClickableImages = ({ onImageClick }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [mousepadDimensions, setMousepadDimensions] = useState({ width: 500, height: 400 });

    const images = importAll(require.context('../assets/images', false, /\.(png|jpe?g|svg)$/));

    const settings = {
        dots: false,
        infinite: true,
        speed: 50,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        variableWidth: true,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        responsive: [
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 2,
            },
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
            },
          },
        ],
      };
      

    const handleImageClick = (filename) => {
        setSelectedImage(filename);
        onImageClick(filename);
        updateMousepadDimensions(filename);
    };
    
    const handleAfterChange = (currentSlide) => {
        setSelectedImage(images[currentSlide].filename);
        updateMousepadDimensions(images[currentSlide].filename);
    };

    useEffect(() => {
        if (selectedImage) {
            updateMousepadDimensions(selectedImage);
        }
    }, [selectedImage]);

    const updateMousepadDimensions = (filename) => {
        const img = new Image();
        img.src = require(`../assets/images/${filename}`);
        img.onload = () => {
            const aspectRatio = img.width / img.height;
            const mousepadWidth = 700;
            const mousepadHeight = mousepadWidth / aspectRatio;
            setMousepadDimensions({ width: mousepadWidth, height: mousepadHeight });
        };
    };

    return (
        <div className='row'>
            <div
                className="mousepad-container"
                style={{
                    width: `${mousepadDimensions.width}px`,
                    height: `${mousepadDimensions.height}px`,
                }}
            >
                {selectedImage && (
                    <img
                        src={require(`../assets/images/${selectedImage}`)}
                        alt="Selected"
                        className="selected-image"
                    />
                )}
                <img
                    src={require(`../assets/logo.jpg`)}
                    alt="Logo"
                    className="logo"
                />
            </div>
            <div className="clickable-images">
            <Slider {...settings}>
                    {images.map((image) => (
                        <div key={image.id} className="image-slide">
                            <img
                                src={require(`../assets/images/${image.filename}`)}
                                alt={image.name}
                                className="clickable-image"
                                onClick={() => handleImageClick(image.filename)}
                            />
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
};

export default ClickableImages;
