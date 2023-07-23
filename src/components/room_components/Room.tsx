import React, { useEffect, useState } from "react";
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
import { Outlet, useNavigate, Link } from "react-router-dom";
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
import { MY_URL } from "../../App";
import { io } from "socket.io-client";

let socket: any;

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

//! 룸 나가기를 하면 userState의 current room 을 {}로 설정
const fakeCurrentRoom = {
    room_id: "123321",
    room_name: "세젤예 손예진",
    room_summary: "현빈의 영원의 짝꿍 손예진에 대한 설명입니다.",
};

function Room() {
    const [roomText, setRoomText] = useState<any>([]);
    const [mic, setMic] = useRecoilState(MicCondition);
    const [volume, setVolume] = useRecoilState(VolumeContidion);
    const navigate = useNavigate();
    const [userState, setUserState] = useRecoilState(AuthLogin);

    // console.log(userState);
    // console.log(fakeCurrentRoom);

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
            },
        });

        console.log(userState);
        navigate(`/room/${userState.userId}`);
    };

    useEffect(() => {
        setUserState({
            ...userState,
            currentRoom: fakeCurrentRoom,
        });

        //로딩 될때만 실행
    }, []);

    useEffect(() => {
        const {
            userId,
            currentRoom: { room_id },
        } = userState;
        // ! MY_URL 혹은 ${MY_URL}${userId}/${room_id} 일듯
        socket = io(`${MY_URL}`, {
            path: `/room/${room_id}`,
        });
        socket.emit("join", { userId, room_id }, (error: any) => {
            error && alert(error);
        });

        return () => {
            socket.disconnect();
        };
    }, [MY_URL, userState]);

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

    useEffect(() => {
        socket.on("newMessage", onNewMessage);
        return () => socket.off("newMessage", onNewMessage);
    }, []);

    const onValid = async ({ text, text_time }: ITextForm) => {
        setValue("text", "");
        // setabc(text);
        // socket.emit("sendMessage", text, setabc);
        socket.emit("sendMessage", {
            text,
            user_nickname: userState.userNickname,
        });
        console.log(userState);
    };
    console.log(roomText);

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
                    <Container>hello</Container>

                    {/* <Dictaphone /> */}
                </MainContainer>
                <VerticalLine />

                <RoomList>
                    <ChatArea>
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
                    </form>
                </RoomList>
            </BaseContainer>
        </>
    );
}

export default Room;
