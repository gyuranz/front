import { io } from "socket.io-client";
import queryString from "query-string";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { AuthLogin, MicCondition, VolumeContidion } from "../../atoms";
import { motion } from "framer-motion";
import { styled } from "styled-components";
import {
    Tab,
    Tabs,
    VerticalLine,
    buttonStyle,
    containerStyle,
    containerVariants,
    leftSideBoxVariants,
    mainBgColor,
    reverseColor,
    reverseTextColor,
} from "../Styles";
import { useNavigate, Link, useParams, Routes, Route } from "react-router-dom";
import {
    faMicrophone,
    faMicrophoneSlash,
    faVolumeHigh,
    faVolumeLow,
    faVolumeXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Playground from "./Playground";
import Question from "./Question";
import Summary from "./Summary";
import Quiz from "./Quiz";
import { useForm } from "react-hook-form";

const Container = styled.div`
    /* background-color: rgba(0, 0, 0, 0.2); */
    height: 80vh;
    padding: 10px;
    //! MVP 끝나고 overflow 삭제
    /* overflow: auto; */
`;

const InputTextStyle = styled.div`
    display: grid;
    grid-template-columns: 4fr 1fr;
`;

const TextInput = styled(motion.input)`
    ${buttonStyle}
    width: 23.5vw;
    height: 6vh;
    border-radius: 0;
    font-size: 1.2rem;
`;
const IOButton = styled.button`
    border: none;
    background-color: transparent;
    position: absolute;
    top: -33px;
    padding: 10px;
    cursor: pointer;
`;
const SideOpenToolBox = styled(motion.div)`
    position: relative;
`;

const TextInputButton = styled(motion.button)`
    ${buttonStyle}
    ${mainBgColor}
    border-radius: 0 0 30px 0;
    font-size: 1.2rem;
    /* line-height: 1.2rem; */
    width: 5vw;
    height: 6vh;
    cursor: pointer;
    color: white;
`;

const ChatArea = styled.div`
    width: 100%;
    height: 80vh;
    margin-top: 4vh;
    overflow-y: auto;
`;

const ChattingBox = styled(motion.div)`
    margin: 10px 20px;
`;

const Message = styled.div`
    margin-bottom: 0.5rem;
    background: rgba(0, 0, 0, 0.1);
    color: white;
    /* max-width: 100%; */
    padding: 5px;
    border-radius: 0.5rem;
    word-break: break-all;
`;

interface ITextForm {
    text: string;
    text_time: number;
}

interface WordRecognized {
    isFinal: boolean;
    text: string;
}

const BaseContainer = styled(motion.div)`
    ${containerStyle}
    width: 95vw;
    height: 90vh;
    display: grid;
    grid-template-columns: 3.5fr 1fr 1.5fr;
`;

const MainContainer = styled.div`
    ${containerStyle}
    background-color: transparent;
    box-shadow: none;
    width: 66.5vw;
    height: 90vh;
    /* position: relative; */
    /* display: flex; */
    /* align-items: flex-start; */
    /* justify-content: baseline; */
    display: block;
    border-radius: 30px 0 0 30px;
`;

const RoomList = styled(motion.div)`
    ${containerStyle}
    background-color: transparent;
    box-shadow: none;
    width: 28.5vw;
    height: 90vh;
    display: block;
    border-radius: 0 30px 30px 0;
`;

const RoomOutButton = styled(motion.div)`
    ${buttonStyle}
    ${reverseColor}
    color:white;
    padding: 5px;
    border-radius: 3px;
    font-size: 1rem;
    z-index: 999;
    position: absolute;
    top: 5vh;
    right: 2.5vw;
    cursor: pointer;
    &:hover {
        ${reverseTextColor}
        background-color: white;
    }
    transition: all 0.3s ease-in-out;
`;
//! 소켓 api 꼭 같이 수정해주기
// const socket = io(`http://15.164.100.230:8080/room`);
// const socket = io(`${process.env.REACT_APP_BACKEND_URL}/room`, {
//     query: { user: JSON.stringify(storedData.userNickname) },
// });
let socket;
const current_room_id = window.location.pathname.split("/")[2];
const storedData = JSON.parse(localStorage.getItem("userData") as string);
socket = io(`${process.env.REACT_APP_BACKEND_URL}/room`, {
    query: { user: JSON.stringify(storedData.userNickname) },
});
//! STT
const sampleRate = 16000;

const getMediaStream = () =>
    navigator.mediaDevices.getUserMedia({
        audio: {
            deviceId: "default",
            sampleRate: sampleRate,
            sampleSize: 16,
            channelCount: 1,
        },
        video: false,
    });

//! STT
function Room() {
    const [mic, setMic] = useRecoilState(MicCondition);
    const [volume, setVolume] = useRecoilState(VolumeContidion);

    const [myVideoStream, setMyVideoStream] = useState<any>();
    const myFaceRef = useRef(null);
    const peerFaceRef = useRef(null);

    // const [myPeerConnection, setMyPeerConnection] = useState(null);

    const myPeerConnectionRef = useRef(null);

    async function initCall() {
        try {
            const myStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true,
            });
            myFaceRef.current.srcObject = myStream;
            setMyVideoStream((prev) => (prev = myStream));
        } catch (e) {
            console.log(e);
        }
    }
    // useEffect(() => {
    //     console.log(myVideoStream, "d");
    // }, [myVideoStream]);

    // async function startVideo() {
    //     try {
    //         await initCall();
    //         makeConnection();
    //     } catch (e) {
    //         console.log(e);
    //     }
    // }

    // function handleIce(data) {
    //     console.log("send ice candidate");
    //     socket.emit("ice", { ice: data.candidate, roomName: current_room_id });
    //     console.log(data);
    // }
    // function handleAddStream(data) {
    //     console.log("got an event from my peer");
    //     console.log(data.stream);
    //     console.log(myVideoStream);
    // }
    function makeConnection() {
        myPeerConnectionRef.current = new RTCPeerConnection();
        myVideoStream
            ?.getTracks()
            .forEach((track) =>
                myPeerConnectionRef.current.addTrack(track, myVideoStream)
            );
        console.log(myPeerConnectionRef.current);
        //! icecandidate 연결되는지 확인 안됨
        myPeerConnectionRef.current.addEventListener("icecandidate", (data) => {
            if (data.candidate) {
                console.log("ICE candidate generated:", data.candidate);
                socket.emit("ice", {
                    ice: data.candidate,
                    roomName: current_room_id,
                });
            }
        });
        myPeerConnectionRef.current.addEventListener("addstream", (data) => {
            if (data.stream) {
                console.log("got an event from my peer");
                console.log(data.stream);
                console.log(myVideoStream);
            }
        });
        // myPeerConnectionRef.current.onicecandidate = handleIce;
        // myPeerConnectionRef.current.onaddstream = handleAddStream;
        console.log(myPeerConnectionRef);
    }

    // useEffect(() => {
    //     myPeerConnectionRef?.current?.addEventListener(
    //         "icecandidate",
    //         handleIce
    //     );
    //     myPeerConnectionRef?.current?.addEventListener(
    //         "addstream",
    //         handleAddStream
    //     );
    // }, [myPeerConnectionRef]);

    useEffect(() => {
        makeConnection();
        //! join-room 은 기존의 브라우저(a)에서 실행,
        socket.on("join-room", async (welcome) => {
            console.log(`${storedData.userId}님이 입장하셨습니다.${welcome}`);

            const offer = await myPeerConnectionRef.current.createOffer();
            myPeerConnectionRef.current.setLocalDescription(offer);
            console.log("send offer");
            socket.emit("offer", { offer, roomName: current_room_id });
        });
        //!  offer는 뒤에 들어온 브라우저(b)에서 실행
        socket.on("offer", async ({ offer }) => {
            console.log("recieve offer");

            await myPeerConnectionRef.current.setRemoteDescription(offer);
            // console.log(myPeerConnectionRef);
            const answer = await myPeerConnectionRef.current.createAnswer();
            // console.log(answer);
            myPeerConnectionRef.current.setLocalDescription(answer);
            // console.log(myPeerConnectionRef);
            console.log("send answer");
            socket.emit("answer", { answer, roomName: current_room_id });
            // console.log("a");
        });
        //! a 브라우저에서 실행 => 두 브라우져는 모두 local과 remote를 가지게 됨
        socket.on("answer", async ({ answer }) => {
            console.log("recieve answer");
            await myPeerConnectionRef.current.setRemoteDescription(answer);
            console.log(myPeerConnectionRef);
        });
        socket.on("ice", ({ ice }) => {
            console.log("recieve candidate");
            myPeerConnectionRef.current.addIceCandidate(ice);
        });
    }, []);

    //! 비디오 끄고 켜기
    const volumeControl = () => {
        // console.log(myVideoStream.getVideoTracks());
        setVolume((prev) => !prev);
        myVideoStream
            .getVideoTracks()
            .forEach((track) => (track.enabled = !track.enabled));
    };
    //! 마이크 음소거
    const micControl = () => {
        myVideoStream
            .getAudioTracks()
            .forEach((track) => (track.enabled = !track.enabled));
        setMic((prev) => !prev);
    };
    //! audio 끝!
    useEffect(() => {
        initCall();
        // console.log(current_room_id);
        // startVideo();

        socket.emit("join-room", current_room_id);
        // return () => {
        //     socket.emit("disconnect");
        //     socket.off();
        // };
    }, [`${window.location.host}`]);
    // let socket = io(`${process.env.REACT_APP_BACKEND_URL}/room`);
    //! message event listener
    useEffect(() => {
        // socket = io(`${process.env.REACT_APP_BACKEND_URL}/room`);
        const messageHandler = (chat) => {
            setChats((prevChats) => [...prevChats, chat]);
        };
        socket.on("message", messageHandler);

        return () => {
            socket.off("message", messageHandler);
        };
    }, []);
    // console.log(chats);
    // ! STT
    const [connection, setConnection] = useState<any>();
    const [currentRecognition, setCurrentRecognition] = useState<string>();
    const [recognitionHistory, setRecognitionHistory] = useState<string[]>([]);
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [recorder, setRecorder] = useState<any>();
    const processorRef = useRef<any>();
    const audioContextRef = useRef<any>();
    const audioInputRef = useRef<any>();
    const { register, handleSubmit, setValue } = useForm();
    //! STT
    const navigate = useNavigate();
    const [userState, setUserState] = useRecoilState(AuthLogin);
    const [chats, setChats] = useState([]);
    const [message, setMessage] = useState("");
    const chatContainerEl = useRef(null);

    const [STTMessage, setSTTMessage] = useState<string[]>([]);

    //! STT
    // * 서버로 부터 받은 음성 인식 결과를 처리하는 함수
    const speechRecognized = useCallback((data: WordRecognized) => {
        if (data.isFinal) {
            setCurrentRecognition("...");
            //*
            setRecognitionHistory((old) => [...old, data.text]);
            setSTTMessage((prev) => [...prev, data.text]);
        } else setCurrentRecognition(data.text + "...");

        socket.on("broadcastAudio", (audioData) => {
            // Handle received audio data and play it back using the Web Audio API or Audio element
            // For simplicity, this example doesn't include the playback implementation.
            console.log("Received audio data:", audioData);
        });
    }, []);

    //! audio

    //* 서버로부터 받은 음성 인식 결과를 처리하는 speechRecognized 함수에서
    //* recognitionHistory를 변경하기에 실행되는 함수. console.log로 보여줌
    useEffect(() => {
        console.log("\n\nrecognitionHistory", recognitionHistory);
    }, [recognitionHistory]);

    //* 서버와의 연결을 설정하고, 음성 녹음 및 전송을 위한 준비를 한다.
    const connect = () => {
        if (!connection) {
            setConnection(socket);
        }

        socket.emit("send_message", "hello world");

        socket.emit("startGoogleCloudStream");

        socket.on("disconnect", () => {
            console.log("disconnected", socket.id);
        });
    };

    useEffect(() => {
        // 이벤트 핸들러 등록
        socket.on("receive_audio_text", speechRecognized);

        // cleanup function: 컴포넌트가 언마운트 될 때 실행됩니다.
        return () => {
            // 이벤트 핸들러 해제
            socket.off("receive_audio_text", speechRecognized);
        };
    }, [connection, isRecording, speechRecognized]);

    //* 서버와의 연결의 해제하는 함수, 녹음과 관련된 상태와 객체들을 초기화하고 연결을 해제
    const disconnect = () => {
        //* connection이 존재하는지 확인합니다. connection은 서버와의 소켓 연결을 의미합니다.
        //* 연결이 없는 경우(즉, connection이 undefined인 경우) 함수를 종료합니다.
        if (!connection) return;
        //* connection?.emit("endGoogleCloudStream")를 호출하여
        //* 서버로 "endGoogleCloudStream" 메시지를 보냅니다.
        //* 이 메시지는 서버 측에서 음성 녹음을 종료하도록 지시하는 역할을 합니다.
        connection?.emit("endGoogleCloudStream");
        //* connection?.disconnect()를 호출하여 클라이언트와 서버 간의 소켓 연결을 끊습니다.
        //* 이로써 클라이언트와 서버 간의 통신이 종료됩니다.
        // connection?.disconnect();
        //* processorRef.current?.disconnect()를 호출하여 워크렛 프로세서를 해제합니다.
        //* 워크렛은 음성 녹음을 처리하는 커스텀 프로세서입니다.
        processorRef.current?.disconnect();
        //* audioInputRef.current?.disconnect()를 호출하여 오디오 입력 소스를 해제합니다.
        //* 이는 마이크와의 연결을 해제하는 것입니다.
        audioInputRef.current?.disconnect();
        //* audioContextRef.current?.close()를 호출하여 오디오 컨텍스트를 닫습니다.
        //* 오디오 컨텍스트는 녹음에 필요한 오디오 스트림을 관리합니다.
        audioContextRef.current?.close();
        //* connection 상태를 undefined로 설정하여 연결을 끊었음을 알립니다.
        setConnection(undefined);
        //* setRecorder(undefined)를 호출하여 녹음을 수행하는 데 사용한 녹음기 객체를 해제합니다.
        setRecorder(undefined);
        //* 녹음 상태를 false로 설정합니다. 이로써 녹음 중이 아님을 알립니다.
        setIsRecording(false);
    };

    //* 컴포넌트가 렌더링 될 때마다 실행되는 훅, 클라이언트 측에서 음성 녹음과 서버 전송을 처리
    //* connection과 isRecording 상태, 그리고 recorder를 의존성 배열로 지정하여
    //* 이들 값이 변경될 때마다 해당 코드 블록이 실행됩니다.
    useEffect(() => {
        (async () => {
            if (connection) {
                if (isRecording) {
                    return;
                }
                //* 브라우져의 미디어 스트림을 가져옴, 사용자의 마이크에서 오디오 데이터를 제공
                const stream = await getMediaStream();
                //* 오디오 스트림을 처리하고 녹음 작업을 진행
                audioContextRef.current = new window.AudioContext();
                //* audioWorklet을 사용하여 워크렛(worklet)을 추가합니다.
                //* 워크렛은 오디오 데이터를 처리하는 커스텀 프로세서입니다.
                //*여기서는 recorderWorkletProcessor.js 파일에 정의된 워크렛을 추가합니다.
                await audioContextRef.current.audioWorklet.addModule(
                    "/src/worklets/recorderWorkletProcessor.js"
                );
                //* 오디오 컨텍스트를 재개합니다. 브라우저는 보안 이슈로 인해
                //* 사용자 인터랙션 이전에 오디오 컨텍스트를 재개하지 못하도록 막고 있습니다.
                //* 오디오 컨텍스트를 직접 재개합니다.
                audioContextRef.current.resume();
                //* 미디어 스트림에서 오디오 입력 소스를 만듭니다.
                audioInputRef.current =
                    audioContextRef.current.createMediaStreamSource(stream);
                //* 워크렛 노드를 생성하여 오디오 스트림을 처리하는 커스텀 워크렛과 연결합니다.
                processorRef.current = new AudioWorkletNode(
                    audioContextRef.current,
                    "recorder.worklet"
                );
                //* 오디오워크렛 노드를 컨텍스트의 출력(destination)과 연결
                //* 이를 통해 오디오 데이터를 처리한 뒤 컨텍스트의 출력으로 보낼 수 있음
                processorRef.current.connect(
                    audioContextRef.current.destination
                );
                audioContextRef.current.resume();

                //* 워크렛 노드와 오디오 입력 소스를 연결합니다.
                audioInputRef.current.connect(processorRef.current);
                //* 워크렛 노드의 port.onmessage 이벤트 핸들러를 정의합니다.
                //* 이 핸들러는 워크렛으로부터 오디오 데이터를 전달받아 서버로 전송하는 역할을 합니다.
                //! 실제 녹음은 processorRef.current.port.onmessage 핸들러를 통해 이루어지며,
                //! 워크렛은 오디오 데이터를 처리하여 실시간으로 서버로 전송합니다.
                processorRef.current.port.onmessage = (event: any) => {
                    const audioData = event.data;
                    //! 서버로 음성 데이터는 보내는 부분. 이부분을 통해서 전체에 음성을 보내주면 될듯
                    connection.emit("send_audio_data", { audio: audioData });
                };
                //* setIsRecording(true)를 호출하여 녹음 상태를 설정합니다.
                setIsRecording(true);
            } else {
                console.error("No connection");
            }
        })();
        return () => {
            if (isRecording) {
                processorRef.current?.disconnect();
                audioInputRef.current?.disconnect();
                if (audioContextRef.current?.state !== "closed") {
                    audioContextRef.current?.close();
                }
            }
        };
    }, [connection, isRecording, recorder]);

    //! 채팅이 길어지면(chats.length) 스크롤이 생성되므로, 스크롤의 위치를 최근 메시지에 위치시키기 위함
    useEffect(() => {
        if (!chatContainerEl.current) return;

        const chatContainer = chatContainerEl.current;
        const { scrollHeight, clientHeight } = chatContainer;

        if (scrollHeight > clientHeight) {
            chatContainer.scrollTop = scrollHeight - clientHeight;
        }
    }, [chats.length]);

    const onSendMessage = handleSubmit((data) => {
        const { message }: any = data;
        if (!message) return alert("메시지를 입력해 주세요.");

        socket.emit(
            "message",
            {
                user_nickname: storedData.userNickname,
                message: message,
                room_id: current_room_id,
            },
            (chat) => {
                setChats((prevChats) => [...prevChats, chat]);
                console.log(chats);
            }
        );

        // 폼 데이터 전송 후 폼 리셋
        setValue("message", "");
    });
    //!

    //! 룸 나가기를 하면 userState의 current room 을 {}로 설정
    const RoomOutHandler = () => {
        //! 소켓 룸에서도 나가는 기능 해야함
        socket.emit("leave-room", { room_id: current_room_id }, () => {
            console.log(
                `${storedData.userNickname} 님이 ${current_room_id}에서 나가셨습니다.`
            );
        });
        setUserState({
            ...userState,
            currentRoom: {
                room_id: "",
                room_name: "",
                room_summary: "",
                room_password: "",
            },
        });

        // console.log(userState);
        navigate(`/${userState.userId}`);
    };
    // console.log(userState);
    //! 현재 접속한 방이 유저가(db) 들어온 방에 있는지 확인
    const current_room = useParams();

    const room = userState.userJoinedRoomList.filter(
        (room: any) => room.room_id === current_room.room_id
    );
    // console.log(room[0]);
    useEffect(() => {
        setUserState({
            ...userState,
            currentRoom: room[0],
        });
    }, []);
    // console.log(userState);

    return (
        <>
            <RoomOutButton onClick={RoomOutHandler}>FINISH</RoomOutButton>
            <BaseContainer
                variants={containerVariants}
                initial="start"
                animate="end"
            >
                <MainContainer>
                    <SideOpenToolBox variants={leftSideBoxVariants}>
                        <IOButton onClick={volumeControl}>
                            {volume ? (
                                <FontAwesomeIcon icon={faVolumeXmark} />
                            ) : (
                                <FontAwesomeIcon icon={faVolumeHigh} />
                            )}
                        </IOButton>
                        <IOButton onClick={micControl} style={{ left: "30px" }}>
                            {mic ? (
                                <FontAwesomeIcon icon={faMicrophoneSlash} />
                            ) : (
                                <FontAwesomeIcon icon={faMicrophone} />
                            )}
                        </IOButton>
                        <IOButton
                            className={
                                isRecording ? "btn-danger" : "btn-outline-light"
                            }
                            onClick={connect}
                            disabled={isRecording}
                            style={{ left: "80px" }}
                        >
                            Start
                        </IOButton>
                        <IOButton
                            className="btn-outline-light"
                            onClick={disconnect}
                            disabled={!isRecording}
                            style={{ left: "120px" }}
                        >
                            Stop
                        </IOButton>
                    </SideOpenToolBox>
                    <Tabs style={{ margin: "0" }}>
                        <Tab
                            isActive={true}
                            style={{ borderRadius: "30px 0 0 0" }}
                        >
                            <Link to={"playground"}>PLAYGROUND</Link>
                        </Tab>
                        <VerticalLine />
                        <Tab isActive={false}>
                            <Link to={"summary"}>SUMMARY</Link>
                        </Tab>
                        <VerticalLine />
                        <Tab isActive={false}>
                            <Link to={"question"}>QUESTION</Link>
                        </Tab>
                        <VerticalLine />
                        <Tab isActive={false}>
                            <Link to={"quiz"}>QUIZ</Link>
                        </Tab>
                    </Tabs>
                    <Container>
                        <Routes>
                            <Route path="playground" element={<Playground />} />
                            <Route path="summary" element={<Summary />} />
                            <Route path="question" element={<Question />} />
                            <Route path="quiz" element={<Quiz />} />
                        </Routes>
                        <div id="myStream">
                            {/* <button onClick={startVideo}>start</button> */}
                            <video
                                id="myFace"
                                autoPlay
                                // muted
                                width={200}
                                height={200}
                                ref={myFaceRef}
                            ></video>
                        </div>
                    </Container>
                    {/* <Dictaphone /> */}
                </MainContainer>
                {/* <VerticalLine /> */}

                <RoomList>
                    <ChatArea ref={chatContainerEl}>
                        {/*//! text 메세지 나오는 부분 */}
                        {chats.map((chat, index) => (
                            <ChattingBox key={index}>
                                <span style={{ color: `#00d2d3` }}>
                                    {chat.user_nickname !==
                                    storedData.userNickname
                                        ? chat.user_nickname
                                        : "ME"}
                                </span>
                                <Message>{chat.message}</Message>
                            </ChattingBox>
                        ))}
                        {/*//! STT 메세지 나오는 부분 */}
                        {STTMessage.map((message, idx) => (
                            <ChattingBox key={idx}>
                                <span style={{ color: `#00d2d3` }}>발표자</span>
                                <Message>{message}</Message>
                            </ChattingBox>
                        ))}
                        {/* <p>{currentRecognition}</p> */}
                    </ChatArea>

                    <form onSubmit={onSendMessage}>
                        <InputTextStyle>
                            <TextInput
                                type="text"
                                {...register("message")} // useForm의 register 메소드로 폼 입력과 연결
                            />
                            <TextInputButton type="submit">
                                SEND
                            </TextInputButton>
                        </InputTextStyle>
                    </form>
                </RoomList>
            </BaseContainer>
        </>
    );
}

export default Room;
