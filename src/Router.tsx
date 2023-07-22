import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Main from "./components/Main";
import PageRoute from "./components/PageRoute";
import Create from "./components/main_componets/Create";
import Finished from "./components/main_componets/Finished";
import Join from "./components/main_componets/Join";
import Room from "./components/room_components/Room";

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/:uid" element={<Main />}>
                    <Route path="finished" element={<Finished />} />
                    <Route path="join" element={<Join />} />
                    <Route path="create" element={<Create />} />
                </Route>
                <Route path="/:user_id/:room_id" element={<Room />}>
                    <Route path="playground" />
                    <Route path="summary" />
                    <Route path="question" />
                    <Route path="quiz" />
                </Route>
                <Route path="auth">
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<Signup />} />
                </Route>
                <Route path="/*" element={<PageRoute />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;
