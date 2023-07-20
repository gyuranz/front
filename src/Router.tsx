import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Main from "./components/Main";

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="users/login" element={<Login />} />
                <Route path="users/signup" element={<Signup />} />
                <Route path="users/:uid" element={<Main />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;
