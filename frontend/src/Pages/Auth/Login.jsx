import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import meetFlowLogo from "../../assets/images/logo.png";
import meetFlowFavicon from "../../assets/images/favicon.png"; // Import your favicon
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import Meta from "../../Components/Meta/Meta";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Add a loading state
  const navigate = useNavigate();
  const { setUser, setToken } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true); // Start loading
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/login`,
          formData
        );

        if (response.status === 200) {
          alert("Login successful!");
          localStorage.setItem("token", response.data.token);
          setUser(response.data.user);
          setToken(response.data.token);
          const meetingId = localStorage.getItem("meetingId");
          if (meetingId) {
            localStorage.setItem("meetingId", "");
            navigate(`/join-meeting/${meetingId}`);
          } else {
            navigate("/dashboard");
          }
        } else {
          setErrors({
            form: response.data.message || "Login failed. Please try again.",
          });
        }
      } catch (error) {
        console.error("Error during login:", error);
        setErrors({
          form:
            error.response?.data?.message ||
            "Network error or server unavailable",
        });
      } finally {
        setLoading(false); // End loading regardless of success or failure
      }
    } else {
      console.error("Form has errors:", errors);
    }
  };

  return (
    <>
      <Meta page="login" />
      <div className="auth-container">
        <div className="auth-card">
          <img
            onClick={() => {
              navigate("/");
            }}
            src={meetFlowLogo}
            alt="MeetFlow Logo"
            className="auth-logo"
          />
          <h2 className="auth-title">Log in to your account</h2>
          <p className="auth-subtitle">
            Welcome back! Please enter your details.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : null}
              />
              {errors.email && (
                <p id="email-error" className="error-message">
                  {errors.email}
                </p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={errors.password ? "password-error" : null}
              />
              {errors.password && (
                <p id="password-error" className="error-message">
                  {errors.password}
                </p>
              )}
            </div>
            <div className="auth-actions">
              <Link
                to="/forgot-password"
                className="auth-link forgot-password-link"
              >
                Forgot password?
              </Link>
            </div>
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? (
                <div className="loading-button-content">
                  <img
                    src={meetFlowFavicon}
                    alt="Loading Icon"
                    className="rotating-icon"
                  />
                  <span className="loading-text-btn">Logging in...</span>
                </div>
              ) : (
                "Login"
              )}
            </button>
            {errors.form && <p className="error-message">{errors.form}</p>}
          </form>
          <Link to="/register" className="auth-link">
            Don't have an account? Register here.
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;
