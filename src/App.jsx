import React, { useState } from 'react';
import LangToggle from './components/LangToggle';
import { translations } from './translations';
import { 
  LoadingScreen, 
  WelcomeSection, 
  UnifiedForm,
  SubmittingLoader, 
  SuccessScreen, 
  FinalConfirmation 
} from './components/FormSteps';
import { Sun } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState('en');
  // Slide 3: Loading Screen
  // Slide 4: Welcome Banner
  // Slide 4.5: Fullscreen Video Intro
  // Slide 5: Unified Form Page
  // Slide 9: Submitting Loader
  // Slide 10: Success Screen
  // Slide 11: Final Confirmation
  const [slide, setSlide] = useState(3);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    mobile: '',
    date: '',
    time: '',
    solution: 'on-grid',
  });

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
    if (Object.keys(newData).length > 0) {
      const field = Object.keys(newData)[0];
      if (errors[field]) {
        setErrors(prev => {
          const updated = { ...prev };
          delete updated[field];
          return updated;
        });
      }
    }
  };

  const handleRestart = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      mobile: '',
      date: '',
      time: '',
      solution: 'on-grid',
    });
    setErrors({});
    setSlide(4);
    window.scrollTo({ top: 0 });
  };

  const handleStartForm = () => {
    setSlide(4.5);
  };

  const handleSubmit = () => {
    const finalErrors = {};
    if (!formData.firstName?.trim()) finalErrors.firstName = t.validationFirstName;
    if (!formData.lastName?.trim()) finalErrors.lastName = t.validationLastName;
    if (!formData.email?.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      finalErrors.email = t.validationEmail;
    }
    if (!formData.mobile?.trim()) {
      finalErrors.mobile = t.validationMobile;
    } else if (formData.mobile.replace(/\D/g, '').length < 8) {
      finalErrors.mobile = t.validationMobileFormat;
    }

    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setErrors({});
    setSlide(9);
  };

  const t = translations[lang];

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden">
      {/* Static background image for Welcome and Loading screens */}
      {(slide === 3 || slide === 4) && (
        <div 
          className="fixed inset-0 -z-20 w-screen h-screen bg-cover bg-center transition-opacity duration-1000"
          style={{ backgroundImage: `url('/background.png')` }}
        />
      )}
      
      {/* Blurred background image for Slide 5 */}
      {slide === 5 && (
        <div 
          className="fixed inset-0 -z-15 w-screen h-screen bg-cover bg-center filter blur-md scale-105"
          style={{ backgroundImage: `url('/background.png')` }}
        />
      )}
      
      {/* Overlay for readable text */}
      <div className="fixed inset-0 -z-10 w-screen h-screen bg-black/35" />

      {/* Header Bar */}
      {slide !== 3 && slide !== 4.5 && (
        <header className="w-full max-w-xl mx-auto px-6 py-6 flex items-center justify-between z-40 select-none">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Sun className="w-5 h-5 text-[#0d130e]" />
            </div>
            <div>
              <span className="text-white font-black text-lg tracking-tight block">RAJAM</span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest -mt-1 block">TRADERS</span>
            </div>
          </div>
          <LangToggle currentLang={lang} setLang={setLang} />
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-4 z-30 w-full relative">
        {slide === 3 && <LoadingScreen onComplete={() => setSlide(4)} t={t} />}
        
        {slide === 4 && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-xl mx-auto pb-6">
            <WelcomeSection onStartForm={handleStartForm} t={t} />
          </div>
        )}

        {slide === 4.5 && (
          <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
            <video 
              src="/solor house.mp4" 
              autoPlay 
              muted 
              playsInline
              onEnded={() => setSlide(5)}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Slide 5: Single-page Unified Form layout */}
        {slide === 5 && (
          <div className="w-full max-w-xl mx-auto py-8 z-30 relative animate-fade-in">
            <UnifiedForm 
              data={formData} 
              updateData={updateFormData} 
              errors={errors} 
              onSubmit={handleSubmit} 
              t={t}
            />
          </div>
        )}

        {slide === 9 && <SubmittingLoader onComplete={() => setSlide(10)} t={t} />}
        {slide === 10 && <SuccessScreen onNext={() => setSlide(11)} t={t} />}
        {slide === 11 && <FinalConfirmation onRestart={handleRestart} t={t} />}
      </main>

      {/* Footer Info */}
      {slide !== 3 && slide !== 4.5 && (
        <footer className="w-full max-w-xl mx-auto px-6 py-6 text-center z-40 select-none">
          <p className="text-zinc-500 text-[10px] md:text-xs tracking-wider">
            &copy; {new Date().getFullYear()} Rajam Traders. All rights reserved. &bull; Thanjavur &bull; Chennai &bull; Trichy
          </p>
        </footer>
      )}
    </div>
  );
}
