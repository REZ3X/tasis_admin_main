"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  FaEye,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaFilter,
} from "react-icons/fa";

interface Report {
  id: number;
  title: string;
  incident_datetime: string;
  submitted_datetime: string;
  details: string;
  evidence_url: string | null;
  status: "pending" | "process" | "resolved" | "failed";
}

export default function ReportsList() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [updating, setUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Report["status"] | "all">(
    "all"
  );
  const [message, setMessage] = useState<{
    type: "success" | "error";
    content: string;
  } | null>(null);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/getReport");
      const data = await response.json();

      if (data.success) {
        setReports(data.reports);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleStatusUpdate = async (
    reportId: number,
    newStatus: Report["status"]
  ) => {
    setUpdating(true);
    try {
      const response = await fetch("/api/updateReportStatus", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Update local state
        setReports((prevReports) =>
          prevReports.map((report) =>
            report.id === reportId ? { ...report, status: newStatus } : report
          )
        );
        // Show success message
        setMessage({ type: "success", content: "Status berhasil diperbarui" });
        // Optional: close modal after success
        setSelectedReport(null);
      } else {
        throw new Error(data.error || "Failed to update status");
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      setMessage({
        type: "error",
        content: "Gagal memperbarui status. Silakan coba lagi.",
      });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: Report["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "process":
        return "bg-blue-500/20 text-blue-400";
      case "resolved":
        return "bg-green-500/20 text-green-400";
      case "failed":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FaSpinner className="w-8 h-8 text-[#ebae3a] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 p-4 bg-red-500/10 rounded-lg">{error}</div>
    );
  }

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Reports Table */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-[#ebae3a]/70" />
          </div>
          <input
            type="text"
            placeholder="Cari laporan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#1f1c16] text-gray-100 rounded-lg 
        border border-[#594925]/20 focus:border-[#ebae3a]/50 focus:outline-none 
        focus:ring-1 focus:ring-[#ebae3a]/50 transition-colors
        placeholder:text-gray-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <FaFilter className="text-[#ebae3a]" />
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as Report["status"] | "all")
            }
            className="px-4 py-2 bg-[#1f1c16] text-gray-100 rounded-lg 
        border border-[#594925]/20 focus:border-[#ebae3a]/50 focus:outline-none 
        focus:ring-1 focus:ring-[#ebae3a]/50 transition-colors"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="process">Proses</option>
            <option value="resolved">Selesai</option>
            <option value="failed">Gagal</option>
          </select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-[#1f1c16]/50 rounded-lg p-4 space-y-3
        hover:bg-[#1f1c16] transition-colors border border-[#594925]/20
        flex flex-col"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                {" "}
                {/* Added to prevent title overflow */}
                <span className="text-sm text-[#ebae3a]">#{report.id}</span>
                <h3 className="text-gray-300 font-medium mt-1 truncate">
                  {report.title}
                </h3>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${getStatusColor(
                  report.status
                )}`}
              >
                {report.status}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 text-sm text-gray-400">
              <div>
                <span className="block text-[#ebae3a]/70">
                  Tanggal Kejadian
                </span>
                <span className="block">
                  {formatDate(report.incident_datetime)}
                </span>
              </div>
              <div>
                <span className="block text-[#ebae3a]/70">Tanggal Lapor</span>
                <span className="block">
                  {formatDate(report.submitted_datetime)}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2 mt-auto">
              {" "}
              {/* Added mt-auto to push button to bottom */}
              <button
                onClick={() => setSelectedReport(report)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm
            text-[#ebae3a] hover:bg-[#ebae3a]/10 rounded-lg transition-colors"
              >
                <FaEye className="w-4 h-4" />
                <span>Lihat Detail</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Report Detail Modal */}
      {message && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg z-50 ${
            message.type === "success"
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {message.content}
        </div>
      )}

      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#0d1216] p-6 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-[#ebae3a]">
                Detail Laporan #{selectedReport.id}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    handleStatusUpdate(selectedReport.id, "resolved")
                  }
                  disabled={updating || selectedReport.status === "resolved"}
                  className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg
            hover:bg-green-500/30 transition-colors disabled:opacity-50
            flex items-center gap-2"
                >
                  {updating ? (
                    <FaSpinner className="w-5 h-5 animate-spin" />
                  ) : (
                    <FaCheckCircle className="w-5 h-5" />
                  )}
                  <span>Selesai</span>
                </button>
                <button
                  onClick={() =>
                    handleStatusUpdate(selectedReport.id, "failed")
                  }
                  disabled={updating || selectedReport.status === "failed"}
                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg
            hover:bg-red-500/30 transition-colors disabled:opacity-50
            flex items-center gap-2"
                >
                  {updating ? (
                    <FaSpinner className="w-5 h-5 animate-spin" />
                  ) : (
                    <FaTimesCircle className="w-5 h-5" />
                  )}
                  <span>Gagal</span>
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-[#ebae3a] font-semibold mb-1">Judul</h4>
                  <p className="text-gray-300">{selectedReport.title}</p>
                </div>

                <div>
                  <h4 className="text-[#ebae3a] font-semibold mb-1">Detail</h4>
                  <p className="text-gray-300 whitespace-pre-wrap">
                    {selectedReport.details}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-[#ebae3a] font-semibold mb-1">
                      Waktu Kejadian
                    </h4>
                    <p className="text-gray-300">
                      {formatDate(selectedReport.incident_datetime)}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-[#ebae3a] font-semibold mb-1">
                      Waktu Lapor
                    </h4>
                    <p className="text-gray-300">
                      {formatDate(selectedReport.submitted_datetime)}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="text-[#ebae3a] font-semibold mb-1">Status</h4>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      selectedReport.status
                    )}`}
                  >
                    {selectedReport.status}
                  </span>
                </div>
              </div>

              {selectedReport.evidence_url && (
                <div>
                  <h4 className="text-[#ebae3a] font-semibold mb-2">Bukti</h4>
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-[#1f1c16]">
                    <Image
                      src={selectedReport.evidence_url}
                      alt="Evidence"
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedReport(null)}
              className="mt-6 w-full py-2 bg-[#ebae3a] text-[#0d1216] rounded-lg
                font-semibold hover:bg-[#efbb4a] transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
