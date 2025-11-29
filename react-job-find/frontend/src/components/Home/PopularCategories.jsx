import React from "react";
import {
  MdOutlineDesignServices,
  MdOutlineWebhook,
  MdAccountBalance,
  MdOutlineAnimation,
} from "react-icons/md";
import { TbAppsFilled } from "react-icons/tb";
import { FaReact } from "react-icons/fa";
import { GiArtificialIntelligence } from "react-icons/gi";
import { IoGameController } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const PopularCategories = () => {
  const navigate = useNavigate();
  
  const categories = [
    {
      id: 1,
      title: "Graphics & Design",
      subTitle: "305 Open Positions",
      icon: <MdOutlineDesignServices />,
      color: "#FF6B6B",
    },
    {
      id: 2,
      title: "Mobile App Development",
      subTitle: "500 Open Positions",
      icon: <TbAppsFilled />,
      color: "#4ECDC4",
    },
    {
      id: 3,
      title: "Frontend Web Development",
      subTitle: "200 Open Positions",
      icon: <MdOutlineWebhook />,
      color: "#45B7D1",
    },
    {
      id: 4,
      title: "MERN STACK Development",
      subTitle: "1000+ Open Postions",
      icon: <FaReact />,
      color: "#96CEB4",
    },
    {
      id: 5,
      title: "Account & Finance",
      subTitle: "150 Open Positions",
      icon: <MdAccountBalance />,
      color: "#FFEAA7",
    },
    {
      id: 6,
      title: "Artificial Intelligence",
      subTitle: "867 Open Positions",
      icon: <GiArtificialIntelligence />,
      color: "#DDA0DD",
    },
    {
      id: 7,
      title: "Video Animation",
      subTitle: "50 Open Positions",
      icon: <MdOutlineAnimation />,
      color: "#FFB347",
    },
    {
      id: 8,
      title: "Game Development",
      subTitle: "80 Open Positions",
      icon: <IoGameController />,
      color: "#98D8C8",
    },
  ];

  const handleCategoryClick = (category) => {
    navigate(`/job/getall?search=${encodeURIComponent(category.title)}`);
  };

  return (
    <div className="categories">
      <div className="categories__header">
        <p className="categories__subtitle">Browse by Category</p>
        <h3>Popular Categories</h3>
        <span className="categories__description">
          Explore opportunities across different industries and find your perfect match
        </span>
      </div>
      <div className="banner">
        {categories.map((element, index) => {
          return (
            <div 
              className="card" 
              key={element.id}
              onClick={() => handleCategoryClick(element)}
              style={{ 
                '--category-color': element.color,
                animationDelay: `${index * 0.1}s` 
              }}
            >
              <div className="icon" style={{ color: element.color }}>
                {element.icon}
              </div>
              <div className="text">
                <p className="text__title">{element.title}</p>
                <p className="text__subtitle">{element.subTitle}</p>
              </div>
              <div className="card__arrow">→</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PopularCategories;
