import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";

const Jobs = () => {
  const [allJobs, setAllJobs] = useState([]); // Store all jobs
  const [filteredJobs, setFilteredJobs] = useState([]); // Jobs to display
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    // Fetch all jobs initially
    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/v1/job/getall", {
          withCredentials: true,
        });
        setAllJobs(res.data.jobs); // Save all jobs
        setFilteredJobs(res.data.jobs); // Initially, display all jobs
      } catch (error) {
        console.error(error);
      }
    };

    fetchJobs();
  }, []);

  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      // If search query is empty, reset to show all jobs
      setFilteredJobs(allJobs);
    } else {
      try {
        // Make GET request to search endpoint
        const res = await axios.get(
          `http://localhost:4000/api/v1/job/jobs/search?title=${searchQuery}`,
          { withCredentials: true }
        );
        console.log(res.data.jobs);
        
        setFilteredJobs(res.data.jobs); // Update displayed jobs
      } catch (error) {
        console.error(error);
        setFilteredJobs([]); // Clear the list if an error occurs
      }
    }
  };
  

  if (!isAuthorized) {
    navigateTo("/");
  }

  return (
    <section
      className="jobs page"
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        padding: "50px 0",
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "55px",
            color: "#fff",
            marginBottom: "40px",
          }}
        >
          ALL AVAILABLE JOBS
        </h1>

        {/* Search Input */}
        <div
          className="search-bar"
          style={{
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          <input
            type="text"
            placeholder="Search jobs by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              maxWidth: "400px",
              padding: "10px",
              fontSize: "18px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              outline: "none",
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              marginLeft: "10px",
              padding: "10px 20px",
              fontSize: "18px",
              backgroundColor: "#ffb700",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Search
          </button>
        </div>

        <div
          className="jobs-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gap: "20px",
          }}
        >
          {filteredJobs.length > 0 ? (
            filteredJobs.map((element) => (
              <div
                className="job-card"
                key={element._id}
                style={{
                  position: "relative",
                  backgroundImage: "url('/cardd.jpg')",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  width: "500px",
                  height: "660px",
                  borderTopLeftRadius: "16px",
                  borderTopRightRadius: "16px",
                  borderBottomLeftRadius: "250px",
                  borderBottomRightRadius: "250px",
                  overflow: "hidden",
                  color: "white",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                }}
              >
                <div
                  className="job-card-content"
                  style={{
                    background: "rgba(0, 0, 0, 0.5)",
                    padding: "10px",
                    height: "100%",
                    borderRadius: "16px",
                  }}
                >
                  <img
                    src="/logos.png"
                    alt="Logo"
                    style={{
                      width: "280px",
                      height: "280px",
                      objectFit: "contain",
                      margin: "0 auto 20px",
                    }}
                  />
                  <h2
                    className="job-title"
                    style={{
                      fontSize: "50px",
                      fontWeight: "bold",
                      marginTop: "10px",
                    }}
                  >
                    {element.title}
                  </h2>
                  <p
                    className="job-category"
                    style={{
                      fontSize: "35px",
                      color: "#ccc",
                    }}
                  >
                    {element.category}
                  </p>
                  <p
                    className="job-location"
                    style={{
                      fontSize: "30px",
                      color: "#bbb",
                    }}
                  >
                    {element.country}, {element.city}
                  </p>
                  <Link
                    className="job-details-link"
                    to={`/job/${element._id}`}
                    style={{
                      marginTop: "42px",
                      display: "inline-block",
                      textDecoration: "none",
                      color: "#ffb700",
                      border: "2px solid #ffb700",
                      padding: "10px 20px",
                      width: "273px",
                      borderRadius: "20px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffb700";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#ffb700";
                    }}
                  >
                    Job Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: "white", textAlign: "center" }}>
              No jobs found matching the search query.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Jobs;
