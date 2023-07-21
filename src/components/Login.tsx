import { motion } from "framer-motion";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { buttonStyle, containerStyle, mainBgColor } from "./Styles";
import { Link, useNavigate } from "react-router-dom";

import { useRecoilState, useRecoilValue } from "recoil";
import { AuthAtom, AuthLogin } from "../atoms";

const Container = styled(motion.div)`
    ${containerStyle}
    height: 280px;
    position: relative;
    a {
        flex: none;
        position: absolute;
        bottom: 15px;
        right: 110px;
        color: white;
        padding: 10px;
    }
`;

const LoginInput = styled(motion.input)`
    ${buttonStyle}
    width: 300px;
    margin-bottom: 10px;
`;

const GridLoginStyle = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr;
    width: 410px;
    gap: 10px;
`;

const LoginButton = styled(motion.button)`
    ${buttonStyle}
    ${mainBgColor}
    width: 100px;
    height: 145px;
    cursor: pointer;
    color: white;
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

interface ILoginForm {
    user_id: string;
    user_password: string;
    //! 필수 항목(not required)이 아닐시 ? 를 이용하여 적을 수 있음
    extraError?: string;
}

function Login() {
    const navigate = useNavigate();

    const [loginError, setLoginError] = useState("");
    const [isLoading, setIsLoaging] = useState(false);
    // const authFunc = useRecoilValue(AuthAtom);
    const [userState, setUserState] = useRecoilState(AuthLogin);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<ILoginForm>();

    //url 이동을 위한 useHistory? useNavigate
    const onValid = async ({ user_id, user_password }: ILoginForm) => {
        // setValue("user_id", "");
        // setValue("user_password", "");
        try {
            setIsLoaging(true);
            const response = await fetch("http://localhost:8080/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: " Bearer " + userState.token,
                },
                body: JSON.stringify({
                    user_id,
                    user_password,
                }),
            });
            const responseData = await response.json();

            setIsLoaging(false);
            setLoginError(responseData.message);
            responseData.message
                ? alert(responseData.message)
                : alert(`${responseData.userNickname}님, 반갑습니다.`);

            if (!response.ok) {
                throw new Error(responseData.message);
            }
            setUserState({
                isLoggedIn: true,
                userId: responseData.userId,
                userNickname: responseData.userNickname,
                token: responseData.token,
            });

            // console.log(userState);
            localStorage.setItem(
                "userData",
                JSON.stringify({
                    userId: responseData.userId,
                    userNickname: responseData.userNickname,
                    token: responseData.token,
                })
            );
            // authFunc.login(responseData.userId, responseData.token);

            navigate(`/${user_id}`);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <Container variants={boxVariants} initial="start" animate="end">
                <form onSubmit={handleSubmit(onValid)}>
                    <GridLoginStyle>
                        <div>
                            <LoginInput
                                type="text"
                                variants={inputVariants}
                                {...register("user_id", {
                                    required: "please write right form",
                                })}
                                placeholder="ID"
                            />
                            <LoginWarning>
                                {errors?.user_id?.message as string}
                            </LoginWarning>

                            <LoginInput
                                type="password"
                                variants={inputVariants}
                                {...register("user_password", {
                                    required: "Password is Required",
                                    minLength: {
                                        value: 8,
                                        message: "Your password is too short",
                                    },
                                })}
                                placeholder="PASSWORD"
                            />
                            <LoginWarning>
                                {errors?.user_password?.message as string}
                            </LoginWarning>
                        </div>

                        <LoginButton variants={inputVariants}>
                            LOG IN
                        </LoginButton>
                        {/* <LoginWarning>{loginError}</LoginWarning> */}
                    </GridLoginStyle>
                </form>
                <Link to={"/users/signup"}>SIGN UP</Link>
            </Container>
        </>
    );
}
export default Login;
