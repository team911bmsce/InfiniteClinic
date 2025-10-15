import { Box, Flex, Heading, Spacer, Button } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link as ScrollLink } from 'react-scroll';

import { HomePage } from './components/HomePage';
import { Footer } from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

const Header = () => (
  <Flex as="header" p={4} borderBottomWidth="1px" alignItems="center" position="sticky" top={0} bg="white" zIndex={5}>
    <Box id="logo-destination" opacity={0}>
      <Heading size="md">Infinite Clinic</Heading>
    </Box>
    <Spacer />
    <Flex gap={8} fontWeight="medium">
      <ScrollLink to="book-a-test" smooth={true} duration={500} offset={-120} style={{ cursor: 'pointer' }}>Book a test</ScrollLink>
      <ScrollLink to="health-plans" smooth={true} duration={500} offset={-30} style={{ cursor: 'pointer' }}>Health plans</ScrollLink>
      <ScrollLink to="about-us" smooth={true} duration={500} offset={-80} style={{ cursor: 'pointer' }}>About us</ScrollLink>
    </Flex>
    <Spacer />
    <Button colorScheme="blue">Log In</Button>
  </Flex>
);

function App() {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const preloaderLogoRef = useRef<HTMLHeadingElement>(null);
  const loadingBarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const destination = document.getElementById('logo-destination');
    if (!preloaderLogoRef.current || !contentRef.current || !destination || !loadingBarRef.current) return;
    gsap.set(contentRef.current, { autoAlpha: 0 });
    gsap.set(preloaderLogoRef.current, { autoAlpha: 0 });
    const tl = gsap.timeline();
    tl.to(loadingBarRef.current, { duration: 2, width: '100%', ease: 'power3.inOut' })
      .to(preloaderLogoRef.current, { duration: 0.8, autoAlpha: 1 }, "-=0.8").delay(0.5)
      .to(preloaderLogoRef.current, {
        duration: 1.5,
        x: destination.getBoundingClientRect().left - preloaderLogoRef.current.getBoundingClientRect().left,
        y: destination.getBoundingClientRect().top - preloaderLogoRef.current.getBoundingClientRect().top,
        fontSize: '1rem', ease: 'power3.inOut',
      })
      .to(preloaderRef.current, { duration: 0.5, opacity: 0, onComplete: () => preloaderRef.current?.remove() }, "-=0.5")
      .to(contentRef.current, { duration: 1, autoAlpha: 1 }, "-=1.5")
      .to(destination, { duration: 0.5, opacity: 1 }, "-=0.5");
  }, []);

  useEffect(() => {
    gsap.utils.toArray('.section-box').forEach((box: any) => {
      gsap.set(box, { autoAlpha: 1 });
      gsap.from(box, {
        y: 50, opacity: 0, duration: 1,
        scrollTrigger: {
          trigger: box,
          start: "top 80%",
          toggleActions: "play none none none",
        }
      });
    });
  }, []);

  return (
    <>
      <Flex ref={preloaderRef} position="fixed" top="0" left="0" h="100vh" w="100vw" align="center" justify="center" zIndex={10} bg="white">
        <Box>
          <Heading ref={preloaderLogoRef} size="2xl">Infinite Clinic</Heading>
          <Box mt={4} h="4px" w="100%" bg="gray.200">
            <Box ref={loadingBarRef} h="100%" w="0%" bg="blue.500" />
          </Box>
        </Box>
      </Flex>
      
      <Box ref={contentRef} visibility="hidden" display="flex" flexDirection="column" minHeight="100vh">
        <Header />

        <Box as="main" flex="1">
          <HomePage />
        </Box>
        
        <Footer />
      </Box>
    </>
  );
}

export default App;