
import React, { useState, useEffect } from 'react';
import { Box, Text, Button, VStack, Progress, Spinner, Flex } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Question from '../components/Question';
import { retrieveQuestions, submitAnswersToApi } from '../helpers/helpers';

// let sampleQuestions = require('../sampleQuestions.json');  // TODO: TEST MULTIPLE SECTIONS

const Questionnaire = () => {
  const [questionsLength, setQuestionsLength] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);  // there can be multiple sections of questions so we will need to track the section index.
  const [sectionResponses, setSectionResponses] = useState([]);
  const [allResponses, setAllResponses] = useState([]);
  const [apiResponse, setApiResponse] = useState([]);
  const [data, setData] = useState({});
  const [progress, setProgress] = useState(0);

  const navigate = useNavigate();

  const handleReturnHomeButton = () => {
    navigate('/home');
  };

  // Fetch questions from API at the beginning of page load
  useEffect(() => {
    const questionsPromise = retrieveQuestions();

    questionsPromise.then((data) => {
      // data = sampleQuestions; // TODO: TEST MULTIPLE SECTIONS

      setData(data);

      if (data?.content?.sections.length > 0) {
        let total = 0;
        data.content.sections.forEach((section) => {
          total += section.questions.length;
        });

        setQuestionsLength(total);
      }
    })
      .catch((error) => console.error('Error fetching questions:', error));
  }, []);

  useEffect(() => {
    const storeResponses = () => {
      setAllResponses((prev) => {
        if (prev.length === 0) {
          return [sectionResponses];
        }
        return [...prev, sectionResponses];
      });
      setSectionResponses([]);
    }

    if (currentQuestion === data?.content?.sections[currentSection]?.questions?.length) {
      storeResponses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion]);

  const submitResponse = () => {
    let promises = [];

    allResponses.forEach((response) => {
      let promise = submitAnswersToApi(response);
      promises.push(promise);
    });

    Promise.allSettled(promises).then((results) => {
      let ans = [];
      results.forEach((result) => {
        ans.push(result.value);
      })
      setApiResponse(ans);
    })
  };

  const handleNextQuestion = (selOption) => {
    if (selOption !== '') {
      setSectionResponses((responses) => {
        return [...responses, { 'value': selOption, 'question_id': data.content.sections[currentSection].questions[currentQuestion].question_id }];
      })
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);

      setProgress((count) => ++count);
    }
  };

  const determineColor = (progress) => {
    if (progress !== 100) {
      return 'blue';
    } else {
      return 'green';
    }
  };
  const color = determineColor(progress);

  const handleNextSection = () => {
    setCurrentSection((prevSection) => prevSection + 1);
    setCurrentQuestion(0);
  };

  const renderQuestion = () => {
    const question = data.content.sections[currentSection].questions[currentQuestion];

    return (
      <Box>
        <Question
          options={data.content.sections[currentSection].answers}
          handleNextQuestion={handleNextQuestion}
          displayName={data.content.display_name}
          sectionTitle={data.content.sections[currentSection].title}
          question={question}
        />
      </Box>
    );
  };

  return (
    <Box maxW="500px" mx="auto" p={4}>
      <Flex pb={4}>
        <Progress hasStripe value={progress / questionsLength * 100} size="xl" flex="1" colorScheme={color} />
        <Text fontSize="m" pl={3}>{progress} out of {questionsLength}</Text>
      </Flex>

      {(data.content?.display_name && data.content?.sections[currentSection]?.title && data.content.sections[currentSection]?.questions.length > 0) ? (
        currentQuestion < Object.entries(data.content.sections[currentSection].questions).length ? (
          renderQuestion()
        ) : (
          <VStack pr={6}>
            <Text fontSize="xl" fontWeight="bold">
              Questionnaire completed!
            </Text>
            <Flex>
              {currentSection === data.content?.sections?.length - 1 ? (
                <Button m={4} onClick={submitResponse}>
                  Submit
                </Button>
              ) : (
                <Button m={4} onClick={handleNextSection}>
                  Next Section
                </Button>
              )}
              <Button m={4} colorScheme="teal" onClick={handleReturnHomeButton}>
                Return home
              </Button>
            </Flex>
            {apiResponse.length && (
              <Box>
                <VStack mt={5}>
                  <Text>
                    Here are your results by sections:
                  </Text>
                  <VStack>
                    {
                      apiResponse.map((resp, i) => {
                        return (
                          <Text>
                            Section {i+1}: {resp?.results.join(', ') ||
                              "You have no level-2 assessments to be made."}
                          </Text>
                        )
                      })
                    }
                  </VStack>
                  <Text>
                    Thanks for taking the test!
                  </Text>

                </VStack>
              </Box>
            )}
          </VStack>
        )
      ) : (
        <Box>
          <Spinner color='blue.300' />
          <Text fontSize="xl" fontWeight="bold">
            Loading questions...
          </Text>
        </Box>

      )}
    </Box>
  );
};

export default Questionnaire;
