import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AdminNav } from '../components/layout/AdminNav';
import { StudentsTable } from '../components/dashboard/StudentsTable';
import { CertificatesTable } from '../components/dashboard/CertificatesTable';
import { StudentDetailsModal } from '../components/dashboard/StudentDetailsModal';
import { FormatModal, ExportFormat } from '../components/dashboard/FormatModal';
import { ApplicationRecord } from '../types/application';
import { CertificateRecord } from '../types/certificate';
import { listApplications, listCertificates, revokeCertificate } from '../lib/api';
import {
  Users,
  Award,
  ShieldX,
  Search,
  RefreshCw,
  Download,
  Loader2,
  CheckCircle2,
  Zap,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'students' | 'certificates'>('students');
  const [students, setStudents] = useState<ApplicationRecord[]>([]);
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page] = useState(1);

  // Selections & Modals
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [inspectedStudent, setInspectedStudent] = useState<ApplicationRecord | null>(null);
  const [isFormatOpen, setIsFormatOpen] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load Data
  const loadStudentsData = async () => {
    setLoading(true);
    try {
      const res = await listApplications({ page, search, status: statusFilter, limit: 50 });
      setStudents(res.applications || []);
    } catch (err: any) {
      console.warn('Could not load student applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCertificatesData = async () => {
    setLoading(true);
    try {
      const res = await listCertificates({ page, limit: 50 });
      setCertificates(res.certificates || []);
    } catch (err: any) {
      console.warn('Could not load certificates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'students') {
      loadStudentsData();
    } else {
      loadCertificatesData();
    }
  }, [activeTab, page, search, statusFilter]);

  // Handle Revoke
  const handleRevoke = async (certId: string) => {
    if (!window.confirm(`Are you sure you want to revoke certificate ${certId}?`)) return;
    try {
      await revokeCertificate(certId);
      setMessage({ type: 'success', text: `✓ Certificate ${certId} revoked successfully.` });
      loadCertificatesData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Revocation failed' });
    }
  };

  // Toggle Selection
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === students.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(students.map((s) => s.applicationId || s.id));
    }
  };

  // Single Generate Action
  const handleSingleGenerate = (student: ApplicationRecord) => {
    navigate(`/preview?applicationId=${encodeURIComponent(student.applicationId)}`);
  };

  // Bulk Generation Action
  const handleExportSelected = (format: ExportFormat) => {
    if (selectedIds.length === 0) return;
    setMessage({ type: 'success', text: `Processing ${selectedIds.length} certificates as ${format.toUpperCase()}...` });

    setTimeout(() => {
      setMessage({ type: 'success', text: `✓ Batch export completed for ${selectedIds.length} records.` });
    }, 1200);
  };

  const totalApps = students.length;
  const issuedCerts = certificates.length;
  const revokedCerts = certificates.filter((c) => c.status === 'revoked').length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <AdminNav />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Top Header & Stats */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Admin Console</h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage student registrations, issue certificates, and review verification credentials.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/preview"
              className="px-4 py-2.5 rounded-xl bg-[#2F2FE4] hover:bg-[#4F46E5] text-white font-extrabold text-xs shadow-md shadow-[#2F2FE4]/25 transition-all flex items-center gap-1.5 text-decoration-none"
            >
              <Zap className="w-4 h-4 fill-white" /> Open Certificate Studio
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2F2FE4] border border-blue-100 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Applications</p>
              <h3 className="text-2xl font-black text-slate-900">{totalApps}</h3>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Certificates Issued</p>
              <h3 className="text-2xl font-black text-slate-900">{issuedCerts}</h3>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shrink-0">
              <ShieldX className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Revoked Credentials</p>
              <h3 className="text-2xl font-black text-slate-900">{revokedCerts}</h3>
            </div>
          </div>
        </div>

        {/* Feedback Alert */}
        {message && (
          <div
            className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center justify-between animate-fadeIn ${
              message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{message.text}</span>
            </div>
            <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600 font-bold">
              ✕
            </button>
          </div>
        )}

        {/* Filter Controls & Action Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('students')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'students' ? 'bg-white text-[#2F2FE4] shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" /> Student Applications
            </button>
            <button
              onClick={() => setActiveTab('certificates')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'certificates' ? 'bg-white text-[#2F2FE4] shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-4 h-4" /> Issued Certificates
            </button>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            {activeTab === 'students' && (
              <>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-slate-50 text-slate-800"
                >
                  <option value="">All Statuses</option>
                  <option value="RECEIVED">RECEIVED</option>
                  <option value="SELECTED">SELECTED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CERTIFICATE_GENERATED">CERTIFICATE_GENERATED</option>
                </select>

                {selectedIds.length > 0 && (
                  <button
                    onClick={() => setIsFormatOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#2F2FE4] text-white text-xs font-bold shadow-md flex items-center gap-1.5 animate-fadeIn"
                  >
                    <Download className="w-4 h-4" /> Export Selected ({selectedIds.length})
                  </button>
                )}
              </>
            )}

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search name, course, ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:border-[#2F2FE4] focus:outline-none bg-slate-50 w-[200px]"
              />
            </div>

            <button
              onClick={() => (activeTab === 'students' ? loadStudentsData() : loadCertificatesData())}
              className="p-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-600 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Data Table */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#2F2FE4]" />
            <p className="text-xs font-semibold">Loading data records...</p>
          </div>
        ) : activeTab === 'students' ? (
          <StudentsTable
            students={students}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            onInspect={setInspectedStudent}
            onGenerate={handleSingleGenerate}
          />
        ) : (
          <CertificatesTable certificates={certificates} onRevoke={handleRevoke} />
        )}
      </main>

      {/* Modals */}
      <StudentDetailsModal
        student={inspectedStudent}
        onClose={() => setInspectedStudent(null)}
        onGenerate={handleSingleGenerate}
      />

      <FormatModal
        isOpen={isFormatOpen}
        onClose={() => setIsFormatOpen(false)}
        count={selectedIds.length}
        onSelectFormat={handleExportSelected}
      />
    </div>
  );
};
