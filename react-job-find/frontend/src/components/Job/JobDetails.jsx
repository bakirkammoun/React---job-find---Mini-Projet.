import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Context } from "../../main";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigateTo = useNavigate();
  const { isAuthorized, user } = useContext(Context);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/v1/job/${id}`, {
          withCredentials: true,
        });
        setJob(res.data.job);
      } catch (error) {
        navigateTo("/notfound");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [id, navigateTo]);

  const salaryText = useMemo(() => {
    if (!job) return "—";
    if (job.fixedSalary) return `$${job.fixedSalary}`;
    if (job.salaryFrom && job.salaryTo)
      return `$${job.salaryFrom} - $${job.salaryTo}`;
    return "Salary not specified";
  }, [job]);

  const postedOn = useMemo(() => {
    if (!job?.jobPostedOn) return "Date not available";
    const date = new Date(job.jobPostedOn);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [job]);

  if (!isAuthorized) {
    navigateTo("/login");
  }

  if (isLoading) {
    return (
      <section className="jobDetail page">
        <div className="container jobDetail__loading">Loading...</div>
      </section>
    );
  }

  if (!job) {
    return null;
  }

  return (
    <section className="jobDetail page">
      <div className="container">
        <div className="jobDetail__hero">
          <p>Opportunity overview</p>
          <h1>{job.title}</h1>
          <span>
            {job.category} • {job.country}, {job.city}
          </span>
        </div>

        <div className="jobDetail__content">
          <article className="jobDetail__card">
            <div className="jobDetail__grid">
              <div>
                <label>Category</label>
                <p>{job.category || "—"}</p>
              </div>
              <div>
                <label>Job Type</label>
                <p>{job.jobType || "Flexible"}</p>
              </div>
              <div>
                <label>Salary</label>
                <p>{salaryText}</p>
              </div>
              <div>
                <label>Posted On</label>
                <p>{postedOn}</p>
              </div>
              <div>
                <label>Country</label>
                <p>{job.country || "—"}</p>
              </div>
              <div>
                <label>City</label>
                <p>{job.city || "—"}</p>
              </div>
            </div>

            <div className="jobDetail__description">
              <label>Description</label>
              <p>{job.description || "No description provided."}</p>
            </div>

            <div className="jobDetail__description">
              <label>Location</label>
              <p>{job.location || "Flexible / Remote"}</p>
            </div>

            {user?.role !== "Employer" && (
              <div className="jobDetail__cta">
                <div>
                  <p>Ready to apply?</p>
                  <span>Attach your CV and send your best pitch.</span>
                </div>
                <Link to={`/application/${job._id}`}>Apply now</Link>
              </div>
            )}
          </article>
        </div>
      </div>
    </section>
  );
};

export default JobDetails;
