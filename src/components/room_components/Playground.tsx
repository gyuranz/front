import React, { useEffect, useState } from "react";
import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";

const Dictaphone = () => {
    const [text, setText] = useState([]) as any;
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();
    const onClick = () => {
        SpeechRecognition.startListening({ continuous: true });
    };

    // useEffect(() => {
    //     SpeechRecognition.startListening({ continuous: true });
    //     const twoSecond = setInterval(() => {
    //         setText((prev: string[]) => [...prev, transcript]);
    //         resetTranscript();
    //     }, 2000);
    //     return () => {
    //         // clearInterval()
    //     };
    // }, []);
    // console.log(text);

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    return (
        <div>
            <p>Microphone: {listening ? "on" : "off"}</p>
            <button onClick={onClick}>Start</button>
            <button onClick={SpeechRecognition.stopListening}>Stop</button>
            <button onClick={resetTranscript}>Reset</button>
            <p>{transcript}</p>
        </div>
    );
};
export default Dictaphone;
