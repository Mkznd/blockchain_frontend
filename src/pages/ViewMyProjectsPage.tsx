import useDAppStore from "@/store/store.ts";
import ProjectList from "@/components/ProjectList.tsx";
import {useEffect} from "react";

export default function ViewMyProjectsPage(){
    const { projects, loadMyProjects } = useDAppStore();

    useEffect(() => {
        loadMyProjects()
    }, []);

    return (
        <div className="container py-4">
            <h2 className="mb-4">My Projects</h2>
            <ProjectList projects={projects}></ProjectList>
        </div>
    );
}
