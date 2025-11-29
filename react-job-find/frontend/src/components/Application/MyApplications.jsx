import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ResumeModal from "./ResumeModal";

const APPLICATIONS_PER_PAGE = 12;
const FALLBACK_PROFILE_IMAGE = "/cardd.jpg";
const isImageUrl = (url = "") => {
  if (!url) return false;
  const sanitized = url.split("?")[0];
  return /\.(png|jpe?g|webp|gif)$/i.test(sanitized);
};
const getProfileImageUrl = (element) => {
  if (element?.profileImage?.url) return element.profileImage.url;
  if (isImageUrl(element?.resume?.url)) return element.resume.url;
  return FALLBACK_PROFILE_IMAGE;
};

const MyApplications = () => {
  const { user } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    try {
      if (user && user.role === "Employer") {
        axios
          .get("http://localhost:4000/api/v1/application/employer/getall", {
            withCredentials: true,
          })
          .then((res) => {
            setApplications(res.data.applications);
          });
      } else {
        axios
          .get("http://localhost:4000/api/v1/application/jobseeker/getall", {
            withCredentials: true,
          })
          .then((res) => {
            setApplications(res.data.applications);
          });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }, [isAuthorized]);

  if (!isAuthorized) {
    navigateTo("/");
  }

  const deleteApplication = (id) => {
    try {
      axios
        .delete(`http://localhost:4000/api/v1/application/delete/${id}`, {
          withCredentials: true,
        })
        .then((res) => {
          toast.success(res.data.message);
          setApplications((prevApplication) =>
            prevApplication.filter((application) => application._id !== id)
          );
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const openModal = (imageUrl) => {
    setResumeImageUrl(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [applications]);

  const handleStatusChange = async (applicationId, status) => {
    try {
      const res = await axios.put(
        `http://localhost:4000/api/v1/application/status/${applicationId}`,
        { status },
        {
          withCredentials: true,
        }
      );
      toast.success(res.data.message);
      setApplications((prevApplications) =>
        prevApplications.map((application) =>
          application._id === applicationId
            ? { ...application, status }
            : application
        )
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to update application status."
      );
    } 
  };

  const isJobSeeker = user && user.role === "Job Seeker";
  const CardComponent = isJobSeeker ? JobSeekerCard : EmployerCard;
  const cardProps = isJobSeeker
    ? { deleteApplication, openModal }
    : { openModal, onStatusChange: handleStatusChange };

  const totalPages =
    applications.length > 0
      ? Math.ceil(applications.length / APPLICATIONS_PER_PAGE)
      : 1;
  const startIndex = (currentPage - 1) * APPLICATIONS_PER_PAGE;
  const displayedApplications = applications.slice(
    startIndex,
    startIndex + APPLICATIONS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <section className="my_applications page">
      <div className="container">
        <div className="my_applications__header">
          <p>{isJobSeeker ? "Your latest job pursuits" : "Manage your talent pool"}</p>
          <h1>{isJobSeeker ? "My Applications" : "Applications From Job Seekers"}</h1>
          <span>
            {applications.length}{" "}
            {applications.length === 1 ? "opportunity" : "opportunities"}
          </span>
        </div>

        {applications.length <= 0 ? (
          <div className="empty_state">
            <p>No applications found yet.</p>
            <span>
              {isJobSeeker
                ? "Keep exploring roles and apply when you find the perfect fit."
                : "Share a job post to start receiving applications."}
            </span>
          </div>
        ) : (
          <>
            <div className="applications_grid">
              {displayedApplications.map((element) => (
                <CardComponent
                  element={element}
                  key={element._id}
                  {...cardProps}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPrev={() => handlePageChange(currentPage - 1)}
                onNext={() => handlePageChange(currentPage + 1)}
                onSelectPage={handlePageChange}
              />
            )}
          </>
        )}
      </div>
      {modalOpen && (
        <ResumeModal imageUrl={resumeImageUrl} onClose={closeModal} />
      )}
    </section>
  );
};

export default MyApplications;

const formatStatus = (status) => status || "Pending";
const statusClass = (status) => {
  const formatted = formatStatus(status);
  switch (formatted) {
    case "Accepted":
      return "status_badge accepted";
    case "Rejected":
      return "status_badge rejected";
    default:
      return "status_badge pending";
  }
};

const JobSeekerCard = ({ element, deleteApplication, openModal }) => {
  const profileImageUrl = getProfileImageUrl(element);
  return (
    <>
      <div className="job_seeker_card">
        <div className="resume">
          <img
            src={profileImageUrl}
            alt={`Profil de ${element.name}`}
            onClick={() =>
              isImageUrl(profileImageUrl) && openModal(profileImageUrl)
            }
          />
        </div>
        <div className="detail">
          <div className="field_row">
            <p>
              <span className="field_label">Name:</span>
              <span className="field_value">{element.name}</span>
            </p>
            <p>
              <span className="field_label">Email:</span>
              <span className="field_value">{element.email}</span>
            </p>
          </div>
          <div className="field_row">
            <p>
              <span className="field_label">Phone:</span>
              <span className="field_value">{element.phone}</span>
            </p>
            <p>
              <span className="field_label">Address:</span>
              <span className="field_value">{element.address}</span>
            </p>
          </div>
          <div className="field_row">
            <p>
              <span className="field_label">CoverLetter:</span>
              <span className="field_value">{element.coverLetter}</span>
            </p>
            <p>
              <span className="field_label">Status:</span>{" "}
              <span className={statusClass(element.status)}>
                {formatStatus(element.status)}
              </span>
            </p>
          </div>
        </div>
        <div className="btn_area">
          {element?.resume?.url && (
            <a
              className="download_btn"
              href={element.resume.url}
              target="_blank"
              rel="noopener noreferrer"
              download
            >
              Télécharger le CV
            </a>
          )}
          <button onClick={() => deleteApplication(element._id)}>
            Delete Application
          </button>
        </div>
      </div>
    </>
  );
};

const EmployerCard = ({ element, openModal, onStatusChange }) => {
  const profileImageUrl = getProfileImageUrl(element);
  return (
    <>
      <div className="job_seeker_card">
        <div className="resume">
          <img
            src={profileImageUrl}
            alt={`Profil de ${element.name}`}
            onClick={() =>
              isImageUrl(profileImageUrl) && openModal(profileImageUrl)
            }
          />
        </div>
        <div className="detail">
          <div className="field_row">
            <p>
              <span className="field_label">Name:</span>
              <span className="field_value">{element.name}</span>
            </p>
            <p>
              <span className="field_label">Email:</span>
              <span className="field_value">{element.email}</span>
            </p>
          </div>
          <div className="field_row">
            <p>
              <span className="field_label">Phone:</span>
              <span className="field_value">{element.phone}</span>
            </p>
            <p>
              <span className="field_label">Address:</span>
              <span className="field_value">{element.address}</span>
            </p>
          </div>
          <div className="field_row">
            <p>
              <span className="field_label">CoverLetter:</span>
              <span className="field_value">{element.coverLetter}</span>
            </p>
            <p>
              <span className="field_label">Status:</span>{" "}
              <span className={statusClass(element.status)}>
                {formatStatus(element.status)}
              </span>
            </p>
          </div>
        </div>
        <div className="btn_area">
          {element?.resume?.url && (
            <a
              className="download_btn"
              href={element.resume.url}
              target="_blank"
              rel="noopener noreferrer"
              download
            >
              Télécharger le CV
            </a>
          )}
          <button
            className="accept"
            onClick={() => onStatusChange(element._id, "Accepted")}
            disabled={element.status === "Accepted"}
          >
            Accepter
          </button>
          <button
            className="reject"
            onClick={() => onStatusChange(element._id, "Rejected")}
            disabled={element.status === "Rejected"}
          >
            Refuser
          </button>
        </div>
      </div>
    </>
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
