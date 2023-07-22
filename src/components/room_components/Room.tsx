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
    display: flex;
    justify-content: baseline;
    align-items: flex-start;
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

    const RoomOutHandler = () => {
        // useEffect(() => {
        setUserState({
            ...userState,
            currentRoom: {
                room_id: "",
                room_name: "",
                room_summary: "",
            },
        });
        // });
        console.log(userState);
        navigate(`/${userState.userId}`);
    };

    useEffect(() => {
        setUserState({
            ...userState,
            currentRoom: fakeCurrentRoom,
        });
    }, []);

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

                <RoomList></RoomList>
            </BaseContainer>
        </>
    );
}

export default Room;
