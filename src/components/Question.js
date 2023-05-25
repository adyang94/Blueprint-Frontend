import React, { useState } from 'react';
import { Box, Text, Radio, RadioGroup, Button, VStack } from '@chakra-ui/react';

function Question({displayName, sectionTitle, question, options, handleNextQuestion}) {

    const [selectedOption, setSelectedOption] = useState('');

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    const handleNext =() => {
        handleNextQuestion(selectedOption);
        setSelectedOption('');
    }

    return (
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            {displayName}
          </Text>
          <Text fontSize="xl" fontWeight="bold" mb={4} borderBottom="1px solid black">
            {sectionTitle}
          </Text>
  
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            {question.title}
          </Text>
          <RadioGroup value={selectedOption} onChange={handleOptionChange}>
            <VStack align="start" spacing={3}>
              {options.map((option) => (
                <Radio key={option.title} value={`${option.value}`}>
                  {option.title}
                </Radio>
              ))}
            </VStack>
          </RadioGroup>
          <Button mt={4} onClick={handleNext}>
            Next
          </Button>
        </Box>
      );
}

export default Question;