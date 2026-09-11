import React, { useState, useEffect } from "react";
import { HeaderStepper } from "./components/HeaderStepper";
import { TeamBasicsForm } from "./components/TeamBasicsForm";
import { LeaderDetailsForm } from "./components/LeaderDetailsForm";
import { DynamicMembersForm } from "./components/DynamicMembersForm";
import { PaymentVerificationForm } from "./components/PaymentVerificationForm";
import { FormSubmittedSuccess } from "./components/FormSubmittedSuccess";
import { HackXLogo } from "./components/HackXLogo";
import { Footer } from "./components/Footer";
import { HomePage } from "./components/HomePage";
import { RegistrationFormData, OFFICIAL_WHATSAPP_GROUP_LINK } from "./types";
import { createEmptyFormData } from "./lib/formUtils";
import { Sun, Moon, ExternalLink, Sparkles, BookOpen } from "lucide-react";

const AUTOSAVE_STORAGE_KEY = "hackx_registration_form_data";

export default function App() {
  // Navigation view state: "register" | "home"
  const [currentView, setCurrentView] = useState<"register" | "home">(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const viewParam = urlParams.get("view");
      if (viewParam === "home" || window.location.hash === "#home") {
        return "home";
      }
    }
    return "register";
  });

  // Listen for browser popstate / hashchange navigation
  useEffect(() => {
    const handleLocationChange = () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("view") === "home" || window.location.hash === "#home") {
        setCurrentView("home");
      } else {
        setCurrentView("register");
      }
    };
    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("hashchange", handleLocationChange);
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("hashchange", handleLocationChange);
    };
  }, []);

  const navigateToHome = () => {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("view", "home");
    window.history.pushState({}, "", newUrl.toString());
    setCurrentView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToRegister = () => {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete("view");
    newUrl.hash = "";
    window.history.pushState({}, "", newUrl.toString());
    setCurrentView("register");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Initialize form state from localStorage (Auto-Save restoration)
  const [formData, setFormData] = useState<RegistrationFormData>(() => {
    const defaultData = createEmptyFormData();
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(AUTOSAVE_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Never restore heavy base64 strings from localStorage
          const { screenshotBase64, ...textFields } = parsed;
          return {
            ...defaultData,
            ...textFields,
            leader: { ...defaultData.leader, ...(textFields.leader || {}) },
            members:
              Array.isArray(textFields.members) && textFields.members.length > 0
                ? textFields.members
                : defaultData.members,
          };
        }
      } catch (e) {
        console.warn("Could not parse saved form data from localStorage:", e);
      }
    }
    return defaultData;
  });

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Auto-Save Effect (Step 4.3): Persist all text field data on refresh
  // Explicitly excludes large base64 strings
  useEffect(() => {
    if (typeof window !== "undefined" && !isSubmitted) {
      try {
        const { screenshotBase64, ...textDataToSave } = formData;
        localStorage.setItem(AUTOSAVE_STORAGE_KEY, JSON.stringify(textDataToSave));
      } catch (err) {
        console.warn("Failed to auto-save form data:", err);
      }
    }
  }, [formData, isSubmitted]);

  // Dark mode state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("hackx_theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("hackx_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("hackx_theme", "light");
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark((prev) => !prev);
  };

  const handleUpdateForm = (updates: Partial<RegistrationFormData>) => {
    setFormData((prev) => {
      const next = {
        ...prev,
        ...updates,
      };

      // If leader's college is updated, automatically populate member colleges if empty or matching previous
      if (
        updates.leader &&
        updates.leader.college !== undefined &&
        updates.leader.college !== prev.leader.college
      ) {
        const oldCollege = prev.leader.college;
        const newCollege = updates.leader.college;
        next.members = next.members.map((m) => {
          if (!m.college || m.college.trim() === "" || m.college === oldCollege) {
            return { ...m, college: newCollege };
          }
          return m;
        });
      }

      return next;
    });
  };

  const handleReset = () => {
    try {
      localStorage.removeItem(AUTOSAVE_STORAGE_KEY);
    } catch (e) {
      // ignore
    }
    setFormData(createEmptyFormData());
    setCurrentStep(1);
    setIsSubmitted(false);
  };

  const teamMemberCount = parseInt(formData.teamSize.match(/\d+/)?.[0] || "4", 10) - 1;

  // If the user navigated to the Home / Overview & Rules page
  if (currentView === "home") {
    return (
      <div className="min-h-screen flex flex-col font-sans">
        <HomePage
          onNavigateRegister={navigateToRegister}
          isDark={isDark}
          onToggleTheme={toggleDarkMode}
        />
        <Footer
          onNavigateHome={navigateToHome}
          onNavigateRegister={navigateToRegister}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070D18] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-cyan-500/20 selection:text-cyan-600 dark:selection:text-cyan-400">
      {/* Top Navigation Bar */}
      <header className="bg-white/90 dark:bg-[#0B132B]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 sticky top-0 z-30 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Logo links to /?view=home in new tab */}
            <HackXLogo
              size="sm"
              href="/?view=home"
              target="_blank"
            />

            {/* Clickable badge on the side of HackX logo to open the overview & rules in a new tab */}
            <a
              href="/?view=home"
              target="_blank"
              rel="noopener noreferrer"
              id="hackx-overview-header-link"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 text-xs font-bold transition-all shadow-2xs group"
              title="Open HackX 2026 Overview, Timelines & Rules in a new tab"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span className="hidden xs:inline sm:inline">Overview &amp; Rules</span>
              <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>

          {/* Right Action: Dark Mode Toggle */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              id="theme-toggle-btn"
              onClick={toggleDarkMode}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all flex items-center gap-2 text-xs font-semibold shadow-2xs"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-600" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* When submitted successfully, display full dedicated Success Page with WhatsApp Group Call-to-Action */}
      {isSubmitted ? (
        <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <FormSubmittedSuccess
            data={formData}
            onReset={handleReset}
            whatsappLink={OFFICIAL_WHATSAPP_GROUP_LINK}
          />
        </main>
      ) : (
        <>
          {/* Stepper Bar */}
          <HeaderStepper
            currentStep={currentStep}
            onSelectStep={setCurrentStep}
            teamSize={formData.teamSize}
          />

          {/* Main Workspace Layout */}
          <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Step Form Card */}
            {currentStep === 1 && (
              <TeamBasicsForm
                data={formData}
                onChange={handleUpdateForm}
                onNext={() => setCurrentStep(2)}
              />
            )}

            {currentStep === 2 && (
              <LeaderDetailsForm
                data={formData}
                onChange={handleUpdateForm}
                onNext={() => setCurrentStep(3)}
                onBack={() => setCurrentStep(1)}
              />
            )}

            {currentStep === 3 && (
              <DynamicMembersForm
                data={formData}
                onChange={handleUpdateForm}
                onNext={() => setCurrentStep(4)}
                onBack={() => setCurrentStep(2)}
              />
            )}

            {currentStep === 4 && (
              <PaymentVerificationForm
                data={formData}
                onChange={handleUpdateForm}
                onBack={() => setCurrentStep(3)}
                onJumpToStep={setCurrentStep}
                onSubmitSuccess={() => {
                  try {
                    localStorage.removeItem(AUTOSAVE_STORAGE_KEY);
                  } catch (e) {
                    // ignore
                  }
                  setIsSubmitted(true);
                }}
              />
            )}

            {/* Bottom Overview Strip */}
            <div className="p-5 sm:p-6 bg-white dark:bg-[#0F172A] rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800/90 shadow-xs transition-colors">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Overview
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formData.teamSize} &bull; Track: {formData.track}
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-cyan-50 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 rounded-lg border border-cyan-200 dark:border-cyan-800/60">
                  {formData.teamName ? formData.teamName : "Team Name Pending"}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-4">
                {/* Leader Card */}
                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-bold text-xs mb-2">
                      L
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white block truncate">
                      {formData.leader.name || "Leader"}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                      {formData.leader.college || "Leader College"}
                    </span>
                  </div>
                  <span className="mt-2 inline-block px-1.5 py-0.5 bg-cyan-50 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 text-[9px] font-semibold rounded border border-cyan-200 dark:border-cyan-800/50">
                    Team Lead
                  </span>
                </div>

                {/* Member Cards */}
                {formData.members
                  .slice(0, teamMemberCount)
                  .map((member, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-xs mb-2">
                          M{idx + 2}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white block truncate">
                          {member.name || `Member ${idx + 2}`}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                          {member.college || (formData.leader.college || "Teammate College")}
                        </span>
                      </div>
                      <span className="mt-2 inline-block px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[9px] font-medium rounded border border-slate-200 dark:border-slate-700 truncate">
                        {member.roles[0] || "Frontend"}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </main>
        </>
      )}

      {/* Comprehensive Footer */}
      <Footer
        onNavigateHome={navigateToHome}
        onNavigateRegister={navigateToRegister}
      />
    </div>
  );
}

