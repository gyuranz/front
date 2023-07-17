import { motion } from "framer-motion";
import React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { buttonStyle, containerStyle, mainBgColor } from "./Styles";
import { useNavigate } from "react-router-dom";

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
    email: string;
    nickname: string;
    password: string;
    verifyPassword: string;
    //! 필수 항목(not required)이 아닐시 ? 를 이용하여 적을 수 있음
    extraError?: string;
}

function Join() {
    const navigate = useNavigate();
    const goLogin = () => {
        navigate("/login");
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<IForm>();
    const onValid = (data: IForm) => {
        console.log(data);
        if (data.password !== data.verifyPassword) {
            setError(
                "verifyPassword",
                { message: "Password are not the same." },
                { shouldFocus: true }
            );
        }
        //! 특정 항목에 해당되는 에러가 아니라, 전체 form에 해당되는 에러
        // setError("extraError", { message: "Server offline." });
    };
    // console.log(errors);
    console.log(errors);
    return (
        <>
            <Container variants={boxVariants} initial="start" animate="end">
                <form
                    style={{ display: "flex", flexDirection: "column" }}
                    onSubmit={handleSubmit(onValid)}
                >
                    <JoinInput
                        variants={inputVariants}
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[A-Za-z0-9._%+-]+@naver.com$/,
                                message: "Only naver.com emails allowed",
                            },
                        })}
                        placeholder="Email"
                    />
                    <LoginWarning>
                        {errors?.email?.message as string}
                    </LoginWarning>

                    <JoinInput
                        variants={inputVariants}
                        {...register("nickname", {
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
                        {errors?.nickname?.message as string}
                    </LoginWarning>

                    <JoinInput
                        variants={inputVariants}
                        {...register("password", {
                            required: "Password is Required",
                            minLength: {
                                value: 8,
                                message: "Your password is too short",
                            },
                        })}
                        placeholder="Password"
                    />
                    <LoginWarning>
                        {errors?.password?.message as string}
                    </LoginWarning>

                    <JoinInput
                        variants={inputVariants}
                        {...register("verifyPassword", {
                            required: "Password is Required",
                            minLength: {
                                value: 5,
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
export default Join;
