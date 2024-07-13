import React from 'react';
import { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, []);
  return (
    <div className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-left">
        <span className="navbar-logo">
        <img
                    src={require(`../../assets/logo.jpg`)}
                    alt="Logo"
                    className="nav-logo"
                    style={
                        {
                            height:80,
                            width:80
                        }
                    }
                />
        </span>
      </div>
      <div className="navbar-center">
      <ul className="navbar-menu">
          <li className="navbar-item">Home</li>
          <li className="navbar-item">About us</li>
          <li className="navbar-item">Explore</li>
          <li className="navbar-item">Pages</li>
          <li className="navbar-item">Blog</li>
          <li className="navbar-item">Contact</li>
          <li className="navbar-item active">Builder</li>
        </ul>
      </div>
      <div className="navbar-right">
        <button className="signin-button">Sign In / Register</button>
      </div>
    </div>
  );
};

export default Navbar;
