import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// import Main from "./components/Main";
// import Room from "./components/room_components/Room";
// import Signup from "./components/Signup";
// import Finished from "./components/main_componets/Finished";
// import Create from "./components/main_componets/Create";
// import Join from "./components/main_componets/Join";
import Login from "./components/Login";
import PageRoute from "./components/PageRoute";

const Main = React.lazy(() => import("./components/Main"));
const Signup = React.lazy(() => import("./components/Signup"));
const Room = React.lazy(() => import("./components/room_components/Room"));
const Finished = React.lazy(
    () => import("./components/main_componets/Finished")
);
const Create = React.lazy(() => import("./components/main_componets/Create"));
const Join = React.lazy(() => import("./components/main_componets/Join"));

function App() {
    return (
        <>
            <BrowserRouter>
                <Suspense fallback={<div className="center">Loading...</div>}>
                    <Routes>
                        {/* <Route path="/auth">
                        <Route path="login" element={<Login />} />
                        <Route path="signup" element={<Signup />} />
                    </Route> */}

                        <Route path="auth/login" element={<Login />} />
                        <Route path="auth/signup" element={<Signup />} />

                        <Route path=":uid/*" element={<Main />} />
                        <Route path="room/:room_id/*" element={<Room />} />
                        <Route path="*" element={<PageRoute />} />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </>
    );
}

export default App;
