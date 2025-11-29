import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import { Job } from "../models/jobSchema.js";
import cloudinary from "cloudinary";

export const postApplication = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Employer") {
    return next(
      new ErrorHandler("Employer not allowed to access this resource.", 400)
    );
  }
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Resume File Required!", 400));
  }

  const { resume, profileImage } = req.files;
  if (!resume) {
    return next(new ErrorHandler("Resume File Required!", 400));
  }

  const resumeAllowedFormats = [
    "image/png",
    "image/jpeg",
    "image/webp",
    "application/pdf",
  ];
  if (!resumeAllowedFormats.includes(resume.mimetype)) {
    return next(
      new ErrorHandler(
        "Invalid file type. Please upload a PDF or image (PNG/JPG/WEBP).",
        400
      )
    );
  }
  const resumeUploadResponse = await cloudinary.uploader.upload(
    resume.tempFilePath,
    {
      resource_type: "auto",
      folder: "job-applications/resumes",
    }
  );

  if (!resumeUploadResponse || resumeUploadResponse.error) {
    console.error(
      "Cloudinary Error:",
      resumeUploadResponse.error || "Unknown Cloudinary error"
    );
    return next(new ErrorHandler("Failed to upload Resume to Cloudinary", 500));
  }

  let profileImageResponse = null;
  if (profileImage) {
    const profileAllowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!profileAllowedFormats.includes(profileImage.mimetype)) {
      return next(
        new ErrorHandler(
          "Invalid profile image. Please upload PNG/JPG/WEBP only.",
          400
        )
      );
    }
    profileImageResponse = await cloudinary.uploader.upload(
      profileImage.tempFilePath,
      {
        folder: "job-applications/profile-images",
      }
    );

    if (!profileImageResponse || profileImageResponse.error) {
      console.error(
        "Cloudinary Error:",
        profileImageResponse.error || "Unknown Cloudinary error"
      );
      return next(
        new ErrorHandler("Failed to upload profile image to Cloudinary", 500)
      );
    }
  }

  const { name, email, coverLetter, phone, address, jobId } = req.body;
  const applicantID = {
    user: req.user._id,
    role: "Job Seeker",
  };
  if (!jobId) {
    return next(new ErrorHandler("Job not found!", 404));
  }
  const jobDetails = await Job.findById(jobId);
  if (!jobDetails) {
    return next(new ErrorHandler("Job not found!", 404));
  }

  const employerID = {
    user: jobDetails.postedBy,
    role: "Employer",
  };
  if (!name || !email || !coverLetter || !phone || !address) {
    return next(new ErrorHandler("Please fill all fields.", 400));
  }
  const application = await Application.create({
    name,
    email,
    coverLetter,
    phone,
    address,
    applicantID,
    employerID,
    resume: {
      public_id: resumeUploadResponse.public_id,
      url: resumeUploadResponse.secure_url,
    },
    profileImage: profileImageResponse
      ? {
          public_id: profileImageResponse.public_id,
          url: profileImageResponse.secure_url,
        }
      : undefined,
  });
  res.status(200).json({
    success: true,
    message: "Application Submitted!",
    application,
  });
});

export const employerGetAllApplications = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
      return next(
        new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
      );
    }
    const { _id } = req.user;
    const applications = await Application.find({ "employerID.user": _id });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const jobseekerGetAllApplications = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler("Employer not allowed to access this resource.", 400)
      );
    }
    const { _id } = req.user;
    const applications = await Application.find({ "applicantID.user": _id });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const jobseekerDeleteApplication = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler("Employer not allowed to access this resource.", 400)
      );
    }
    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application) {
      return next(new ErrorHandler("Application not found!", 404));
    }
    await application.deleteOne();
    res.status(200).json({
      success: true,
      message: "Application Deleted!",
    });
  }
);

export const updateApplicationStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { role, _id } = req.user;
    if (role === "Job Seeker") {
      return next(
        new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
      );
    }

    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["Pending", "Accepted", "Rejected"];
    if (!allowedStatuses.includes(status)) {
      return next(new ErrorHandler("Invalid status option provided.", 400));
    }

    const application = await Application.findById(id);
    if (!application) {
      return next(new ErrorHandler("Application not found!", 404));
    }

    if (application.employerID.user.toString() !== _id.toString()) {
      return next(
        new ErrorHandler("You are not allowed to update this application.", 403)
      );
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      success: true,
      message:
        status === "Accepted"
          ? "Application accepted!"
          : status === "Rejected"
          ? "Application rejected!"
          : "Application status updated!",
      application,
    });
  }
);
