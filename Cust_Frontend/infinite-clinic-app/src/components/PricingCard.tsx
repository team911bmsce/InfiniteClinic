import { VStack, Heading, Text, List, ListItem, ListIcon, Button } from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';

export const PricingCard = ({ plan, isActive, onMouseEnter, onMouseLeave, id }: any) => {
  return (
    <VStack
      id={id}
      p={8}
      bg={isActive ? 'blue.50' : 'gray.50'}
      borderWidth="2px"
      borderColor={isActive ? 'blue.500' : 'gray.200'}
      borderRadius="xl"
      spacing={6}
      align="stretch"
      width="100%"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="pricing-card"
      flex="1" 
    >
      <Heading size="lg">{plan.name}</Heading>
      <Text fontSize="4xl" fontWeight="bold">
        ₹{plan.price}
      </Text>
      <List spacing={3}>
        {plan.features.map((feature: string, index: number) => (
          <ListItem key={index}>
            <ListIcon as={FaCheckCircle} color="green.500" />
            {feature}
          </ListItem>
        ))}
      </List>
      <Button colorScheme={isActive ? 'blue' : 'gray'} mt="auto" pt={6} pb={6}>
        Book Now
      </Button>
    </VStack>
  );
};