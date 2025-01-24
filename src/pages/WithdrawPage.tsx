import { useState } from "react";
import useDAppStore from "../store/store.ts";

const WithdrawPage: React.FC = () => {
    const { withdrawFunds } = useDAppStore();
    const [projectId, setProjectId] = useState("");

    const handleWithdraw = () => {
        withdrawFunds(projectId);
        setProjectId("");
    };

    return (
        <div className="container">
            <h2>Withdraw Funds</h2>
            <input
                type="text"
                placeholder="Project ID"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="form-control mb-3"
            />
            <button onClick={handleWithdraw} className="btn btn-success">
                Withdraw
            </button>
        </div>
    );
};

export default WithdrawPage;
