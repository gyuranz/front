import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Join from "./components/Join";
import Main from "./components/Main";

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/join" element={<Join />} />
                <Route path="/" element={<Main />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;
