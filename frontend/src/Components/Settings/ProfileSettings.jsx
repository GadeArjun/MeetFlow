// 📁 src/components/Settings/ProfileSettings.jsx
import React, { useState } from "react";
import "./ProfileSettings.css";

const ProfileSettings = () => {
  const [profile, setProfile] = useState({
    name: "Arjun Gade",
    username: "arjun_g",
    bio: "Frontend Developer and Tech Enthusiast",
    image: "", // for preview
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, image: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Profile:", profile);
    alert("Profile updated successfully!");
  };

  return (
    <div className="profile-settings">
      <h3>👤 Profile Settings</h3>
      <p>Update your personal information and profile picture.</p>

      <form onSubmit={handleSubmit} className="profile-form">
        {/* Profile Image Preview & Upload */}
        <div className="image-section">
          <img
            src={profile.image || "/user.png"}
            alt="Profile Preview"
            className="profile-image"
          />
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        {/* Name */}
        <label>
          Full Name
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            required
          />
        </label>

        {/* Username */}
        <label>
          Username
          <input
            type="text"
            name="username"
            value={profile.username}
            onChange={handleChange}
            required
          />
        </label>

        {/* Bio */}
        <label>
          Bio
          <textarea
            name="bio"
            rows={3}
            value={profile.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
          />
        </label>

        <button type="submit" className="save-btn">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;
