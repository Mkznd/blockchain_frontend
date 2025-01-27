import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore.ts";

const HomeCheck: React.FC = () => {
    const { isLoggedIn } = useAuthStore();
    // If user is logged in -> go to /all-projects
    // If not -> go to /login
    return isLoggedIn
        ? <Navigate to="/all-projects" replace />
        : <Navigate to="/login" replace />;
};

export default HomeCheck;
