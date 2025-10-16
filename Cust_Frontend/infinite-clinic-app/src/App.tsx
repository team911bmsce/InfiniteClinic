import { Box, Flex, Heading, Button, Link as ChakraLink, VStack} from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Link as ScrollLink } from 'react-scroll';
import { Routes, Route, Link as RouterLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { HomePage } from './components/HomePage';
import { Footer } from './components/Footer';
import { FaqPage } from './components/FaqPage';
import { AboutUs } from './components/AboutUs';


const Header = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <Flex as="header" p={4} borderBottomWidth="1px" alignItems="center" position="sticky" top={0} bg="white" zIndex={5} justifyContent="space-between">
      <Heading size="lg" id="logo-destination">
        <ChakraLink as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
          Infinite Clinic
        </ChakraLink>
      </Heading>

      <Flex alignItems="center" gap={8}>
        <Flex gap={6} fontWeight="medium" fontSize="md">
          {/* If on the homepage, show scroll links */}
          {path === '/' ? (
            <>
              <ScrollLink to="book-a-test" smooth={true} duration={500} offset={-150} style={{ cursor: 'pointer' }}>Book a test</ScrollLink>
              <ScrollLink to="health-plans" smooth={true} duration={500} offset={-30} style={{ cursor: 'pointer' }}>Health plans</ScrollLink>
              <ScrollLink to="about-us" smooth={true} duration={500} offset={-150} style={{ cursor: 'pointer' }}>About us</ScrollLink>
            </>
          ) : (
            // If on any other page, show a link to Home
            <ChakraLink as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>Home</ChakraLink>
          )}

          {/* If NOT on the FAQ page, show a link to it */}
          {path !== '/faq' && (
            <ChakraLink as={RouterLink} to="/faq" _hover={{ textDecoration: 'none' }}>
              FAQs
            </ChakraLink>
          )}
          
          {/* If you ARE on the FAQ page, show a link to "About us" instead */}
          {path === '/faq' && (
            <ChakraLink as={RouterLink} to="/about-us" _hover={{ textDecoration: 'none' }}>
              About us
            </ChakraLink>
          )}
        </Flex>
        <Button colorScheme="blue" size="md">Log In</Button>
      </Flex>
    </Flex>
  );
};

const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <Box as="main" flex="1">{children}</Box>
      <Footer />
    </Box>
  </motion.div>
);

function App() {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const preloaderLogoRef = useRef<HTMLHeadingElement>(null);
  const loadingBarRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const animationTimeout = setTimeout(() => {
      const destination = document.getElementById('logo-destination');
      if (!preloaderLogoRef.current || !destination || !loadingBarRef.current) return;
      
      gsap.set(preloaderLogoRef.current, { autoAlpha: 0 }); 
      
      const tl = gsap.timeline();
      
      tl
        .to(loadingBarRef.current, { duration: 1.5, width: '100%', ease: 'power2.inOut' })
        .to(preloaderLogoRef.current, { duration: 0.8, autoAlpha: 1 }, "-=0.8")
        .to(preloaderLogoRef.current, {
          duration: 1.5,
          x: destination.getBoundingClientRect().left - preloaderLogoRef.current.getBoundingClientRect().left,
          y: destination.getBoundingClientRect().top - preloaderLogoRef.current.getBoundingClientRect().top,
          fontSize: '1rem', 
          ease: 'power3.inOut',
        }, "+=0.2")
        .to(preloaderRef.current, { 
            duration: 0.8, 
            opacity: 0, 
            onComplete: () => preloaderRef.current?.remove() 
        }, "-=1.2");
    }, 100); 

    return () => clearTimeout(animationTimeout);
  }, []);

  return (
    <>
      <Flex ref={preloaderRef} position="fixed" top="0" left="0" h="100vh" w="100vw" align="center" justify="center" zIndex={100} bg="white">
        <VStack spacing={3}>
            <Heading ref={preloaderLogoRef} size="2xl">
                Infinite Clinic
            </Heading>
            <Box h="4px" w="100%" bg="gray.200" borderRadius="full">
                <Box ref={loadingBarRef} h="100%" w="0%" bg="blue.500" borderRadius="full" />
            </Box>
        </VStack>
      </Flex>
      
      <Box>
        <AnimatePresence 
          mode="wait" 
          onExitComplete={() => window.scrollTo(0, 0)}
        >
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
            <Route path="/faq" element={<MainLayout><FaqPage /></MainLayout>} />
            {/* Added the route for the new About Us page */}
            <Route path="/about-us" element={<MainLayout><AboutUs /></MainLayout>} />
          </Routes>
        </AnimatePresence>
      </Box>
    </>
  );
}

export default App;

