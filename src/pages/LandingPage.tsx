import useDAppStore from "@/store/store.ts";
import {useNavigate} from "react-router-dom";


const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS as string;

const LoginPage: React.FC = () => {
    const isLoggedIn = useDAppStore();
    const { connectWallet, account } = useDAppStore();
    const navigate= useNavigate();

    if(isLoggedIn) {
        navigate("/all-projects", {replace: true});
    }

    return (
        <div className="container text-center">
            <h2>Welcome to Crowdfunding DApp</h2>
    {account ? (
        <p>Connected as: {account}</p>
    ) : (
        <button
            onClick={() => connectWallet(contractAddress)}
        className="btn btn-secondary"
            >
            Connect Wallet
    </button>
    )}
    </div>
);
};

export default LoginPage;
