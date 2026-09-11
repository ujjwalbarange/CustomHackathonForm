import React, { useState } from "react";
import { RegistrationFormData, MemberRole, ROLE_OPTIONS, GOOGLE_FORM_MAPPING } from "../types";
import { UserPlus, Mail, Phone, Building2, Check, ArrowRight, ArrowLeft, ShieldCheck, Github } from "lucide-react";

interface DynamicMembersFormProps {
  data: RegistrationFormData;
  onChange: (updates: Partial<RegistrationFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const DynamicMembersForm: React.FC<DynamicMembersFormProps> = ({
  data,
  onChange,
  onNext,
  onBack,
}) => {
  const [activeMemberTab, setActiveMemberTab] = useState<number>(0);

  const calculatedSlots = parseInt(data.teamSize.match(/\d+/)?.[0] || "4", 10) - 1;
  const totalNeeded = Math.min(
    Math.max(calculatedSlots, data.members ? data.members.length : 0),
    GOOGLE_FORM_MAPPING.members.length
  );

  const updateMember = (index: number, field: string, value: any) => {
    const updated = [...data.members];
    if (!updated[index]) {
      updated[index] = {
        name: "",
        email: "",
        phone: "",
        college: data.leader.college || "",
        roles: ["Frontend"],
      };
    }
    (updated[index] as any)[field] = value;
    onChange({ members: updated });
  };

  const toggleRole = (index: number, role: MemberRole) => {
    const member = data.members[index];
    if (!member) return;
    const currentRoles = member.roles || [];
    const newRoles = currentRoles.includes(role)
      ? currentRoles.filter((r) => r !== role)
      : [...currentRoles, role];

    // Ensure at least one role is selected
    if (newRoles.length === 0) return;

    updateMember(index, "roles", newRoles);
  };

  // Get active member, autofilling college from leader if empty
  const rawMember = data.members[activeMemberTab];
  const activeMember = {
    name: rawMember?.name || "",
    email: rawMember?.email || "",
    phone: rawMember?.phone || "",
    college: rawMember?.college !== undefined && rawMember?.college !== "" 
      ? rawMember.college 
      : (data.leader.college || ""),
    roles: rawMember?.roles || ["Frontend"],
    github: rawMember?.github || "",
  };

  const activeMapping = GOOGLE_FORM_MAPPING.members[activeMemberTab];

  return (
    <div id="members-form-card" className="w-full bg-white dark:bg-[#0F172A] rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800/90 p-6 sm:p-8 shadow-xs transition-colors">
      {/* Header */}
      <div className="pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 text-xs font-semibold mb-2.5 border border-cyan-200 dark:border-cyan-800/70">
              <UserPlus className="w-3.5 h-3.5 text-cyan-500" />
              Team Members ({totalNeeded} Teammates)
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Step 3: Member Details
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Enter contact details and assign technical domain roles for each teammate.
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs font-medium text-cyan-800 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-200 dark:border-cyan-800/70">
              Active: Member {activeMemberTab + 2} of {data.teamSize.split(" ")[0]}
            </span>
          </div>
        </div>

        {/* Member Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2.5 mt-5">
          {Array.from({ length: totalNeeded }).map((_, idx) => {
            const memberNum = idx + 2;
            const memberData = data.members[idx];
            const isFilled = memberData && memberData.name.trim() !== "" && memberData.email.trim() !== "";
            const isSelected = activeMemberTab === idx;

            return (
              <button
                type="button"
                key={idx}
                id={`member-tab-${memberNum}`}
                onClick={() => setActiveMemberTab(idx)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  isSelected
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 shadow-sm ring-2 ring-cyan-500/20"
                    : isFilled
                    ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-950/50"
                    : "bg-slate-50 dark:bg-slate-900/70 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isSelected
                      ? "bg-white/25 text-white"
                      : isFilled
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {isFilled && !isSelected ? <Check className="w-3 h-3" /> : memberNum}
                </div>
                <span>
                  Member {memberNum}
                  {memberData?.name ? `: ${memberData.name.split(" ")[0]}` : ""}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Member Form Card */}
      <div className="mt-6">
        <div className="p-5 sm:p-6 bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl">
          <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-200 dark:border-slate-800">
            {/* Minimalist tech avatar badge */}
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-indigo-500/10 text-cyan-500 font-bold text-sm shadow-xs">
              M{activeMemberTab + 2}
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Member {activeMemberTab + 2} Details
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Teammate profile &bull; College automatically inherited from Leader
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* 2-Col: Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor={`member-${activeMemberTab}-name`} className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id={`member-${activeMemberTab}-name`}
                  placeholder="e.g. Jane Doe"
                  value={activeMember.name}
                  onChange={(e) => updateMember(activeMemberTab, "name", e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label htmlFor={`member-${activeMemberTab}-email`} className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="email"
                    id={`member-${activeMemberTab}-email`}
                    placeholder="teammate@example.com"
                    value={activeMember.email}
                    onChange={(e) => updateMember(activeMemberTab, "email", e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* 2-Col: Phone & College */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor={`member-${activeMemberTab}-phone`} className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="tel"
                    id={`member-${activeMemberTab}-phone`}
                    placeholder="e.g. 9876543211"
                    value={activeMember.phone}
                    onChange={(e) => updateMember(activeMemberTab, "phone", e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor={`member-${activeMemberTab}-college`} className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
                    College / Institute
                  </label>
                  {data.leader.college && (
                    <button
                      type="button"
                      onClick={() => updateMember(activeMemberTab, "college", data.leader.college)}
                      className="text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline font-medium"
                    >
                      Reset to Leader's College
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    id={`member-${activeMemberTab}-college`}
                    placeholder={data.leader.college || "e.g. VNIT / PCE / IIIT"}
                    value={activeMember.college}
                    onChange={(e) => updateMember(activeMemberTab, "college", e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Optional GitHub Profile if supported for this slot (e.g. Member 2) */}
            {activeMapping?.github && (
              <div>
                <label htmlFor={`member-${activeMemberTab}-github`} className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  GitHub / Portfolio Profile Link
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <Github className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="url"
                    id={`member-${activeMemberTab}-github`}
                    placeholder="https://github.com/username"
                    value={activeMember.github || ""}
                    onChange={(e) => updateMember(activeMemberTab, "github", e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            )}

            {/* Member Roles (Multi-select Enum checkboxes) */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Technical Roles (Multi-Select) <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {activeMember.roles.length} role(s) chosen
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ROLE_OPTIONS.map((role) => {
                  const isChecked = activeMember.roles.includes(role);
                  return (
                    <button
                      type="button"
                      key={role}
                      id={`member-${activeMemberTab}-role-${role.toLowerCase().replace(/\s+|\//g, "-")}`}
                      onClick={() => toggleRole(activeMemberTab, role)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center justify-between transition-all ${
                        isChecked
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 shadow-xs font-semibold"
                          : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span>{role}</span>
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center text-[10px] border ${
                          isChecked ? "bg-white/20 border-transparent text-white" : "border-slate-300 dark:border-slate-600"
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Member Preview Strip */}
        <div className="mt-5 p-3.5 bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Members summary: {data.members.filter((m) => m.name.trim() !== "").length} of {totalNeeded} completed.
            </span>
          </div>

          {activeMemberTab < totalNeeded - 1 && (
            <button
              type="button"
              onClick={() => setActiveMemberTab(activeMemberTab + 1)}
              className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline"
            >
              Next: Member {activeMemberTab + 3} &rarr;
            </button>
          )}
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex items-center justify-between pt-5 mt-6 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            id="back-to-step-2-btn"
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Leader Details
          </button>

          <button
            type="button"
            id="proceed-to-step-4-btn"
            onClick={onNext}
            className="px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white active:scale-98 inline-flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20"
          >
            <span>Final Confirmation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

