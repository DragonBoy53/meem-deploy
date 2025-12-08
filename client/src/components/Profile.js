import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, updateProfile, loading } = useAuth();

  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAvatar(user.avatar || '');
      setBio(user.bio || '');
    }
  }, [user]);

  if (!user) {
    return (
      <div className="product-section">
        <h2 className="section-title">Profile</h2>
        <p className="muted-text">You must be logged in to view your profile.</p>
        <Link to="/login" className="btn btn-primary" style={{ marginTop: 12 }}>
          Go to Login
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const res = await updateProfile({ name, avatar, bio });
    if (res.success) {
      setMessage('Profile updated successfully.');
    } else {
      setMessage(res.message || 'Update failed.');
    }
  };

  const avatarPreview =
    avatar && avatar.trim().length > 0
      ? avatar
      : 'https://via.placeholder.com/120x120.png?text=Avatar';

  return (
    <div className="product-section">
      <h2 className="section-title">My Profile</h2>

      <div
        style={{
          display: 'flex',
          gap: 24,
          flexWrap: 'wrap',
          marginTop: 16
        }}
      >
        <div>
          <img
            src={avatarPreview}
            alt="avatar preview"
            style={{
              width: 120,
              height: 120,
              borderRadius: '999px',
              objectFit: 'cover',
              border: '2px solid #e5e7eb'
            }}
          />
        </div>

        <form
          style={{ maxWidth: 360, flex: '1 1 260px' }}
          onSubmit={handleSubmit}
        >
          <label style={{ display: 'block', marginBottom: 8 }}>
            Name
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </label>

          <label style={{ display: 'block', marginBottom: 8 }}>
            Avatar URL
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://example.com/my-avatar.jpg"
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </label>

          <label style={{ display: 'block', marginBottom: 8 }}>
            Bio
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              style={{ width: '100%', padding: 8, marginTop: 4 }}
              placeholder="Tell something about yourself..."
            />
          </label>

          {message && (
            <p
              className="muted-text"
              style={{
                marginBottom: 8,
                color: message.includes('successfully') ? '#16a34a' : '#dc2626'
              }}
            >
              {message}
            </p>
          )}

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
