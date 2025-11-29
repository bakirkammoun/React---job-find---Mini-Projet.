import React from "react";
import { FaMicrosoft, FaApple } from "react-icons/fa";
import { SiTesla } from "react-icons/si";
import { useNavigate } from "react-router-dom";

const PopularCompanies = () => {
  const navigate = useNavigate();
  
  const companies = [
    {
      id: 1,
      title: "Microsoft",
      location: "Redmond, Washington",
      openPositions: "164,000",
      icon: <FaMicrosoft />,
      color: "#00A4EF",
    },
    {
      id: 2,
      title: "Tesla",
      location: "Palo Alto, California",
      openPositions: "133,000",
      icon: <SiTesla />,
      color: "#E31937",
    },
    {
      id: 3,
      title: "Apple",
      location: "Cupertino, California",
      openPositions: "221,000",
      icon: <FaApple />,
      color: "#A8ADB0",
    }
  ];

  const handleCompanyClick = (company) => {
    navigate(`/job/getall?search=${encodeURIComponent(company.title)}`);
  };

  return (
    <div className="companies">
      <div className="container">
        <div className="companies__header">
          <p className="companies__subtitle">Leading Employers</p>
          <h3>Top Companies</h3>
          <span className="companies__description">
            Join thousands of professionals working at world-class organizations
          </span>
        </div>
        <div className="banner">
          {companies.map((element, index) => {
            return (
              <div 
                className="card" 
                key={element.id}
                onClick={() => handleCompanyClick(element)}
                style={{ 
                  '--company-color': element.color,
                  animationDelay: `${index * 0.15}s` 
                }}
              >
                <div className="content">
                  <div className="icon" style={{ color: element.color }}>
                    {element.icon}
                  </div>
                  <div className="text">
                    <p className="text__title">{element.title}</p>
                    <p className="text__location">{element.location}</p>
                  </div>
                </div>
                <div className="card__footer">
                  <span className="card__positions">~{element.openPositions}</span>
                  <span className="card__label">Open Positions</span>
                </div>
                <div className="card__overlay">
                  <span>View Jobs →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PopularCompanies;

