import Link from 'next/link';
import { formatRupiah } from '@/lib/utils';

interface Project {
  id: string;
  title: string;
  recipient_name: string;
  total_amount: string;
  total_allocated: string;
  total_released: string;
  status: string;
  created_at: string;
  blockchain_id: string | null;
  solana_account: string | null;
  creation_tx: string | null;
}

export default function ProjectCard({ project }: { project: Project }) {
  const totalBudget = BigInt(project.total_amount);
  const totalReleased = BigInt(project.total_released);

  // Calculate progress percentage (avoid division by zero)
  const progress = totalBudget > 0n
    ? Number((totalReleased * 100n) / totalBudget)
    : 0;

  return (
    <Link href={`/projects/${project.id}`} className="cursor-pointer">
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-100 h-full flex flex-col">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-gray-900 line-clamp-2 flex-1">
              {project.title}
            </h3>
            {project.creation_tx && (
              <span className="ml-2 flex-shrink-0 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✓ Verified
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 mb-4 flex items-center">
            <svg
              className="w-4 h-4 mr-1 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            {project.recipient_name}
          </p>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Total Anggaran:</span>
              <span className="font-bold text-gray-900">
                {formatRupiah(totalBudget)}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Telah Direalisasikan:</span>
              <span className="font-bold text-green-600">
                {formatRupiah(totalReleased)}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="pt-2">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Progress</span>
                <span className="font-semibold">{progress.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-blue-600 text-sm font-medium">
            Lihat Detail
          </span>
          <svg
            className="w-5 h-5 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
