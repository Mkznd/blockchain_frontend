import Project, {ProjectStatus} from "@/types/Project.ts";
import {useState} from "react";
import useDAppStore from "@/store/store.ts";

export default function ProjectList({projects} : {projects: Project[]}) {
    const {contribute} = useDAppStore();
    const [form, setForm] = useState({ goal: "" });

    const formatEther = (value: bigint): string => {
        const etherValue = Number(value) / 10 ** 18;
        return etherValue.toLocaleString(undefined, { maximumFractionDigits: 4 });
    };

    const calculatePercentage = (fundsRaised: bigint, goal: bigint): number => {
        if (goal === BigInt(0)) return 0;
        return Number((fundsRaised * BigInt(100)) / goal);
    };
    return (
        <>
            {projects.map((project, index) => (
                <div key={index} className="card mb-4 shadow-sm">
                    <div className="card-body">
                        <h5 className="card-title text-primary">{project.name}</h5>
                        <h6 className="card-subtitle mb-2 text-muted">Owned by: {project.owner}</h6>

                        <p className="card-text mb-3">{project.description}</p>

                        <div className="mb-3">
                            <strong>Project:</strong> {project.projectId.toLocaleString()}<br />
                            <strong>Goal:</strong> {formatEther(project.goal)} ETH<br />
                            <strong>Funds Raised:</strong> {formatEther(project.fundsRaised)} ETH<br />
                            <strong>Status:</strong> {ProjectStatus[project.status]} <br />
                            <strong>Deadline:</strong> {new Date(Number(project.deadline)).toLocaleDateString()} <br />
                            <strong>Token:</strong> {project.token}
                        </div>

                        <div className="progress" style={{ height: "10px" }}>
                            <div
                                className="progress-bar bg-success"
                                role="progressbar"
                                style={{ width: `${calculatePercentage(project.fundsRaised, project.goal)}%` }}
                                aria-valuenow={calculatePercentage(project.fundsRaised, project.goal)}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            ></div>
                        </div>

                        <p className="mt-2 text-muted">
                            {calculatePercentage(project.fundsRaised, project.goal).toFixed(2)}% funded
                        </p>

                        {
                            project.status === ProjectStatus.Active && (
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Contribute (ETH)"
                                        value={form.goal}
                                        onChange={(e) => setForm({ ...form, goal: e.target.value })}
                                        className="form-control mb-2"
                                    />
                                    <button className={'btn btn-secondary'} onClick={() => {
                                        contribute(project.projectId.toLocaleString(), form.goal);
                                        setForm({ goal: "" });
                                    }}>Contribute!</button>
                                </div>

                            )
                        }
                    </div>
                </div>
            ))}
        </>
    )

}
