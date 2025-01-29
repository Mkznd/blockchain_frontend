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
    totalPages: number;
    currentPage: number;

    connectWallet: (contractAddress: string) => Promise<void>;
    loadAllProjects: (page?: number) => Promise<void>;
    loadMyProjects: (page?: number) => Promise<void>;
    createProject: (name: string, description: string, goal: string, durationInDays: string) => Promise<void>;
    contribute: (projectId: string, amount: string) => Promise<void>;
    refund: (projectId: string) => Promise<void>;
    withdrawFunds: (projectId: string) => Promise<void>;
}

const useDAppStore = create<DAppState>((set, get) => ({
    account: null,
    provider: null,
    signer: null,
    crowdfundingContract: null,
    projects: [],
    contractAbi: undefined,
    totalPages: 1,
    currentPage: 1,


    connectWallet: async (contractAddress) => {
        const contractAbi = await getAbi();
        console.log(contractAbi);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractAbi, signer);

        set({ provider, signer, account: accounts[0], crowdfundingContract: contract });
    },

    loadAllProjects: async (page = 1) => {
        const { crowdfundingContract } = get();
        if (!crowdfundingContract) return;

        try {
            const pageSize = 10; // Define how many projects per page
            const result = await crowdfundingContract.getProjects(page, pageSize);
            set({ projects: result, currentPage: page });
        } catch (error) {
            console.error("Error loading projects:", error);
        }
    },

    loadMyProjects: async (page = 1) => {
        const { crowdfundingContract, account, pageSize } = get();
        if (!crowdfundingContract || !account) return;

        try {
            const startIndex = (page - 1) * pageSize;
            const result = await crowdfundingContract.getProjectsByOwner(account, startIndex, pageSize);

            set({ projects: result, currentPage: page });
        } catch (error) {
            console.error("Error loading my projects:", error);
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
