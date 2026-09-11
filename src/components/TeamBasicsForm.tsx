import React, { useState } from "react";
import { RegistrationFormData, TRACK_OPTIONS, TEAM_SIZE_OPTIONS, TeamSize } from "../types";
import { Users, AlertTriangle, ArrowRight, Sparkles } from "lucide-react";

interface TeamBasicsFormProps {
  data: RegistrationFormData;
  onChange: (updates: Partial<RegistrationFormData>) => void;
  onNext: () => void;
}

export const TeamBasicsForm: React.FC<TeamBasicsFormProps> = ({
  data,
  onChange,
  onNext,
}) => {
  const [sizeWarning, setSizeWarning] = useState<string | null>(null);

  const handleSizeSelect = (size: TeamSize) => {
    setSizeWarning(null);
    const count = parseInt(size.match(/\d+/)?.[0] || "2", 10);
    const neededMembers = count - 1;

    // Adjust members array size dynamically and inherit leader's college if available
    let updatedMembers = [...data.members];
    if (updatedMembers.length < neededMembers) {
      const toAdd = neededMembers - updatedMembers.length;
      for (let i = 0; i < toAdd; i++) {
        updatedMembers.push({
          name: "",
          email: "",
          phone: "",
          college: data.leader.college || "",
          roles: ["Frontend"],
        });
      }
    } else if (updatedMembers.length > neededMembers) {
      updatedMembers = updatedMembers.slice(0, neededMembers);
    }

    onChange({
      teamSize: size,
      members: updatedMembers,
    });
  };

  const calculatedSlots = (parseInt(data.teamSize.match(/\d+/)?.[0] || "4", 10)) - 1;

  return (
    <div id="team-basics-card" className="w-full bg-white dark:bg-[#0F172A] rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800/90 p-6 sm:p-8 shadow-xs transition-colors">
      {/* Header section with HackX 2026 badge */}
      <div className="pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 text-xs font-semibold mb-2.5 border border-cyan-200 dark:border-cyan-800/70">
          <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
          HackX 2026
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Step 1: Team Basics & Track
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure your team identity, competition track, and team size (2 to 5 members only).
        </p>
      </div>

      {/* Main Form Fields */}
      <div className="mt-6 space-y-6">
        {/* Team Name Input */}
        <div>
          <label htmlFor="teamName" className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
            Team Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="teamName"
              placeholder="e.g. CodeWarriors, ByteForge, NexusAI"
              value={data.teamName}
              onChange={(e) => onChange({ teamName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Track Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
            Hackathon Track / Domain <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {TRACK_OPTIONS.map((track) => {
              const isSelected = data.track === track;
              return (
                <button
                  type="button"
                  key={track}
                  id={`track-select-${track.toLowerCase().replace(/\s+|\//g, "-")}`}
                  onClick={() => onChange({ track })}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all text-center flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 shadow-sm ring-2 ring-cyan-500/20 font-bold"
                      : "bg-slate-50 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-cyan-500/40"
                  }`}
                >
                  <span>{track}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Team Size Selector (Strictly 2 to 5 members) */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
              Total Team Size (Strictly 2–5 Members) <span className="text-rose-500">*</span>
            </label>
            <span className="text-xs font-medium text-cyan-800 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-200 dark:border-cyan-800/70">
              1 Leader + {calculatedSlots} Members
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TEAM_SIZE_OPTIONS.map((size) => {
              const isSelected = data.teamSize === size;
              const count = parseInt(size.match(/\d+/)?.[0] || "2", 10);
              return (
                <button
                  type="button"
                  key={size}
                  id={`team-size-option-${count}`}
                  onClick={() => handleSizeSelect(size)}
                  className={`p-3.5 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                    isSelected
                      ? "bg-cyan-50/60 dark:bg-cyan-950/40 border-cyan-500 dark:border-cyan-500/80 ring-2 ring-cyan-500/20 shadow-xs"
                      : "bg-slate-50 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:border-cyan-500/50"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-sm font-bold ${isSelected ? "text-cyan-900 dark:text-cyan-200" : "text-slate-800 dark:text-slate-200"}`}>
                      {size}
                    </span>
                    <Users className={`w-4 h-4 ${isSelected ? "text-cyan-500" : "text-slate-400 dark:text-slate-500"}`} />
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                    1 Leader + {count - 1} Members
                  </span>
                </button>
              );
            })}
          </div>

          {sizeWarning && (
            <div id="size-warning-banner" className="mt-3 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-300">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Constraint Enforcement:</p>
                <p>{sizeWarning}</p>
              </div>
            </div>
          )}
        </div>

        {/* Action button */}
        <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            id="proceed-to-step-2-btn"
            onClick={onNext}
            disabled={!data.teamName.trim()}
            className={`px-6 py-3 rounded-xl text-sm font-semibold inline-flex items-center gap-2 transition-all shadow-xs ${
              data.teamName.trim()
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white active:scale-98 shadow-md shadow-cyan-500/20"
                : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
            }`}
          >
            <span>Leader Details</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

