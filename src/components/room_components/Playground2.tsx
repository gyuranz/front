import React, { useCallback } from "react";
import { createSpeechlySpeechRecognition } from "@speechly/speech-recognition-polyfill";
import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";

// const appId = "daein7076@gmail.com";
// const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
// SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);

const Playground = () => {
    const {
        transcript,
        listening,
        browserSupportsSpeechRecognition,
        resetTranscript,
    } = useSpeechRecognition();
    const startListening = () =>
        SpeechRecognition.startListening({ continuous: true });

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    const onMouseUp = () => {
        console.log(transcript);
        SpeechRecognition.stopListening();
        resetTranscript();
    };

    return (
        <div>
            <p>Microphone: {listening ? "on" : "off"}</p>
            <button
                onTouchStart={startListening}
                onMouseDown={startListening}
                onTouchEnd={SpeechRecognition.stopListening}
                onMouseUp={onMouseUp}
            >
                Hold to talk
            </button>
            <p>{transcript}</p>
        </div>
    );
};
export default Playground;
