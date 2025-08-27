// export default AccountSettings;
import React, { useState, useContext } from "react";
import "./AccountSettings.css";
import { UserContext } from "../../context/UserContext";

const AccountSettings = () => {
  const { user } = useContext(UserContext);

  const [account, setAccount] = useState({
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setAccount({ ...account, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { email, currentPassword, newPassword, confirmPassword } = account;

    if (newPassword && newPassword !== confirmPassword) {
      return setError("New password and confirm password do not match.");
    }

    try {
      setLoading(true);

      const res = await fetch("/api/user/account", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          email,
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      alert("Account updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-settings">
      <h3>Account Settings</h3>
      <form className="account-form" onSubmit={handleSubmit}>
        {/* Email Section */}
        <label>
          Email Address
          <input
            type="email"
            name="email"
            value={account.email}
            onChange={handleChange}
            required
          />
        </label>

        {/* Password Update */}
        <label>
          Current Password
          <input
            type="password"
            name="currentPassword"
            value={account.currentPassword}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          New Password
          <input
            type="password"
            name="newPassword"
            value={account.newPassword}
            onChange={handleChange}
          />
        </label>

        <label>
          Confirm New Password
          <input
            type="password"
            name="confirmPassword"
            value={account.confirmPassword}
            onChange={handleChange}
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="save-btn" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default AccountSettings;
