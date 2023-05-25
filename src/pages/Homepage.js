import React from 'react';
import { Button, Heading, Box, Center, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {

  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/questionnaire');
  };

  return (

    <Center h="100vh">
      <Box textAlign="center">
        <Heading as="h1" size="xl" mb={3}>
        Welcome to Blueprint Health!
        </Heading>
        <Text fontSize="lg" mb={5}>
          This is a questionnaire to determine your Level-2 Assessments.
        </Text>
        <Text fontSize="sm" mb={19}>
          Created by Andrew Yang
        </Text>
        <Button colorScheme="teal" onClick={handleButtonClick}>
          Go to Questionnaire!
        </Button>
      </Box>
    </Center>
  );
};

export default Homepage;