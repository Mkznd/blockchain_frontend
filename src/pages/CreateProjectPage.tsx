import { useState } from "react";
import useDAppStore from "../store/store.ts";

const CreateProjectPage: React.FC = () => {
    const { createProject } = useDAppStore();
    const [form, setForm] = useState({
        name: "",
        description: "",
        goal: "",
        durationInDays: "",
    });

    const handleSubmit = () => {
        const { name, description, goal, durationInDays } = form;
        createProject(name, description, goal, durationInDays);
        setForm({ name: "", description: "", goal: "", durationInDays: "" });
    };

    return (
        <div className="container">
            <h2>Create a New Project</h2>
            <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="form-control mb-2"
            />
            <input
                type="text"
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="form-control mb-2"
            />
            <input
                type="text"
                placeholder="Goal (ETH)"
                value={form.goal}
                onChange={(e) => setForm({ ...form, goal: e.target.value })}
                className="form-control mb-2"
            />
            <input
                type="text"
                placeholder="Duration (Days)"
                value={form.durationInDays}
                onChange={(e) => setForm({ ...form, durationInDays: e.target.value })}
                className="form-control mb-3"
            />
            <button onClick={handleSubmit} className="btn btn-primary">
                Create Project
            </button>
        </div>
    );
};

export default CreateProjectPage;
