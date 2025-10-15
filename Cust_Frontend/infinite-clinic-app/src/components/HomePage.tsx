import { Box, VStack } from '@chakra-ui/react'; // Import VStack here
import { VisualHero } from './VisualHero';
import { CategorySection } from './CategorySection';
import { TrustSection } from './TrustSection';
import { PricingSection } from './PricingSection';

export const HomePage = () => {
  const gridPatternStyle = {
    backgroundImage:
      'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
    backgroundSize: '40px 40px',
    
    maskImage: 'linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)',
    WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)',
  };

  return (
    <>
      <VisualHero />
      <Box sx={gridPatternStyle}>
        <VStack spacing={10} align="stretch"> 
          <TrustSection />

          <Box id="book-a-test" className="section-box">
            <CategorySection />
          </Box>

          <Box id="health-plans" className="section-box">
            <PricingSection />
          </Box>
        </VStack>
      </Box>
    </>
  );
};