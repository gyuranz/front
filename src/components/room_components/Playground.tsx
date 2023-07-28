import React, { useEffect, useState } from "react";

function Playground() {
    const [currentRecognition, setCurrentRecognition] = useState<string>();
    const [STTMessage, setSTTMessage] = useState<string[]>([]);
    useEffect(() => {
        setCurrentRecognition("...");
        setSTTMessage((prev) => [...prev, " "]);
    }, [setSTTMessage, currentRecognition]);
    return (
        <div
            style={{
                width: "100%",
                height: "70vh",
                color: "white",
                // fontWeight: "bold",
                fontSize: "24px",
                backgroundColor: "rgba(0,0,0,0.1)",
                padding: "10px",
                borderRadius: "20px",
            }}
        >
            {STTMessage.map((message, idx) => (
                <p key={idx}>{message}</p>
            ))}
            <p>{currentRecognition}</p>
        </div>
    );
}

export default Playground;
