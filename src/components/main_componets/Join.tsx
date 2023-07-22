import React from "react";
import { AuthLogin } from "../../atoms";
import { useRecoilState } from "recoil";
import { useParams } from "react-router-dom";

function Join() {
    const [userState, setUserState] = useRecoilState(AuthLogin);
    const room_name = useParams();
    console.log(room_name);
    console.log(userState.userJoinedRoomList);
    return (
        <>
            <div>,jhmvg</div>
            {/* <div>hello, {userState.userNickname}</div>
            <div>{userState.userJoinedRoomList}</div> */}
        </>
    );
}

export default Join;
