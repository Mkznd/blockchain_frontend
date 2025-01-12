import { useState, useEffect } from "react";
import { ethers } from "ethers";
import getAbi from "@/getAbi.ts";

// 1. Copy your contract's ABI here (shortened example)
const contractABI = await getAbi();
console.log("Contract ABI:", contractABI);

// 2. Your deployed contract address:
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
    const [account, setAccount] = useState(null);
    const [projectCount, setProjectCount] = useState("N/A");
    const [provider, setProvider] = useState(null);
    const [crowdfundingContract, setCrowdfundingContract] = useState(null);

    // On mount, check if window.ethereum is available
    useEffect(() => {
        if (window.ethereum) {
            // Ethers v6 approach:
            const _provider = new ethers.BrowserProvider(window.ethereum);
            setProvider(_provider);
        } else {
            console.log("MetaMask not detected");
        }
    }, []);

    // Connect to MetaMask
    const connectWallet = async () => {
        if (!provider) return;

        try {
            // Request accounts from MetaMask
            const accounts = await provider.send("eth_requestAccounts", []);
            setAccount(accounts[0]);
            console.log("Connected as:", accounts[0]);

            // In Ethers v6, we get the signer from the BrowserProvider
            const signer = await provider.getSigner();

            // Instantiate contract
            const contract = new ethers.Contract(contractAddress, contractABI, signer);
            setCrowdfundingContract(contract);
            console.log("Contract connected:", contract);
        } catch (error) {
            console.error("User rejected connection or other error:", error);
        }
    };

    // Example: call a "view" function from the contract
    const getProjectCount = async () => {
        if (!crowdfundingContract) return;

        try {
            const count = await crowdfundingContract.projectCount();
            setProjectCount(count.toString());
        } catch (error) {
            console.error("Error reading projectCount:", error);
        }
    };

    // Example: send a transaction to create a new project
    const createNewProject = async () => {
        if (!crowdfundingContract) return;

        try {
            const tx = await crowdfundingContract.createProject(
                "MyProject",
                "MyDescription",
                ethers.parseEther("1"), // goal of 1 ETH
                30 // 30 days
            );
            console.log("Transaction submitted:", tx.hash);
            await tx.wait();
            console.log("Project created!");

            // Optionally refresh project count
            getProjectCount();
        } catch (error) {
            console.error("Error creating project:", error);
        }
    };

    return (
        <div style={{ margin: "2rem" }}>
            <h1>Minimal Crowdfunding + MetaMask Demo</h1>

            {account ? (
                <p>Connected as: {account}</p>
            ) : (
                <button onClick={connectWallet}>Connect MetaMask</button>
            )}

            <div style={{ marginTop: "1rem" }}>
                <button onClick={getProjectCount} disabled={!crowdfundingContract}>
                    Get Project Count
                </button>
                <p>Project Count: {projectCount}</p>
            </div>

            <div style={{ marginTop: "1rem" }}>
                <button onClick={createNewProject} disabled={!crowdfundingContract}>
                    Create a Project
                </button>
            </div>
        </div>
    );
}

export default App;
