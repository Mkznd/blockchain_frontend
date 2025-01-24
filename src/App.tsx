import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import CreateProjectPage from "./pages/CreateProjectPage";
import ViewAllProjectsPage from "./pages/ViewAllProjectsPage";
import RefundPage from "./pages/RefundPage";
import WithdrawPage from "./pages/WithdrawPage";
import Navbar from "@/components/Navbar.tsx";
import ViewMyProjectsPage from "@/pages/ViewMyProjectsPage.tsx";

const App = () => {
    return (
        <div>
        <Navbar />
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/create-project" element={<CreateProjectPage />} />
            <Route path="/all-projects" element={<ViewAllProjectsPage />} />
            <Route path="/my-projects" element={<ViewMyProjectsPage />} />
            <Route path="/refund" element={<RefundPage />} />
            <Route path="/withdraw" element={<WithdrawPage />} />
        </Routes>
        </div>
    );
};

export default App;
