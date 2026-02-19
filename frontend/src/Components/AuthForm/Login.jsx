import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../AuthForm/authform.css";
import CustomAlert from "../Alert/Alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success");


  const showCustomAlert = (message, type = "success") => {
    setAlertMsg(message);
    setAlertType(type);
    setShowAlert(true);
  };

  const handleLogin = async (event) => {
  event.preventDefault();

  try {
    const response = await fetch(
      "http://localhost:8000/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      // ⭐ IMPORTANT FIX
      localStorage.setItem("token", data.authToken);

      showCustomAlert("Login success ✅", "success");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } else {
      showCustomAlert(
        data.message || "Login failed",
        "error"
      );
    }
  } catch (error) {
    showCustomAlert("Server error", "error");
  }
};

  return (
    <>
      {/* Alert */}
      <CustomAlert
        message={alertMsg}
        type={alertType}
        show={showAlert}
      />

      <div className="login-container">
        <form onSubmit={handleLogin}>
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

          <button type="submit" className="btn-login">
            Login
          </button>

          <p>
            Don't have an account? <Link to="/signup">Signup</Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
