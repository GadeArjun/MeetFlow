// 📁 src/components/Settings/AccountSettings.jsx
import React, { useState } from "react";
import "./AccountSettings.css";

const AccountSettings = () => {
  const [account, setAccount] = useState({
    email: "user@example.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

//   const [linkedAccounts, setLinkedAccounts] = useState({
//     google: true,
//     github: false,
//   });

  const handleChange = (e) => {
    setAccount({ ...account, [e.target.name]: e.target.value });
  };

//   const handleUnlink = (provider) => {
//     setLinkedAccounts({ ...linkedAccounts, [provider]: false });
//     alert(`${provider} account unlinked`);
//   };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Account Updated:", account);
    alert("Account settings updated successfully!");
  };

  return (
    <div className="account-settings">
      <h3>🔐 Account Settings</h3>
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

        <button type="submit" className="save-btn">
          Save Changes
        </button>
      </form>

      {/* Linked Accounts */}
      {/* <div className="linked-accounts">
        <h4>🔗 Linked Accounts</h4>
        <ul>
          <li>
            Google:{" "}
            {linkedAccounts.google ? (
              <button onClick={() => handleUnlink("google")}>Unlink</button>
            ) : (
              <span>Not Linked</span>
            )}
          </li>
          <li>
            GitHub:{" "}
            {linkedAccounts.github ? (
              <button onClick={() => handleUnlink("github")}>Unlink</button>
            ) : (
              <span>Not Linked</span>
            )}
          </li>
        </ul>
      </div> */}
    </div>
  );
};

export default AccountSettings;
