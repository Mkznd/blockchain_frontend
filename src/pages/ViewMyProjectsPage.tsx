import { useEffect } from "react";
import useDAppStore from "@/store/store.ts";
import ProjectList from "@/components/ProjectList.tsx";

export default function ViewMyProjectsPage() {
    const { projects, loadMyProjects, totalPages, currentPage } = useDAppStore();

    useEffect(() => {
        loadMyProjects(currentPage);
    }, [currentPage]);

    const nextPage = () => {
        if (currentPage < totalPages) {
            loadMyProjects(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            loadMyProjects(currentPage - 1);
        }
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4">My Projects</h2>
            <ProjectList projects={projects} />

            <div className="d-flex justify-content-between mt-3">
                <button className="btn btn-secondary" onClick={prevPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button className="btn btn-secondary" onClick={nextPage} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
}
