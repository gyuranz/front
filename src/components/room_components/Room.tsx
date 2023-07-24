import { MY_URL } from "../../App";
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
import { Outlet, useNavigate, Link, useParams } from "react-router-dom";
import {
    faMicrophone,
    faMicrophoneSlash,
    faVolumeHigh,
    faVolumeLow,
    faVolumeXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dictaphone from "./Playground";
import { useForm } from "react-hook-form";
import classNames from "classnames";

//! 소켓 api 꼭 같이 수정해주기
const socket = io(`http://15.164.100.230:8080/room`);
// const socket = io(`http://localhost:8080/room`);

const Container = styled.div`
    background-color: rgba(0, 0, 0, 0.5);
    height: 80vh;
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
    background-color: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 80vh;
    margin-top: 4vh;
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

const Message = styled.span`
    margin-bottom: 0.5rem;
    background: #fff;
    width: fit-content;
    padding: 12px;
    border-radius: 0.5rem;
`;

const Video = styled.video`
    max-width: 100%;
    max-height: 100%;
`;

const ChattingBox = styled(motion.div)`
    margin: 30px;
`;

//! 룸 나가기를 하면 userState의 current room 을 {}로 설정
let stream;
function Room() {
    const [roomText, setRoomText] = useState<any>([]);
    const [mic, setMic] = useRecoilState(MicCondition);
    const [volume, setVolume] = useRecoilState(VolumeContidion);
    const navigate = useNavigate();
    const [userState, setUserState] = useRecoilState(AuthLogin);
    const [sharing, setSharing] = useState(false);
    const [chats, setChats] = useState([]);
    const [message, setMessage] = useState("");
    const chatContainerEl = useRef(null);
    // 채팅이 길어지면(chats.length) 스크롤이 생성되므로, 스크롤의 위치를 최근 메시지에 위치시키기 위함
    useEffect(() => {
        if (!chatContainerEl.current) return;

        const chatContainer = chatContainerEl.current;
        const { scrollHeight, clientHeight } = chatContainer;

        if (scrollHeight > clientHeight) {
            chatContainer.scrollTop = scrollHeight - clientHeight;
        }
    }, [chats.length]);

    // useEffect(() => {
    //     const {
    //         userId,
    //         currentRoom: { room_id },
    //     } = userState;
    //     // ! MY_URL 혹은 ${MY_URL}${userId}/${room_id} 일듯
    //     // socket = io(`${MY_URL}`, {
    //     //     path: `/room/${room_id}`,
    //     // });
    //     socket.emit("join", { userId, room_id }, (error: any) => {
    //         error && alert(error);
    //     });

    //     return () => {
    //         socket.disconnect();
    //     };
    // }, [MY_URL, userState]);

    // message event listener

    useEffect(() => {
        const messageHandler = (chat) =>
            setChats((prevChats) => [...prevChats, chat]);
        socket.on("message", messageHandler);

        return () => {
            socket.off("message", messageHandler);
        };
    }, []);

    const onChange = useCallback((e) => {
        setMessage(e.target.value);
    }, []);

    const onSendMessage = useCallback(
        (e) => {
            e.preventDefault();
            if (!message) return alert("메시지를 입력해 주세요.");

            socket.emit("message", message, (chat) => {
                setChats((prevChats) => [...prevChats, chat]);
                setMessage("");
            });
        },
        [message]
    );

    // console.log(userState);
    // console.log(fakeCurrentRoom);

    //!
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const shareScreen = async () => {
        if (navigator.mediaDevices.getDisplayMedia) {
            stream = await navigator.mediaDevices.getDisplayMedia({
                audio: true,
                video: {
                    cursor: "always",
                } as any,
                // video: true,
            });

            console.log("stream", stream);
            // videoRef.current?.srcObject = stream;
            if (videoRef.current) videoRef.current.srcObject = stream;
        }
    };
    const stopShareScreen = () => {
        // let tracks = videoRef.current?.srcObject?.getTracks() as any;
        // tracks.forEach((t: any) => t.stop());
        if (videoRef.current) videoRef.current.srcObject = null;
    };

    //!

    const volumeControl = () => {
        setVolume((prev) => !prev);
    };
    const micControl = () => {
        setMic((prev) => !prev);
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<ITextForm>();

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

        console.log(userState);
        navigate(`/${userState.userId}`);
    };
    // console.log(userState);
    const a = useParams();
    // console.log(a.room_id);
    const room = userState.userJoinedRoomList.filter(
        (abc: any) => abc.room_id === a.room_id
    );
    // console.log(room[0]);
    useEffect(() => {
        setUserState({
            ...userState,
            currentRoom: room[0],
        });

        //로딩 될때만 실행
    }, []);
    console.log(userState);

    // const setabc = (text: string) => {
    //     setRoomText([
    //         ...roomText,
    //         {
    //             user_nickname: userState.userNickname,
    //             chat: text,
    //         },
    //     ]);
    // };

    const onNewMessage = (newMessage: any) => {
        setRoomText((prevRoomText: any) => [...prevRoomText, newMessage]);
    };

    // socket.on("sendMessage", setabc);

    // useEffect(() => {
    //     socket.on("newMessage", onNewMessage);
    //     return () => socket.off("newMessage", onNewMessage);
    // }, []);

    const onValid = async ({ text, text_time }: ITextForm) => {
        setValue("text", "");
        // setabc(text);
        // socket.emit("sendMessage", text, setabc);
        socket.emit("sendMessage", {
            text,
            user_nickname: userState.userNickname,
        });
        // console.log(userState);
    };
    // console.log(roomText);

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
                            <Link to={""}>PLAYGROUND</Link>
                        </Tab>
                        <VerticalLine />
                        <Tab isActive={false}>
                            <Link to={""}>SUMMARY</Link>
                        </Tab>
                        <VerticalLine />
                        <Tab isActive={false}>
                            <Link to={""}>QUESTION</Link>
                        </Tab>
                        <VerticalLine />
                        <Tab isActive={false}>
                            <Link to={""}>QUIZ</Link>
                        </Tab>
                    </Tabs>

                    <Outlet />
                    <Container>
                        <button
                            onClick={() => {
                                shareScreen();
                                // setSharing((prev) => !prev);
                            }}
                        >
                            play
                        </button>
                        <button onClick={stopShareScreen}>stop</button>

                        <Video ref={videoRef} autoPlay />
                    </Container>

                    {/* <Dictaphone /> */}
                </MainContainer>
                <VerticalLine />

                <RoomList>
                    {/* <ChatArea ref={chatContainerEl}>
                        {roomText?.map((roomText: any, index: any) => (
                            <div key={index}>
                                <span style={{ paddingRight: "10px" }}>
                                    {roomText?.user_nickname}:
                                </span>
                                <span>{roomText?.chat}</span>
                            </div>
                        ))}
                    </ChatArea>

                    <form onSubmit={handleSubmit(onValid)}>
                        <InputTextStyle>
                            <div>
                                <TextInput
                                    type="text"
                                    {...register("text", {
                                        required: true,
                                    })}
                                    placeholder="INPUT TEXT"
                                />
                            </div>

                            <TextInputButton>SEND</TextInputButton>
                        </InputTextStyle>
                    </form> */}
                    <ChatArea ref={chatContainerEl}>
                        {chats.map((chat, index) => (
                            <ChattingBox
                                key={index}
                                className={classNames({
                                    my_message: socket.id === chat.username,
                                    alarm: !chat.username,
                                })}
                            >
                                <span>
                                    {chat.username
                                        ? socket.id === chat.username
                                            ? ""
                                            : chat.username
                                        : ""}
                                </span>
                                <Message className="message">
                                    {chat.message}
                                </Message>
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
                            <TextInputButton>보내기</TextInputButton>
                        </InputTextStyle>
                    </form>
                </RoomList>
            </BaseContainer>
        </>
    );
}

export default Room;
