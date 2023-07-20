import { motion } from "framer-motion";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { buttonStyle, containerStyle, mainBgColor } from "./Styles";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { AuthAtom, AuthLogin } from "../atoms";

const Container = styled(motion.div)`
    ${containerStyle}
    height: 480px;
`;

const JoinInput = styled(motion.input)`
    ${buttonStyle}
    width: 400px;
    margin-bottom: 10px;
`;

const OneLineTwoButton = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
`;

const JoinButton = styled(motion.button)`
    ${buttonStyle}
    ${mainBgColor}
    cursor: pointer;
`;

const CancelButton = styled(motion.button)`
    ${buttonStyle}
    background-color: rgba(255,0,0,0.7);
    cursor: pointer;
`;

const LoginWarning = styled.span`
    color: red;
    font-size: 14px;
`;

const boxVariants = {
    start: { opacity: 0, scale: 0.5 },
    end: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            duration: 2,
            bounce: 0.65,
            delayChildren: 0.3,
            staggerChildren: 0.1,
        },
    },
};

const inputVariants = {
    start: {
        opacity: 0,
        y: 100,
    },
    end: {
        opacity: 1,
        y: 0,
    },
};

interface IForm {
    user_id: string;
    user_nickname: string;
    user_password: string;
    verifyPassword: string;
    //! 필수 항목(not required)이 아닐시 ? 를 이용하여 적을 수 있음
    extraError?: string;
}

function Signup() {
    const navigate = useNavigate();

    const goLogin = () => {
        navigate("/users/login");
    };

    const [loginError, setLoginError] = useState("");
    const [isLoading, setIsLoaging] = useState(false);
    // const authFunc = useRecoilValue(AuthAtom);
    const [userState, setUserState] = useRecoilState(AuthLogin);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<IForm>();

    const onValid = async ({
        user_id,
        user_nickname,
        user_password,
        verifyPassword,
    }: IForm) => {
        if (user_password !== verifyPassword) {
            setError(
                "verifyPassword",
                { message: "Password are not the same." },
                { shouldFocus: true }
            );
        }
        //! 특정 항목에 해당되는 에러가 아니라, 전체 form에 해당되는 에러
        // setError("extraError", { message: "Server offline." });
        try {
            setIsLoaging(true);
            const response = await fetch("/users/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id,
                    user_nickname,
                    user_password,
                }),
            });
            const responseData = await response.json();
            setIsLoaging(false);
            setLoginError(responseData.message);

            if (!response.ok) {
                throw new Error(responseData.message);
            }
            setUserState({
                isLoggedIn: true,
                userId: responseData.userId,
                token: responseData.token,
            });
            localStorage.setItem(
                "userData",
                JSON.stringify({
                    userId: responseData.userId,
                    token: responseData.token,
                })
            );
            // authFunc.login(responseData.userId, responseData.token);

            navigate(`/${user_id}`);
        } catch (err) {
            setIsLoaging(false);
            console.log(err);
        }
    };

    return (
        <>
            <Container variants={boxVariants} initial="start" animate="end">
                {/* 수정 필요!!! 로딩화면 */}
                {isLoading ? <h1>로딩 중...</h1> : null}
                <form
                    style={{ display: "flex", flexDirection: "column" }}
                    onSubmit={handleSubmit(onValid)}
                >
                    <LoginWarning>{loginError}</LoginWarning>
                    <JoinInput
                        variants={inputVariants}
                        {...register("user_id", {
                            required: "ID is required",
                            // pattern: {
                            //     value: /^[A-Za-z0-9._%+-]+@naver.com$/,
                            //     message: "Only naver.com emails allowed",
                            // },
                        })}
                        placeholder="ID"
                    />
                    <LoginWarning>
                        {errors?.user_id?.message as string}
                    </LoginWarning>

                    <JoinInput
                        variants={inputVariants}
                        {...register("user_nickname", {
                            required: "Nickname is required",
                            validate: {
                                // async 를 사용해서 서버와 id 중복확인
                                nobig: (value) =>
                                    value.includes("big")
                                        ? "no 'big' allowed"
                                        : true,
                                noperson: (value) =>
                                    value.includes("person")
                                        ? "no 'person' allowed"
                                        : true,
                            },
                            minLength: {
                                value: 3,
                                message: "Nickname is at least 3length",
                            },
                        })}
                        placeholder="Nickname"
                    />
                    <LoginWarning>
                        {errors?.user_nickname?.message as string}
                    </LoginWarning>

                    <JoinInput
                        type="password"
                        variants={inputVariants}
                        {...register("user_password", {
                            required: "Password is Required",
                            minLength: {
                                value: 6,
                                message: "Your password is too short",
                            },
                        })}
                        placeholder="Password"
                    />
                    <LoginWarning>
                        {errors?.user_password?.message as string}
                    </LoginWarning>

                    <JoinInput
                        type="password"
                        variants={inputVariants}
                        {...register("verifyPassword", {
                            required: "Password is Required",
                            minLength: {
                                value: 6,
                                message: "Your password is too short",
                            },
                        })}
                        placeholder="Verify Password"
                    />
                    <LoginWarning>
                        {errors?.verifyPassword?.message as string}
                    </LoginWarning>

                    <OneLineTwoButton>
                        <CancelButton
                            variants={inputVariants}
                            onClick={goLogin}
                        >
                            Cancel
                        </CancelButton>
                        <JoinButton variants={inputVariants}>Join</JoinButton>
                    </OneLineTwoButton>
                </form>
            </Container>
        </>
    );
}
export default Signup;
