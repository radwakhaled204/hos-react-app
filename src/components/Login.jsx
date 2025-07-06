// src/components/Login.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AuthComponent.css";

const Login = () => {
    const navigate = useNavigate();

    const handleRegisterClick = () => {
        navigate("/signup");
    };

    
    const handleLoginClick = () => {
       
        const userData = {
            username: "testuser",
            token: "1234567890"
        };

        
        localStorage.setItem("userData", JSON.stringify(userData));

       
        navigate("/home"); 
    };

    return (
        <section className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">Sign In</h2>

                <input type="email" className="auth-input" placeholder="Email address" />
                <input type="password" className="auth-input" placeholder="Password" />

                <div className="auth-options">
                    <label>
                        <input type="checkbox" /> Remember me
                    </label>
                    <a href="#!" className="auth-link">Forgot password?</a>
                </div>

                {/* 🚩 عدل الزر ليستخدم handleLoginClick */}
                <button className="auth-button" onClick={handleLoginClick}>
                    Login
                </button>

                <div className="auth-footer">
                    Don't have an account?{" "}
                    <span
                        className="auth-link"
                        style={{ cursor: "pointer" }}
                        onClick={handleRegisterClick}
                    >
                        Register
                    </span>
                </div>
            </div>
        </section>
    );
};

export default Login;
