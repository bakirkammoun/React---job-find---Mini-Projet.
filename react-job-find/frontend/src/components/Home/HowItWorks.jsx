import React from "react";
import { FaUserPlus } from "react-icons/fa";
import { MdFindInPage } from "react-icons/md";
import { IoMdSend } from "react-icons/io";

const HowItWorks = () => {
  return (
    <>
      <div className="howitworks">
        <div className="container">
          <h3>How Career Connect Works !</h3>
          <div className="banner">
            <div className="card">
              <FaUserPlus />
              <p>Create Account</p>
              <p>
              "Sign up now to unlock exclusive content and stay up-to-date with our latest features. Enjoy a personalized experience and be the first to know about new updates!"
              </p>
            </div>
            <div className="card">
              <MdFindInPage />
              <p>Find a Job/Post a Job</p>
              <p>
              "Find your next job or post job openings easily. Sign up today to connect with top talent or discover the perfect opportunity!"
              </p>
            </div>
            <div className="card">
              <IoMdSend />
              <p>Apply For Job/Recruit Suitable Candidates</p>
              <p>
             
"Apply for jobs that match your skills or recruit the best candidates for your openings. Sign up now to access a wide range of opportunities or connect with top talent!"
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HowItWorks;
