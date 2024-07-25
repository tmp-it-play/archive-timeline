import React from "react";
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";

const App = () => {
    const {transcript, listening, resetTranscript, browserSupportsSpeechRecognition} = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return <span>음성 인식이 지원되지 않는 브라우저인 것 같습니다...</span>;
    }

    const startListening = () => SpeechRecognition.startListening({continuous: true});
    const stopListening = () => SpeechRecognition.stopListening();

    const handleCommand = (command) => {
        if (command.includes("안녕")) {
            speak("안녕하세요!");
        }
    };

    const speak = (text) => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        synth.speak(utterance);
    };

    return (
        <div>
            <button onClick={startListening}>Start</button>
            <button onClick={stopListening}>Stop</button>
            <button onClick={resetTranscript}>Reset</button>
            <h3>마이크 상태:</h3>
            <p>{listening ? "on" : "off"}</p>
            <h3>들은 문장: </h3>
            <p>{transcript}</p>
            {transcript && handleCommand(transcript)}
            <h3>답변: </h3>
            {}
        </div>
    );
};

export default App;