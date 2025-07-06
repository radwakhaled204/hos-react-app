// src/components/Signup.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AuthComponent.css";

const Signup = () => {
    const [activeTab, setActiveTab] = useState("register");
    const navigate = useNavigate();

    const handleTabClick = (tab) => {
        if (tab === "login") {
            navigate("/");
        } else {
            setActiveTab(tab);
        }
    };

    return (
        <section className="auth-page">
            <div className="auth-card">
                <div className="auth-title">
                    {activeTab === "login" ? "Login" : "Register"}
                </div>

                <div className="nav-pills-container">
                    <button
                        className={`nav-pill ${activeTab === "login" ? "active" : ""}`}
                        onClick={() => handleTabClick("login")}
                    >
                        Login
                    </button>
                    <button
                        className={`nav-pill ${activeTab === "register" ? "active" : ""}`}
                        onClick={() => handleTabClick("register")}
                    >
                        Register
                    </button>
                </div>

                <form>

                    <input type="text" placeholder="Name" className="auth-input" />
                    <input type="text" placeholder="Username" className="auth-input" />
                    <input type="email" placeholder="Email" className="auth-input" />
                    <input type="password" placeholder="Password" className="auth-input" />
                    <input type="password" placeholder="Repeat Password" className="auth-input" />

                    <div className="auth-options">
                        <label>
                            <input type="checkbox" defaultChecked /> I agree to the terms
                        </label>
                    </div>

                    <button type="submit" className="auth-button">Register</button>

                    <div className="auth-footer">
                        Already have an account?{" "}
                        <span
                            className="auth-link"
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate("/")}
                        >
                            Login
                        </span>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Signup;
