import { io } from "socket.io-client";
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

//! 소켓 api 꼭 같이 수정해주기
// const socket = io(`http://15.164.100.230:8080/room`);
const socket = io(`${process.env.REACT_APP_BACKEND_URL}/room`, {
    query: { user: JSON.stringify("a") },
});

const Container = styled.div`
    /* background-color: rgba(0, 0, 0, 0.5); */
    height: 80vh;
    padding: 10px;
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

const IOButton = styled.button`
    border: none;
    background-color: transparent;
    position: absolute;
    top: 10px;
    left: 30px;
    padding: 10px;
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

const Video = styled.video`
    max-width: 100%;
    max-height: 100%;
`;

let stream;
function Room() {
    const navigate = useNavigate();
    const [mic, setMic] = useRecoilState(MicCondition);
    const [volume, setVolume] = useRecoilState(VolumeContidion);
    const [userState, setUserState] = useRecoilState(AuthLogin);
    const [chats, setChats] = useState([]);
    const [message, setMessage] = useState("");
    const chatContainerEl = useRef(null);
    //! 채팅이 길어지면(chats.length) 스크롤이 생성되므로, 스크롤의 위치를 최근 메시지에 위치시키기 위함
    useEffect(() => {
        if (!chatContainerEl.current) return;

        const chatContainer = chatContainerEl.current;
        const { scrollHeight, clientHeight } = chatContainer;

        if (scrollHeight > clientHeight) {
            chatContainer.scrollTop = scrollHeight - clientHeight;
        }
    }, [chats.length]);

    //! message event listener
    useEffect(() => {
        // const socket = io(`${process.env.REACT_APP_BACKEND_URL}/room`);
        const messageHandler = (chat) =>
            setChats((prevChats) => [...prevChats, chat]);
        socket.on("message", messageHandler);

        return () => {
            socket.off("message", messageHandler);
        };
    }, []);
    console.log(chats);

    const onChange = useCallback((e) => {
        setMessage(e.target.value);
    }, []);

    const onSendMessage = useCallback(
        (e) => {
            e.preventDefault();
            if (!message) return alert("메시지를 입력해 주세요.");

            socket.emit("message", message, (chat) => {
                console.log(chat);
                setChats((prevChats) => [...prevChats, chat]);
                setMessage("");
            });
        },
        [message]
    );
    //!

    const volumeControl = () => {
        setVolume((prev) => !prev);
    };
    const micControl = () => {
        setMic((prev) => !prev);
    };
    //! 룸 나가기를 하면 userState의 current room 을 {}로 설정
    const RoomOutHandler = () => {
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
    // console.log(a.room_id);
    const room = userState.userJoinedRoomList.filter(
        (abc: any) => abc.room_id === current_room.room_id
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
            <RoomOutButton onClick={RoomOutHandler}>ROOM OUT</RoomOutButton>
            <BaseContainer
                variants={containerVariants}
                initial="start"
                animate="end"
            >
                <MainContainer>
                    <IOButton onClick={volumeControl}>
                        {volume ? (
                            <FontAwesomeIcon icon={faVolumeHigh} />
                        ) : (
                            <FontAwesomeIcon icon={faVolumeXmark} />
                        )}
                    </IOButton>
                    <IOButton onClick={micControl} style={{ left: "60px" }}>
                        {mic ? (
                            <FontAwesomeIcon icon={faMicrophone} />
                        ) : (
                            <FontAwesomeIcon icon={faMicrophoneSlash} />
                        )}
                    </IOButton>

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
                    </Container>

                    {/* <Dictaphone /> */}
                </MainContainer>
                <VerticalLine />

                <RoomList>
                    <ChatArea ref={chatContainerEl}>
                        {chats.map((chat, index) => (
                            <ChattingBox key={index}>
                                <span style={{ color: `#00d2d3` }}>
                                    {chat.username
                                        ? socket.id === chat.username
                                            ? ""
                                            : chat.username
                                        : ""}
                                    {chat.username}
                                </span>
                                <Message>{chat.message}</Message>
                            </ChattingBox>
                        ))}
                    </ChatArea>
                    <form onSubmit={onSendMessage}>
                        <InputTextStyle>
                            <TextInput
                                type="text"
                                onChange={onChange}
                                value={message}
                            />
                            <TextInputButton>SEND</TextInputButton>
                        </InputTextStyle>
                    </form>
                </RoomList>
            </BaseContainer>
        </>
    );
}

export default Room;
