import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthStore from "@/store/authStore.ts";


interface LoginCredentials {
    username: string;
    password: string;
}

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const {login} = useAuthStore();
    const [credentials, setCredentials] = useState<LoginCredentials>({
        username: "",
        password: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            // Example: calling your FastAPI JWT login endpoint
            // e.g. POST /auth/login => { "token": "...", "token_type": "bearer" }
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL+"/auth/login", {
                username: credentials.username,
                password: credentials.password,
            });
            const { token } = response.data;
            login(token);

            navigate("/");
        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.detail) {
                setError(err.response.data.detail);
            } else {
                setError("An error occurred during login.");
            }
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "500px" }}>
            <h2 className="mb-4 text-center">Login</h2>
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                        Username
                    </label>
                    <input
                        id="username"
                        name="username"
                        className="form-control"
                        value={credentials.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        className="form-control"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                    Login
                </button>
            </form>

            <div className="mt-3">
                <span>Don't have an account? </span>
                <button
                    className="btn btn-link p-0"
                    onClick={() => navigate("/register")}
                >
                    Register here
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
