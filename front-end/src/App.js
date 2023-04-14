import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';



const App = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    fetch('http://localhost:8080/questions')
      .then((response) => response.json())
      .then((data) => setQuestions(data));
  }, []);

  const handleQuestionChange = (event) => {
    setSelectedQuestion(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setAnswer('');
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify({ question: selectedQuestion }));
    }
  };

  useEffect(() => {
    socketRef.current = new WebSocket('ws://localhost:8080');
    socketRef.current.onopen = () => {
      console.log('Connected to server');
    };
    socketRef.current.onmessage = (event) => {
      setAnswer((prevAnswer) => prevAnswer + event.data + ' ');
    };
    return () => {
      socketRef.current.close();
    };
  }, []);

  return (

    <div className="App">
      <h1>Question Answering System Like ChatGPT</h1>
      <Box sx={{ minWidth: 100 }}>
        <FormControl sx={{ m: 1, minWidth: 1200 }} size="small">
          <InputLabel id="demo-select-small">Select a question:</InputLabel>
          <Select
            labelId="question"
            id="question"
            value={selectedQuestion}
            label="Select a question:"
            onChange={handleQuestionChange}
          >
            <MenuItem value="">
              <em>--Please choose a question--</em>
            </MenuItem>
            {questions.map((question) => (
              <MenuItem key={question.id} value={question.question}>
                {question.question}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <br />
        <Button onClick={handleFormSubmit} variant="contained">Submit</Button>
      </Box>
      <h4>Answer:</h4>
      <Grid container>
        <Box
          sx={{
            boxShadow: 10,
            width: '100%',
            height: '100%',
            color: (theme) =>
              theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
            p: 5,
            m: 3,
            borderRadius: 2,
            textAlign: 'center',
            fontSize: '0.875rem',
            fontWeight: '700',
            border: '1px solid blue',
            bgcolor: 'blue.100',
          }}
        >
          {answer}
        </Box>
      </Grid>
    </div>
  );
};

export default App;

