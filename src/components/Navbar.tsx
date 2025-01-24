import { Link } from "react-router-dom";

const Navbar = () => (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
            <Link to="/" className="navbar-brand">Crowdfunding DApp</Link>
            <div className="collapse navbar-collapse">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <Link to="/create-project" className="nav-link">Create Project</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/my-projects" className="nav-link">My Projects</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/all-projects" className="nav-link">All Projects</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/refund" className="nav-link">Refund</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/withdraw" className="nav-link">Withdraw</Link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
);

export default Navbar;
