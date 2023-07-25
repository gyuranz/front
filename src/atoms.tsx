import { atom, selector } from "recoil";

export const AuthLogin = atom({
    key: "AuthLogin",
    default: {
        isLoggedIn: false,
        userId: "",
        userNickname: "",
        token: "",
        userJoinedRoomList: [],
        currentRoom: {
            room_id: "",
            room_name: "",
            room_summary: "",
            room_password: "",
        },
    },
});

export const VolumeContidion = atom({
    key: "volume",
    default: false,
});

export const MicCondition = atom({
    key: "mic",
    default: false,
});

export const AuthAtom = atom({
    key: "AuthAtom",
    default: {
        isLoggedIn: false,
        userId: "",
        token: "",
        login: (userId: string, token: string) => {},
        logout: () => {},
    },
});

export const SummaryAtom = atom({
    key: "Summary",
    default: [
        "코드를 보면 알겠지만, 리액트에서 socket을 최상단에서 부르기 때문에 유저정보를 저장할 수 없어, 다른 방식은 없어?",
        "리액트 애플리케이션에서 최상단에서 소켓을 호출하여 유저 정보를 저장하는 것은 어려운 문제입니다. 그러나 이러한 경우에는 다른 방식을 사용하여 유저 정보를 서버에 전달하고 저장할 수 있습니다.",
        "가장 간단한 방법은 로그인 시 유저 정보를 서버로 전달하는 것입니다. 로그인 시 서버로 유저 정보를 전송하여 서버에서 해당 정보를 저장한 뒤, 소켓 연결 시에 해당 정보를 사용하도록 처리할 수 있습니다.",
        "유저가 로그인할 때, 서버에 로그인 요청을 보내고 로그인 성공 시 서버로부터 토큰 또는 유저 ID를 받아올 수 있습니다. 이러한 토큰 또는 유저 ID를 클라이언트 측에서 저장하고, 소켓 연결 시에 해당 정보를 서버로 전송하는 방식으로 구현할 수 있습니다.",
        "예를 들어, 로그인 성공 시 서버로부터 받은 토큰을 로컬 스토리지 또는 쿠키에 저장하고, 소켓 연결 시 헤더에 해당 토큰을 담아서 보내는 방식입니다.",
        "소켓 연결 시 서버에 유저 정보 전달:이 방법은 소켓 연결 시에 추가적인 데이터를 서버로 전달하는 방식입니다. 여기서는 유저 정보를 URL 매개변수를 사용하여 서버로 전달할 수 있습니다.",
    ],
});
