import { atom, selector } from "recoil";

export const AuthLogin = atom({
    key: "AuthLogin",
    default: {
        isLoggedIn: false,
        userId: "",
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
