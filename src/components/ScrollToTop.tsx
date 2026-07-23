import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const { pathname, search } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const topOffset = pathname === '/search' ? 90 : 0;
    
    // Immediate reset to top on route change
    window.scrollTo({ top: topOffset, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = topOffset;
    document.body.scrollTop = topOffset;

    const timer = setTimeout(() => {
      window.scrollTo({ top: topOffset, left: 0, behavior: 'instant' });
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname, search]);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 250) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    toggleVisibility();

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`fixed bottom-6 right-6 z-50 p-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform flex items-center justify-center cursor-pointer ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-90 pointer-events-none'
      }`}
    >
      <ArrowUp className="w-6 h-6 stroke-[2.5]" />
    </button>
  );
}

