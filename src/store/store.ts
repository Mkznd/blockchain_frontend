import { create } from "zustand";
import { ethers } from "ethers";
import getAbi from "@/getAbi.ts";
import Project from "@/types/Project.ts";

interface DAppState {
    account: string | null;
    provider: ethers.BrowserProvider | null;
    signer: ethers.JsonRpcSigner | null;
    crowdfundingContract: ethers.Contract | null;
    projects: Project[];
    contractAbi: any;

    connectWallet: (contractAddress: string) => Promise<void>;
    loadAllProjects: () => Promise<void>;
    createProject: (name: string, description: string, goal: string, durationInDays: string) => Promise<void>;
    contribute: (projectId: string, amount: string) => Promise<void>;
    refund: (projectId: string) => Promise<void>;
    withdrawFunds: (projectId: string) => Promise<void>;
    loadMyProjects: () => Promise<void>;
}

const useDAppStore = create<DAppState>((set, get) => ({
    account: null,
    provider: null,
    signer: null,
    crowdfundingContract: null,
    projects: [],
    contractAbi: undefined,


    connectWallet: async (contractAddress) => {
        const contractAbi = await getAbi();
        console.log(contractAbi);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractAbi, signer);

        set({ provider, signer, account: accounts[0], crowdfundingContract: contract });
    },

    loadAllProjects: async () => {
        const { crowdfundingContract, account } = get();
        if (!crowdfundingContract) return;

        try {
            const projects = await crowdfundingContract.getAllProjects();
            set({ projects });
        } catch (error) {
            console.error("Error loading projects:", error);
        }
    },

    loadMyProjects: async () => {
        const { crowdfundingContract, account } = get();
        if (!crowdfundingContract) return;

        try {
            const projects = await crowdfundingContract.getProjectsByOwner(account);
            set({ projects });
        } catch (error) {
            console.error("Error loading projects:", error);
        }
    },

    createProject: async (name, description, goal, durationInDays) => {
        const { crowdfundingContract, loadAllProjects } = get();
        if (!crowdfundingContract) return;

        try {
            const tx = await crowdfundingContract.createProject(
                name,
                description,
                ethers.parseEther(goal),
                parseInt(durationInDays, 10)
            );
            await tx.wait();
            loadAllProjects();
        } catch (error) {
            console.error("Error creating project:", error);
        }
    },

    contribute: async (projectId, amount) => {
        const { crowdfundingContract, loadAllProjects } = get();
        if (!crowdfundingContract) return;

        try {
            const tx = await crowdfundingContract.contribute(projectId, {
                value: ethers.parseEther(amount),
            });
            await tx.wait();
            loadAllProjects();
        } catch (error) {
            console.error("Contribution error:", error);
        }
    },

    refund: async (projectId) => {
        const { crowdfundingContract, loadAllProjects } = get();
        if (!crowdfundingContract) return;

        try {
            const tx = await crowdfundingContract.refund(projectId);
            await tx.wait();
            loadAllProjects();
        } catch (error) {
            console.error("Refund error:", error);
        }
    },

    withdrawFunds: async (projectId) => {
        const { crowdfundingContract, loadAllProjects } = get();
        if (!crowdfundingContract) return;

        try {
            const tx = await crowdfundingContract.withdrawFunds(projectId);
            await tx.wait();
            loadAllProjects();
        } catch (error) {
            console.error("Withdraw error:", error);
        }
    },
}));

export default useDAppStore;
