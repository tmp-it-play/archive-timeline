import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import axios from "axios";
import { Container, Nav, Button, Status, Transcript, Answer } from "./Style";
import "./App.css";

const App = () => {
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [answer, setAnswer] = useState("");
  const URL = "https://api.openai.com/v1/engines/davinci-codex/completions";
  const API_KEY = "your-api-key";

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const handleCommand = async (command) => {
    const responseAnswer = await sendCommandToApi(command);
    if (responseAnswer) {
      setAnswer(responseAnswer);
      speak(responseAnswer);
    }
  };

  const sendCommandToApi = async (command) => {
    try {
      const response = await axios.post(
        URL,
        {
          prompt: command,
          max_tokens: 150,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );
      console.log("API 응답:", response.data);
      return response.data.choices[0].text.trim();
    } catch (error) {
      console.error("API 요청 실패:", error);
      return null;
    }
  };

  const speak = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  useEffect(() => {
    if (transcript) {
      handleCommand(transcript);
    }
  }, [transcript]);

  if (!browserSupportsSpeechRecognition) {
    return <span>음성 인식이 지원되지 않는 브라우저인 것 같습니다...</span>;
  }

  return (
    <Container>
      <Nav>
        <Button onClick={toggleListening}>{listening ? "Stop" : "Start"}</Button>
        <Button onClick={resetTranscript}>Reset</Button>
      </Nav>

      <Status>
        <p>{listening ? "mic on" : "mic off"}</p>
      </Status>

      <Transcript>
        <h3>INPUT: </h3>
        <p>{transcript}</p>
      </Transcript>

      <Answer>
        <h3>OUTPUT: </h3>
        <p>{answer}</p>
      </Answer>
    </Container>
  );
};

export default App;
