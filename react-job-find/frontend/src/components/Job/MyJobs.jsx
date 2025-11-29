import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";

const MyJobs = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [editingMode, setEditingMode] = useState(null);
  const { isAuthorized, user } = useContext(Context);

  const navigateTo = useNavigate();
  //Fetching all jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/job/getmyjobs",
          { withCredentials: true }
        );
        setMyJobs(data.myJobs);
      } catch (error) {
        toast.error(error.response.data.message);
        setMyJobs([]);
      }
    };
    fetchJobs();
  }, []);
  if (!isAuthorized || (user && user.role !== "Employer")) {
    navigateTo("/");
  }

  const handleEnableEdit = (jobId) => {
   
    setEditingMode(jobId);
  };

  //Function For Disabling Editing Mode
  const handleDisableEdit = () => {
    setEditingMode(null);
  };

  //Function For Updating The Job
  const handleUpdateJob = async (jobId) => {
    const updatedJob = myJobs.find((job) => job._id === jobId);
    await axios
      .put(`http://localhost:4000/api/v1/job/update/${jobId}`, updatedJob, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setEditingMode(null);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  //Function For Deleting Job
  const handleDeleteJob = async (jobId) => {
    await axios
      .delete(`http://localhost:4000/api/v1/job/delete/${jobId}`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setMyJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const handleInputChange = (jobId, field, value) => {
    // Update the job object in the jobs state with the new value
    setMyJobs((prevJobs) =>
      prevJobs.map((job) =>
        job._id === jobId ? { ...job, [field]: value } : job
      )
    );
  };

  return (
    <section className="myJobs page">
      <div className="container">
        <div className="myJobs__header">
          <p>Manage your active opportunities</p>
          <h1>Your Posted Jobs</h1>
          <span>
            {myJobs.length}{" "}
            {myJobs.length === 1 ? "listing is live" : "listings ready to edit"}
          </span>
        </div>
        {myJobs.length > 0 ? (
          <div className="myJobs__grid">
            {myJobs.map((element) => (
              <div className="job_card" key={element._id}>
                <div className="job_card__header">
                  <div className="field_group">
                    <label>Title</label>
                    <input
                      type="text"
                      disabled={editingMode !== element._id}
                      value={element.title}
                      onChange={(e) =>
                        handleInputChange(element._id, "title", e.target.value)
                      }
                    />
                  </div>
                  <div className="field_group inline">
                    <label>Expired</label>
                    <select
                      value={element.expired}
                      onChange={(e) =>
                        handleInputChange(
                          element._id,
                          "expired",
                          e.target.value
                        )
                      }
                      disabled={editingMode !== element._id}
                    >
                      <option value={true}>True</option>
                      <option value={false}>False</option>
                    </select>
                  </div>
                </div>

                <div className="job_card__meta">
                  <div className="field_group">
                    <label>Country</label>
                    <input
                      type="text"
                      disabled={editingMode !== element._id}
                      value={element.country}
                      onChange={(e) =>
                        handleInputChange(
                          element._id,
                          "country",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="field_group">
                    <label>City</label>
                    <input
                      type="text"
                      disabled={editingMode !== element._id}
                      value={element.city}
                      onChange={(e) =>
                        handleInputChange(element._id, "city", e.target.value)
                      }
                    />
                  </div>
                  <div className="field_group">
                    <label>Category</label>
                    <select
                      value={element.category}
                      onChange={(e) =>
                        handleInputChange(
                          element._id,
                          "category",
                          e.target.value
                        )
                      }
                      disabled={editingMode !== element._id}
                    >
                      <option value="Graphics & Design">Graphics & Design</option>
                      <option value="Mobile App Development">
                        Mobile App Development
                      </option>
                      <option value="Frontend Web Development">
                        Frontend Web Development
                      </option>
                      <option value="MERN Stack Development">
                        MERN STACK Development
                      </option>
                      <option value="Account & Finance">Account & Finance</option>
                      <option value="Artificial Intelligence">
                        Artificial Intelligence
                      </option>
                      <option value="Video Animation">Video Animation</option>
                      <option value="MEAN Stack Development">
                        MEAN STACK Development
                      </option>
                      <option value="MEVN Stack Development">
                        MEVN STACK Development
                      </option>
                      <option value="Data Entry Operator">
                        Data Entry Operator
                      </option>
                    </select>
                  </div>
                </div>

                <div className="job_card__salary">
                  <label>Salary</label>
                  {element.fixedSalary ? (
                    <input
                      type="number"
                      disabled={editingMode !== element._id}
                      value={element.fixedSalary}
                      onChange={(e) =>
                        handleInputChange(
                          element._id,
                          "fixedSalary",
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    <div className="salary_range">
                      <input
                        type="number"
                        disabled={editingMode !== element._id}
                        value={element.salaryFrom}
                        onChange={(e) =>
                          handleInputChange(
                            element._id,
                            "salaryFrom",
                            e.target.value
                          )
                        }
                      />
                      <span>to</span>
                      <input
                        type="number"
                        disabled={editingMode !== element._id}
                        value={element.salaryTo}
                        onChange={(e) =>
                          handleInputChange(
                            element._id,
                            "salaryTo",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  )}
                </div>

                <div className="job_card__details">
                  <div className="field_group">
                    <label>Description</label>
                    <textarea
                      rows={4}
                      value={element.description}
                      disabled={editingMode !== element._id}
                      onChange={(e) =>
                        handleInputChange(
                          element._id,
                          "description",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="field_group">
                    <label>Location</label>
                    <textarea
                      rows={4}
                      value={element.location}
                      disabled={editingMode !== element._id}
                      onChange={(e) =>
                        handleInputChange(
                          element._id,
                          "location",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>

                <div className="job_card__actions">
                  <div className="edit_btn_wrapper">
                    {editingMode === element._id ? (
                      <>
                        <button
                          onClick={() => handleUpdateJob(element._id)}
                          className="check_btn"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={handleDisableEdit}
                          className="cross_btn"
                        >
                          <RxCross2 />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEnableEdit(element._id)}
                        className="edit_btn"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteJob(element._id)}
                    className="delete_btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty_state">
            <p>No jobs posted yet.</p>
            <span>
              Start by creating your first role to attract new candidates.
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default MyJobs;
