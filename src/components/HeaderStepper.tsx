import React from "react";
import { Users, UserCheck, UserPlus, ShieldCheck } from "lucide-react";

interface HeaderStepperProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  teamSize: string;
}

export const HeaderStepper: React.FC<HeaderStepperProps> = ({
  currentStep,
  onSelectStep,
  teamSize,
}) => {
  const steps = [
    { id: 1, label: "Team Basics", sublabel: teamSize, icon: Users },
    { id: 2, label: "Leader Details", sublabel: "Lead Contact", icon: UserCheck },
    { id: 3, label: "Members", sublabel: "Teammates", icon: UserPlus },
    { id: 4, label: "Payment & Verify", sublabel: "UPI & Submit", icon: ShieldCheck },
  ];

  return (
    <div id="header-stepper-container" className="w-full bg-[#F8FAFC] dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800/80 py-4 px-4 sm:px-6 transition-colors">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between relative">
          {/* Connecting line */}
          <div className="absolute top-5 left-8 right-8 h-0.5 bg-slate-200 dark:bg-slate-800 -z-0 hidden sm:block" />

          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isPassed = currentStep > step.id;

            return (
              <button
                key={step.id}
                id={`stepper-button-step-${step.id}`}
                onClick={() => onSelectStep(step.id)}
                className="group relative z-10 flex flex-col items-center focus:outline-none transition-all duration-200"
              >
                <div
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-xs border ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 ring-4 ring-cyan-500/20 scale-105 shadow-[0_0_15px_rgba(6,182,212,0.35)]"
                      : isPassed
                      ? "bg-emerald-600 dark:bg-emerald-500 text-white border-emerald-500"
                      : "bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-slate-300 dark:border-slate-700 group-hover:border-cyan-500/60 group-hover:text-slate-800 dark:group-hover:text-slate-200"
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="mt-2 text-center">
                  <span
                    className={`block text-xs sm:text-sm font-semibold tracking-tight transition-colors ${
                      isActive
                        ? "text-cyan-600 dark:text-cyan-400"
                        : isPassed
                        ? "text-emerald-600 dark:text-emerald-400 font-medium"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="hidden sm:block text-[11px] text-slate-400 dark:text-slate-500">
                    {step.sublabel}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

