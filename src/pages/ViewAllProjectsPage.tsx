import {useEffect} from "react";
import useDAppStore from "@/store/store";
import ProjectList from "@/components/ProjectList.tsx";

const ViewAllProjectsPage: React.FC = () => {
    const { projects, loadAllProjects } = useDAppStore();

    useEffect(() => {
        loadAllProjects();
    }, []);


    return (
        <div className="container py-4">
            <h2 className="mb-4">All Projects</h2>
            <ProjectList projects={projects}></ProjectList>
        </div>
    );
};

export default ViewAllProjectsPage;
