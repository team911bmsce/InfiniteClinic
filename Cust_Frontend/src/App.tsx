import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import Preloader from './components/ui/Preloader';
import Header from './components/ui/Header';
import Hero from './components/ui/Hero';


function App() {
  const [isLoading, setIsLoading] = useState(true);
  const appRef = useRef<HTMLDivElement>(null);
  const logoTextRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading && logoTextRef.current && appRef.current) {
      const tl = gsap.timeline();
      
      const destination = document.getElementById('logo-destination');
      if (!destination) return;

      const destRect = destination.getBoundingClientRect();
      const logoRect = logoTextRef.current.getBoundingClientRect();
      
      tl.to(logoTextRef.current, {
        duration: 1.5,
        x: destRect.left - logoRect.left,
        y: destRect.top - logoRect.top,
        fontSize: '1.5rem',
        ease: 'power3.inOut',
      })
      .to(".page-content", {
        autoAlpha: 1,
        y: 0, // GSAP will animate the transform 'y' property here
        stagger: 0.2,
        duration: 1,
      }, "-=1.2");
    }
  }, [isLoading]);

  if (isLoading) {
    return <Preloader logoRef={logoTextRef} />;
  }

  return (
    <div ref={appRef} className="bg-white min-h-screen text-gray-800">
      <h1 ref={logoTextRef} className="text-5xl font-bold text-black fixed inset-0 flex items-center justify-center pointer-events-none z-50">
        Infinite Clinic
      </h1>

      {/* The `y` transform is now controlled by GSAP, not the style prop */}
      <div className="page-content invisible -translate-y-5">
        <Header />
      </div>
      <div className="page-content invisible -translate-y-5">
        <Hero />
      </div>
      
      <main className="page-content invisible -translate-y-5 px-8">
        <section id="book-a-test" className="h-screen pt-24">
          <h2 className="text-4xl font-bold">Book a Test</h2>
        </section>
        <section id="health-plans" className="h-screen pt-24">
          <h2 className="text-4xl font-bold">Health Plans</h2>
        </section>
        <section id="about-us" className="h-screen pt-24">
          <h2 className="text-4xl font-bold">About Us</h2>
        </section>
      </main>
    </div>
  );
}

export default App;