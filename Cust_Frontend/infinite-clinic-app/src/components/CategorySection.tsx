import { Box, Circle, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { FaHeartbeat, FaVial, FaTint, FaCapsules, FaShieldVirus, FaLungs } from 'react-icons/fa';

const testCategories = [
  { name: 'Sugar Fasting', icon: FaTint },
  { name: 'Thyroid Profile', icon: FaLungs },
  { name: 'Lipid Profile Screen', icon: FaHeartbeat },
  { name: 'LFT/KFT', icon: FaShieldVirus },
  { name: 'CBC', icon: FaVial },
  { name: 'Vitamin B12 / D3', icon: FaCapsules },
];

export const CategorySection = () => {
  return (
    <Box>
      <VStack gap={4} textAlign="center" mb={10}>
        <Heading size="xl">Book a Test by Category</Heading>
        <Text fontSize="lg" color="gray.600">
          Choose from our comprehensive panel of lab tests to schedule your appointment quickly and easily.
        </Text>
      </VStack>
      <Flex justify="center" gap={{ base: 6, md: 10 }} wrap="wrap">
        {testCategories.map((category) => (
          <VStack key={category.name} gap={3} cursor="pointer" _hover={{ color: 'blue.500', transform: 'scale(1.05)' }} transition="transform 0.2s">
            <Circle size="100px" bg="blue.50" color="blue.500">
              <category.icon size="40px" />
            </Circle>
            <Text fontWeight="medium" textAlign="center">{category.name}</Text>
          </VStack>
        ))}
      </Flex>
    </Box>
  );
};