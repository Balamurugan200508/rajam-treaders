import React, { useState, useEffect, useRef } from 'react';
import LangToggle from './components/LangToggle';
import { translations } from './translations';
import { 
  LoadingScreen, 
  WelcomeSection, 
  StepNameSection, 
  StepContactSection, 
  StepAppointmentSection, 
  StepSolutionSection, 
  SubmittingLoader, 
  SuccessScreen, 
  FinalConfirmation 
} from './components/FormSteps';
import { Sun } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState('en');
  // Slide 3: Loading Screen
  // Slide 4: Welcome Banner
  // Slide 5: Scroll-Driven Form Layout
  // Slide 9: Submitting Loader
  // Slide 10: Success Screen
  // Slide 11: Final Confirmation
  const [slide, setSlide] = useState(3);
  const [errors, setErrors] = useState({});
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Track scroll milestones: 
  // 0: Welcome, 1: Name unlocked (100vh), 2: Contact unlocked (200vh), 3: Appointment unlocked (300vh), 4: Solution unlocked (400vh)
  const [maxUnlockedStep, setMaxUnlockedStep] = useState(0);

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

  const imagesRef = useRef([]);
  const canvasRef = useRef(null);
  const currentFrameIndexRef = useRef(1);

  // Helper to draw image onto fixed cover canvas
  const drawImageOnCanvas = (img) => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = img.naturalWidth || img.width;
    const imgHeight = img.naturalHeight || img.height;

    if (imgWidth === 0 || imgHeight === 0) return;

    const ratio = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
    const newWidth = imgWidth * ratio;
    const newHeight = imgHeight * ratio;
    const x = (canvasWidth - newWidth) / 2;
    const y = (canvasHeight - newHeight) / 2;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, x, y, newWidth, newHeight);
  };

  // Prefetch frames on startup
  useEffect(() => {
    const loadedImages = [];
    for (let i = 1; i <= 150; i++) {
      const img = new Image();
      img.src = `/frames/ezgif-frame-${String(i).padStart(3, '0')}.png`;
      img.onload = () => {
        if (i === 1) {
          drawImageOnCanvas(img);
        }
      };
      loadedImages[i] = img;
    }
    imagesRef.current = loadedImages;
  }, []);

  // Handle Resize bounds
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const currentImg = imagesRef.current[currentFrameIndexRef.current];
      if (currentImg) {
        drawImageOnCanvas(currentImg);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track scroll position to advance frames based on absolute 4-viewport limit
  useEffect(() => {
    const handleScroll = () => {
      if (slide !== 5) return;
      
      const scrollY = window.scrollY;
      const maxTrackHeight = 4 * window.innerHeight;
      
      // Calculate progress relative to the 4-viewport full track
      const scrollPercent = Math.min(1.0, scrollY / maxTrackHeight);
      setScrollProgress(scrollPercent);
      
      const frameIndex = Math.min(150, Math.max(1, Math.floor(scrollPercent * 149) + 1));
      currentFrameIndexRef.current = frameIndex;

      const img = imagesRef.current[frameIndex];
      if (img && (img.complete || img.naturalWidth > 0)) {
        drawImageOnCanvas(img);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [slide]);

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
    setScrollProgress(0);
    setMaxUnlockedStep(0);
    currentFrameIndexRef.current = 1;
    
    const firstImg = imagesRef.current[1];
    if (firstImg) {
      drawImageOnCanvas(firstImg);
    }
    
    setSlide(4);
    window.scrollTo({ top: 0 });
  };

  const scrollToPercent = (percent) => {
    const maxTrackHeight = 4 * window.innerHeight;
    window.scrollTo({ top: maxTrackHeight * percent, behavior: 'smooth' });
  };

  const handleStartForm = () => {
    setSlide(5);
    setScrollProgress(0);
    setMaxUnlockedStep(1); // Unlocks Step 1 scroll space (up to 100vh)
    setTimeout(() => {
      scrollToPercent(0.25); // Scrolls to 100vh (25% of 400vh)
    }, 100);
  };

  const handleContinueName = () => {
    const newErrors = {};
    if (!formData.firstName?.trim()) newErrors.firstName = t.validationFirstName;
    if (!formData.lastName?.trim()) newErrors.lastName = t.validationLastName;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setMaxUnlockedStep(2); // Unlocks Step 2 scroll space (up to 200vh)
    setTimeout(() => {
      scrollToPercent(0.50); // Scrolls to 200vh (50% of 400vh)
    }, 100);
  };

  const handleContinueContact = () => {
    const newErrors = {};
    if (!formData.email?.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t.validationEmail;
    }
    if (!formData.mobile?.trim()) {
      newErrors.mobile = t.validationMobile;
    } else if (formData.mobile.replace(/\D/g, '').length < 8) {
      newErrors.mobile = t.validationMobileFormat;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setMaxUnlockedStep(3); // Unlocks Step 3 scroll space (up to 300vh)
    setTimeout(() => {
      scrollToPercent(0.75); // Scrolls to 300vh (75% of 400vh)
    }, 100);
  };

  const handleContinueAppointment = () => {
    setMaxUnlockedStep(4); // Unlocks Step 4 scroll space (up to 400vh)
    setTimeout(() => {
      scrollToPercent(1.00); // Scrolls to 400vh (100% of 400vh)
    }, 100);
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
      
      const firstErrorField = Object.keys(finalErrors)[0];
      if (firstErrorField === 'firstName' || firstErrorField === 'lastName') {
        scrollToPercent(0.25);
      } else {
        scrollToPercent(0.50);
      }
      return;
    }

    setErrors({});
    setSlide(9);
  };

  const t = translations[lang];

  // Helper to calculate card style based on scroll progress (0.0 to 1.0)
  const getCardStyle = (min, peak, max) => {
    if (slide !== 5) return { display: 'none' };
    
    if (scrollProgress < min || scrollProgress > max) {
      return { 
        opacity: 0, 
        transform: 'translateY(60px) scale(0.95)', 
        pointerEvents: 'none',
        position: 'absolute',
        width: '100%',
        maxWidth: '28rem',
        transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
      };
    }
    
    let opacity = 0;
    if (scrollProgress >= min && scrollProgress <= peak) {
      opacity = (scrollProgress - min) / (peak - min);
    } else if (scrollProgress > peak && scrollProgress <= max) {
      if (max >= 0.99) {
        opacity = 1;
      } else {
        opacity = 1 - (scrollProgress - peak) / (max - peak);
      }
    }
    
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const progressOffset = scrollProgress - peak;
    const translateY = progressOffset * (isMobile ? -90 : -180);
    
    return {
      opacity: opacity,
      transform: `translateY(${translateY}px) scale(${0.96 + opacity * 0.04})`,
      pointerEvents: opacity > 0.25 ? 'auto' : 'none',
      position: 'absolute',
      width: '100%',
      maxWidth: '28rem',
      transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
    };
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden">
      {/* High-Performance Canvas Scroll-Sequence Background */}
      <canvas 
        ref={canvasRef}
        id="scroll-canvas"
        className="fixed inset-0 -z-20 w-screen h-screen object-cover"
      />
      {/* Overlay for readable text */}
      <div className="fixed inset-0 -z-10 w-screen h-screen bg-black/35" />

      {/* Language Toggle Selector */}
      {slide !== 3 && <LangToggle currentLang={lang} setLang={setLang} />}

      {/* Header Bar */}
      {slide !== 3 && (
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

        {/* Slide 5: Scroll-Gated reveals centered in viewport */}
        {slide === 5 && (
          <div className="fixed inset-0 z-30 flex items-center justify-center px-4 pointer-events-none">
            <div className="relative w-full max-w-md h-full flex items-center justify-center">
              
              {/* Card 1: Name Section (Visible: 10% - 38%, Peak: 25% [100vh]) */}
              <div style={getCardStyle(0.10, 0.25, 0.38)}>
                <StepNameSection 
                  data={formData} 
                  updateData={updateFormData} 
                  errors={errors} 
                  onContinue={handleContinueName} 
                  t={t}
                  isUnlocked={maxUnlockedStep >= 1}
                />
              </div>
              
              {/* Card 2: Contact Section (Visible: 38% - 62%, Peak: 50% [200vh]) */}
              <div style={getCardStyle(0.38, 0.50, 0.62)}>
                <StepContactSection 
                  data={formData} 
                  updateData={updateFormData} 
                  errors={errors} 
                  onContinue={handleContinueContact} 
                  t={t}
                  isUnlocked={maxUnlockedStep >= 2}
                />
              </div>
              
              {/* Card 3: Appointment Section (Visible: 62% - 88%, Peak: 0.75 [300vh]) */}
              <div style={getCardStyle(0.62, 0.75, 0.88)}>
                <StepAppointmentSection 
                  data={formData} 
                  updateData={updateFormData} 
                  onContinue={handleContinueAppointment} 
                  t={t}
                  isUnlocked={maxUnlockedStep >= 3}
                />
              </div>
              
              {/* Card 4: Solution Section (Visible: 88% - 100%, Peak: 1.00 [400vh]) */}
              <div style={getCardStyle(0.88, 1.00, 1.0)}>
                <StepSolutionSection 
                  data={formData} 
                  updateData={updateFormData} 
                  onSubmit={handleSubmit} 
                  t={t}
                  isUnlocked={maxUnlockedStep >= 4}
                />
              </div>

            </div>
          </div>
        )}

        {/* Dynamic spacer that extends page scroll height ONLY as steps are unlocked */}
        {slide === 5 && (
          <div 
            style={{ height: `${maxUnlockedStep * 100}vh` }} 
            className="w-full pointer-events-none transition-[height] duration-500 ease-out" 
          />
        )}

        {slide === 9 && <SubmittingLoader onComplete={() => setSlide(10)} t={t} />}
        {slide === 10 && <SuccessScreen onNext={() => setSlide(11)} t={t} />}
        {slide === 11 && <FinalConfirmation onRestart={handleRestart} t={t} />}
      </main>

      {/* Footer Info */}
      {slide !== 3 && (
        <footer className="w-full max-w-xl mx-auto px-6 py-6 text-center z-40 select-none">
          <p className="text-zinc-500 text-[10px] md:text-xs tracking-wider">
            &copy; {new Date().getFullYear()} Rajam Traders. All rights reserved. &bull; Thanjavur &bull; Chennai &bull; Trichy
          </p>
        </footer>
      )}
    </div>
  );
}
