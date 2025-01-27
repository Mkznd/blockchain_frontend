import {Routes, Route, Navigate, useNavigate} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import CreateProjectPage from "./pages/CreateProjectPage";
import ViewAllProjectsPage from "./pages/ViewAllProjectsPage";
import RefundPage from "./pages/RefundPage";
import Navbar from "@/components/Navbar.tsx";
import ViewMyProjectsPage from "@/pages/ViewMyProjectsPage.tsx";
import HomeCheck from "@/components/HomeCheck";
import useAuthStore from "@/store/authStore.ts";
import RegistrationPage from "@/pages/RegistrationPage.tsx";
import {useEffect} from "react";
import LandingPage from "@/pages/LandingPage.tsx"; // The new redirect component

const App = () => {
    // use etherium name server for user friendly names
    // use blockchain explorer so that the user can see the transaction, wallets and tokens
    // automatic deployment of blockchain
    return (
        <div>
            <Navbar />
            <Routes>
                <Route path="/" element={<LandingPage />} />

                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/create-project" element={<CreateProjectPage />} />
                <Route path="/all-projects" element={<ViewAllProjectsPage />} />
                <Route path="/my-projects" element={<ViewMyProjectsPage />} />
                <Route path="/refund" element={<RefundPage />} />
            </Routes>
        </div>
    );
};

export default App;
