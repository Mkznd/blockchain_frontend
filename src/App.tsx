import { useState, useEffect } from "react";
import { ethers } from "ethers";
import getAbi from "@/getAbi.ts";

// Load the ABI dynamically (or just import it as a static JSON)
const contractABI = await getAbi();

// Your deployed contract address (from Hardhat logs)
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
    // MetaMask / Ethers state
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [crowdfundingContract, setCrowdfundingContract] = useState(null);

    // State to store projects and UI interactions
    const [projects, setProjects] = useState([]);
    const [createForm, setCreateForm] = useState({
        name: "",
        description: "",
        goal: "",
        durationInDays: ""
    });
    const [contributionAmount, setContributionAmount] = useState("");
    const [refundProjectId, setRefundProjectId] = useState("");
    const [withdrawProjectId, setWithdrawProjectId] = useState("");

    // On mount, check for MetaMask
    useEffect(() => {
        if (window.ethereum) {
            const _provider = new ethers.BrowserProvider(window.ethereum);
            setProvider(_provider);
        } else {
            console.log("MetaMask not detected");
        }
    }, []);

    // Connect to MetaMask and setup the contract
    const connectWallet = async () => {
        if (!provider) return;
        try {
            const accounts = await provider.send("eth_requestAccounts", []);
            setAccount(accounts[0]);
            console.log("Connected as:", accounts[0]);

            const _signer = await provider.getSigner();
            setSigner(_signer);

            // Instantiate Crowdfunding contract with signer
            const contract = new ethers.Contract(contractAddress, contractABI, _signer);
            setCrowdfundingContract(contract);

            console.log("Crowdfunding contract connected:", contract);
        } catch (error) {
            console.error("User rejected connection or other error:", error);
        }
    };

    // Create a new project
    const createProject = async () => {
        if (!crowdfundingContract) return;

        const { name, description, goal, durationInDays } = createForm;
        if (!name || !description || !goal || !durationInDays) {
            alert("Please fill in all fields to create a project.");
            return;
        }
        try {
            const tx = await crowdfundingContract.createProject(
                name,
                description,
                ethers.parseEther(goal),      // parse the "goal" field as ETH
                parseInt(durationInDays, 10)  // convert string to integer
            );
            console.log("Create Project Tx submitted:", tx.hash);
            await tx.wait();
            console.log("Project created!");

            // Reset form
            setCreateForm({ name: "", description: "", goal: "", durationInDays: "" });
            // Reload the projects so we see the newly created one
            loadAllProjects();
        } catch (error) {
            console.error("Error creating project:", error);
        }
    };

    // Load all projects from the contract
    const loadAllProjects = async () => {
        if (!crowdfundingContract) return;
        try {
            const all = await crowdfundingContract.getAllProjects();
            // `all` is an array of structs (owner, name, description, goal, fundsRaised, deadline, token, status, exists)
            setProjects(all);
            console.log("Projects loaded:", all);
        } catch (error) {
            console.error("Error loading projects:", error);
        }
    };

    // Contribute (donate) to a specific project
    const contribute = async (projectId) => {
        if (!crowdfundingContract) return;
        if (!contributionAmount) {
            alert("Enter a contribution amount first.");
            return;
        }
        try {
            const tx = await crowdfundingContract.contribute(projectId, {
                value: ethers.parseEther(contributionAmount)
            });
            console.log(`Contribute Tx submitted: ${tx.hash}`);
            await tx.wait();
            console.log("Contribution successful!");
            // Refresh projects to see updated fundsRaised
            loadAllProjects();
        } catch (error) {
            console.error("Error contributing:", error);
        }
    };

    // Refund a project (if deadline passed and goal not met)
    const refund = async () => {
        if (!crowdfundingContract) return;
        if (refundProjectId === "") {
            alert("Enter a valid project ID to refund.");
            return;
        }
        try {
            const tx = await crowdfundingContract.refund(refundProjectId);
            console.log("Refund Tx submitted:", tx.hash);
            await tx.wait();
            console.log("Refund successful!");
            // Reload
            loadAllProjects();
        } catch (error) {
            console.error("Error refunding:", error);
        }
    };

    // Withdraw funds if the project is successful and you are the owner
    const withdrawFunds = async () => {
        if (!crowdfundingContract) return;
        if (withdrawProjectId === "") {
            alert("Enter a valid project ID to withdraw from.");
            return;
        }
        try {
            const tx = await crowdfundingContract.withdrawFunds(withdrawProjectId);
            console.log("Withdraw Tx submitted:", tx.hash);
            await tx.wait();
            console.log("Withdraw successful!");
            // Reload
            loadAllProjects();
        } catch (error) {
            console.error("Error withdrawing:", error);
        }
    };

    // Rendering each project with some basic info
    const renderProject = (project, index) => {
        const { owner, name, description, goal, fundsRaised, deadline, status, exists } = project;

        // Convert big numbers to ETH (for goal/funds) or to normal timestamps
        const goalEth = ethers.formatEther(goal);
        const raisedEth = ethers.formatEther(fundsRaised);

        // status: 0=Active, 1=Successful, 2=Failed
        console.log("Status:", status);
        let statusLabel = "";
        if (status === 0n) statusLabel = "Active";
        else if (status === 1n) statusLabel = "Successful";
        else if (status === 2n) statusLabel = "Failed";

        // Deadline is a Unix timestamp (seconds). Convert to a date
        const deadlineDate = new Date(Number(deadline) * 1000).toLocaleString();

        return (
            <div key={index} style={{ margin: "1rem 0", border: "1px solid #ccc", padding: "1rem" }}>
                <p><strong>ID:</strong> {index}</p>
                <p><strong>Name:</strong> {name}</p>
                <p><strong>Description:</strong> {description}</p>
                <p><strong>Owner:</strong> {owner}</p>
                <p><strong>Goal:</strong> {goalEth} ETH</p>
                <p><strong>Funds Raised:</strong> {raisedEth} ETH</p>
                <p><strong>Deadline:</strong> {deadlineDate}</p>
                <p><strong>Status:</strong> {statusLabel} </p>
                <p><strong>Exists:</strong> {exists ? "Yes" : "No"}</p>

                {/* Contribute button */}
                {statusLabel === "Active" && (
                    <div style={{ marginTop: "0.5rem" }}>
                        <input
                            placeholder="Contribution in ETH"
                            value={contributionAmount}
                            onChange={(e) => setContributionAmount(e.target.value)}
                            style={{ marginRight: "0.5rem" }}
                        />
                        <button onClick={() => contribute(index)}>Contribute</button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div style={{ margin: "2rem" }}>
            <h1>Crowdfunding DApp</h1>
            {/* Connect Wallet */}
            {account ? (
                <p>Connected as: {account}</p>
            ) : (
                <button onClick={connectWallet}>Connect MetaMask</button>
            )}

            {/* Create Project */}
            <section style={{ marginTop: "2rem" }}>
                <h2>Create a Project</h2>
                <div style={{ display: "flex", flexDirection: "column", maxWidth: "300px" }}>
                    <input
                        placeholder="Name"
                        value={createForm.name}
                        onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                        style={{ marginBottom: "0.5rem" }}
                    />
                    <input
                        placeholder="Description"
                        value={createForm.description}
                        onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                        style={{ marginBottom: "0.5rem" }}
                    />
                    <input
                        placeholder="Goal in ETH"
                        value={createForm.goal}
                        onChange={(e) => setCreateForm({ ...createForm, goal: e.target.value })}
                        style={{ marginBottom: "0.5rem" }}
                    />
                    <input
                        placeholder="Duration (days)"
                        value={createForm.durationInDays}
                        onChange={(e) => setCreateForm({ ...createForm, durationInDays: e.target.value })}
                        style={{ marginBottom: "0.5rem" }}
                    />
                    <button onClick={createProject} disabled={!crowdfundingContract}>
                        Create Project
                    </button>
                </div>
            </section>

            {/* Load All Projects */}
            <section style={{ marginTop: "2rem" }}>
                <button onClick={loadAllProjects} disabled={!crowdfundingContract}>
                    Load All Projects
                </button>
                {projects.length > 0 && (
                    <div style={{ marginTop: "1rem" }}>
                        <h2>All Projects</h2>
                        {projects.map((proj, idx) => renderProject(proj, idx))}
                    </div>
                )}
            </section>

            {/* Refund Section */}
            <section style={{ marginTop: "2rem" }}>
                <h3>Refund (if not successful & deadline passed)</h3>
                <input
                    placeholder="Project ID"
                    value={refundProjectId}
                    onChange={(e) => setRefundProjectId(e.target.value)}
                    style={{ marginRight: "0.5rem" }}
                />
                <button onClick={refund} disabled={!crowdfundingContract}>Refund</button>
            </section>

            {/* Withdraw Section */}
            <section style={{ marginTop: "2rem" }}>
                <h3>Withdraw Funds (if you are owner & project is successful)</h3>
                <input
                    placeholder="Project ID"
                    value={withdrawProjectId}
                    onChange={(e) => setWithdrawProjectId(e.target.value)}
                    style={{ marginRight: "0.5rem" }}
                />
                <button onClick={withdrawFunds} disabled={!crowdfundingContract}>Withdraw</button>
            </section>
        </div>
    );
}

export default App;
