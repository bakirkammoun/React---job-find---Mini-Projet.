import React, { useState } from "react";
import { FaBuilding, FaSuitcase, FaUsers, FaUserPlus, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const details = [
    {
      id: 1,
      title: "1,23,441",
      subTitle: "Live Job",
      icon: <FaSuitcase />,
    },
    {
      id: 2,
      title: "91220",
      subTitle: "Companies",
      icon: <FaBuilding />,
    },
    {
      id: 3,
      title: "2,34,200",
      subTitle: "Job Seekers",
      icon: <FaUsers />,
    },
    {
      id: 4,
      title: "1,03,761",
      subTitle: "Employers",
      icon: <FaUserPlus />,
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/job/getall?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/job/getall");
    }
  };

  return (
    <>
      <div className="heroSection">
        <div className="container">
          <div className="title">
            <h1>
              Find a job that <span className="highlight">suits</span>
            </h1>
            <h1>
              your interests and <span className="highlight">skills</span>
            </h1>
            <p>
              Discover job opportunities that match your skills and passions.
              Connect with employers seeking talent like yours for rewarding
              careers.
            </p>
            <form className="heroSearch" onSubmit={handleSearch}>
              <div className="heroSearch__wrapper">
                <FaSearch className="heroSearch__icon" />
                <input
                  type="text"
                  placeholder="Search for jobs, companies, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="heroSearch__input"
                />
                <button type="submit" className="heroSearch__button">
                  Search Jobs
                </button>
              </div>
            </form>
          </div>
          <div className="image">
            <img src="/imhome.jpg" alt="hero" />
          </div>
        </div>
        <div className="details">
          {details.map((element) => {
            return (
              <div className="card" key={element.id}>
                <div className="icon">{element.icon}</div>
                <div className="content">
                  <p>{element.title}</p>
                  <p>{element.subTitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default HeroSection;
