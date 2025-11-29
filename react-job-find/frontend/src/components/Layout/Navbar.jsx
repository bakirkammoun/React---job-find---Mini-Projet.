import React, { useContext, useEffect, useMemo, useState } from "react";
import { Context } from "../../main";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthorized, setIsAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/user/logout",
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      setIsAuthorized(false);
      navigateTo("/login");
    } catch (error) {
      toast.error(error.response.data.message), setIsAuthorized(true);
    }
  };

  const navLinks = useMemo(() => {
    const baseLinks = [
      { to: "/", label: "Home" },
      { to: "/job/getall", label: "All Jobs" },
      {
        to: "/applications/me",
        label:
          user && user.role === "Employer"
            ? "Applicant Applications"
            : "My Applications",
      },
    ];

    if (user?.role === "Employer") {
      baseLinks.push(
        { to: "/job/post", label: "Post New Job" },
        { to: "/job/me", label: "My Jobs" }
      );
    }
    return baseLinks;
  }, [user]);

  const userInitials = useMemo(() => {
    if (!user?.name) return "CC";
    return user.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [user]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={`navbar ${isAuthorized ? "navbarShow" : "navbarHide"}`}
      aria-label="Primary navigation"
    >
      <div className="container navbar__container">
        <Link to="/" className="navbar__brand">
          <img src="/logos.png" alt="CareerConnect logo" />
          <span>CareerConnect</span>
        </Link>

        <button
          className="navbar__toggle"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <AiOutlineClose /> : <GiHamburgerMenu />}
        </button>

        <ul className={`navbar__links ${isMenuOpen ? "is-open" : ""}`}>
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `navbar__link ${isActive ? "active" : ""}`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
          <li className="navbar__profile">
            <div className="navbar__avatar">{userInitials}</div>
            <div>
              <p>{user?.name || "CareerConnect User"}</p>
              <span>{user?.role || "Guest"}</span>
            </div>
          </li>
          <li>
            <button className="navbar__logout" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
