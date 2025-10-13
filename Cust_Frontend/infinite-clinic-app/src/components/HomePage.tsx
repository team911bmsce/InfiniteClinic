import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';
import { VisualHero } from './VisualHero';
import { CategorySection } from './CategorySection';

export const HomePage = () => {
  return (
    <>
      <VisualHero />
      <Container maxW="container.lg" py={20}>
        <VStack gap={20} align="stretch">
          <Box id="book-a-test" className="section-box">
            <CategorySection />
          </Box>
          <Box id="health-plans" className="section-box">
            <Heading>Our Health Plans</Heading>
            <Text mt={4}>This is where you can display the health packages.</Text>
          </Box>
        </VStack>
      </Container>
    </>
  );
};
