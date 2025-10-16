import { Box, Heading, Text, Button, VStack, HStack, Spacer, Divider, CloseButton } from '@chakra-ui/react';

export const Cart = ({ cart, onRemove, onEditInfo }: any) => {
  const cartTotal = cart.reduce((total: number, item: any) => total + (item.price * item.patients.length), 0);

  // This helper function determines if the "Edit" button should be shown
  const needsInfoEdit = (item: any) => {
    // Show if there are multiple patients
    if (item.patients.length > 1) {
      return true;
    }
    // Show for a single patient ONLY if it's not for "Self"
    if (item.patients.length === 1 && item.patients[0].name !== 'Self') {
      return true;
    }
    // Otherwise, hide it
    return false;
  };

  return (
    <Box position="sticky" top="120px" borderWidth="1px" borderRadius="lg" p={6} shadow="sm">
      <Heading size="md" mb={6}>Your Cart</Heading>
      {cart.length === 0 ? (
        <Text color="gray.500">Your cart is currently empty.</Text>
      ) : (
        <VStack align="stretch" spacing={6}>
          {cart.map((item: any) => (
            <VStack key={item.cartId} align="stretch" spacing={3}>
              <HStack>
                <Text fontWeight="semibold">{item.name}</Text>
                <Spacer />
                <Text fontWeight="bold">₹{item.price * item.patients.length}</Text>
                <CloseButton size="sm" onClick={() => onRemove(item.cartId)} />
              </HStack>
              
              {/* Updated text to be more descriptive */}
              <Text fontSize="sm" color="gray.500">
                {item.patients.length === 1 && item.patients[0].name === 'Self'
                  ? 'For: Myself'
                  : `${item.patients.length} patient(s) added`
                }
              </Text>

              {/* Only show the button if it's needed */}
              {needsInfoEdit(item) && (
                <Button variant="link" size="sm" onClick={() => onEditInfo(item)} justifyContent="flex-start">
                  Edit Patient Info
                </Button>
              )}
            </VStack>
          ))}
          <Divider my={4} />
          <HStack>
            <Text fontWeight="bold" fontSize="lg">Total</Text>
            <Spacer />
            <Text fontWeight="bold" fontSize="xl">₹{cartTotal}</Text>
          </HStack>
          <Button colorScheme="green" size="lg" mt={4} isDisabled={cart.length === 0}>
            Proceed to Checkout
          </Button>
        </VStack>
      )}
    </Box>
  );
};