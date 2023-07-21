import { atom, selector } from "recoil";

export const AuthLogin = atom({
    key: "AuthLogin",
    default: {
        isLoggedIn: false,
        userId: "",
        userNickname: "",
        token: "",
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