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
      py={{ base: 10, md: 20 }}
      
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
            <Box as="span" mr={2}>🔥</Box> New! 12 Health Hubs now open across Bengaluru.
            <Link href="#" ml={1} textDecoration="underline" _hover={{ color: 'pink.700' }}>Find yours now</Link>
          </Flex>

          
          <Heading as="h2" size="3xl" maxW="800px">
            Your Journey to Better Health Starts Here
          </Heading>

          
          <Text fontSize="xl" color="gray.600" maxW="600px">
            Discover comprehensive health packages and easy lab test booking tailored for your well-being.
          </Text>

          
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