import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { updateProfile } from '../services/auth.js';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user: updatedUser } = await updateProfile({
        name: formData.name,
        phone: formData.phone,
      });
      setUser(updatedUser);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update failed:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold text-slate-950 mb-4">Access Required</h1>
        <p className="text-slate-600 mb-8">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-4xl font-bold text-slate-950">Profile</h1>
        <p className="mt-3 text-sm text-slate-600">Update your personal details and contact information.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Input
              label="Full name"
              name="name"
              placeholder="Jane Doe"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="jane@example.com"
              value={formData.email}
              disabled
              className="bg-slate-50"
            />
            <Input
              label="Phone"
              name="phone"
              placeholder="(123) 456-7890"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          <Button type="submit" disabled={loading} className="mt-8">
            {loading ? 'Saving...' : 'Save changes'}
          </Button>
        </form>
      </div>
    </div>
  );
}
