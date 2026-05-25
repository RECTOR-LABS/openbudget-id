'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface IssueReportModalProps {
  projectId: string;
  projectTitle: string;
  milestoneId?: string;
  milestoneTitle?: string;
}

export default function IssueReportModal({
  projectId,
  projectTitle,
  milestoneId,
  milestoneTitle,
}: IssueReportModalProps) {
  const t = useTranslations('engagement.issues');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [issueType, setIssueType] = useState('budget_mismatch');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !title || !description) {
      setError(t('allFieldsRequired'));
      return;
    }

    if (description.length < 10 || description.length > 2000) {
      setError(t('descriptionLength'));
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projectId,
          milestone_id: milestoneId || null,
          reporter_email: email,
          reporter_name: name,
          issue_type: issueType,
          title,
          description,
          severity,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t('submitError'));
        return;
      }

      setSuccess(t('submitSuccess'));
      setTimeout(() => {
        setShowModal(false);
        setSuccess('');
        // Reset form
        setName('');
        setEmail('');
        setTitle('');
        setDescription('');
        setIssueType('budget_mismatch');
        setSeverity('medium');
      }, 2000);
    } catch {
      setError(t('networkError'));
    } finally {
      setSubmitting(false);
    }
  };

  const issueTypes = [
    { value: 'budget_mismatch', label: t('modal.types.budget_mismatch') },
    { value: 'missing_proof', label: t('modal.types.missing_proof') },
    { value: 'delayed_release', label: t('modal.types.delayed_release') },
    { value: 'fraudulent_claim', label: t('modal.types.fraudulent_claim') },
    { value: 'other', label: t('modal.types.other') },
  ];

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition cursor-pointer"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        {t('reportButton')}
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative my-8">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              🚨 {t('modal.title')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('modal.projectLabel')}: <strong>{projectTitle}</strong>
              {milestoneTitle && (
                <>
                  {' '}
                  | {t('modal.milestoneLabel')}: <strong>{milestoneTitle}</strong>
                </>
              )}
            </p>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('modal.nameLabel')}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder={t('modal.namePlaceholder')}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('modal.emailLabel')}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder={t('modal.emailPlaceholder')}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('modal.typeLabel')}
                  </label>
                  <select
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent cursor-pointer"
                  >
                    {issueTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('modal.severityLabel')}
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent cursor-pointer"
                  >
                    <option value="low">{t('modal.severity.low')}</option>
                    <option value="medium">{t('modal.severity.medium')}</option>
                    <option value="high">{t('modal.severity.high')}</option>
                    <option value="critical">{t('modal.severity.critical')}</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('modal.titleLabel')}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={200}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder={t('modal.titlePlaceholder')}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('modal.descriptionLabel')}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  minLength={10}
                  maxLength={2000}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder={t('modal.descriptionPlaceholder')}
                  required
                />
                <div className="text-sm text-gray-500 mt-1 text-right">
                  {t('modal.characterCount', { count: description.length })}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
                >
                  {submitting ? t('modal.submitting') : t('modal.submitButton')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition cursor-pointer"
                >
                  {t('modal.cancelButton')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
