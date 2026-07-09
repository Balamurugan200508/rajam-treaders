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

  // Helper to draw an image onto the canvas (object-cover style)
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

    // Calculate scaling factor to emulate object-cover behavior
    const ratio = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
    const newWidth = imgWidth * ratio;
    const newHeight = imgHeight * ratio;
    const x = (canvasWidth - newWidth) / 2;
    const y = (canvasHeight - newHeight) / 2;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, x, y, newWidth, newHeight);
  };

  // Prefetch and cache all 150 frames into memory
  useEffect(() => {
    const loadedImages = [];
    for (let i = 1; i <= 150; i++) {
      const img = new Image();
      img.src = `/frames/ezgif-frame-${String(i).padStart(3, '0')}.png`;
      img.onload = () => {
        // If it's the first frame, draw it immediately
        if (i === 1) {
          drawImageOnCanvas(img);
        }
      };
      loadedImages[i] = img;
    }
    imagesRef.current = loadedImages;
  }, []);

  // Handle Resize and initial setup of canvas bounds
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

  // Track scrolling and draw corresponding frame
  useEffect(() => {
    const handleScroll = () => {
      if (slide !== 5) return;
      
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? scrollY / docHeight : 0;
      
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
    currentFrameIndexRef.current = 1;
    
    const firstImg = imagesRef.current[1];
    if (firstImg) {
      drawImageOnCanvas(firstImg);
    }
    
    setSlide(4);
    window.scrollTo({ top: 0 });
  };

  const handleStartForm = () => {
    setSlide(5);
    setScrollProgress(0);
    setTimeout(() => {
      scrollToPercent(0.30);
    }, 100);
  };

  const scrollToPercent = (percent) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: maxScroll * percent, behavior: 'smooth' });
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
    scrollToPercent(0.50);
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
    scrollToPercent(0.70);
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
        scrollToPercent(0.30);
      } else {
        scrollToPercent(0.50);
      }
      return;
    }

    setErrors({});
    setSlide(9);
  };

  const t = translations[lang];

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

        {slide === 5 && (
          <div className="fixed inset-0 z-30 flex items-center justify-center px-4 pointer-events-none">
            <div className="relative w-full max-w-md h-full flex items-center justify-center">
              
              <div style={getCardStyle(0.20, 0.30, 0.40)}>
                <StepNameSection 
                  data={formData} 
                  updateData={updateFormData} 
                  errors={errors} 
                  onContinue={handleContinueName} 
                  t={t}
                  isUnlocked={true}
                />
              </div>
              
              <div style={getCardStyle(0.40, 0.50, 0.60)}>
                <StepContactSection 
                  data={formData} 
                  updateData={updateFormData} 
                  errors={errors} 
                  onContinue={handleContinueContact} 
                  t={t}
                  isUnlocked={true}
                />
              </div>
              
              <div style={getCardStyle(0.60, 0.70, 0.80)}>
                <StepAppointmentSection 
                  data={formData} 
                  updateData={updateFormData} 
                  onContinue={() => scrollToPercent(0.90)} 
                  t={t}
                  isUnlocked={true}
                />
              </div>
              
              <div style={getCardStyle(0.80, 0.90, 1.0)}>
                <StepSolutionSection 
                  data={formData} 
                  updateData={updateFormData} 
                  onSubmit={handleSubmit} 
                  t={t}
                  isUnlocked={true}
                />
              </div>

            </div>
          </div>
        )}

        {slide === 5 && (
          <div className="h-[800vh] w-full pointer-events-none" />
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
