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
  const [displayAmount, setDisplayAmount] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Format number with thousand separators
  const formatNumber = (value: string): string => {
    // Remove all non-digit characters
    const numericValue = value.replace(/\D/g, '');
    if (!numericValue) return '';
    // Add thousand separators
    return Number(numericValue).toLocaleString('id-ID');
  };

  // Parse formatted number back to raw number
  const parseFormattedNumber = (value: string): string => {
    return value.replace(/\D/g, '');
  };

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

      // Convert amount to string (store as-is in Rupiah)
      const amountInRupiah = BigInt(
        Math.floor(parseFloat(formData.total_amount))
      ).toString();

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          total_amount: amountInRupiah,
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

    // Special handling for amount field
    if (name === 'total_amount') {
      const rawValue = parseFormattedNumber(value);
      setFormData((prev) => ({ ...prev, [name]: rawValue }));
      setDisplayAmount(formatNumber(value));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

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
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder:text-gray-400 ${
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder:text-gray-400"
                placeholder="Provide details about the project objectives, scope, and expected outcomes..."
              />
            </div>

            {/* Recipient Name */}
            <div>
              <label
                htmlFor="recipient_name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Recipient / Implementing Entity *
              </label>
              <select
                id="recipient_name"
                name="recipient_name"
                value={formData.recipient_name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                  errors.recipient_name ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select recipient...</option>

                <optgroup label="Kementerian (Ministries)">
                  <option value="Kementerian Keuangan">Kementerian Keuangan</option>
                  <option value="Kementerian Dalam Negeri">Kementerian Dalam Negeri</option>
                  <option value="Kementerian Luar Negeri">Kementerian Luar Negeri</option>
                  <option value="Kementerian Pertahanan">Kementerian Pertahanan</option>
                  <option value="Kementerian Hukum dan HAM">Kementerian Hukum dan HAM</option>
                  <option value="Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi">Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi</option>
                  <option value="Kementerian Kesehatan">Kementerian Kesehatan</option>
                  <option value="Kementerian Agama">Kementerian Agama</option>
                  <option value="Kementerian Sosial">Kementerian Sosial</option>
                  <option value="Kementerian Ketenagakerjaan">Kementerian Ketenagakerjaan</option>
                  <option value="Kementerian Perindustrian">Kementerian Perindustrian</option>
                  <option value="Kementerian Perdagangan">Kementerian Perdagangan</option>
                  <option value="Kementerian Energi dan Sumber Daya Mineral">Kementerian Energi dan Sumber Daya Mineral</option>
                  <option value="Kementerian Pekerjaan Umum dan Perumahan Rakyat">Kementerian Pekerjaan Umum dan Perumahan Rakyat</option>
                  <option value="Kementerian Perhubungan">Kementerian Perhubungan</option>
                  <option value="Kementerian Pertanian">Kementerian Pertanian</option>
                  <option value="Kementerian Lingkungan Hidup dan Kehutanan">Kementerian Lingkungan Hidup dan Kehutanan</option>
                  <option value="Kementerian Kelautan dan Perikanan">Kementerian Kelautan dan Perikanan</option>
                  <option value="Kementerian Pariwisata dan Ekonomi Kreatif">Kementerian Pariwisata dan Ekonomi Kreatif</option>
                  <option value="Kementerian Komunikasi dan Informatika">Kementerian Komunikasi dan Informatika</option>
                  <option value="Kementerian BUMN">Kementerian BUMN</option>
                  <option value="Kementerian Investasi/BKPM">Kementerian Investasi/BKPM</option>
                </optgroup>

                <optgroup label="Lembaga (Agencies)">
                  <option value="BPKP (Badan Pengawasan Keuangan dan Pembangunan)">BPKP</option>
                  <option value="BPS (Badan Pusat Statistik)">BPS</option>
                  <option value="BPOM (Badan Pengawas Obat dan Makanan)">BPOM</option>
                  <option value="BNPB (Badan Nasional Penanggulangan Bencana)">BNPB</option>
                  <option value="BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)">BMKG</option>
                  <option value="BATAN (Badan Tenaga Nuklir Nasional)">BATAN</option>
                  <option value="LAPAN (Lembaga Penerbangan dan Antariksa Nasional)">LAPAN</option>
                  <option value="BRIN (Badan Riset dan Inovasi Nasional)">BRIN</option>
                </optgroup>

                <optgroup label="Universitas Negeri">
                  <option value="Universitas Indonesia">Universitas Indonesia</option>
                  <option value="Universitas Gadjah Mada">Universitas Gadjah Mada</option>
                  <option value="Institut Teknologi Bandung">Institut Teknologi Bandung</option>
                  <option value="Institut Pertanian Bogor">Institut Pertanian Bogor</option>
                  <option value="Universitas Airlangga">Universitas Airlangga</option>
                  <option value="Universitas Diponegoro">Universitas Diponegoro</option>
                  <option value="Universitas Padjadjaran">Universitas Padjadjaran</option>
                </optgroup>

                <optgroup label="Rumah Sakit">
                  <option value="RSUP Dr. Cipto Mangunkusumo">RSUP Dr. Cipto Mangunkusumo</option>
                  <option value="RSUP Dr. Sardjito">RSUP Dr. Sardjito</option>
                  <option value="RSUP Dr. Hasan Sadikin">RSUP Dr. Hasan Sadikin</option>
                  <option value="RSUP Dr. Kariadi">RSUP Dr. Kariadi</option>
                  <option value="RSUP Sanglah">RSUP Sanglah</option>
                </optgroup>
              </select>
              {errors.recipient_name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.recipient_name}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Select the entity that will implement or receive this budget allocation
              </p>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              >
                <option value="" className="text-gray-400">Select type...</option>
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
                Total Budget (Rupiah) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-2 text-gray-500">
                  Rp
                </span>
                <input
                  type="text"
                  id="total_amount"
                  name="total_amount"
                  value={displayAmount}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder:text-gray-400 ${
                    errors.total_amount ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="1,000,000"
                  inputMode="numeric"
                />
              </div>
              {errors.total_amount && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.total_amount}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Type amount and it will format automatically (e.g., 1,000,000 or 5,500,000,000)
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
