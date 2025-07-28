import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css"; // Import the shared CSS
import desklyLogo from "../../assets/images/logo.png"; // <--- Import your logo here
import axios from "axios";
const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for the current field as user types
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    // Made async for potential future API calls
    e.preventDefault();
    if (validateForm()) {
      // Here you would typically send data to your backend API
      // Example using try/catch for async operation:

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/register`,
          formData
        );


        if (response.status == 201) {
          // Check if response status is 2xx
          alert("Registration successful!");
          navigate("/login"); // Redirect to login page
        } else {
          setErrors({
            form:
              response.data.message || "Registration failed. Please try again.",
          });
        }
      } catch (error) {
        console.error("Error during registration:", error);
        setErrors({
          form:
            error.response.data.message ||
            "Network error or server unavailable. Please try again.",
        });
      }

      // alert("Registration successful! (Simulated)");
      // navigate("/login");
    } else {
      console.error("Form has errors:", errors);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src={desklyLogo} alt="Deskly Logo" className="auth-logo" />{" "}
        {/* <--- Add your logo here */}
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              aria-invalid={errors.username ? "true" : "false"}
              aria-describedby={errors.username ? "username-error" : null}
            />
            {errors.username && (
              <p id="username-error" className="error-message">
                {errors.username}
              </p>
            )}
          </div>
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
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              aria-invalid={errors.confirmPassword ? "true" : "false"}
              aria-describedby={
                errors.confirmPassword ? "confirmPassword-error" : null
              }
            />
            {errors.confirmPassword && (
              <p id="confirmPassword-error" className="error-message">
                {errors.confirmPassword}
              </p>
            )}
          </div>
          <button type="submit" className="auth-button">
            Register
          </button>
          {errors.form && <p className="error-message">{errors.form}</p>}
        </form>
        <Link to="/login" className="auth-link">
          Already have an account? Login here.
        </Link>
      </div>
    </div>
  );
};

export default Register;
