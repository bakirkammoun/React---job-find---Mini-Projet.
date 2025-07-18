import React from "react";
import { FaMicrosoft, FaApple } from "react-icons/fa";
import { SiTesla } from "react-icons/si";

const PopularCompanies = () => {
  const companies = [
    {
      id: 1,
      title: "Microsoft",
      location: "Redmond, Washington",
      openPositions: "(164.000)",
      icon: <FaMicrosoft />, 
    },
    {
      id: 2,
      title: "Tesla",
      location: "Palo Alto, California",
      openPositions:  "(133.000)",
      icon: <SiTesla />, 
    },
    {
      id: 3,
      title: "Apple",
      location: "Cupertino, California",
      openPositions: "(221.000)",
      icon: <FaApple />, 
    }
  ];

  return (
    <div className="companies">
      <div className="container">
        <h3>TOP COMPANIES</h3>
        <div className="banner">
          {companies.map((element) => {
            return (
              <div className="card" key={element.id}>
                <div className="content">
                  <div className="icon">{element.icon}</div> {/* Displaying the icon */}
                  <div className="text">
                    <p>{element.title}</p>
                    <p>{element.location}</p>
                  </div>
                </div>
                <button>Approximately : {element.openPositions}</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PopularCompanies;
