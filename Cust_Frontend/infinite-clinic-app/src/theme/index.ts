import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: `'Poppins', sans-serif`,
    body: `'Roboto', sans-serif`,
  },
  styles: {
    global: {
      body: {
        fontSize: '1.1rem',
        color: 'gray.700', 
      },
    },
  },
  components: {
    Heading: {
      
      sizes: {
        '4xl': { fontSize: ['4.5rem', null, '6rem'], lineHeight: '1.1' },
        '3xl': { fontSize: ['3rem', null, '3.75rem'], lineHeight: '1.2' },
      },
    },
  },
});

export default theme;