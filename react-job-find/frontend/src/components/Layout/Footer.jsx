import React, { useContext } from 'react';
import { Context } from "../../main";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { RiInstagramFill } from "react-icons/ri";

function Footer() {
  const { isAuthorized } = useContext(Context);
  return (
    <footer className={isAuthorized ? "footerShow" : "footerHide"}>
      <div>&copy; All Rights Reserved by Bakir et Iheb.</div>
      <div>
        <Link to={'https://github.com'} target='github'><FaGithub /></Link>
        <Link to={'https://leetcode.com'} target='leetcode'><SiLeetcode /></Link>
        <Link to={'https://www.linkedin.com'} target='linkedin'><FaLinkedin /></Link>
        <Link to={'https://www.instagram.com'} target='instagram'><RiInstagramFill /></Link>
      </div>
      
      {/* Formulaire de contact */}
      <div className="contact-form">
        <form>
          <label htmlFor="name">Nom:</label>
          <input type="text" id="name" name="name" placeholder="Votre nom" required />

          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" placeholder="Votre email" required />

          <label htmlFor="message">Message:</label>
          <textarea id="message" name="message" placeholder="Votre message" rows="4" required></textarea>

          <button type="submit">Envoyer</button>
        </form>
      </div>

      <style jsx>{`
        
        .contact-form h3 {
          margin-bottom: 15px;
        }
        .contact-form label {
          display: block;
          margin: 10px 0 5px;
        }
        .contact-form input,
        .contact-form textarea {
          width: 100%;
          padding: 8px;
          margin-bottom: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .contact-form button {
          background-color: #ffb700;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .contact-form button:hover {
          background-color: white;
           
          color:#ffb700 ;
        }
      `}</style>
    </footer>
  );
}

export default Footer;
