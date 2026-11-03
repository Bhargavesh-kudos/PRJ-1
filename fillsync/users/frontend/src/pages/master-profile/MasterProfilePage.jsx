/**
 * ============================================================================
 * FILE: frontend/src/pages/master-profile/MasterProfilePage.jsx
 * PURPOSE: Master Profile Management Screen (Personal Info + Address Details).
 * ============================================================================
 */

import React, { useEffect, useState } from "react";
import { Save, Edit3, CheckCircle2 } from "lucide-react";
import { apiRequest } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function MasterProfilePage() {
  const { user, updateUserState } = useAuth();
  const [isEditing, setIsEditing] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "Male",
    address: {
      street: "",
      city: "",
      state: "",
      pinCode: "",
      country: "India"
    }
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await apiRequest("/profiles/me");
        if (res.profile) {
          setFormData({
            fullName: res.profile.fullName || "",
            email: res.profile.email || "",
            phone: res.profile.phone || "",
            dob: res.profile.dob || "",
            gender: res.profile.gender || "Male",
            address: {
              street: res.profile.address?.street || "",
              city: res.profile.address?.city || "",
              state: res.profile.address?.state || "",
              pinCode: res.profile.address?.pinCode || "",
              country: res.profile.address?.country || "India"
            }
          });
        }
      } catch (err) {
        setToast({ type: "error", text: err.message });
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  async function handleSaveProfile(e) {
    e.preventDefault();
    setSaving(true);
    setToast(null);

    try {
      const res = await apiRequest("/profiles/me", {
        method: "PUT",
        body: JSON.stringify(formData)
      });

      if (user && formData.fullName) {
        updateUserState({ ...user, name: formData.fullName });
      }

      setToast({
        type: "success",
        text: res.message || "Master Profile saved successfully!"
      });
    } catch (err) {
      setToast({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-8 text-sm text-slate-500">Loading Master Profile...</div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Master Profile</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Personal and address details used across web forms
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700"
          >
            <Edit3 className="w-4 h-4" />
            {isEditing ? "Lock Form" : "Edit Profile"}
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-2 ${
            toast.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          {toast.text}
        </div>
      )}

      {/* Main Profile Form Card */}
      <form
        onSubmit={handleSaveProfile}
        className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8"
      >
        {/* Section 1: Personal Information */}
        <div>
          <h2 className="text-base font-bold text-slate-800 pb-3 border-b border-slate-100 mb-5">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm disabled:bg-slate-50 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                disabled={!isEditing}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm disabled:bg-slate-50 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 9876543210"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm disabled:bg-slate-50 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Date of Birth
              </label>
              <input
                type="date"
                disabled={!isEditing}
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm disabled:bg-slate-50 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Gender
              </label>
              <select
                disabled={!isEditing}
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm disabled:bg-slate-50 focus:outline-none focus:border-teal-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Address Details */}
        <div>
          <h2 className="text-base font-bold text-slate-800 pb-3 border-b border-slate-100 mb-5">
            Address Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Street Address
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.address.street}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, street: e.target.value }
                  })
                }
                placeholder="House/Hostel No, Street, Landmark"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm disabled:bg-slate-50 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                City
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.address.city}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, city: e.target.value }
                  })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm disabled:bg-slate-50 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                State
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.address.state}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, state: e.target.value }
                  })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm disabled:bg-slate-50 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                ZIP / PIN Code
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.address.pinCode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, pinCode: e.target.value }
                  })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm disabled:bg-slate-50 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Country
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.address.country}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, country: e.target.value }
                  })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm disabled:bg-slate-50 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold shadow-sm transition-colors"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
