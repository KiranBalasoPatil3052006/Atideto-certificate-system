import React from 'react';
import { CertificateRecord } from '../../types/certificate';
import { formatDate } from '../../lib/dateUtils';
import { ShieldCheck, ShieldX, ExternalLink } from 'lucide-react';

interface CertificatesTableProps {
  certificates: CertificateRecord[];
  onRevoke: (certificateId: string) => void;
}

export const CertificatesTable: React.FC<CertificatesTableProps> = ({ certificates, onRevoke }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <th className="py-3.5 px-4">Certificate ID</th>
              <th className="py-3.5 px-4">Student Name</th>
              <th className="py-3.5 px-4">Course / Program</th>
              <th className="py-3.5 px-4">Issue Date</th>
              <th className="py-3.5 px-4">Scan Count</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
            {certificates.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  No certificates issued yet.
                </td>
              </tr>
            ) : (
              certificates.map((c) => {
                const isRevoked = c.status === 'revoked';

                return (
                  <tr key={c.id || c.certificateId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2F2FE4]">
                      {c.certificateId}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{c.studentName}</div>
                      <div className="text-[11px] text-slate-400">{c.college || '—'}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{c.course}</td>
                    <td className="py-3.5 px-4">{formatDate(c.issueDate)}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-bold text-slate-700">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        {c.verifiedCount || 0} scans
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          isRevoked
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        {isRevoked ? 'Revoked' : 'Active'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      {!isRevoked ? (
                        <>
                          <button
                            onClick={() => onRevoke(c.certificateId)}
                            className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-[11px] font-semibold transition-all inline-flex items-center gap-1"
                          >
                            <ShieldX className="w-3.5 h-3.5" /> Revoke
                          </button>
                          <a
                            href={`/studentverify/${encodeURIComponent(c.certificateId)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold transition-all inline-flex items-center gap-1 text-decoration-none"
                          >
                            View <ExternalLink className="w-3 h-3" />
                          </a>
                        </>
                      ) : (
                        <span className="text-slate-400 text-xs italic">Revoked</span>
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
