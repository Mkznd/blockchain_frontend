import { useEffect } from "react";
import useDAppStore from "@/store/store";
import ProjectList from "@/components/ProjectList.tsx";

const ViewAllProjectsPage: React.FC = () => {
    const { projects, loadAllProjects, totalPages, currentPage } = useDAppStore();

    useEffect(() => {
        loadAllProjects(currentPage);
    }, [currentPage]);

    const nextPage = () => {
        if (currentPage < totalPages) {
            loadAllProjects(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            loadAllProjects(currentPage - 1);
        }
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4">All Projects</h2>
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
};

export default ViewAllProjectsPage;
