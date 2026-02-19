import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../AuthForm/authform.css";
import CustomAlert from "../Alert/Alert";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertType, setAlertType] = useState("success");

        const navigate = useNavigate();

    // Show alert function (no auto hide)
    const handleClickAlert = (message, type) => {
        setAlertMsg(message);
        setAlertType(type);
        setShowAlert(true);
    };

    const handleSignup = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("http://localhost:8000/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Save token if present
                if (data.token) {
                    localStorage.setItem("token", data.token);
                }

                // Show success alert
                handleClickAlert("User Signup successfully ✅", "success");

                // Clear input fields
                setName("");
                setEmail("");
                setPassword("");

                // Redirect after alert
                setTimeout(() => {
                    setShowAlert(false); // Hide alert
                    navigate("/login");
                }, 2000);
            } else {
                handleClickAlert(data.message || "Signup failed ❌", "error");
                setTimeout(() => {
                    setShowAlert(false);
                }, 2000);
            }
        } catch (error) {
            console.error("Connection Error:", error);
            handleClickAlert("Server error. Please try again later.", "error");

            setTimeout(() => {
                setShowAlert(false); // Hide alert
            }, 2000);
        }
    };


    return (
        <>
            <CustomAlert
                message={alertMsg}
                type={alertType}
                show={showAlert}
            />

            <div className="signup-container">
                <form onSubmit={handleSignup}>

                    <label className="form-label">Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name..."
                        required
                    />

                    <label className="form-label">Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email..."
                        required
                    />

                    <label className="form-label">Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password..."
                        required
                    />

                    <button type="submit" className="btn-signup">
                        Signup
                    </button>

                    <p>
                        Already have an account? <Link to="/login">Login</Link>
                    </p>

                </form>
            </div>
        </>
    );
};

export default Signup;
