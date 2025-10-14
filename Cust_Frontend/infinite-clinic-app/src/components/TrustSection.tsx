import { Box, Button, Container, Flex, Heading, Text, VStack, Link } from '@chakra-ui/react';
import { Link as ScrollLink } from 'react-scroll';

export const TrustSection = () => {
  return (
    // 1. This outer Box now has the same mx, mt, and borderRadius as VisualHero
    <Box
      mt={{ base: 4, md: 8 }}
      borderRadius="xl"
      mx={{ base: 4, md: 8 }}
      position="relative"
      overflow="hidden"
      py={{ base: 10, md: 20 }}
      // 2. Your preferred gradient is applied here
      bgGradient="radial(circle at 60% 70%, #90caf9 0%, #e3f2fd 65%, white 100%)"
    >
      {/* 3. An inner Container now holds the content, just like in VisualHero */}
      <Container maxW="container.xl">
        <VStack spacing={6} textAlign="center" position="relative" zIndex={1}>
          {/* Notification Bar */}
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
            <Box as="span" mr={2}>🔥</Box> New! 12 Health Hubs now open across Bengaluru.
            <Link href="#" ml={1} textDecoration="underline" _hover={{ color: 'pink.700' }}>Find yours now</Link>
          </Flex>

          {/* Main Heading */}
          <Heading as="h2" size="3xl" maxW="800px">
            Your Journey to Better Health Starts Here
          </Heading>

          {/* Subheading */}
          <Text fontSize="xl" color="gray.600" maxW="600px">
            Discover comprehensive health packages and easy lab test booking tailored for your well-being.
          </Text>

          {/* Button: Explore Our Plans */}
          <ScrollLink to="health-plans" smooth={true} duration={500} offset={-80}>
            <Button colorScheme="blue" size="lg" px={8} py={6} fontSize="xl" mt={6}>
              Explore Our Plans
            </Button>
          </ScrollLink>
        </VStack>
      </Container>
    </Box>
  );
};