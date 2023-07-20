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
import { useRecoilState } from "recoil";
import { MicCondition, VolumeContidion } from "../atoms";
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

    const { uid } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [loadedUsers, setLoadedUsers] = useState();

    useEffect(() => {
        const sendRequest = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5001/users/${uid}`
                );

                const responseData = await response.json();
                if (!response.ok) {
                    throw new Error(responseData.message);
                }
                console.log(responseData);
                setLoadedUsers(responseData.user);
                console.log(loadedUsers);
            } catch (err) {
                console.log(err);
            }
        };
        sendRequest();
    }, []);

    return (
        <>
            <BaseContainer>
                <MainContainer>
                    {/* <h1>{loadedUsers.user.user_id}</h1> */}
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
                <RoomList>room list</RoomList>
            </BaseContainer>
        </>
    );
}

export default Main;
