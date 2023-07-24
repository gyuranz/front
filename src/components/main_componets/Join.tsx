import React from "react";
import { AuthLogin } from "../../atoms";
import { useRecoilState } from "recoil";
import { useNavigate, useParams } from "react-router-dom";
import { MY_URL } from "../../App";
import { useForm } from "react-hook-form";
import { buttonStyle, inputVariants, mainBgColor } from "../Styles";
import { styled } from "styled-components";
import { motion } from "framer-motion";

interface IRoomForm {
    room_id: string;
    room_password: string;
    room_name: string;
    room_summary: string;
}

const RoomJoinInput = styled(motion.input)`
    ${buttonStyle}
    max-width: 400px;
    margin-bottom: 10px;
    font-size: 1rem;
    width: 90%;
`;

const RoomJoinButton = styled(motion.button)`
    ${buttonStyle}
    ${mainBgColor}
    width: 90%;
    max-width: 400px;
    font-size: 1rem;
    cursor: pointer;
    color: white;
`;

const LoginWarning = styled.span`
    color: red;
    font-size: 14px;
`;

function Join() {
    const navigate = useNavigate();
    const [userState, setUserState] = useRecoilState(AuthLogin);

    console.log(userState.userJoinedRoomList);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<IRoomForm>();

    const onValid = async (room: IRoomForm) => {
        try {
            const response = await fetch(`${MY_URL}/${userState.userId}/join`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: " Bearer " + userState.token,
                },
                body: JSON.stringify({
                    room_id: room.room_id,
                    room_password: room.room_password,
                }),
            });
            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message);
            }
            const { room_id, room_name, room_summary, room_password } =
                responseData;
            setUserState({
                ...userState,
                currentRoom: {
                    room_id,
                    room_name,
                    room_summary,
                    room_password,
                },
            });

            navigate(`/room/${room_id}`);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            {/* <div>hello, {userState.userNickname}</div>
            <div>{userState.userJoinedRoomList}</div> */}
            <form
                onSubmit={handleSubmit(onValid)}
                style={{
                    height: "60vh",
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <RoomJoinInput
                    type="text"
                    variants={inputVariants}
                    {...register("room_id", {
                        required: "ROOM ID is required",
                        minLength: {
                            value: 6,
                            message: "please write at least 6 numbers",
                        },
                    })}
                    placeholder="ROOM ID"
                />
                <LoginWarning>
                    {errors?.room_id?.message as string}
                </LoginWarning>

                <RoomJoinInput
                    type="password"
                    variants={inputVariants}
                    {...register("room_password")}
                    placeholder="PASSWORD: not required"
                />
                <LoginWarning>
                    {errors?.room_password?.message as string}
                </LoginWarning>

                <RoomJoinButton variants={inputVariants}>JOIN</RoomJoinButton>
                {/* <LoginWarning>{loginError}</LoginWarning> */}
            </form>
        </>
    );
}

export default Join;
