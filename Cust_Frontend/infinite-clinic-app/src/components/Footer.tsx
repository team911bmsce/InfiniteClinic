import { Box, Container, SimpleGrid, VStack, Heading, Text, Link, Flex } from '@chakra-ui/react';

export const Footer = () => {
  return (
    <Box bg="gray.900" color="gray.300">
      <Container maxW="container.xl" py={16}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          <VStack align="flex-start" spacing={4}>
            <Heading size="md" color="white">Get Help</Heading>
            <Link href="#">FAQs</Link>
            <Text>📞 +91 9351012745</Text>
            <Text>📩 idcudaipur@gmail.com</Text>
          </VStack>

          <VStack align="flex-start" spacing={4}>
            <Heading size="md" color="white">Explore about us</Heading>
            <Link href="#">Who we are</Link>
          </VStack>
          
          <Box />
        </SimpleGrid>
        <Box mt={16}>
          <Heading size="md" color="white" mb={6}>Our Health Hub</Heading>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacingX={10} spacingY={4}>
            <Text>Udaipur</Text>
          </SimpleGrid>
        </Box>
      </Container>
      <Box borderTopWidth="1px" borderColor="gray.700">
        <Container maxW="container.xl" py={4} display="flex" flexDirection={{ base: 'column', md: 'row' }} justifyContent="space-between" alignItems="center">
          <Text fontSize="sm">© 2025 Infinite Clinic Pvt. Ltd.</Text>
          <Flex gap={6} mt={{ base: 4, md: 0 }}>
            <Link fontSize="sm">Privacy Policy</Link>
            <Link fontSize="sm">Grievance Redressal</Link>
            <Link fontSize="sm">Terms of Use</Link>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};