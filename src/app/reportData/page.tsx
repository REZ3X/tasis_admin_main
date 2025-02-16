/**
 * ReportDataPage Component
 * Displays a page containing a list of reports/complaints (pengaduan)
 * Includes navigation back to home and renders the ReportsList component
 */

import ReportsList from '@/components/pengaduan/reportsList';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function ReportDataPage() {
  return (
    <main className="min-h-screen bg-[#0d1216] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="p-2 text-[#ebae3a] hover:bg-[#ebae3a]/10 rounded-lg
              transition-colors"
          >
            <FaArrowLeft />
          </Link>
          <h1 className="text-4xl font-bold text-[#ebae3a]">
            Data Pengaduan
          </h1>
        </div>

        <div className="bg-[#1f1c16] rounded-lg border border-[#594925]/20 p-6">
          <ReportsList />
        </div>
      </div>
    </main>
  );
}