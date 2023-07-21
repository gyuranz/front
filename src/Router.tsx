import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Main from "./components/Main";
import PageRoute from "./components/PageRoute";

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="auth">
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<Signup />} />
                </Route>
                <Route path="/:uid" element={<Main />} />
                <Route path="/*" element={<PageRoute />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;
