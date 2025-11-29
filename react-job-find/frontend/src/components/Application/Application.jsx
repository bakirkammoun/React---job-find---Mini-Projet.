import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiClock, FiFileText, FiShield, FiUploadCloud } from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Context } from "../../main";

const Application = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [resume, setResume] = useState(null);
  const [resumeName, setResumeName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageName, setProfileImageName] = useState("");
  const [profileImagePreview, setProfileImagePreview] = useState("");

  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();
  const { id } = useParams();

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setResume(file || null);
    setResumeName(file ? file.name : "");
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files?.[0];
    setProfileImage(file || null);
    setProfileImageName(file ? file.name : "");
  };

  useEffect(() => {
    if (!profileImage) {
      setProfileImagePreview("");
      return undefined;
    }
    const previewUrl = URL.createObjectURL(profileImage);
    setProfileImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [profileImage]);

  const handleApplication = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("coverLetter", coverLetter);
    if (resume) {
      formData.append("resume", resume);
    }
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }
    formData.append("jobId", id);

    try {
      setIsSubmitting(true);
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/application/post",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setName("");
      setEmail("");
      setCoverLetter("");
      setPhone("");
      setAddress("");
      setResume(null);
      setResumeName("");
      setProfileImage(null);
      setProfileImageName("");
      setProfileImagePreview("");
      toast.success(data.message);
      navigateTo("/job/getall");
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Une erreur est survenue."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthorized || (user && user.role === "Employer")) {
    navigateTo("/");
  }

  return (
    <section className="application">
      <div className="application__wrapper">
        <div className="application__header">
          <p className="application__eyebrow">Candidature express</p>
          <h1>Partagez votre profil en quelques minutes</h1>
          <span>
            Chaque candidature est étudiée avec attention. Fournissez des
            informations claires pour nous aider à mieux vous connaître.
          </span>
        </div>

        <div className="application__grid">
          <div className="application__card application__card--info">
            <div className="application__stats">
              <article>
                <span>Étape 01</span>
                <p>Présentez-vous</p>
              </article>
              <article>
                <span>Étape 02</span>
                <p>Résumez vos atouts</p>
              </article>
              <article>
                <span>Étape 03</span>
                <p>Déposez votre CV</p>
              </article>
            </div>

            <ul className="application__perks">
              <li>
                <FiShield />
                <div>
                  <p>Confidentialité totale</p>
                  <span>
                    Vos informations sont chiffrées et partagées uniquement avec
                    le recruteur concerné.
                  </span>
                </div>
              </li>
              <li>
                <FiClock />
                <div>
                  <p>Réponse rapide</p>
                  <span>Nos équipes vous contactent sous 48 h ouvrées.</span>
                </div>
              </li>
            </ul>

            <div className="application__tip">
              <FiFileText />
              <div>
                <p>Astuce CV</p>
                <span>
                  Ajoutez des chiffres clés (croissance, budget, taille
                  d&apos;équipe) pour rendre vos réalisations mémorables.
                </span>
              </div>
            </div>
          </div>

          <form className="application__form" onSubmit={handleApplication}>
            <div className="application__row">
              <div className="application__field">
                <label htmlFor="candidateName">Nom complet</label>
                <input
                  id="candidateName"
                  type="text"
                  placeholder="Ex. Léa Martin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
              <div className="application__field">
                <label htmlFor="candidateEmail">Adresse e-mail</label>
                <input
                  id="candidateEmail"
                  type="email"
                  placeholder="lea.martin@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="application__row">
              <div className="application__field">
                <label htmlFor="candidatePhone">Numéro de téléphone</label>
                <input
                  id="candidatePhone"
                  type="tel"
                  placeholder="+33 6 45 78 98 32"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  autoComplete="tel"
                />
              </div>
              <div className="application__field">
                <label htmlFor="candidateAddress">Ville (ou remote)</label>
                <input
                  id="candidateAddress"
                  type="text"
                  placeholder="Lyon, France"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  autoComplete="address-level2"
                />
              </div>
            </div>

            <div className="application__field">
              <label htmlFor="coverLetter">Lettre de motivation</label>
              <textarea
                id="coverLetter"
                placeholder="Racontez-nous ce qui vous motive et vos réalisations majeures..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={5}
                required
              />
              <small>200-300 mots suffisent pour faire la différence.</small>
            </div>

            <div className="application__upload">
              <label htmlFor="resumeUpload">CV ou portfolio</label>
              <div className="application__uploadBox">
                <FiUploadCloud />
                <div>
                  <p>{resumeName ? "Fichier sélectionné" : "Déposez ou importez un fichier"}</p>
                  <span>
                    {resumeName || "Formats acceptés : PDF, PNG, JPG (max 5 Mo)"}
                  </span>
                </div>
                <input
                  id="resumeUpload"
                  type="file"
                  accept=".pdf, .jpg, .jpeg, .png, .webp"
                  onChange={handleFileChange}
                  required
                />
              </div>
            </div>

            <div className="application__upload">
              <label htmlFor="profileImageUpload">Photo de profil (optionnel)</label>
              <div className="application__uploadBox application__uploadBox--profile">
                {profileImagePreview ? (
                  <img
                    src={profileImagePreview}
                    alt="Prévisualisation du profil"
                    className="application__uploadAvatar"
                  />
                ) : (
                  <div className="application__uploadAvatar placeholder">
                    <span>+</span>
                  </div>
                )}
                <div>
                  <p>
                    {profileImageName
                      ? "Image sélectionnée"
                      : "Ajoutez un portrait professionnel"}
                  </p>
                  <span>
                    {profileImageName || "Formats acceptés : PNG, JPG, WEBP (max 2 Mo)"}
                  </span>
                </div>
                <input
                  id="profileImageUpload"
                  type="file"
                  accept=".jpg, .jpeg, .png, .webp"
                  onChange={handleProfileImageChange}
                />
              </div>
            </div>

            <div className="application__actions">
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Envoi en cours..." : "Envoyer ma candidature"}
              </button>
              <p>
                Besoin d&apos;autres idées ?{" "}
                <Link to="/job/getall">Découvrir toutes les offres</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Application;
