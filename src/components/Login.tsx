import { motion } from "framer-motion";
import React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { buttonStyle, containerStyle, mainBgColor } from "./Styles";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/UserLogin";
import { setRefreshToken } from "../storage/Cookie";
import { useRecoilState } from "recoil";
import { authTokenState, setToken } from "./Auth";

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

//동기식 방식 ( async await 사용!!!!!)
const fetchLogin = async ({ user_id, user_password }: ILoginForm) => {
    const response = await fetch("http://localhost:8888/users");

    if (response.ok) {
        //서버통신이 성공적으로 이루어지면 users에 json값 대입
        const users = await response.json();

        //users안 객체들을 순회하면서 그 객체들의 id값과 form 컴포넌트에서 받음 account의 id값과 비교
        //서로 일치하는 것만 user에 대입
        const user = users.find((user: ILoginForm) => user.user_id === user_id);
        //일치하는 user가 없거나, 비밀번호가 틀리면 해당 에러 생성
        if (!user || user.user_password !== user_password) {
            // throw new Error("아이디 또는 비밀번호가 일치하지 않습니다.");
            console.log("wrong password");
        }

        //모든게 일치하면 그 user 정보 return -> 이 return값이 form 컴포넌트 내 fetchLogin 함수 값으로 출력되는것
        //form 컴포넌트에서 setUser값에 넣어야함
        return user;
    }

    //서버 통신이 안이루어졌을떄
    throw new Error("서버 통신이 원할하지 않습니다.");
};

function Login() {
    const navigate = useNavigate();
    const [authToken, setAuthToken] = useRecoilState(authTokenState);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<ILoginForm>();

    //url 이동을 위한 useHistory
    const onValid = async ({ user_id, user_password }: ILoginForm) => {
        // const user = await fetchLogin(data);
        // setValue("email", "");
        // setValue("password", "");

        const response = await loginUser({ user_id, user_password });
        console.log(response);
        if (response.status) {
            // 쿠키에 Refresh Token, store에 Access Token 저장
            setRefreshToken(response.json.refresh_token);
            setAuthToken(setToken(authToken, response.json.access_token));

            return navigate("/");
        } else {
            console.log(response.json);
        }

        //성공하면 해당 user 아이디 패스워드값 셋팅
        // setUser(user);
        //성공하면 해당 url로 이동(main페이지로)
        // history.replace("/");

        //! 특정 항목에 해당되는 에러가 아니라, 전체 form에 해당되는 에러
        // setError("extraError", { message: "Server offline." });
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
                    </GridLoginStyle>
                </form>
                <Link to={"/signup"}>SIGN UP</Link>
            </Container>
        </>
    );
}
export default Login;
