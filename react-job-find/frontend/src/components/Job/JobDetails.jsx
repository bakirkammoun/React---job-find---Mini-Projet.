import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const navigateTo = useNavigate();
  const { isAuthorized, user } = useContext(Context);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/v1/job/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setJob(res.data.job);
      })
      .catch((error) => {
        navigateTo("/notfound");
      });
  }, [id]);

  if (!isAuthorized) {
    navigateTo("/login");
  }

  return (
    <section style={styles.jobDetail}>
      <div style={styles.container}>
        <h3 style={styles.heading}>Job Details</h3>
        <div style={styles.banner}>
          <p>
            Title: <span style={styles.jobText}>{job.title}</span>
          </p>
          <p>
            Category: <span style={styles.jobText}>{job.category}</span>
          </p>
          <p>
            Country: <span style={styles.jobText}>{job.country}</span>
          </p>
          <p>
            City: <span style={styles.jobText}>{job.city}</span>
          </p>
          <p>
            Location: <span style={styles.jobText}>{job.location}</span>
          </p>
          <p>
            Description: <span style={styles.jobText}>{job.description}</span>
          </p>
          <p>
            Job Posted On: <span style={styles.jobText}>{job.jobPostedOn}</span>
          </p>
          <p>
            Salary:{" "}
            {job.fixedSalary ? (
              <span style={styles.jobText}>{job.fixedSalary}</span>
            ) : (
              <span style={styles.jobText}>
                {job.salaryFrom} - {job.salaryTo}
              </span>
            )}
          </p>
          {user && user.role === "Employer" ? (
            <></>
          ) : (
            <Link style={styles.applyButton} to={`/application/${job._id}`}>
              Apply Now
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

const styles = {
  jobDetail: {
    backgroundImage: "url('/background.jpg')", // Ajouter l'image de fond ici
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    padding: "50px 0",
    fontFamily: "'Arial', sans-serif",
  },
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
  },
  heading: {
    fontSize: "50px",
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: "20px",
    textTransform: "uppercase",
    letterSpacing: "2px",
  },
  banner: {
    backgroundColor: "rgba(0, 0, 0, 0.9)", // Filtre sombre appliqué ici
    padding: "20px",
    borderRadius: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    color: "white",
    transition: "background-color 0.3s ease",
  },
  jobText: {
    color: "#FFFFFF",
  },
  applyButton: {
    display: "inline-block",
    textDecoration: "none",
    backgroundColor: "#ffb700",
    color: "white",
    padding: "12px 24px",
    borderRadius: "10px",
    textAlign: "center",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    marginTop: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
  },
};

styles.applyButton[":hover"] = {
  backgroundColor: "#e0a000",
  transform: "scale(1.05)",
  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
};

export default JobDetails;
