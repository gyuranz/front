import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const Quiz = () => {
    const [myStream, setMyStream] = useState(null);
    const [muted, setMuted] = useState(false);
    const [cameraOff, setCameraOff] = useState(false);
    const [roomName, setRoomName] = useState("");
    const myFaceRef = useRef<HTMLVideoElement>(null);
    const myPeerConnectionRef = useRef(null);
    const myDataChannelRef = useRef(null);
    const socket = useRef(null);

    useEffect(() => {
        socket.current.on("welcome", handleWelcome);
        socket.current.on("offer", handleOffer);
        socket.current.on("answer", handleAnswer);
        socket.current.on("ice", handleIce);
        getMedia();

        return () => {
            if (myPeerConnectionRef.current) {
                myPeerConnectionRef.current.close();
            }
        };
    }, []);

    const getMedia = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia();
            setMyStream(stream);
            myFaceRef.current.srcObject = stream;
        } catch (e) {
            console.log(e);
        }
    };

    const handleMuteClick = () => {
        myStream
            .getAudioTracks()
            .forEach((track) => (track.enabled = !track.enabled));
        setMuted(!muted);
    };

    const handleCameraClick = () => {
        myStream
            .getVideoTracks()
            .forEach((track) => (track.enabled = !track.enabled));
        setCameraOff(!cameraOff);
    };

    const handleWelcome = async () => {
        myDataChannelRef.current =
            myPeerConnectionRef.current.createDataChannel("chat");
        myDataChannelRef.current.addEventListener("message", (event) =>
            console.log(event.data)
        );
        console.log("made data channel");

        const offer = await myPeerConnectionRef.current.createOffer();
        myPeerConnectionRef.current.setLocalDescription(offer);
        console.log("sent the offer");

        socket.current.emit("offer", offer, roomName);
    };

    const handleOffer = async (offer) => {
        myPeerConnectionRef.current.addEventListener("datachannel", (event) => {
            myDataChannelRef.current = event.channel;
            myDataChannelRef.current.addEventListener("message", (event) =>
                console.log(event.data)
            );
        });

        console.log("received the offer");
        myPeerConnectionRef.current.setRemoteDescription(offer);
        const answer = await myPeerConnectionRef.current.createAnswer();
        myPeerConnectionRef.current.setLocalDescription(answer);
        socket.current.emit("answer", answer, roomName);
        console.log("sent the answer");
    };

    const handleAnswer = (answer) => {
        console.log("received the answer");
        myPeerConnectionRef.current.setRemoteDescription(answer);
    };

    const handleIce = (ice) => {
        console.log("received candidate");
        myPeerConnectionRef.current.addIceCandidate(ice);
    };

    const handleWelcomeSubmit = (event) => {
        event.preventDefault();
        initCall();
        socket.current.emit("join_room", roomName);
    };

    const initCall = async () => {
        await getMedia();
        makeConnection();
        setRoomName("");
    };

    const handleAddStream = (event) => {
        const peerFace = document.getElementById(
            "peerFace"
        ) as HTMLVideoElement;
        peerFace.srcObject = event.stream;
    };

    const makeConnection = () => {
        myPeerConnectionRef.current = new RTCPeerConnection({
            iceServers: [
                {
                    urls: [
                        "stun:stun.l.google.com:19302",
                        "stun:stun1.l.google.com:19302",
                        "stun:stun2.l.google.com:19302",
                        "stun:stun3.l.google.com:19302",
                        "stun:stun4.l.google.com:19302",
                    ],
                },
            ],
        });

        myPeerConnectionRef.current.addEventListener("icecandidate", handleIce);
        myPeerConnectionRef.current.addEventListener(
            "addstream",
            handleAddStream
        );

        myStream
            .getTracks()
            .forEach((track) =>
                myPeerConnectionRef.current.addTrack(track, myStream)
            );
    };

    return (
        <div>
            <video
                id="myFace"
                ref={myFaceRef}
                autoPlay
                muted
                playsInline
            ></video>
            <video id="peerFace" autoPlay playsInline></video>

            <button onClick={handleMuteClick}>
                {muted ? "Unmute" : "Mute"}
            </button>
            <button onClick={handleCameraClick}>
                {cameraOff ? "Turn Camera Off" : "Turn Camera On"}
            </button>

            <form onSubmit={handleWelcomeSubmit}>
                <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Enter Room Name"
                />
                <button type="submit">Join Room</button>
            </form>
        </div>
    );
};

export default Quiz;
