import React from "react";
import { FaUserPlus } from "react-icons/fa";
import { MdFindInPage } from "react-icons/md";
import { IoMdSend } from "react-icons/io";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      icon: <FaUserPlus />,
      title: "Create Account",
      description: "Sign up now to unlock exclusive content and stay up-to-date with our latest features. Enjoy a personalized experience and be the first to know about new updates!",
      number: "01"
    },
    {
      id: 2,
      icon: <MdFindInPage />,
      title: "Find a Job/Post a Job",
      description: "Find your next job or post job openings easily. Sign up today to connect with top talent or discover the perfect opportunity!",
      number: "02",
      featured: true
    },
    {
      id: 3,
      icon: <IoMdSend />,
      title: "Apply For Job/Recruit Suitable Candidates",
      description: "Apply for jobs that match your skills or recruit the best candidates for your openings. Sign up now to access a wide range of opportunities or connect with top talent!",
      number: "03"
    },
  ];

  return (
    <>
      <div className="howitworks">
        <div className="container">
          <div className="howitworks__header">
            <p className="howitworks__subtitle">Simple Process</p>
            <h3>How Career Connect Works</h3>
            <span className="howitworks__description">
              Get started in three easy steps and find your dream job or the perfect candidate
            </span>
          </div>
          <div className="banner">
            {steps.map((step, index) => (
              <div 
                className={`card ${step.featured ? 'card--featured' : ''}`} 
                key={step.id}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="card__number">{step.number}</div>
                <div className="card__icon">{step.icon}</div>
                <h4 className="card__title">{step.title}</h4>
                <p className="card__description">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HowItWorks;
