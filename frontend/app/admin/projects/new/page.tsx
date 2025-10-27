'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';

export default function NewProjectPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    recipient_name: '',
    recipient_type: '',
    total_amount: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required';
    } else if (formData.title.length > 255) {
      newErrors.title = 'Title must be less than 255 characters';
    }

    if (!formData.recipient_name.trim()) {
      newErrors.recipient_name = 'Recipient name is required';
    }

    if (!formData.total_amount) {
      newErrors.total_amount = 'Total budget is required';
    } else {
      const amount = parseFloat(formData.total_amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.total_amount = 'Budget must be a positive number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Convert amount to lamports (smallest unit, 9 decimals for SOL equivalent)
      const amountInLamports = BigInt(
        Math.floor(parseFloat(formData.total_amount) * 1_000_000_000)
      ).toString();

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          total_amount: amountInLamports,
          ministry_id: session?.user?.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/admin/projects/${data.project.id}`);
      } else {
        setErrors({ submit: data.error || 'Failed to create project' });
      }
    } catch (error) {
      console.error('Error creating project:', error);
      setErrors({ submit: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Create New Project
          </h1>
          <p className="text-gray-600 mt-1">
            Draft a new budget transparency project. You can publish it to the
            blockchain later.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Project Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., Road Infrastructure Development 2025"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Provide details about the project objectives, scope, and expected outcomes..."
              />
            </div>

            {/* Recipient Name */}
            <div>
              <label
                htmlFor="recipient_name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Recipient Name *
              </label>
              <input
                type="text"
                id="recipient_name"
                name="recipient_name"
                value={formData.recipient_name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.recipient_name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., Ministry of Public Works"
              />
              {errors.recipient_name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.recipient_name}
                </p>
              )}
            </div>

            {/* Recipient Type */}
            <div>
              <label
                htmlFor="recipient_type"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Recipient Type
              </label>
              <select
                id="recipient_type"
                name="recipient_type"
                value={formData.recipient_type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select type...</option>
                <option value="ministry">Ministry</option>
                <option value="department">Department</option>
                <option value="agency">Government Agency</option>
                <option value="contractor">Contractor</option>
                <option value="ngo">NGO Partner</option>
              </select>
            </div>

            {/* Total Budget */}
            <div>
              <label
                htmlFor="total_amount"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Total Budget (Billion Rupiah) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-2 text-gray-500">
                  Rp
                </span>
                <input
                  type="number"
                  id="total_amount"
                  name="total_amount"
                  value={formData.total_amount}
                  onChange={handleChange}
                  step="0.001"
                  min="0"
                  className={`w-full pl-12 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.total_amount ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0.000"
                />
              </div>
              {errors.total_amount && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.total_amount}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Enter amount in billion rupiah (e.g., 5.5 for Rp 5.5 billion)
              </p>
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                'Create Draft Project'
              )}
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This will create a draft project in the
              database. You&apos;ll need to connect your wallet and publish it to
              the blockchain before adding milestones.
            </p>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
