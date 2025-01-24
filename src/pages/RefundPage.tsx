import { useState } from "react";
import useDAppStore from "../store/store";

const RefundPage: React.FC = () => {
    const { refund } = useDAppStore();
    const [projectId, setProjectId] = useState("");

    const handleRefund = () => {
        refund(projectId);
        setProjectId("");
    };

    return (
        <div className="container">
            <h2>Request a Refund</h2>
            <input
                type="text"
                placeholder="Project ID"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="form-control mb-3"
            />
            <button onClick={handleRefund} className="btn btn-danger">
                Refund
            </button>
        </div>
    );
};

export default RefundPage;
