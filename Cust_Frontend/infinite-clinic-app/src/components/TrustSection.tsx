import { Box, Button, Container, Flex, Heading, Text, VStack, Link } from '@chakra-ui/react';
import { Link as ScrollLink } from 'react-scroll';

export const TrustSection = () => {
  return (
    <Box
      mt={{ base: 4, md: 8 }}
      borderRadius="xl"
      mx={{ base: 4, md: 8 }}
      position="relative"
      overflow="hidden"
      py={{ base: 10, md: 20 }} // Made this identical to VisualHero for debugging
      bgGradient="radial(circle at 60% 70%, #90caf9 0%, #e3f2fd 65%, white 100%)"
    >
      <Container maxW="container.xl">
        <VStack spacing={6} textAlign="center" position="relative" zIndex={1}>
          <Flex
            align="center"
            justify="center"
            bg="pink.100"
            color="pink.800"
            px={4}
            py={2}
            borderRadius="full"
            fontSize="sm"
            fontWeight="medium"
            mb={4}
          >
            <Box as="span" mr={2}>🌟</Box> We care for your health like family — experience hassle-free testing with us!
            <Link href="#" ml={1} textDecoration="underline" _hover={{ color: 'pink.700' }}>Find us now</Link>
          </Flex>

          <Heading as="h2" size="3xl" maxW="800px">
            Your Neighborhood Lab for Health You Can Trust
          </Heading>

          <Text fontSize="xl" color="gray.600" maxW="600px">
            Accurate tests, fast reports, and personalized care — all under one roof, right here in your city.
          </Text>

          <ScrollLink to="health-plans" smooth={true} duration={500} offset={-80}>
            <Button colorScheme="blue" size="lg" px={8} py={6} fontSize="xl" mt={6}>
              View Health Plans
            </Button>
          </ScrollLink>
        </VStack>
      </Container>
    </Box>
  );
};