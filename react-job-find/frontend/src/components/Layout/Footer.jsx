import React, { useContext } from "react";
import { Context } from "../../main";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaDribbble } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "All Jobs", to: "/job/getall" },
  { label: "My Applications", to: "/applications/me" },
  { label: "Post a Job", to: "/job/post", employerOnly: true },
];

const socialLinks = [
  { label: "GitHub", to: "https://github.com", icon: <FaGithub /> },
  { label: "LinkedIn", to: "https://www.linkedin.com", icon: <FaLinkedin /> },
  { label: "Dribbble", to: "https://dribbble.com", icon: <FaDribbble /> },
  { label: "Instagram", to: "https://www.instagram.com", icon: <RiInstagramFill /> },
];

function Footer() {
  const { isAuthorized, user } = useContext(Context);

  if (!isAuthorized) return null;

  return (
    <footer className="footer">
      <div className="footer__grid">
        <div>
          <Link to="/" className="footer__brand">
            <img src="/logos.png" alt="CareerConnect logo" />
            <span>CareerConnect</span>
          </Link>
          <p>
            Craft your next career step with curated opportunities, modern tools,
            and a community built for ambitious talent.
          </p>
          <div className="footer__social">
            {socialLinks.map((link) => (
              <a key={link.label} href={link.to} target="_blank" rel="noreferrer">
                {link.icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4>Quick Links</h4>
          <ul>
            {quickLinks.map((link) => {
              if (link.employerOnly && user?.role !== "Employer") return null;
              return (
                <li key={link.label}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="footer__newsletter">
          <h4>Stay in the loop</h4>
          <p>Get curated vacancies and product updates once a week.</p>
          <form>
            <input type="email" placeholder="Your email address" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="footer__bottom">
        <span>© {new Date().getFullYear()} CareerConnect. All rights reserved.</span>
        <div className="footer__legal">
          <Link to="#">Privacy</Link>
          <Link to="#">Terms</Link>
          <Link to="#">Support</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
