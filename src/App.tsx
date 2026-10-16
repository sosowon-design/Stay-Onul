import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Instagram, 
  Phone, 
  Mail, 
  ChevronRight, 
  ChevronLeft,
  ChevronDown,
  Info, 
  Sparkles, 
  Copy, 
  Menu, 
  X, 
  ArrowUp,
  ExternalLink,
  CalendarDays,
  Home,
  Clock,
  Volume2,
  Wind,
  Coffee,
  Droplets,
  Disc3,
  Moon,
  Navigation,
  CheckCircle2,
  ShieldCheck,
  HeartHandshake,
  MessageCircle,
  BookOpen,
  Bed,
  Compass,
  ArrowRight
} from 'lucide-react';
import { ROOMS_DATA, Room } from './data/rooms';
import { IMAGES } from './assets/imagesMap';

const HERO_GALLERY_IMAGES = [
  {
    url: IMAGES.stayGalleryExteriorPath,
    caption: '고즈넉한 한옥 돌담길과 대나무 정원'
  },
  {
    url: IMAGES.stayGalleryKitchenDining,
    caption: '정갈한 다도와 수제 백자 식기가 놓인 다이닝 키친'
  },
  {
    url: IMAGES.stayGalleryStudyDesk,
    caption: '은은한 새벽빛이 드는 사색의 목재 서재'
  },
  {
    url: IMAGES.stayGalleryLivingRoom,
    caption: '비움의 가치가 돋보이는 고요하고 아늑한 거실'
  },
  {
    url: IMAGES.stayGalleryCourtyardNight,
    caption: '별빛이 쏟아지는 한옥 마당의 따스한 밤풍경'
  }
];

export default function App() {
  // Navigation & UI States
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Interaction & Dialog States
  const [activeModalRoom, setActiveModalRoom] = useState<'on' | 'eul' | 'ahn' | 'gyeol' | null>(null);
  const [currentImgIndex, setCurrentImgIndex] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
  const [redirectingRoomName, setRedirectingRoomName] = useState<string>('');
  const [isInquiryOpen, setIsInquiryOpen] = useState<boolean>(false);

  // Policy guide active tab
  const [activePolicyTab, setActivePolicyTab] = useState<'reservation' | 'benefits' | 'etiquette' | 'refund'>('reservation');

  // Preload all critical hero & room images on initial load for instant rendering
  useEffect(() => {
    HERO_GALLERY_IMAGES.forEach(img => {
      const imageObj = new Image();
      imageObj.src = img.url;
    });
    ROOMS_DATA.forEach(r => {
      const mainImg = new Image();
      mainImg.src = r.image;
      r.images.forEach(subImg => {
        const sub = new Image();
        sub.src = subImg;
      });
    });
  }, []);

  // Track scroll position & active section
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      const sectionList = ['booking', 'contact', 'experience', 'rooms', 'habits', 'about', 'hero'];
      const scrollPos = window.scrollY + 180;
      for (const sId of sectionList) {
        const elem = document.getElementById(sId);
        if (elem) {
          const top = elem.offsetTop;
          if (scrollPos >= top) {
            // MINDFUL RITUALS (habits) is connected to 'about' (이야기) menu
            setActiveSection(sId === 'habits' ? 'about' : sId);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Automatic hero image slider (natural crossfade transition every 5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroIndex(prev => (prev + 1) % HERO_GALLERY_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Automatic modal image slider when room modal is opened
  useEffect(() => {
    setCurrentImgIndex(0);
    if (!activeModalRoom) return;

    const room = ROOMS_DATA.find(r => r.id === activeModalRoom);
    const count = room?.images?.length || 1;
    if (count <= 1) return;

    const modalTimer = setInterval(() => {
      setCurrentImgIndex(prev => (prev + 1) % count);
    }, 4000);

    return () => clearInterval(modalTimer);
  }, [activeModalRoom]);

  // Show a quick toast message
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Copy to clipboard helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    triggerToast(`${label}이(가) 클립보드에 복사되었습니다.`);
  };

  // Smooth scroll
  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Open external maps
  const openExternalMap = (type: 'naver' | 'kakao') => {
    const address = '경상북도 경주시 황남동 첨성로 45번길 12-8';
    if (type === 'naver') {
      window.open(`https://map.naver.com/v5/search/${encodeURIComponent('온을 경주 ' + address)}`, '_blank');
      triggerToast('네이버 지도 검색창으로 이동합니다.');
    } else {
      window.open(`https://map.kakao.com/link/search/${encodeURIComponent('온을 경주')}`, '_blank');
      triggerToast('카카오맵 검색창으로 이동합니다.');
    }
  };

  // Simulate external booking redirect / open official Naver booking
  const handleBookingRedirect = (roomTitle: string = '온을 독채 전체') => {
    setRedirectingRoomName(roomTitle);
    setIsRedirecting(true);
    setTimeout(() => {
      setIsRedirecting(false);
      window.open('https://booking.naver.com', '_blank');
      triggerToast(`${roomTitle} 네이버 공식 예약 페이지로 연결되었습니다.`);
    }, 1200);
  };

  return (
    <div id="onul-application" className="min-h-screen bg-[#FAF7F2] font-sans selection:bg-[#E6DCD0] selection:text-[#2C2621]">
      
      {/* Dynamic Toast System */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 30, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 15, x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-50 transform rounded-full bg-[#2C2621]/95 px-6 py-3 text-center text-[13px] font-normal tracking-wide text-[#FAF7F2] shadow-2xl backdrop-blur-md border border-[#E6DCD0]/20"
            id="toast-notification"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#E6DCD0] animate-pulse" />
              {toastMessage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Buttons (Inquiry & Scroll to Top - Hidden on mobile when menu drawer is open) */}
      <AnimatePresence>
        {scrollY > 400 && !isMobileMenuOpen && (
          <motion.div
            id="floating-actions"
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-6 right-5 sm:bottom-8 sm:right-8 z-40 flex flex-col items-center gap-2.5"
          >
            {/* Quick Inquiry Popover */}
            <AnimatePresence>
              {isInquiryOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 8, originY: 1 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full right-0 mb-3 w-[calc(100vw-2.5rem)] max-w-[320px] sm:w-84 sm:max-w-none rounded-xs bg-[#FAF7F2] p-4.5 sm:p-5 text-[#2C2621] shadow-2xl border border-[#E6DCD0] z-50 text-left"
                >
                  <div className="flex items-center justify-between border-b border-[#E6DCD0] pb-3 mb-3.5">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-[#9E8D7A]" />
                      <h4 className="font-serif text-[14px] font-medium text-[#2C2621]">온을(溫乙) 문의 안내</h4>
                    </div>
                    <button
                      onClick={() => setIsInquiryOpen(false)}
                      className="p-1 text-[#8B7A68] hover:text-[#8B7A68] cursor-pointer bg-transparent border-none transition-colors"
                      title="닫기"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2.5 text-[12px]">
                    {/* 전화 문의 */}
                    <div
                      onClick={() => handleCopy('0507-1349-2680', '전화번호')}
                      className="flex items-center justify-between p-3 sm:p-3.5 bg-[#F3ECE1]/70 hover:bg-[#EAE1D5] rounded-xs border border-[#E6DCD0]/60 text-[#2C2621] transition-colors cursor-pointer group"
                      title="클릭하여 전화번호 복사"
                    >
                      <div className="flex items-center gap-2.5">
                        <Phone className="h-4 w-4 text-[#9E8D7A]" />
                        <div>
                          <span className="text-[10.5px] text-[#8B7A68] block leading-none mb-1">전화 문의</span>
                          <span className="font-medium text-[#2C2621]">0507-1349-2680</span>
                        </div>
                      </div>
                      <Copy className="h-3.5 w-3.5 text-[#9E8D7A]" />
                    </div>

                    {/* 인스타그램 DM */}
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 sm:p-3.5 bg-[#F3ECE1]/70 hover:bg-[#EAE1D5] rounded-xs border border-[#E6DCD0]/60 text-[#2C2621] transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Instagram className="h-4 w-4 text-[#9E8D7A]" />
                        <div>
                          <span className="text-[10.5px] text-[#8B7A68] block leading-none mb-1">인스타그램 DM</span>
                          <span className="font-medium">@stay.onul</span>
                        </div>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 text-[#9E8D7A]" />
                    </a>

                    {/* 예약 및 이용 안내 확인하기 */}
                    <button
                      onClick={() => {
                        setIsInquiryOpen(false);
                        scrollToSection('booking');
                      }}
                      className="w-full py-3 px-3 sm:px-4 bg-[#9E8D7A] hover:bg-[#8B7A68] text-[#FAF7F2] text-[12px] sm:text-[12.5px] rounded-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border-none font-light whitespace-nowrap"
                    >
                      <CalendarDays className="h-4 w-4 shrink-0" />
                      <span>예약 및 이용 안내 확인하기</span>
                    </button>
                  </div>

                  <p className="mt-3.5 text-[11px] text-[#8B7A68] font-light leading-snug">
                    ※ 문의 가능 시간: 10:00 ~ 20:00
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Floating Inquiry Button (Identical size to Scroll to Top, Icon-only) */}
            <motion.button
              id="floating-inquiry-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsInquiryOpen(prev => !prev)}
              className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full shadow-lg transition-all duration-300 cursor-pointer ${
                isInquiryOpen 
                  ? 'bg-[#8B7A68] text-[#FAF7F2] border border-[#8B7A68]' 
                  : 'bg-[#9E8D7A] hover:bg-[#8B7A68] text-[#FAF7F2] border border-[#FAF7F2]/30'
              }`}
              title={isInquiryOpen ? '문의창 닫기' : '문의하기'}
            >
              {isInquiryOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <MessageCircle className="h-4 w-4" />
              )}
            </motion.button>

            {/* Scroll to Top Button */}
            <motion.button
              id="scroll-to-top"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-[#9E8D7A]/40 bg-[#FAF7F2]/95 text-[#2C2621] shadow-lg hover:bg-[#8B7A68] hover:border-[#8B7A68] hover:text-[#FAF7F2] transition-all duration-300 cursor-pointer group"
              title="최상단으로 이동"
            >
              <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Container */}
      <header 
        id="stay-header" 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isMobileMenuOpen
            ? 'bg-[#FAF7F2] py-4 border-b border-[#E6DCD0] shadow-xs'
            : scrollY > 40
              ? 'bg-[#FAF7F2]/95 backdrop-blur-md shadow-xs py-3.5 border-b border-[#E6DCD0]/60'
              : 'bg-transparent py-6'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-12">
          
          {/* Logo */}
          <button 
            onClick={() => scrollToSection('hero')} 
            className="flex flex-col items-start text-left cursor-pointer border-none bg-transparent"
          >
            <span className={`font-serif text-xl md:text-2xl tracking-widest font-light transition-colors ${
              isMobileMenuOpen || scrollY > 40 ? 'text-[#2C2621]' : 'text-white'
            }`}>
              stay.Onul
            </span>
            <span className="font-serif text-[13px] tracking-widest text-[#9E8D7A]">
              온을 (溫乙)
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-9 text-[13px] tracking-widest font-light">
            {[
              { id: 'about', label: '이야기' },
              { id: 'rooms', label: '머무는 공간' },
              { id: 'experience', label: '온을의 하루' },
              { id: 'contact', label: '오시는 길' },
            ].map(item => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative py-1 cursor-pointer bg-transparent border-none transition-all duration-300 ${
                    isActive
                      ? 'text-[#9E8D7A] font-medium'
                      : scrollY > 40
                        ? 'text-[#2C2621] hover:text-[#9E8D7A]'
                        : 'text-white/90 hover:text-[#9E8D7A]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* Quick Reservation Action Button - Hero: Line design on default, #8B7A68 on hover; Scrolled: #9E8D7A on default, #8B7A68 on hover */}
            <button
              onClick={() => scrollToSection('booking')}
              className={`px-5 py-2.5 rounded-none text-[13px] tracking-wider transition-all duration-300 cursor-pointer font-normal shadow-xs ${
                scrollY > 40
                  ? 'bg-[#9E8D7A] text-[#FAF7F2] border border-[#9E8D7A] hover:bg-[#8B7A68] hover:border-[#8B7A68]'
                  : 'bg-transparent text-[#FAF7F2] border border-white/80 hover:bg-[#8B7A68] hover:border-[#8B7A68]'
              }`}
            >
              예약하기
            </button>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <button 
            id="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className={`p-1.5 md:hidden transition-colors cursor-pointer border-none bg-transparent ${
              isMobileMenuOpen || scrollY > 40 ? 'text-[#2C2621]' : 'text-white'
            }`}
            aria-label="메뉴 열기"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

        </div>
      </header>

      {/* Mobile Drawer Navigation (Completely covers screen below header with solid 100% opaque warm hanok cream background so hero background is completely hidden) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            id="mobile-menu-drawer"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 bottom-0 top-[65px] z-30 flex flex-col justify-between bg-[#FAF7F2] px-7 py-8 md:hidden border-b border-[#E6DCD0] shadow-2xl overflow-y-auto"
          >
            <div className="flex flex-col space-y-2 text-left">
              {[
                { id: 'about', label: '이야기', icon: BookOpen, en: 'STORY' },
                { id: 'rooms', label: '머무는 공간', icon: Bed, en: 'SPACES' },
                { id: 'experience', label: '온을의 하루', icon: Sparkles, en: 'RETREAT' },
                { id: 'contact', label: '오시는 길', icon: MapPin, en: 'LOCATION' },
                { id: 'booking', label: '예약 및 이용 안내', icon: CalendarDays, en: 'GUIDE' },
              ].map(item => {
                const IconComponent = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex items-center justify-between w-full py-3.5 px-3 rounded-xs transition-all cursor-pointer border-none bg-transparent ${
                      isActive 
                        ? 'bg-[#EAE1D5]/60 text-[#8B7A68]' 
                        : 'text-[#2C2621] hover:bg-[#F3ECE1]/60 hover:text-[#9E8D7A]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        isActive ? 'bg-[#9E8D7A] text-[#FAF7F2]' : 'bg-[#E6DCD0]/50 text-[#5F5449]'
                      }`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <span className={`font-serif text-[16px] tracking-wider ${
                        isActive ? 'font-medium text-[#8B7A68]' : 'font-normal text-[#2C2621]'
                      }`}>
                        {item.label}
                      </span>
                    </div>
                    <span className="font-['Cormorant_Garamond',serif] text-xs tracking-widest text-[#9E8D7A]/80 uppercase font-light">
                      {item.en}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-6 border-t border-[#E6DCD0]/60 space-y-3">
              <button 
                onClick={() => scrollToSection('booking')} 
                className="w-full flex items-center justify-center gap-2 font-serif text-sm tracking-widest text-[#FAF7F2] bg-[#9E8D7A] hover:bg-[#8B7A68] py-3.5 rounded-none cursor-pointer border-none font-normal shadow-xs transition-colors"
              >
                <CalendarDays className="h-4 w-4" />
                <span>실시간 예약하기</span>
              </button>

              <div className="flex items-center justify-between text-[11.5px] text-[#9E8D7A] px-1 font-light">
                <span>문의 0507-1349-2680</span>
                <span>경북 경주시 황남동 첨성로 45번길</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section id="hero" className="relative flex h-screen items-center justify-center overflow-hidden border-b border-[#E6DCD0] bg-black select-none group">
        
        {/* Full screen background image slider with smooth crossfade & soft Ken Burns scale */}
        <AnimatePresence mode="sync">
          <motion.div
            key={activeHeroIndex}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: [0.25, 1, 0.5, 1] }}
            className="absolute inset-0 z-0"
          >
            <img 
              src={HERO_GALLERY_IMAGES[activeHeroIndex].url} 
              alt="Stay Onul Hero Image" 
              className="h-full w-full object-cover object-center filter brightness-[0.70] saturate-[0.9] animate-natural-motion-slow"
              referrerPolicy="no-referrer"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* Hero Central Title */}
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-['Cormorant_Garamond',serif] text-xs sm:text-sm tracking-[0.4em] uppercase text-[#E6DCD0] block mb-4 font-normal"
          >
            PRIVATE HANOK SANCTUARY
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="font-serif text-[26px] sm:text-[32px] md:text-[40px] font-light text-[#FAF7F2] tracking-wide leading-snug break-keep"
          >
            비움과 채움이 머무는 곳,<br className="hidden md:inline" /> 온을(溫乙)
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="mt-6 text-[13px] sm:text-[14px] text-[#FAF7F2]/85 font-light max-w-md mx-auto leading-relaxed break-keep"
          >
            경주 황남동 고즈넉한 돌담길 속, 온전한 쉼을 위한 프라이빗 독채 한옥 스테이
          </motion.p>
        </div>

        {/* Bottom Controller for Hero Image Slider with Transition Speed Indicator & Cormorant Garamond Numbers */}
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-20 w-full max-w-4xl px-6 flex flex-col items-center gap-3.5">
          {/* Slider Controllers */}
          <div className="flex items-center gap-4 sm:gap-5">
            <button
              onClick={() => setActiveHeroIndex(prev => (prev === 0 ? HERO_GALLERY_IMAGES.length - 1 : prev - 1))}
              className="h-9 w-9 border border-white/30 hover:border-white text-white rounded-full flex items-center justify-center transition-all bg-black/30 hover:bg-black/60 cursor-pointer"
              title="이전 사진"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Slider count with Cormorant Garamond font & Transition Speed Progress Bar */}
            <div className="flex items-center gap-3 text-white bg-black/40 px-4 py-2 backdrop-blur-md rounded-xs border border-white/10">
              <span className="font-['Cormorant_Garamond',serif] text-base font-normal tracking-widest">
                0{activeHeroIndex + 1}
              </span>

              {/* Speed Progress Bar */}
              <div className="w-20 sm:w-28 h-1 bg-white/20 rounded-full overflow-hidden relative mx-1">
                <motion.div
                  key={activeHeroIndex}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 5, ease: 'linear' }}
                  className="h-full bg-[#E6DCD0]"
                />
              </div>

              <span className="font-['Cormorant_Garamond',serif] text-base font-normal tracking-widest text-white/60">
                0{HERO_GALLERY_IMAGES.length}
              </span>
            </div>

            <button
              onClick={() => setActiveHeroIndex(prev => (prev === HERO_GALLERY_IMAGES.length - 1 ? 0 : prev + 1))}
              className="h-9 w-9 border border-white/30 hover:border-white text-white rounded-full flex items-center justify-center transition-all bg-black/30 hover:bg-black/60 cursor-pointer"
              title="다음 사진"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Refined Hanok Sanctuary Vertical Center Scroll Down Indicator */}
        <motion.button 
          onClick={() => scrollToSection('about')}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute top-1/2 -translate-y-1/2 right-6 md:right-10 z-20 hidden sm:flex flex-col items-center gap-3.5 cursor-pointer bg-transparent border-none text-[#FAF7F2]/80 hover:text-[#FAF7F2] group transition-all"
          title="온을 이야기로 이동"
        >
          <span className="font-['Cormorant_Garamond',serif] text-[11px] tracking-[0.35em] text-[#E6DCD0] uppercase font-light [writing-mode:vertical-rl] select-none group-hover:text-white transition-colors">
            SCROLL DOWN
          </span>
          <div className="w-[1px] h-14 bg-white/25 relative overflow-hidden group-hover:bg-white/40 transition-colors">
            <motion.div
              animate={{ y: [-16, 56] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
              className="w-[1px] h-4 bg-[#9E8D7A]"
            />
          </div>
        </motion.button>
      </section>

      {/* ABOUT SECTION (온을 브랜드 철학) */}
      <section id="about" className="relative z-10 bg-[#FAF7F2] py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6 md:px-12">

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-center">
            
            {/* Left Column: Evocative Photo */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-6 relative"
            >
              <div className="relative overflow-hidden rounded-xs border border-[#E6DCD0] shadow-sm aspect-[4/3] group">
                <img 
                  src={IMAGES.stayGalleryLivingRoom} 
                  alt="온을 고요한 사색 공간" 
                  className="h-full w-full object-cover animate-natural-motion transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C2621]/40 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 bg-[#FAF7F2]/90 backdrop-blur-xs px-3.5 py-1.5 text-[12px] font-serif text-[#2C2621] rounded-xs border border-[#E6DCD0]/60">
                  오롯한 쉼과 여백 · 온을 프라이빗 라운지
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-[#9E8D7A]/30 -z-10 rounded-xs hidden sm:block" />
            </motion.div>

            {/* Right Column: Concise Core Narrative */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-6 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start"
            >
              {/* Section Category & Eyebrow aligned on top of text content */}
              <div className="w-full text-center lg:text-left">
                <span className="font-['Cormorant_Garamond',serif] text-[13px] tracking-[0.3em] text-[#9E8D7A] uppercase font-semibold block mb-1">
                  BRAND PHILOSOPHY
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#2C2621] leading-snug tracking-wide break-keep text-center lg:text-left w-full">
                복잡한 일상을 비우고 <br/>
                온전한 평온을 채우는 시간
              </h2>
              
              <div className="h-[1px] w-12 bg-[#9E8D7A] mx-auto lg:mx-0" />
              
              <div className="space-y-5 md:space-y-4 text-[13.5px] font-light leading-relaxed md:leading-relaxed text-[#5F5449] max-w-lg lg:max-w-none mx-auto lg:mx-0 break-keep text-center lg:text-left">
                <p className="leading-[1.8] md:leading-relaxed">
                  <strong>온을(溫乙)</strong>은 따뜻할 <strong>온(溫)</strong>과 쉼표를 닮은 둘째 천간 <strong>을(乙)</strong>의 뜻을 품고 있습니다. 
                </p>
                <p className="leading-[1.8] md:leading-relaxed">
                  경주 황남동의 고즈넉한 돌담길 끝자락, 하루 단 한 팀만을 위해 마련된 프라이빗 한옥에서 복잡한 세상의 소음을 잠시 끄고 오롯이 내면의 숨결을 마주해 보세요.
                </p>
                <div className="pt-5 mt-4 md:pt-4 md:mt-3 border-t border-[#E6DCD0]/60 w-full text-center lg:text-left">
                  <p className="font-serif text-[#8B7A68] text-[13.5px] sm:text-[14px] leading-[1.8] md:leading-relaxed break-keep">
                    "맑은 차 한 잔과 고요한 바람의 결을 따라, 일상의 여유를 다시 채웁니다."
                  </p>
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* 4 MINDFUL HABITS SECTION (스스로를 보살피는 온을에서의 4가지 습관) */}
      <section id="habits" className="bg-[#F3ECE1] py-24 border-y border-[#E6DCD0]/60">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="font-['Cormorant_Garamond',serif] text-[13px] tracking-[0.3em] text-[#9E8D7A] uppercase block mb-3 font-semibold">
              MINDFUL RITUALS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#2C2621] break-keep leading-snug">
              스스로를 보살피는<br className="sm:hidden" /> 온을에서의 4가지 습관
            </h2>
            <p className="mt-3 text-[13px] font-light text-[#5F5449] max-w-md mx-auto break-keep leading-relaxed">
              자연의 감각을 깨우고 마음에 평안을 채우는<br className="sm:hidden" /> 온을만의 온전한 휴식 경험입니다.
            </p>
          </motion.div>

          {/* 4 Intuitive Bento/Grid Cards with High Visual Clarity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: '01',
                title: '대나무 바람 소리',
                desc: '을(乙) 다실 너머 푸른 대나무 숲에서 들려오는 청아한 잎새 소리에 가만히 귀를 기울입니다.',
                icon: Wind,
                bgImg: IMAGES.stayGalleryExteriorPath
              },
              {
                num: '02',
                title: '정갈한 웰컴 티 한 잔',
                desc: '따뜻한 온수로 계절 찻잎을 천천히 우려내며 흩어진 생각을 편안하게 정돈합니다.',
                icon: Coffee,
                bgImg: IMAGES.stayTeaDetails
              },
              {
                num: '03',
                title: '화산석 스파 온욕',
                desc: '안(安) 욕실의 편백 향과 따뜻한 화산석 수면 속에서 쌓인 긴장을 완전히 녹여냅니다.',
                icon: Droplets,
                bgImg: IMAGES.staySpaDetails
              },
              {
                num: '04',
                title: '아날로그 바이닐 LP',
                desc: '결(結) 음악실의 턴테이블 위로 흐르는 재즈 선율과 함께 고요한 독서에 잠겨봅니다.',
                icon: Disc3,
                bgImg: IMAGES.staySalonDetails
              }
            ].map((habit, idx) => {
              const IconComp = habit.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="group relative overflow-hidden rounded-xs bg-[#FAF7F2] p-7 border border-[#E6DCD0] shadow-xs flex flex-col justify-between transition-all duration-300"
                >
                  <div>
                    {/* Header: Number & Icon (On mobile: 01~04 numbers centered and icons hidden. On PC/Desktop: original flex between layout maintained) */}
                    <div className="flex items-center justify-center sm:justify-between mb-5">
                      <span className="font-['Cormorant_Garamond',serif] text-3xl font-normal text-[#9E8D7A]">
                        {habit.num}
                      </span>
                      <div className="h-10 w-10 rounded-full bg-[#F3ECE1] text-[#2C2621] items-center justify-center group-hover:bg-[#9E8D7A] group-hover:text-[#FAF7F2] transition-colors duration-300 hidden sm:flex">
                        <IconComp className="h-4.5 w-4.5" />
                      </div>
                    </div>

                    <h3 className="font-serif text-lg font-normal text-[#2C2621] mb-3 flex items-center justify-center sm:justify-start gap-1.5 text-center sm:text-left">
                      <IconComp className="h-4 w-4 text-[#9E8D7A] shrink-0 sm:hidden" />
                      <span>{habit.title}</span>
                    </h3>
                    <p className="text-[12.5px] font-light leading-relaxed text-[#5F5449] text-center sm:text-left break-keep">
                      {habit.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ROOMS / SPACES SECTION */}
      <section id="rooms" className="bg-[#FAF7F2] py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <span className="font-['Cormorant_Garamond',serif] text-[13px] tracking-[0.3em] text-[#9E8D7A] uppercase block mb-3 font-semibold">
              OUR GORGEOUS SPACES
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#2C2621] tracking-wide">
              쉼의 모양을 다듬은 온을의 고유한 공간들
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[13px] font-light leading-relaxed text-[#5F5449]">
              하루 한 팀만을 위한 4가지 테마 공간에서 침실, 다실, 온욕실, 음악실을 프라이빗하게 누려보세요.
            </p>
          </motion.div>

          {/* 4-Room Grid Layout */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {ROOMS_DATA.map((room, idx) => (
              <motion.div 
                key={room.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                id={`room-card-${room.id}`}
                className="group overflow-hidden rounded-xs bg-[#FAF7F2] hover:bg-[#9E8D7A]/10 border border-[#E6DCD0] hover:border-[#9E8D7A] shadow-xs transition-all duration-400 hover:-translate-y-1 hover:shadow-md cursor-pointer flex flex-col justify-between"
                onClick={() => setActiveModalRoom(room.id as any)}
              >
                <div>
                  <div className="relative overflow-hidden aspect-[16/10]">
                    <img 
                      src={room.image} 
                      alt={room.title} 
                      className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
                        idx % 2 === 0 ? 'animate-natural-motion' : 'animate-natural-motion-alt'
                      }`}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  <div className="p-7 pb-4 text-center md:text-left">
                    <div className="flex items-baseline justify-center md:justify-between">
                      <h3 className="font-serif text-xl font-normal text-[#2C2621]">
                        {room.title} – {room.subTitle}
                      </h3>
                    </div>
                    
                    <p className="mt-3 text-[13px] font-light leading-relaxed text-[#5F5449] break-keep">
                      {room.description}
                    </p>

                    {/* Quick highlights - elegant and consistent warm tones before and after hover */}
                    <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-1.5 sm:gap-2 pt-3 border-t border-[#E6DCD0]/40">
                      {room.features.map((feat, fIdx) => (
                        <span key={fIdx} className="text-[11px] sm:text-[11.5px] bg-[#F3ECE1] text-[#4A3F35] px-2 sm:px-2.5 py-1 rounded-xs font-light border border-[#E6DCD0] whitespace-nowrap">
                          ✓ {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-7 pb-7 pt-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveModalRoom(room.id as any);
                    }}
                    className="w-full text-center py-2.5 bg-transparent border border-[#9E8D7A] text-[#9E8D7A] group-hover:bg-[#9E8D7A] group-hover:text-[#FAF7F2] hover:!bg-[#8B7A68] hover:!text-[#FAF7F2] hover:!border-[#8B7A68] text-[12.5px] tracking-widest font-normal transition-all duration-300 rounded-none cursor-pointer shadow-xs"
                  >
                    공간 상세 확인하기
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* EXPERIENCE RETREAT (온을에서의 정갈한 하루 흐름 - 4 Items) */}
      <section id="experience" className="bg-[#F3ECE1] py-24 md:py-32 border-t border-[#E6DCD0]">
        <div className="mx-auto max-w-6xl px-6 md:px-12 text-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-14"
          >
            <span className="font-['Cormorant_Garamond',serif] text-[13px] tracking-[0.3em] text-[#9E8D7A] uppercase block mb-3 font-semibold">
              EXPERIENCE RETREAT
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#2C2621] font-light">
              온을에서의 정갈한 하루 흐름
            </h2>
            <p className="mt-3 text-[13px] font-light text-[#5F5449] max-w-md mx-auto">
              체크인부터 다음 날 아침까지, 온을에서 만나는 특별한 하루의 순간들입니다.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
            
            {/* Step 1: 16:00 */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-[#FAF7F2] rounded-xs shadow-xs overflow-hidden border border-[#E6DCD0] flex flex-col group"
            >
              <div className="h-44 overflow-hidden relative">
                <img 
                  src={IMAGES.stayTeaDetails} 
                  alt="마중과 웰컴 브루잉" 
                  className="h-full w-full object-cover animate-natural-motion transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="font-['Cormorant_Garamond',serif] text-2xl text-[#9E8D7A] block mb-2 font-normal">
                    16:00
                  </span>
                  <h4 className="font-serif text-base text-[#2C2621] mb-2 font-medium">
                    마중과 웰컴 브루잉
                  </h4>
                  <p className="text-[12.5px] font-light leading-relaxed text-[#5F5449] break-keep">
                    도착과 함께 을(乙) 다실에서 명인의 발효 웰컴 티를 준비해 드립니다. 일상의 소음을 끄고 고요한 평온에 들어섭니다.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Step 2: 20:00 */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#FAF7F2] rounded-xs shadow-xs overflow-hidden border border-[#E6DCD0] flex flex-col group"
            >
              <div className="h-44 overflow-hidden relative">
                <img 
                  src={IMAGES.staySpaDetails} 
                  alt="프라이빗 핫스파 온욕" 
                  className="h-full w-full object-cover animate-natural-motion-alt transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="font-['Cormorant_Garamond',serif] text-2xl text-[#9E8D7A] block mb-2 font-normal">
                    20:00
                  </span>
                  <h4 className="font-serif text-base text-[#2C2621] mb-2 font-medium">
                    프라이빗 핫스파 온욕
                  </h4>
                  <p className="text-[12.5px] font-light leading-relaxed text-[#5F5449] break-keep">
                    천연 화산석 욕조에 편백 솔트를 풀고 따스한 스팀 속에 몸을 담가 하루의 피로를 편안히 내려놓습니다.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Step 3: 22:00 */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-[#FAF7F2] rounded-xs shadow-xs overflow-hidden border border-[#E6DCD0] flex flex-col group"
            >
              <div className="h-44 overflow-hidden relative">
                <img 
                  src={IMAGES.stayGalleryCourtyardNight} 
                  alt="밤마당 달빛 사색" 
                  className="h-full w-full object-cover animate-natural-motion transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="font-['Cormorant_Garamond',serif] text-2xl text-[#9E8D7A] block mb-2 font-normal">
                    22:00
                  </span>
                  <h4 className="font-serif text-base text-[#2C2621] mb-2 font-medium">
                    달빛 마당과 야간 사색
                  </h4>
                  <p className="text-[12.5px] font-light leading-relaxed text-[#5F5449] break-keep">
                    기와지붕 위로 별빛이 쏟아지는 한옥 마당에서 은은한 야간 조명과 함께 밤의 정취를 감상합니다.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Step 4: 09:00 */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-[#FAF7F2] rounded-xs shadow-xs overflow-hidden border border-[#E6DCD0] flex flex-col group"
            >
              <div className="h-44 overflow-hidden relative">
                <img 
                  src={IMAGES.staySalonDetails} 
                  alt="아날로그 바이닐 모닝" 
                  className="h-full w-full object-cover animate-natural-motion-alt transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="font-['Cormorant_Garamond',serif] text-2xl text-[#9E8D7A] block mb-2 font-normal">
                    09:00
                  </span>
                  <h4 className="font-serif text-base text-[#2C2621] mb-2 font-medium">
                    아날로그 바이닐 모닝
                  </h4>
                  <p className="text-[12.5px] font-light leading-relaxed text-[#5F5449] break-keep">
                    아침 햇살이 스며드는 음악실에서 클래식 LP 선율을 틀고 향긋한 커피와 함께 상쾌한 하루를 시작합니다.
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* CONTACT & MAP LOCATION SECTION */}
      <section id="contact" className="bg-[#FAF7F2] border-t border-[#E6DCD0] py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-center">
            
            {/* Left Col: Location Info */}
            <motion.div 
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start"
            >
              <span className="font-['Cormorant_Garamond',serif] text-[13px] tracking-widest text-[#9E8D7A] font-semibold block uppercase">
                LOCATION & INFORMATION
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#2C2621] break-keep">
                소란한 길목 끝자락,<br/>
                조용히 마주한 자리
              </h2>
              
              <div className="h-[1px] w-12 bg-[#9E8D7A] mx-auto lg:mx-0" />

              <div className="space-y-4 text-[13px] font-light text-[#3F3730] leading-relaxed w-full">
                
                <div className="flex flex-col items-center lg:flex-row lg:items-start gap-1 lg:gap-3 text-center lg:text-left">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <MapPin className="h-4.5 w-4.5 text-[#9E8D7A] shrink-0" />
                    <strong className="text-[#2C2621] font-medium">도로명 주소</strong>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start gap-1.5 mt-0.5 lg:mt-0">
                    <span className="break-keep">경상북도 경주시 황남동 첨성로 45번길 12-8 (온을)</span>
                    <button 
                      onClick={() => handleCopy('경상북도 경주시 황남동 첨성로 45번길 12-8', '도로명 주소')}
                      className="text-[#9E8D7A] hover:text-[#8B7A68] p-0.5 bg-transparent border-none cursor-pointer transition-colors"
                      title="주소 복사"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-center lg:flex-row lg:items-start gap-1 lg:gap-3 text-center lg:text-left">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Phone className="h-4.5 w-4.5 text-[#9E8D7A] shrink-0" />
                    <strong className="text-[#2C2621] font-medium">문의 연락처</strong>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start gap-1.5 mt-0.5 lg:mt-0">
                    <span>0507-1349-2680</span>
                    <button 
                      onClick={() => handleCopy('0507-1349-2680', '전화번호')}
                      className="text-[#9E8D7A] hover:text-[#8B7A68] p-0.5 bg-transparent border-none cursor-pointer transition-colors"
                      title="전화번호 복사"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-center lg:flex-row lg:items-start gap-1 lg:gap-3 text-center lg:text-left">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Mail className="h-4.5 w-4.5 text-[#9E8D7A] shrink-0" />
                    <strong className="text-[#2C2621] font-medium">이메일</strong>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start gap-1.5 mt-0.5 lg:mt-0">
                    <span>stay.onul@gmail.com</span>
                    <button 
                      onClick={() => handleCopy('stay.onul@gmail.com', '이메일')}
                      className="text-[#9E8D7A] hover:text-[#8B7A68] p-0.5 bg-transparent border-none cursor-pointer transition-colors"
                      title="이메일 복사"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Naver Map & Kakao Map Buttons with Onul Mood Colors */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3 w-full max-w-sm lg:max-w-none mx-auto lg:mx-0">
                <button
                  onClick={() => openExternalMap('naver')}
                  className="flex-1 py-3 px-4 bg-[#9E8D7A] hover:bg-[#8B7A68] text-[#FAF7F2] text-[12.5px] font-light rounded-none flex items-center justify-center gap-2.5 transition-all cursor-pointer border-none shadow-xs tracking-wider"
                >
                  <span className="font-serif font-semibold text-[#FAF7F2] text-[13px]">N</span>
                  <span>네이버 지도 보기</span>
                  <ExternalLink className="h-3.5 w-3.5 text-[#FAF7F2]" />
                </button>
                <button
                  onClick={() => openExternalMap('kakao')}
                  className="flex-1 py-3 px-4 bg-[#F3ECE1] hover:bg-[#EAE1D5] text-[#2C2621] text-[12.5px] font-light rounded-none flex items-center justify-center gap-2.5 transition-all cursor-pointer border border-[#E6DCD0] shadow-xs tracking-wider"
                >
                  <span className="font-serif font-semibold text-[#9E8D7A] text-[13px]">K</span>
                  <span>카카오맵 보기</span>
                  <ExternalLink className="h-3.5 w-3.5 text-[#9E8D7A]" />
                </button>
              </div>

              <div className="pt-2 flex justify-center lg:justify-start w-full hidden sm:flex">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[12.5px] font-light text-[#5F5449] hover:text-[#8B7A68] pb-1 border-b border-[#8B7A68]/40 transition-colors"
                >
                  <Instagram className="h-4 w-4" /> Instagram @stay.onul 소식 확인하기
                </a>
              </div>
            </motion.div>

            {/* Right Col: Restored Stylized Artistic Hanok Map Graphic (Hidden on mobile per request, visible on desktop) */}
            <motion.div 
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="hidden lg:block lg:col-span-7"
            >
              <div className="relative rounded-xs border border-[#E6DCD0] bg-[#F3ECE1] p-4 text-[#3F3730] overflow-hidden aspect-video shadow-xs">
                
                {/* Visual Map Aesthetic Background */}
                <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#FAF7F2] to-[#F3ECE1]" />
                
                {/* Subtle Grid / Lane Overlay */}
                <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#E6DCD0]" />
                <div className="absolute left-1/3 top-0 bottom-0 w-[2px] bg-[#E6DCD0]" />
                <div className="absolute left-2/3 top-0 bottom-0 w-[2px] bg-[#E6DCD0]/60" />
                
                {/* Key Landmark Ambient Bubbles */}
                <div className="absolute top-8 left-8 sm:top-10 sm:left-10 px-4 py-2 rounded-full bg-[#E6DCD0]/40 blur-xs flex items-center justify-center">
                  <span className="text-[12px] sm:text-[13px] text-[#9E8D7A] font-serif">황리단길 정원</span>
                </div>
                <div className="absolute bottom-6 right-10 sm:right-16 px-4 py-2 rounded-full bg-[#E6DCD0]/30 blur-xs flex items-center justify-center">
                  <span className="text-[12px] sm:text-[13px] text-[#9E8D7A] font-serif">황남동 고분군</span>
                </div>

                {/* Locator stays centered around absolute point */}
                <div className="absolute top-[52%] left-[34%] z-10 -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="relative flex flex-col items-center">
                    <span className="absolute -top-1 w-6 h-6 rounded-full bg-[#9E8D7A]/40 animate-ping pointer-events-none" />
                    <div className="relative h-4 w-4 rounded-full bg-[#8B7A68] flex items-center justify-center shadow-md ring-2 ring-[#FAF7F2]">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#FAF7F2]" />
                    </div>
                    <div className="mt-2 text-[12px] sm:text-[13px] bg-[#8B7A68] text-[#FAF7F2] font-serif border border-[#FAF7F2]/20 rounded-xs px-2.5 py-1 shadow-sm font-light tracking-wide">
                      온을 (溫乙) Stay
                    </div>
                  </div>
                </div>

                {/* Transit Badges */}
                <div className="absolute top-4 right-4 bg-[#FAF7F2]/95 px-3 py-1.5 rounded-xs text-[12px] font-sans shadow-xs border border-[#E6DCD0]/90 text-[#3F3730]">
                  <span className="text-[#6E7B68] font-semibold">● </span> 경주역에서 택시로 12분 소요
                </div>
                <div className="absolute bottom-4 left-4 bg-[#FAF7F2]/95 px-3 py-1.5 rounded-xs text-[12px] font-sans shadow-xs border border-[#E6DCD0]/90 text-[#3F3730]">
                  <span className="text-[#A47858] font-semibold">● </span> 자차 방문 시 제1공영주차장 주차지원
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* RESERVATION GUIDE SECTION (예약 및 이용 정보 안내 - Guest Centric) */}
      <section id="booking" className="bg-[#FAF7F2] py-24 md:py-32 border-t border-[#E6DCD0]">
        <div className="mx-auto max-w-5xl px-6 md:px-12">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-14 text-center"
          >
            <span className="font-['Cormorant_Garamond',serif] text-[13px] tracking-[0.3em] text-[#9E8D7A] uppercase block mb-3 font-semibold">
              RESERVATION & AMENITIES
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#2C2621]">
              예약 및 이용 안내
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[13px] font-light text-[#5F5449] break-keep">
              <span className="sm:hidden">1일 1팀 독채 대관 혜택 및 이용 가이드</span>
              <span className="hidden sm:inline">하루 한 팀만을 위한 프라이빗 독채 대관 혜택과 정갈한 머무름을 위한 가이드입니다.</span>
            </p>
          </motion.div>

          {/* Interactive Information Board Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Sidebar Navigation (Horizontal scrollable pill tabs on mobile, vertical cards on desktop) */}
            <div className="md:col-span-4">
              {/* Mobile: Horizontal compact tab bar with refined pill design, #8B7A68 active color, and subtle indicator */}
              <div className="md:hidden mb-3">
                <div className="flex overflow-x-auto no-scrollbar gap-1.5 pb-2 px-0.5">
                  {[
                    { id: 'reservation', label: '예약 및 입퇴실' },
                    { id: 'benefits', label: '무상 혜택' },
                    { id: 'etiquette', label: '머무름 수칙' },
                    { id: 'refund', label: '환불 규정' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActivePolicyTab(tab.id as any)}
                      className={`shrink-0 py-2 px-3.5 text-center rounded-full transition-all duration-200 cursor-pointer border text-xs ${
                        activePolicyTab === tab.id
                          ? 'bg-[#8B7A68] border-[#8B7A68] text-[#FAF7F2] shadow-sm font-normal'
                          : 'bg-white/80 border-[#E6DCD0] text-[#5F5449] hover:bg-[#EAE1D5] hover:text-[#2C2621]'
                      }`}
                    >
                      <span className="font-serif tracking-wide whitespace-nowrap">{tab.label}</span>
                    </button>
                  ))}
                </div>
                {/* Refined subtle scroll track for mobile tab bar */}
                <div className="h-[2px] w-full bg-[#E6DCD0]/40 rounded-full overflow-hidden relative mt-0.5">
                  <motion.div
                    className="h-full bg-[#8B7A68] rounded-full"
                    animate={{
                      width: '25%',
                      x: activePolicyTab === 'reservation' ? '0%' : activePolicyTab === 'benefits' ? '100%' : activePolicyTab === 'etiquette' ? '200%' : '300%'
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                </div>
              </div>

              {/* Desktop: Vertical Card List (Maintained exactly as original PC version with subtle click affordance) */}
              <div className="hidden md:flex flex-col gap-2.5">
                {[
                  { id: 'reservation', label: '예약 및 입퇴실 안내', desc: '1일 1팀 독채 대관 · 체크인 16:00' },
                  { id: 'benefits', label: '무상 제공 혜택', desc: '르 라보 어메니티 · 웰컴 티 세트' },
                  { id: 'etiquette', label: '쾌적한 머무름 수칙', desc: '전 구역 금연 · 정적인 쉼' },
                  { id: 'refund', label: '안심 환불 규정', desc: '취소 일자별 환불 기준' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActivePolicyTab(tab.id as any)}
                    className={`group relative p-4 text-left rounded-xs transition-all duration-200 flex items-center justify-between cursor-pointer border ${
                      activePolicyTab === tab.id
                        ? 'bg-[#8B7A68] border-[#8B7A68] text-[#FAF7F2] shadow-sm'
                        : 'bg-[#F3ECE1]/40 border-[#E6DCD0] text-[#3F3730] hover:bg-[#EAE1D5] hover:border-[#D8CCC0]'
                    }`}
                  >
                    <div className="flex flex-col items-start gap-1">
                      <span className="font-['Cormorant_Garamond',serif] text-[15px] font-medium tracking-wide">{tab.label}</span>
                      <span className={`text-[11.5px] ${activePolicyTab === tab.id ? 'text-[#FAF7F2]/75' : 'text-[#9E8D7A]'}`}>
                        {tab.desc}
                      </span>
                    </div>
                    <ChevronRight 
                      className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                        activePolicyTab === tab.id
                          ? 'text-[#FAF7F2] translate-x-0.5'
                          : 'text-[#9E8D7A]/60 group-hover:text-[#2C2621] group-hover:translate-x-1'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content Board */}
            <div className="md:col-span-8 bg-[#F3ECE1]/40 border border-[#E6DCD0] rounded-xs p-6 md:p-8 min-h-[320px] flex flex-col justify-between shadow-xs">
              <AnimatePresence mode="wait">
                
                {/* Tab 1: Reservation */}
                {activePolicyTab === 'reservation' && (
                  <motion.div
                    key="reservation-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4 text-left"
                  >
                    <div className="flex items-center justify-start gap-3 border-b border-[#E6DCD0] pb-3">
                      <CalendarDays className="h-5 w-5 text-[#9E8D7A]" />
                      <h3 className="font-serif text-lg font-normal text-[#2C2621]">입퇴실 및 예약 기본 안내</h3>
                    </div>
                    <ul className="space-y-4 md:space-y-3.5 text-[13px] font-light leading-relaxed text-[#5F5449]">
                      <li className="flex flex-row gap-2.5 items-start text-left p-3 md:p-0 bg-white/40 md:bg-transparent rounded-xs md:rounded-none border border-[#E6DCD0]/40 md:border-none">
                        <span className="text-[#9E8D7A] font-bold inline-block mt-0.5">•</span>
                        <span className="break-keep"><strong className="text-[#2C2621]">1일 1팀 프라이빗 독채 스테이: </strong>온, 을, 안, 결 4개 공간과 한옥 마당 전체를 하루 단 한 팀만을 위해 온전히 제공합니다.</span>
                      </li>
                      <li className="flex flex-row gap-2.5 items-start text-left p-3 md:p-0 bg-white/40 md:bg-transparent rounded-xs md:rounded-none border border-[#E6DCD0]/40 md:border-none">
                        <span className="text-[#9E8D7A] font-bold inline-block mt-0.5">•</span>
                        <span className="break-keep"><strong className="text-[#2C2621]">입실 및 퇴실 시간: </strong>입실은 <strong>오후 4시</strong>, 퇴실은 <strong>오전 11시</strong>입니다.</span>
                      </li>
                      <li className="flex flex-row gap-2.5 items-start text-left p-3 md:p-0 bg-white/40 md:bg-transparent rounded-xs md:rounded-none border border-[#E6DCD0]/40 md:border-none">
                        <span className="text-[#9E8D7A] font-bold inline-block mt-0.5">•</span>
                        <span className="break-keep"><strong className="text-[#2C2621]">기준 인원: </strong>기준 2인 (최대 5인까지 투숙 가능하며 추가 침구가 정갈하게 준비됩니다).</span>
                      </li>
                      <li className="flex flex-row gap-2.5 items-start text-left p-3 md:p-0 bg-white/40 md:bg-transparent rounded-xs md:rounded-none border border-[#E6DCD0]/40 md:border-none">
                        <span className="text-[#9E8D7A] font-bold inline-block mt-0.5">•</span>
                        <span className="break-keep"><strong className="text-[#2C2621]">비대면 스마트 체크인: </strong>당일 오전 입실 안내 메시지와 도어록 비밀번호가 안전하게 발송됩니다.</span>
                      </li>
                    </ul>
                  </motion.div>
                )}

                {/* Tab 2: Benefits */}
                {activePolicyTab === 'benefits' && (
                  <motion.div
                    key="benefits-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4 text-left"
                  >
                    <div className="flex items-center justify-start gap-3 border-b border-[#E6DCD0] pb-3">
                      <Sparkles className="h-5 w-5 text-[#9E8D7A]" />
                      <h3 className="font-serif text-lg font-normal text-[#2C2621]">투숙객 무상 제공 프리미엄 혜택</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-[12.5px] font-light leading-relaxed text-[#5F5449] text-left">
                      <div className="p-4 bg-white/70 rounded-xs border border-[#E6DCD0]/70 flex flex-col items-start gap-1">
                        <strong className="text-[#2C2621] block text-[13px]">르 라보(Le Labo) 어메니티 키트</strong>
                        <span className="break-keep text-[#5F5449]">샴푸, 컨디셔너, 바디워시, 바디로션 4종 프리미엄 키트 제공</span>
                      </div>
                      <div className="p-4 bg-white/70 rounded-xs border border-[#E6DCD0]/70 flex flex-col items-start gap-1">
                        <strong className="text-[#2C2621] block text-[13px]">장인 다기 & 웰컴 티</strong>
                        <span className="break-keep text-[#5F5449]">명인 수제 다기 세트와 프리미엄 우롱·호지차 찻잎 제공</span>
                      </div>
                      <div className="p-4 bg-white/70 rounded-xs border border-[#E6DCD0]/70 flex flex-col items-start gap-1">
                        <strong className="text-[#2C2621] block text-[13px]">편백 바스 솔트 스파 키트</strong>
                        <span className="break-keep text-[#5F5449]">화산석 욕조용 천연 편백 입욕 솔트 및 코튼 가운 완비</span>
                      </div>
                      <div className="p-4 bg-white/70 rounded-xs border border-[#E6DCD0]/70 flex flex-col items-start gap-1">
                        <strong className="text-[#2C2621] block text-[13px]">LP 큐레이션 & 시네빔</strong>
                        <span className="break-keep text-[#5F5449]">30여 종의 엄선 바이닐 레코드 및 천장 넷플릭스 시네빔</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Tab 3: Etiquette */}
                {activePolicyTab === 'etiquette' && (
                  <motion.div
                    key="etiquette-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4 text-left"
                  >
                    <div className="flex items-center justify-start gap-3 border-b border-[#E6DCD0] pb-3">
                      <ShieldCheck className="h-5 w-5 text-[#9E8D7A]" />
                      <h3 className="font-serif text-lg font-normal text-[#2C2621]">온전한 쉼을 위한 머무름 에티켓</h3>
                    </div>
                    <ul className="space-y-4 md:space-y-3 text-[13px] font-light leading-relaxed text-[#5F5449]">
                      <li className="flex flex-row gap-2.5 items-start text-left p-3 md:p-0 bg-white/40 md:bg-transparent rounded-xs md:rounded-none border border-[#E6DCD0]/40 md:border-none">
                        <span className="text-[#9E8D7A] font-bold inline-block mt-0.5">•</span>
                        <span className="break-keep"><strong className="text-[#2C2621]">실내 전 구역 절대 금연: </strong>전통 목조 한옥의 화재 예방 및 쾌적한 공기를 위해 전자담배 포함 금연입니다.</span>
                      </li>
                      <li className="flex flex-row gap-2.5 items-start text-left p-3 md:p-0 bg-white/40 md:bg-transparent rounded-xs md:rounded-none border border-[#E6DCD0]/40 md:border-none">
                        <span className="text-[#9E8D7A] font-bold inline-block mt-0.5">•</span>
                        <span className="break-keep"><strong className="text-[#2C2621]">정적인 밤의 쉼 (매너 타임): </strong>고즈넉한 마을 정취 유지를 위해 밤 10시 이후 야외 마당에서의 고성방가는 삼가 주시기 바랍니다.</span>
                      </li>
                      <li className="flex flex-row gap-2.5 items-start text-left p-3 md:p-0 bg-white/40 md:bg-transparent rounded-xs md:rounded-none border border-[#E6DCD0]/40 md:border-none">
                        <span className="text-[#9E8D7A] font-bold inline-block mt-0.5">•</span>
                        <span className="break-keep"><strong className="text-[#2C2621]">시설 및 공예 비품 배려: </strong>전통 한옥 목재와 명인의 도자기 다기, 바이닐 음향 기기를 다음 분들을 위해 소중히 다루어 주시기 바랍니다.</span>
                      </li>
                    </ul>
                  </motion.div>
                )}

                {/* Tab 4: Refund */}
                {activePolicyTab === 'refund' && (
                  <motion.div
                    key="refund-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4 text-left"
                  >
                    <div className="flex items-center justify-start gap-3 border-b border-[#E6DCD0] pb-3">
                      <HeartHandshake className="h-5 w-5 text-[#9E8D7A]" />
                      <h3 className="font-serif text-lg font-normal text-[#2C2621]">안심 예약 취소 및 환불 기준</h3>
                    </div>
                    <div className="space-y-3 text-[12.5px] font-light text-[#5F5449]">
                      <div className="border border-[#E6DCD0] rounded-xs overflow-hidden bg-white/50">
                        <div className="grid grid-cols-2 border-b border-[#E6DCD0] p-2.5 bg-[#E6DCD0]/30 font-medium text-[#2C2621]">
                          <span>취소 요청 시점</span>
                          <span className="text-right">환불 비율</span>
                        </div>
                        <div className="grid grid-cols-2 border-b border-[#E6DCD0]/30 p-2.5">
                          <span>이용일 10일 전까지</span>
                          <span className="text-right font-medium text-emerald-800">100% 전액 환불</span>
                        </div>
                        <div className="grid grid-cols-2 border-b border-[#E6DCD0]/30 p-2.5">
                          <span>이용일 7일 전까지</span>
                          <span className="text-right">80% 환불</span>
                        </div>
                        <div className="grid grid-cols-2 border-b border-[#E6DCD0]/30 p-2.5">
                          <span>이용일 5일 전까지</span>
                          <span className="text-right">50% 환불</span>
                        </div>
                        <div className="grid grid-cols-2 p-2.5">
                          <span>이용일 3일 전 ~ 당일</span>
                          <span className="text-right text-[#9E8D7A]">환불 불가</span>
                        </div>
                      </div>
                      <p className="text-[11.5px] text-[#9E8D7A] text-left">
                        ※ 천재지변 및 항공/열차 결항 증빙 시에는 전액 환불 정책이 우선 적용됩니다.
                      </p>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>

              {/* Board Bottom Notice */}
              <div className="mt-6 pt-3 border-t border-[#E6DCD0]/60 flex flex-row items-center justify-between gap-2 text-[12px] text-[#9E8D7A] text-left">
                <span className="flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 shrink-0" />
                  예약 확정 시 상세 오시는 길 및 이용 안내서가 모바일로 자동 전달됩니다.
                </span>
              </div>
            </div>

          </div>

          {/* Standalone Centered Real-Time Booking Button with High Visibility & Elegant Craftsmanship */}
          <div className="mt-16 mb-2 text-center flex flex-col items-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleBookingRedirect('온을 한옥 독채 전체')}
              className="group relative inline-flex items-center justify-center gap-2 sm:gap-2.5 py-2.5 sm:py-3 px-6 sm:px-9 bg-[#8B7A68] hover:bg-[#2C2621] text-[#FAF7F2] border border-[#8B7A68] hover:border-[#2C2621] text-[12px] tracking-widest font-normal transition-all duration-300 rounded-none cursor-pointer shadow-md hover:shadow-lg"
            >
              <CalendarDays className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#F3ECE1] group-hover:text-white transition-colors" />
              <span className="font-['Cormorant_Garamond',serif] text-[14px] sm:text-[15px] tracking-[0.16em] font-medium text-[#FAF7F2]">
                실시간 예약 바로가기
              </span>
              <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#F3ECE1] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white" />
            </motion.button>
            <p className="mt-3.5 text-[10px] sm:text-[10.5px] text-[#9E8D7A] font-light tracking-wide">
              * 네이버 예약 / 카카오 채널을 통해 즉시 예약이 가능합니다
            </p>
          </div>

        </div>
      </section>

      {/* FOOTER SECTION (Cleaned up layout without overlapping elements) */}
      <footer className="bg-[#2C2621] text-[#FAF7F2]/80 font-light text-[13px] py-16 border-t border-[#E6DCD0]/20">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          
          <div className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-8 text-center md:text-left">
            
            {/* Brand Story */}
            <div className="md:col-span-2 space-y-3 flex flex-col items-center md:items-start">
              <span className="font-serif text-xl tracking-widest text-[#FAF7F2] block">
                온을 <span className="font-['Cormorant_Garamond',serif] text-sm text-[#9E8D7A] uppercase">STAY ONUL</span>
              </span>
              <p className="text-[12.5px] leading-relaxed text-[#FAF7F2]/60 max-w-sm font-light break-keep">
                어제와 내일 사이에 조용히 쉼표를 두는 곳, 온을.<br/>
                따뜻한 온기와 풍요로운 고요를 담은 경주 황남동의 감성 독채 한옥 스테이입니다.
              </p>
            </div>

            {/* Quick Menu (Hidden on mobile per request, visible on desktop) */}
            <div className="hidden md:flex flex-col items-center md:items-start">
              <h4 className="font-serif text-[12.5px] text-[#9E8D7A] tracking-wider uppercase mb-3 font-medium">
                공간 둘러보기
              </h4>
              <ul className="space-y-2.5 text-[12.5px] text-[#FAF7F2]/70">
                <li><button onClick={() => scrollToSection('about')} className="hover:text-[#FAF7F2] transition-colors cursor-pointer bg-transparent border-none">이야기</button></li>
                <li><button onClick={() => scrollToSection('rooms')} className="hover:text-[#FAF7F2] transition-colors cursor-pointer bg-transparent border-none">머무는 공간</button></li>
                <li><button onClick={() => scrollToSection('experience')} className="hover:text-[#FAF7F2] transition-colors cursor-pointer bg-transparent border-none">온을의 하루</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-[#FAF7F2] transition-colors cursor-pointer bg-transparent border-none">오시는 길</button></li>
                <li><button onClick={() => scrollToSection('booking')} className="hover:text-[#FAF7F2] transition-colors cursor-pointer bg-transparent border-none">예약 및 이용 안내</button></li>
              </ul>
            </div>

            {/* Business Info */}
            <div className="flex flex-col items-center md:items-start">
              <h4 className="font-serif text-[12.5px] text-[#9E8D7A] tracking-wider uppercase mb-3 font-medium">
                안내 및 사업자 정보
              </h4>
              <div className="space-y-1.5 text-[12px] text-[#FAF7F2]/60 leading-relaxed font-light">
                <p>상호: 온을 Stay | 대표: 김온을</p>
                <p>주소: 경북 경주시 황남동 첨성로 45번길 12-8</p>
                <p>연락처: 0507-1349-2680</p>
                <p>이메일: stay.onul@gmail.com</p>
              </div>
            </div>

          </div>

          {/* Clean Bottom Divider & Legal Strip */}
          <div className="mt-12 pt-8 border-t border-[#FAF7F2]/10 flex flex-col md:flex-row justify-between items-center text-[12px] text-[#FAF7F2]/40 gap-4 text-center md:text-left">
            <div className="flex flex-wrap justify-center gap-4">
              <span className="hover:text-[#FAF7F2]/70 cursor-pointer" onClick={() => triggerToast('이용약관 페이지입니다.')}>이용약관</span>
              <span>·</span>
              <span className="hover:text-[#FAF7F2]/70 cursor-pointer" onClick={() => triggerToast('개인정보 처리방침 페이지입니다.')}>개인정보 처리방침</span>
              <span>·</span>
              <span className="hover:text-[#FAF7F2]/70 cursor-pointer" onClick={() => triggerToast('환불 규정 정책입니다.')}>환불규정서</span>
            </div>
            <div>
              © 2026 Stay Onul. All rights reserved.
            </div>
          </div>

        </div>
      </footer>

      {/* REDIRECTING LOADING SCREEN */}
      <AnimatePresence>
        {isRedirecting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/85 backdrop-blur-md text-white px-6 text-center"
          >
            <div className="flex flex-col items-center gap-5 max-w-sm">
              <div className="h-10 w-10 border-3 border-[#9E8D7A] border-t-transparent rounded-full animate-spin" />
              <div className="space-y-2">
                <p className="font-serif text-lg tracking-wide text-[#E6DCD0]">{redirectingRoomName}</p>
                <h3 className="font-serif text-xl font-light">실시간 예약 시스템으로 연결 중입니다</h3>
                <p className="text-[12.5px] text-[#E6DCD0]/70 font-light leading-relaxed pt-1">
                  안전한 예약을 위해 실시간 부킹 채널로 이동하고 있습니다. 잠시만 기다려 주세요.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DETAILED MODAL FOR ROOMS */}
      <AnimatePresence>
        {activeModalRoom && (() => {
          const room = ROOMS_DATA.find(r => r.id === activeModalRoom);
          if (!room) return null;
          const imagesList = room.images || [room.image];
          return (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-xs"
              onClick={() => setActiveModalRoom(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                transition={{ type: 'spring', damping: 28, stiffness: 350 }}
                className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto md:overflow-hidden rounded-xs bg-[#FAF7F2] text-[#2C2621] shadow-2xl border-none flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button 
                  onClick={() => setActiveModalRoom(null)}
                  className="absolute top-3.5 right-3.5 z-30 rounded-full bg-black/50 p-2 text-white hover:bg-black/80 transition-colors cursor-pointer border-none"
                  title="닫기"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* 2-Column Clean Layout with No Content Cutoff */}
                <div className="grid grid-cols-1 md:grid-cols-12">
                  
                  {/* Left Column: Image Slider with Automatic Transition & Dots */}
                  <div className="md:col-span-6 h-60 md:h-full min-h-[340px] relative overflow-hidden bg-black select-none group">
                    <AnimatePresence mode="sync">
                      <motion.img 
                        key={currentImgIndex}
                        src={imagesList[currentImgIndex]} 
                        alt={`${room.title} image ${currentImgIndex + 1}`} 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="absolute inset-0 h-full w-full object-cover animate-natural-motion-slow"
                        referrerPolicy="no-referrer"
                      />
                    </AnimatePresence>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Manual Navigation Controls */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImgIndex(prev => (prev === 0 ? imagesList.length - 1 : prev - 1));
                      }}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 h-8 w-8 bg-black/40 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all cursor-pointer border-none"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImgIndex(prev => (prev === imagesList.length - 1 ? 0 : prev + 1));
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 h-8 w-8 bg-black/40 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all cursor-pointer border-none"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>

                    {/* Image Numbers count label with Cormorant Garamond - 2px larger */}
                    <div className="absolute bottom-3 right-3 bg-black/60 text-[#FAF7F2] text-[13px] px-3 py-1 rounded-xs font-['Cormorant_Garamond',serif] tracking-widest">
                      0{currentImgIndex + 1} / 0{imagesList.length}
                    </div>

                    {/* Image dots indicators */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {imagesList.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImgIndex(idx);
                          }}
                          className={`h-1.5 rounded-full transition-all cursor-pointer border-none ${
                            idx === currentImgIndex ? 'bg-white w-4' : 'bg-white/40 hover:bg-white/70 w-1.5'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Theme Badge */}
                    {/* Clean photo overlay */}
                  </div>

                  {/* Right Column: Customer-Focused Highlights with generous spacing */}
                  <div className="md:col-span-6 p-7 sm:p-9 flex flex-col justify-between bg-[#FAF7F2]">
                    
                    <div className="space-y-4">
                      
                      {/* Room Title */}
                      <div className="border-b border-[#E6DCD0] pb-3">
                        <span className="text-[10px] font-mono tracking-widest text-[#9E8D7A] uppercase block mb-0.5">
                          THEME STUDIO
                        </span>
                        <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#2C2621]">
                          {room.title} – {room.subTitle}
                        </h3>
                      </div>

                      {/* Core Summary */}
                      <p className="text-[13px] leading-relaxed text-[#5F5449] font-light">
                        {room.description}
                      </p>

                      {/* Guest Highlights */}
                      <div className="pt-2">
                        <h4 className="font-serif text-[12px] uppercase tracking-wider text-[#9E8D7A] font-medium mb-3">
                          이 공간에서 누리는 특별한 경험
                        </h4>
                        <ul className="space-y-2.5 text-[12.5px] text-[#2C2621]">
                          {room.guestHighlights.map((highlight, hIdx) => (
                            <li key={hIdx} className="flex items-start gap-2.5 bg-[#F3ECE1]/70 p-3 rounded-xs border border-[#E6DCD0]/50">
                              <span className="text-[#9E8D7A] font-bold text-xs">✦</span>
                              <span className="font-light leading-snug">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Compact Amenities */}
                      <div className="pt-2">
                        <div className="flex flex-wrap gap-2 text-[11.5px] text-[#5F5449]">
                          {room.amenities.map((item, aIdx) => (
                            <span key={aIdx} className="bg-[#FAF7F2] border border-[#E6DCD0] px-3 py-1 rounded-xs font-light">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>

                  </div>

                </div>

              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
}
