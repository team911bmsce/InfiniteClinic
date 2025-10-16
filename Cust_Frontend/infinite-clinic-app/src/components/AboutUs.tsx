import { Container, Heading, Text, Button } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

export const AboutUs = () => {
  return (
    <Container maxW="container.lg" py={20}>
      <Heading mb={10} textAlign="center">About Infinite Clinic</Heading>
      <Text fontSize="lg">
        This is the placeholder for the About Us page content. We are dedicated to providing the best diagnostic services with speed and accuracy.
      </Text>
      <Button as={RouterLink} to="/" colorScheme="blue" mt={10}>
        Back to Home
      </Button>
    </Container>
  );
};