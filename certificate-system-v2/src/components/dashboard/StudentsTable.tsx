import React from 'react';
import { ApplicationRecord } from '../../types/application';
import { formatDate } from '../../lib/dateUtils';
import { Eye, Award, ExternalLink, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StudentsTableProps {
  students: ApplicationRecord[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onInspect: (student: ApplicationRecord) => void;
  onGenerate: (student: ApplicationRecord) => void;
}

export const StudentsTable: React.FC<StudentsTableProps> = ({
  students,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onInspect,
  onGenerate,
}) => {
  const allSelected = students.length > 0 && selectedIds.length === students.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <th className="py-3.5 px-4 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                  className="rounded border-slate-300 text-[#2F2FE4] focus:ring-[#2F2FE4] cursor-pointer"
                />
              </th>
              <th className="py-3.5 px-4">Student Name</th>
              <th className="py-3.5 px-4">College / Register No</th>
              <th className="py-3.5 px-4">Domain / Program</th>
              <th className="py-3.5 px-4">Duration & Period</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
            {students.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  No student application records found.
                </td>
              </tr>
            ) : (
              students.map((s) => {
                const isSelected = selectedIds.includes(s.applicationId || s.id);
                const isGenerated = s.status === 'CERTIFICATE_GENERATED';
                const certId = s.certificateId;

                return (
                  <tr
                    key={s.applicationId || s.id}
                    className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-blue-50/40' : ''}`}
                  >
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(s.applicationId || s.id)}
                        className="rounded border-slate-300 text-[#2F2FE4] focus:ring-[#2F2FE4] cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{s.fullName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{s.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 max-w-[180px] truncate">{s.college || '—'}</div>
                      <div className="text-[11px] font-mono text-slate-500">{s.registerNo ? `Reg: ${s.registerNo}` : '—'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#2F2FE4]">{s.programTitle || s.selectedCourse}</div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">{s.degree} {s.stream}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold">{s.durationDays ? `${s.durationDays} Days` : '—'}</div>
                      <div className="text-[11px] text-slate-400">
                        {formatDate(s.startDate)} — {formatDate(s.endDate)}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          isGenerated
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : s.status === 'COMPLETED'
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : 'bg-slate-100 text-slate-700 border border-slate-300'
                        }`}
                      >
                        {s.status || 'RECEIVED'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => onInspect(s)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-[11px] font-semibold transition-all inline-flex items-center gap-1"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
                      </button>

                      <Link
                        to={`/offer-letter?applicationId=${encodeURIComponent(s.applicationId)}`}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold transition-all inline-flex items-center gap-1 text-decoration-none"
                        title="Generate Offer Letter"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-600" /> Offer
                      </Link>

                      {isGenerated && certId ? (
                        <a
                          href={`/studentverify/${encodeURIComponent(certId)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-700 hover:bg-emerald-100 text-[11px] font-bold transition-all inline-flex items-center gap-1 text-decoration-none"
                        >
                          View Verified <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <button
                          onClick={() => onGenerate(s)}
                          className="px-3 py-1 rounded-lg bg-[#2F2FE4] hover:bg-[#4F46E5] text-white text-[11px] font-bold shadow-sm transition-all inline-flex items-center gap-1"
                        >
                          <Award className="w-3.5 h-3.5" /> Generate
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
