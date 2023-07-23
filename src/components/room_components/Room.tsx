import React, { useEffect } from "react";
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

const InputTextStyle = styled.div`
    display: grid;
    grid-template-columns: 4fr 1fr;
`;

const TextInput = styled(motion.input)`
    ${buttonStyle}
    width: 23.5vw;
    height: 8vh;
    border-radius: 0;
`;

const TextInputButton = styled(motion.button)`
    ${buttonStyle}
    ${mainBgColor}
    border-radius: 0 0 30px 0;
    width: 5vw;
    height: 8vh;
    cursor: pointer;
    color: white;
`;

const ChatArea = styled.div`
    background-color: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 82vh;
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
    const [mic, setMic] = useRecoilState(MicCondition);
    const [volume, setVolume] = useRecoilState(VolumeContidion);
    const navigate = useNavigate();
    const [userState, setUserState] = useRecoilState(AuthLogin);
    console.log(userState);
    console.log(fakeCurrentRoom);

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
        navigate(`/${userState.userId}`);
    };

    useEffect(() => {
        setUserState({
            ...userState,
            currentRoom: fakeCurrentRoom,
        });
    }, []);

    const onValid = async ({ text, text_time }: ITextForm) => {
        try {
            const response = await fetch(`${MY_URL}auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: " Bearer " + userState.token,
                },
                body: JSON.stringify({
                    text,
                    text_time,
                }),
            });
            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message);
            }
        } catch (err) {
            console.log(err);
        }
    };

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

                    <Tabs>
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

                    <Dictaphone />
                </MainContainer>
                <VerticalLine />

                <RoomList>
                    <ChatArea></ChatArea>

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
