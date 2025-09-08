// 📁 src/components/Settings/ProfileSettings.jsx
import React, { useState, useContext, useEffect } from "react";
import "./ProfileSettings.css";
import meetFlowFavicon from "../../assets/images/favicon.png"; // Import your favicon
import { UserContext } from "../../context/UserContext";

const ProfileSettings = () => {
  const { user, setUser, token } = useContext(UserContext);
  console.log({ user });
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    bio: "",
    avatarUrl: "", // saved URL
    imagePreview: "", // local preview
    imageFile: null, // raw file
  });

  // Load user data on mount
  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.name || "",
        username: user.username || "",
        bio: user.bio || "",
        avatarUrl: user.avatarUrl || "",
        imagePreview: user.avatarUrl || "/user.png",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({
        ...profile,
        imagePreview: URL.createObjectURL(file),
        imageFile: file,
      });
    }
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      let avatarUrl = profile.avatarUrl;

      // Upload image if changed
      if (profile.imageFile) {
        const formData = new FormData();
        formData.append("file", profile.imageFile);

        // Simulate image upload (replace with real endpoint)
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/upload`,
          {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        avatarUrl = data.url;
      }

      const updatedData = {
        name: profile.name,
        username: profile.username,
        bio: profile.bio,
        avatarUrl,
      };

      // Send profile update request
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      const updatedUser = await res.json();
      setUser(updatedUser);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-settings">
      <h3>Profile Settings</h3>
      <p>Update your personal information and profile picture.</p>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="image-section">
          <img
            src={profile.imagePreview || "/user.png"}
            alt="Profile Preview"
            className="profile-image"
          />
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

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

        <label>
          Username
          <input
            type="text"
            name="username"
            value={profile.username}
            onChange={handleChange}
          />
        </label>

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

        {/* <button type="submit" className="save-btn">
          Save Changes
        </button> */}
        <button type="submit" className="save-btn" disabled={loading}>
          {loading ? (
            <div className="loading-button-content">
              <img
                src={meetFlowFavicon}
                alt="Loading Icon"
                className="rotating-icon"
              />
              <span className="loading-text-btn">Saving Changes...</span>
            </div>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;
