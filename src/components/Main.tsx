import { styled } from "styled-components";
import {
    Tab,
    Tabs,
    VerticalLine,
    buttonStyle,
    containerStyle,
    containerVariants,
    reverseColor,
} from "./Styles";

import { useRecoilState } from "recoil";
import { AuthLogin, MicCondition, VolumeContidion } from "../atoms";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { MY_URL } from "../App";

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
    position: relative;
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

const LogoutButton = styled(motion.div)`
    ${buttonStyle}
    ${reverseColor}
    font-size: 1rem;
    color: white;
    z-index: 999;
    position: absolute;
    top: 5vh;
    cursor: pointer;
`;

function Main() {
    const { uid } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [loadedUsers, setLoadedUsers] = useState([]);
    const storedData = JSON.parse(localStorage.getItem("userData") as string);
    const [userState, setUserState] = useRecoilState(AuthLogin);
    // const authFunc = useRecoilValue(AuthAtom);
    // console.log(authFunc);

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
        if (storedData && uid === storedData.userId) {
            console.log("hello, you are right user");
        } else {
            navigate("/auth/login");
        }

        const sendRequest = async () => {
            try {
                if (storedData) {
                    const response = await fetch(
                        `${MY_URL}${storedData.userId}`,
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
                    navigate("/auth/login");
                }
            } catch (err) {
                console.log(err);
            }
        };
        sendRequest();
    }, []);

    // console.log(userState);
    // console.log(loadedUsers);
    return (
        <>
            <LogoutButton onClick={LogoutHandler}>LOG OUT</LogoutButton>
            <BaseContainer
                variants={containerVariants}
                initial="start"
                animate="end"
            >
                <MainContainer>
                    <h1>{storedData && storedData.userNickname}</h1>
                </MainContainer>
                <VerticalLine />

                <RoomList>
                    <Tabs>
                        <Tab isActive={true}>
                            <Link to={"finished"}>FINISHED</Link>
                        </Tab>
                        <VerticalLine />
                        <Tab isActive={false}>
                            <Link to={"join"}>JOIN</Link>
                        </Tab>
                        <VerticalLine />
                        <Tab
                            style={{ borderRadius: "0 30px 0 0" }}
                            isActive={false}
                        >
                            <Link to={"create"}>CREATE</Link>
                        </Tab>
                    </Tabs>

                    <Outlet />
                </RoomList>
            </BaseContainer>
        </>
    );
}

export default Main;
