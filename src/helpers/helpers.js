import axios from "axios";

const fetchQuestionUrl = 'https://blueprint-exam.azurewebsites.net/fetch-questions';
const submitAnswersUrl = 'https://blueprint-exam.azurewebsites.net/score-assessments';

async function retrieveQuestions() {
    try {
        const response = await axios.get(`${fetchQuestionUrl}`, {
            headers: {
                'authorization': `${process.env.REACT_APP_BACKEND_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        return response?.data;
    } catch (error) {
        throw new Error('Error retrieving data.', { cause: error });
    }
}

async function submitAnswersToApi(answerSet) {
    try {
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${submitAnswersUrl}`,
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${process.env.REACT_APP_BACKEND_API_KEY}`
            },
            data: JSON.stringify({ 'answers': answerSet })
        };

        const response = await axios.request(config)

        
        return response.data;

    } catch (error) {
        throw new Error('Error retrieving answers.', { cause: error });
    }
}


export { retrieveQuestions, submitAnswersToApi };