import React, { useContext, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { FaPencilAlt } from "react-icons/fa";
import { FaPhoneFlip } from "react-icons/fa6";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const { isAuthorized, setIsAuthorized, user, setUser } = useContext(Context);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/register",
        { name, phone, email, role, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setRole("");
      setIsAuthorized(true);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if(isAuthorized){
    return <Navigate to={'/'}/>
  }


  return (
    <>
      <section className="authSplit authSplit--bg">
        <div className="authSplit__card">
          <div className="authSplit__header">
            <img src="/careerconnect-black.png" alt="CareerConnect" />
            <div>
              <p className="eyebrow">Créer un compte</p>
              <h2>Rejoignez CareerConnect !</h2>
              <span>Créez votre compte et commencez votre recherche d'emploi dès aujourd'hui.</span>
            </div>
          </div>

          <form className="authSplit__form" onSubmit={handleRegister}>
            <div className="inputTag inputTag--modern">
              <label>S'inscrire en tant que</label>
              <div className="inputTag__inner">
                <span className="inputTag__icon">
                  <FaRegUser />
                </span>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="">Choisir un rôle</option>
                  <option value="Job Seeker">Candidat</option>
                  <option value="Employer">Recruteur</option>
                </select>
              </div>
            </div>

            <div className="inputTag inputTag--modern">
              <label>Nom complet</label>
              <div className="inputTag__inner">
                <span className="inputTag__icon">
                  <FaPencilAlt />
                </span>
                <input
                  type="text"
                  placeholder="Votre nom complet"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="inputTag inputTag--modern">
              <label>Adresse e-mail</label>
              <div className="inputTag__inner">
                <span className="inputTag__icon">
                  <MdOutlineMailOutline />
                </span>
                <input
                  type="email"
                  placeholder="prenom.nom@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="inputTag inputTag--modern">
              <label>Numéro de téléphone</label>
              <div className="inputTag__inner">
                <span className="inputTag__icon">
                  <FaPhoneFlip />
                </span>
                <input
                  type="tel"
                  placeholder="+33 6 12 34 56 78"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="inputTag inputTag--modern">
              <label>Mot de passe</label>
              <div className="inputTag__inner">
                <span className="inputTag__icon">
                  <RiLock2Fill />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit">S'inscrire</button>
          </form>

          <p className="authSplit__foot">
            Vous avez déjà un compte ?{" "}
            <Link to={"/login"}>Se connecter</Link>
          </p>
        </div>
      </section>
    </>
  );
};

export default Register;
