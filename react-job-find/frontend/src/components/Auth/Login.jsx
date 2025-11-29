import React, { useContext, useState } from "react";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { Link, Navigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const { isAuthorized, setIsAuthorized } = useContext(Context);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/login",
        { email, password, role },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setEmail("");
      setPassword("");
      setRole("");
      setIsAuthorized(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Connexion impossible.");
    }
  };

  if (isAuthorized) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <section className="authSplit authSplit--bg">
        <div className="authSplit__card">
          <div className="authSplit__header">
            <img src="/careerconnect-black.png" alt="CareerConnect" />
            <div>
              <p className="eyebrow">Bienvenue</p>
              <h2>Heureux de vous revoir !</h2>
              <span>Reprenez vos candidatures et messages en toute simplicité.</span>
            </div>
          </div>

          <form className="authSplit__form" onSubmit={handleLogin}>
            <div className="inputTag inputTag--modern">
              <label>Connexion en tant que</label>
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

            <button type="submit">Se connecter</button>
          </form>

          <p className="authSplit__foot">
            Nouveau sur CareerConnect ?{" "}
            <Link to={"/register"}>Créer un compte</Link>
          </p>
        </div>
      </section>
    </>
  );
};

export default Login;
