import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, Calendar, Clock, 
  ArrowRight, Sun, BatteryCharging, 
  CheckCircle2, Sparkles, ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Slide 3: Loading Screen
export function LoadingScreen({ onComplete, t }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 600);
          return 100;
        }
        return prev + 2;
      });
    }, 45);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="relative mb-8">
        <div className="w-28 h-28 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin absolute -inset-2"></div>
        <div className="w-24 h-24 rounded-full bg-emerald-950/40 flex items-center justify-center border border-emerald-500/30 glow-emerald animate-pulse">
          <Sun className="w-12 h-12 text-emerald-400" />
        </div>
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2 text-glow">
        Rajam Traders
      </h1>
      <p className="text-emerald-400 text-sm md:text-base font-medium uppercase tracking-widest mb-8">
        {t.solarSolutions}
      </p>
      
      <div className="w-64 bg-zinc-950/80 rounded-full h-3 border border-emerald-900/30 overflow-hidden mb-3">
        <div 
          className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 h-full rounded-full transition-all duration-300 ease-out shadow-lg"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-xs text-zinc-400 tracking-wider">
        {t.loading} <strong className="text-emerald-400 font-bold text-sm ml-1">{progress}%</strong>
      </span>
    </div>
  );
}

// Welcome Section
export function WelcomeSection({ onStartForm, t }) {
  return (
    <div className="glass-panel p-8 md:p-12 rounded-3xl relative overflow-hidden w-full hover:border-emerald-500/20 transition-all duration-300 text-center">
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-emerald-500 to-teal-400"></div>
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600/30 to-teal-400/20 flex items-center justify-center border border-emerald-500/30 mb-6 mx-auto animate-float shadow-xl">
        <Sparkles className="w-8 h-8 text-emerald-300" />
      </div>
      <h2 className="text-zinc-400 text-xs md:text-sm font-semibold uppercase tracking-widest mb-2">
        {t.welcomeTitle}
      </h2>
      <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4 tracking-tight text-glow">
        {t.welcomeSubtitle}
      </h1>
      <p className="text-zinc-300 text-sm md:text-base font-light leading-relaxed mb-8 max-w-md mx-auto">
        {t.welcomeDesc}
      </p>
      <button 
        onClick={onStartForm}
        className="px-8 py-3.5 rounded-full font-bold text-[#0d130e] bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 mx-auto"
      >
        <span>{t.continue}</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}

// Clean Form Card Wrapper with Continue button inside
function FormCard({ id, title, children, onContinue, continueLabel, isDisabled }) {
  return (
    <div 
      id={id} 
      className={`w-full glass-panel p-6 md:p-8 rounded-3xl relative overflow-hidden transition-all duration-500 ${
        isDisabled ? 'opacity-35 pointer-events-none scale-[0.98]' : 'opacity-100 scale-100'
      }`}
    >
      <div className="absolute top-0 left-0 w-[4px] h-full bg-gradient-to-b from-emerald-500 to-teal-500"></div>
      <h3 className="text-lg md:text-xl font-bold text-white mb-6 tracking-wide pl-2 border-b border-zinc-800/60 pb-3">
        {title}
      </h3>
      <div className="space-y-4 pl-2 mb-6">
        {children}
      </div>
      {onContinue && !isDisabled && (
        <div className="flex justify-end pl-2">
          <button
            onClick={onContinue}
            className="py-3 px-8 rounded-full font-bold text-[#0d130e] bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10"
          >
            <span>{continueLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

// Step 1 Section: Name
export function StepNameSection({ data, updateData, errors, onContinue, t, isUnlocked }) {
  return (
    <FormCard 
      id="step-name" 
      title={t.step1Title} 
      onContinue={onContinue} 
      continueLabel={t.continue}
      isDisabled={!isUnlocked}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-xs md:text-sm font-semibold text-zinc-300 tracking-wide">{t.firstName} *</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-4 flex items-center text-zinc-500">
              <User className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder={t.firstNamePlaceholder}
              value={data.firstName || ''}
              onChange={(e) => updateData({ firstName: e.target.value })}
              className={`w-full pl-12 pr-4 py-3 rounded-2xl glass-input text-base ${errors.firstName ? 'border-red-500/50 focus:border-red-400' : ''}`}
            />
          </div>
          {errors.firstName && <p className="text-red-400 text-xs mt-1 font-medium">{errors.firstName}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-xs md:text-sm font-semibold text-zinc-300 tracking-wide">{t.lastName} *</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-4 flex items-center text-zinc-500">
              <User className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder={t.lastNamePlaceholder}
              value={data.lastName || ''}
              onChange={(e) => updateData({ lastName: e.target.value })}
              className={`w-full pl-12 pr-4 py-3 rounded-2xl glass-input text-base ${errors.lastName ? 'border-red-500/50 focus:border-red-400' : ''}`}
            />
          </div>
          {errors.lastName && <p className="text-red-400 text-xs mt-1 font-medium">{errors.lastName}</p>}
        </div>
      </div>
    </FormCard>
  );
}

// Step 2 Section: Contact
export function StepContactSection({ data, updateData, errors, onContinue, t, isUnlocked }) {
  return (
    <FormCard 
      id="step-contact" 
      title={t.step2Title} 
      onContinue={onContinue} 
      continueLabel={t.continue}
      isDisabled={!isUnlocked}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-xs md:text-sm font-semibold text-zinc-300 tracking-wide">{t.email} *</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-4 flex items-center text-zinc-500">
              <Mail className="w-5 h-5" />
            </span>
            <input
              type="email"
              placeholder={t.emailPlaceholder}
              value={data.email || ''}
              onChange={(e) => updateData({ email: e.target.value })}
              className={`w-full pl-12 pr-4 py-3 rounded-2xl glass-input text-base ${errors.email ? 'border-red-500/50 focus:border-red-400' : ''}`}
            />
          </div>
          {errors.email && <p className="text-red-400 text-xs mt-1 font-medium">{errors.email}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs md:text-sm font-semibold text-zinc-300 tracking-wide">{t.phone}</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center text-zinc-500">
                <Phone className="w-5 h-5" />
              </span>
              <input
                type="tel"
                placeholder={t.phonePlaceholder}
                value={data.phone || ''}
                onChange={(e) => updateData({ phone: e.target.value })}
                className="w-full pl-12 pr-4 py-3 rounded-2xl glass-input text-base"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs md:text-sm font-semibold text-zinc-300 tracking-wide">{t.mobile} *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center text-zinc-500">
                <Phone className="w-5 h-5" />
              </span>
              <input
                type="tel"
                placeholder={t.mobilePlaceholder}
                value={data.mobile || ''}
                onChange={(e) => updateData({ mobile: e.target.value })}
                className={`w-full pl-12 pr-4 py-3 rounded-2xl glass-input text-base ${errors.mobile ? 'border-red-500/50 focus:border-red-400' : ''}`}
              />
            </div>
            {errors.mobile && <p className="text-red-400 text-xs mt-1 font-medium">{errors.mobile}</p>}
          </div>
        </div>
      </div>
    </FormCard>
  );
}

// Step 3 Section: Appointment
export function StepAppointmentSection({ data, updateData, onContinue, t, isUnlocked }) {
  return (
    <FormCard 
      id="step-appointment" 
      title={t.step3Title} 
      onContinue={onContinue} 
      continueLabel={t.continue}
      isDisabled={!isUnlocked}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-xs md:text-sm font-semibold text-zinc-300 tracking-wide">{t.selectDate}</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-4 flex items-center text-zinc-500 pointer-events-none">
              <Calendar className="w-5 h-5" />
            </span>
            <input
              type="date"
              value={data.date || ''}
              onChange={(e) => updateData({ date: e.target.value })}
              className="w-full pl-12 pr-4 py-3 rounded-2xl glass-input text-base"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs md:text-sm font-semibold text-zinc-300 tracking-wide">{t.selectTime}</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-4 flex items-center text-zinc-500 pointer-events-none">
              <Clock className="w-5 h-5" />
            </span>
            <input
              type="time"
              value={data.time || ''}
              onChange={(e) => updateData({ time: e.target.value })}
              className="w-full pl-12 pr-4 py-3 rounded-2xl glass-input text-base"
            />
          </div>
        </div>
      </div>
    </FormCard>
  );
}

// Step 4 Section: Solution Selector
export function StepSolutionSection({ data, updateData, onSubmit, t, isUnlocked }) {
  const options = [
    { id: 'on-grid', label: t.onGrid, desc: 'Connected to the utility grid. Save on bills.' },
    { id: 'off-grid', label: t.offGrid, desc: 'Complete independence with battery storage.' },
    { id: 'hybrid', label: t.hybrid, desc: 'Best of both. Connected with battery backup.' },
  ];

  return (
    <FormCard 
      id="step-solution" 
      title={t.step4Title} 
      onContinue={onSubmit} 
      continueLabel={t.submit}
      isDisabled={!isUnlocked}
    >
      <div className="grid grid-cols-1 gap-3">
        {options.map((opt) => {
          const selected = data.solution === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => updateData({ solution: opt.id })}
              className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-start gap-4 cursor-pointer ${
                selected 
                  ? 'border-emerald-400 bg-emerald-950/20 shadow-md shadow-emerald-500/5'
                  : 'border-zinc-800 bg-zinc-950/20 hover:border-zinc-700/60'
              }`}
            >
              <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                selected ? 'border-emerald-400' : 'border-zinc-600'
              }`}>
                {selected && <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />}
              </div>
              <div>
                <h4 className={`font-bold text-sm tracking-wide ${selected ? 'text-emerald-300' : 'text-white'}`}>
                  {opt.label}
                </h4>
                <p className="text-zinc-400 text-xs mt-1 leading-normal">
                  {opt.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </FormCard>
  );
}

// Slide 9: Submitting Loader
export function SubmittingLoader({ onComplete, t }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 max-w-sm mx-auto">
      <div className="w-20 h-20 rounded-full bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center mb-6 relative animate-pulse">
        <BatteryCharging className="w-10 h-10 text-emerald-400 animate-bounce" />
        <div className="absolute inset-0 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"></div>
      </div>
      <h3 className="text-2xl font-extrabold text-white text-glow mb-2">{t.submitting}</h3>
      <p className="text-zinc-400 text-sm">{t.pleaseWait}</p>
    </div>
  );
}

// Slide 10: Success Screen
export function SuccessScreen({ onNext, t }) {
  useEffect(() => {
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#10b981', '#34d399', '#f59e0b']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#10b981', '#34d399', '#f59e0b']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }, []);

  return (
    <div className="w-full max-w-md mx-auto glass-panel p-10 rounded-3xl text-center relative overflow-hidden animate-float">
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-emerald-500 to-amber-400"></div>
      <div className="w-20 h-20 rounded-full bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6 glow-emerald">
        <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-pulse" />
      </div>
      <h2 className="text-3xl font-extrabold text-white mb-4 text-glow">{t.thankYou}</h2>
      <p className="text-zinc-300 text-sm md:text-base font-light leading-relaxed mb-8">
        {t.successMsg}
      </p>

      <button
        onClick={onNext}
        className="w-full py-3.5 px-6 rounded-full font-bold text-[#0d130e] bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 hover:from-emerald-300 hover:to-teal-300 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
      >
        <span>{t.continue}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// Slide 11: Redirect & Confirmation
export function FinalConfirmation({ onRestart, t }) {
  return (
    <div className="w-full max-w-md mx-auto glass-panel-heavy p-10 rounded-3xl text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-emerald-500 to-teal-400"></div>
      
      <div className="w-24 h-24 rounded-full bg-emerald-950/30 border border-emerald-500/20 flex items-center justify-center mx-auto mb-8 relative">
        <ShieldCheck className="w-12 h-12 text-emerald-400" />
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-[10px] font-black text-[#0d130e] shadow-md">
          24h
        </div>
      </div>
      
      <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3 text-glow">
        {t.contactWithin24}
      </h2>
      <p className="text-zinc-300 text-sm md:text-base font-light leading-relaxed mb-8">
        {t.contactDesc}
      </p>

      <div className="border-t border-zinc-800/80 pt-6 space-y-3 text-left text-xs text-zinc-400">
        <div className="flex justify-between">
          <span>{t.firstName}:</span>
          <span className="text-zinc-200 font-medium">Rajam Traders Solar Solutions</span>
        </div>
        <div className="flex justify-between">
          <span>Head Office:</span>
          <span className="text-zinc-200 font-medium text-right">Thanjavur, Tamil Nadu</span>
        </div>
        <div className="flex justify-between">
          <span>Support:</span>
          <span className="text-emerald-400 font-semibold">+91 99445 50787</span>
        </div>
      </div>

      <button
        onClick={onRestart}
        className="mt-8 w-full py-3.5 px-6 rounded-full font-semibold border border-zinc-700/60 text-zinc-300 hover:text-white hover:border-emerald-500/40 hover:bg-emerald-950/10 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>Go Back to Welcome</span>
      </button>
    </div>
  );
}
