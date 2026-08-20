import React from 'react';
import { X, User, Award, Calendar, Hash, Mail, Phone, Building } from 'lucide-react';
import { ApplicationRecord } from '../../types/application';
import { formatDate } from '../../lib/dateUtils';

interface StudentDetailsModalProps {
  student: ApplicationRecord | null;
  onClose: () => void;
  onGenerate: (student: ApplicationRecord) => void;
}

export const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({ student, onClose, onGenerate }) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2F2FE4]/10 text-[#2F2FE4] flex items-center justify-center font-bold text-sm">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">{student.fullName}</h3>
              <p className="text-xs text-slate-500 font-mono">App ID: {student.applicationId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Status Badge */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-600 uppercase tracking-wider">Registration Status</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                student.status === 'CERTIFICATE_GENERATED'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-blue-100 text-blue-800 border border-blue-300'
              }`}
            >
              {student.status || 'RECEIVED'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#2F2FE4]" /> Email Address
              </span>
              <p className="font-semibold text-slate-900">{student.email || '—'}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#2F2FE4]" /> Phone Number
              </span>
              <p className="font-semibold text-slate-900">{student.countryCode || '+91'} {student.phone || '—'}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-[#2F2FE4]" /> College / University
              </span>
              <p className="font-semibold text-slate-900">{student.college || '—'}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-[#2F2FE4]" /> Register Number
              </span>
              <p className="font-mono font-bold text-slate-900">{student.registerNo || '—'}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-[#2F2FE4]" /> Degree & Stream
              </span>
              <p className="font-semibold text-slate-900">{student.degree || ''} - {student.stream || '—'}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-[#2F2FE4]" /> Domain / Program
              </span>
              <p className="font-bold text-[#2F2FE4]">{student.programTitle || student.selectedCourse || '—'}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#2F2FE4]" /> Internship Period
              </span>
              <p className="font-semibold text-slate-900">
                {formatDate(student.startDate)} — {formatDate(student.endDate)} ({student.durationDays || '30'} Days)
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#2F2FE4]" /> Applied On
              </span>
              <p className="font-semibold text-slate-900">{formatDate(student.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-all"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onGenerate(student);
            }}
            className="px-6 py-2 rounded-xl bg-[#2F2FE4] hover:bg-[#4F46E5] text-white font-extrabold shadow-md transition-all flex items-center gap-1.5"
          >
            <Award className="w-4 h-4" /> Issue Certificate
          </button>
        </div>
      </div>
    </div>
  );
};
