import { styled } from "styled-components";
import { containerStyle } from "./Styles";
import {
    faMicrophone,
    faMicrophoneSlash,
    faVolumeHigh,
    faVolumeLow,
    faVolumeXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRecoilState, useRecoilValue } from "recoil";
import { AuthAtom, AuthLogin, MicCondition, VolumeContidion } from "../atoms";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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

function Main() {
    const [mic, setMic] = useRecoilState(MicCondition);
    const [volume, setVolume] = useRecoilState(VolumeContidion);
    const volumeControl = () => {
        setVolume((prev) => !prev);
    };
    const micControl = () => {
        setMic((prev) => !prev);
    };

    // const authFunc = useRecoilValue(AuthAtom);
    // console.log(authFunc);
    const userState = useRecoilValue(AuthLogin);
    // console.log(userState);

    // const { uid } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [loadedUsers, setLoadedUsers] = useState([]);
    const storedData = JSON.parse(localStorage.getItem("userData") as string);
    console.log(storedData);

    useEffect(() => {
        const sendRequest = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/${
                        storedData.userId ? storedData.userId : userState.userId
                    }`,
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
                // console.log(loadedUsers);
            } catch (err) {
                console.log(err);
            }
        };
        sendRequest();
    }, []);
    // console.log(loadedUsers);
    return (
        <>
            <BaseContainer>
                <MainContainer>
                    <h1>{storedData.userId}</h1>
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
