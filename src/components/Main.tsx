import { styled } from "styled-components";
import { buttonStyle, containerStyle, reverseColor } from "./Styles";
import {
    faMicrophone,
    faMicrophoneSlash,
    faVolumeHigh,
    faVolumeLow,
    faVolumeXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRecoilState } from "recoil";
import { AuthLogin, MicCondition, VolumeContidion } from "../atoms";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

const BaseContainer = styled.div`
    /* ${containerStyle} */
    width: 95vw;
    height: 90vh;
    display: grid;
    grid-template-columns: 3.5fr 1.5fr;
`;

const MainContainer = styled.div`
    ${containerStyle}
    width: 66.5vw;
    height: 90vh;
    position: relative;
`;

const RoomList = styled.div`
    ${containerStyle}
    width: 28.5vw;
    height: 90vh;
    display: block;
`;

const IOButton = styled.button`
    border: none;
    background-color: transparent;
    position: absolute;
    top: 10px;
    left: 130px;
    padding: 10px;
`;

const LogoutButton = styled(motion.div)`
    ${buttonStyle}
    ${reverseColor}
    z-index: 999;
    position: absolute;
    top: 3rem;
    cursor: pointer;
`;

function Main() {
    const [mic, setMic] = useRecoilState(MicCondition);
    const [volume, setVolume] = useRecoilState(VolumeContidion);
    const { uid } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [loadedUsers, setLoadedUsers] = useState([]);
    const storedData = JSON.parse(localStorage.getItem("userData") as string);
    const [userState, setUserState] = useRecoilState(AuthLogin);
    // const authFunc = useRecoilValue(AuthAtom);
    // console.log(authFunc);

    const volumeControl = () => {
        setVolume((prev) => !prev);
    };
    const micControl = () => {
        setMic((prev) => !prev);
    };

    const LogoutHandler = () => {
        localStorage.removeItem("userData");
        // setUserState({
        //     isLoggedIn: false,
        //     userId: "",
        //     userNickname: "",
        //     token: "",
        // });
        console.log(userState);
        navigate("/auth/login");
    };

    useEffect(() => {
        // if (storedData && uid === storedData.userId) {
        //     console.log("hello, you are right user");
        // } else {
        //     navigate("/auth/login");
        // }

        const sendRequest = async () => {
            try {
                if (storedData) {
                    const response = await fetch(
                        `http://localhost:8080/${storedData.userId}`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: " Bearer " + storedData.token,
                            },
                        }
                    );
                    // console.log(authFunc);

                    const responseData = await response.json();
                    if (!response.ok) {
                        throw new Error(responseData.message);
                    }

                    // console.log(responseData.user);
                    setLoadedUsers(responseData.user.user_joined_room_list);
                    setUserState({
                        ...userState,
                        isLoggedIn: true,
                        userId: responseData.user.user_id,
                        userNickname: responseData.user.user_nickname,
                        userJoinedRoomList:
                            responseData.user.user_joined_room_list,
                    });
                    // use이펙트로 사용해서 당연히 값이 최신화되어있지 않음
                    // console.log(userState);
                    // console.log(loadedUsers);
                } else {
                    // navigate("/auth/login");
                }
            } catch (err) {
                console.log(err);
            }
        };
        sendRequest();
    }, []);

    // console.log(userState);
    console.log(loadedUsers);
    return (
        <>
            <LogoutButton onClick={LogoutHandler}>LOG OUT</LogoutButton>
            <BaseContainer>
                <MainContainer>
                    <h1>{storedData && storedData.userNickname}</h1>
                    <IOButton onClick={volumeControl}>
                        {volume ? (
                            <FontAwesomeIcon icon={faVolumeHigh} />
                        ) : (
                            <FontAwesomeIcon icon={faVolumeXmark} />
                        )}
                    </IOButton>
                    <IOButton onClick={micControl} style={{ left: "170px" }}>
                        {mic ? (
                            <FontAwesomeIcon icon={faMicrophone} />
                        ) : (
                            <FontAwesomeIcon icon={faMicrophoneSlash} />
                        )}
                    </IOButton>
                </MainContainer>
                <RoomList>
                    {loadedUsers.map((room, index) => (
                        <div key={index}>{room}</div>
                    ))}
                </RoomList>
            </BaseContainer>
        </>
    );
}

export default Main;
