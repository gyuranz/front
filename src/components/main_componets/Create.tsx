import React from "react";
import { AuthLogin } from "../../atoms";
import { useRecoilState } from "recoil";

function Create() {
    const [userState, setUserState] = useRecoilState(AuthLogin);

    return <></>;
}

export default Create;
