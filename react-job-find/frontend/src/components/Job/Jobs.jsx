import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Context } from "../../main";

const JOBS_PER_PAGE = 9;

const Jobs = () => {
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSearch = async (query = searchQuery) => {
    const searchTerm = query.trim();
    if (searchTerm === "") {
      setFilteredJobs(allJobs);
      return;
    }
    try {
      const res = await axios.get(
        `http://localhost:4000/api/v1/job/jobs/search?title=${searchTerm}`,
        { withCredentials: true }
      );
      setFilteredJobs(res.data.jobs || []);
    } catch (error) {
      console.error(error);
      setFilteredJobs([]);
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/v1/job/getall", {
          withCredentials: true,
        });
        setAllJobs(res.data.jobs || []);
        setFilteredJobs(res.data.jobs || []);
      } catch (error) {
        console.error(error);
        setAllJobs([]);
        setFilteredJobs([]);
      }
    };

    fetchJobs();
  }, []);

  // Handle search parameter from URL
  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchParam) {
      setSearchQuery(searchParam);
      // Trigger search after jobs are loaded
      if (allJobs.length > 0) {
        handleSearch(searchParam);
      }
    }
  }, [searchParams, allJobs]);

  useEffect(() => {
    if (searchQuery.trim() === "" && !searchParams.get("search")) {
      setFilteredJobs(allJobs);
    }
  }, [searchQuery, allJobs, searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredJobs]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredJobs.length / JOBS_PER_PAGE) || 1
  );
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
    return filteredJobs.slice(startIndex, startIndex + JOBS_PER_PAGE);
  }, [filteredJobs, currentPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const renderSalary = (job) => {
    if (job.fixedSalary) {
      return `$${job.fixedSalary}`;
    }
    if (job.salaryFrom && job.salaryTo) {
      return `$${job.salaryFrom} - $${job.salaryTo}`;
    }
    return "Salary not specified";
  };

  if (!isAuthorized) {
    navigateTo("/");
  }

  return (
    <section className="jobs page">
      <div className="container">
        <div className="jobs__header">
          <p>Explore opportunities</p>
          <h1>All Available Jobs</h1>
          <span>
            {filteredJobs.length}{" "}
            {filteredJobs.length === 1 ? "role matches" : "roles match"} your
            search
          </span>
        </div>

        <div className="jobs__search">
          <input
            type="text"
            placeholder="Search jobs by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button onClick={() => handleSearch()}>Search</button>
        </div>

        {paginatedJobs.length > 0 ? (
          <div className="jobs__grid">
            {paginatedJobs.map((job) => (
              <article className="job_listing_card" key={job._id}>
                <div className="job_listing_card__badge">
                  {job.category || "General"}
                </div>
                <h2>{job.title}</h2>
                <p className="job_listing_card__location">
                  {job.country}, {job.city}
                </p>
                <p className="job_listing_card__description">
                  {job.description
                    ? job.description.slice(0, 140) +
                      (job.description.length > 140 ? "..." : "")
                    : "No description provided."}
                </p>
                <div className="job_listing_card__meta">
                  <span>Salary: {renderSalary(job)}</span>
                  <span>Type: {job.jobType || "Flexible"}</span>
                </div>
                <div className="job_listing_card__footer">
                  <div>
                    <p>Posted by</p>
                    <span>{job.companyName || "CareerConnect"}</span>
                  </div>
                  <Link to={`/job/${job._id}`}>View details</Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty_state jobs__empty">
            <p>No jobs found.</p>
            <span>Try adjusting your search to discover new roles.</span>
          </div>
        )}

        {totalPages > 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPrev={() => handlePageChange(currentPage - 1)}
            onNext={() => handlePageChange(currentPage + 1)}
            onSelectPage={handlePageChange}
          />
        )}
      </div>
    </section>
  );
};

const PaginationControls = ({
  currentPage,
  totalPages,
  onPrev,
  onNext,
  onSelectPage,
}) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  return (
    <div className="pagination_controls">
      <button onClick={onPrev} disabled={currentPage === 1}>
        Previous
      </button>
      <div className="pagination_numbers">
        {pages.map((page) => (
          <button
            key={page}
            className={`page_number ${page === currentPage ? "active" : ""}`}
            onClick={() => onSelectPage(page)}
          >
            {page}
          </button>
        ))}
      </div>
      <button onClick={onNext} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  );
};

export default Jobs;
