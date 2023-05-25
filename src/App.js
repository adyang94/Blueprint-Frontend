import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import Questionnaire from './pages/Questionnaire.js';
import Homepage from './pages/Homepage.js';


function App() {
  return (
    <div>
      <ChakraProvider>

        <Router>
          <Routes>
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/questionnaire" element={<Questionnaire />} />
            <Route path='*' element={<Navigate to='/homepage' />} />
          </Routes>
        </Router>

      </ChakraProvider>
    </div>
  );
}

export default App;
