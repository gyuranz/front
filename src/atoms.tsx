import { atom, selector } from "recoil";

export const VolumeContidion = atom({
    key: "volume",
    default: false,
});

export const MicCondition = atom({
    key: "mic",
    default: false,
});
