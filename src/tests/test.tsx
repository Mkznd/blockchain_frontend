import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ethers } from 'ethers';
import useAuthStore from '../store/authStore';
import useDAppStore from '../store/store';
import LoginPage from '../pages/LoginPage';
import CreateProjectPage from '../pages/CreateProjectPage';
import ViewAllProjectsPage from '../pages/ViewAllProjectsPage';
import ProjectList from '../components/ProjectList';
import { ProjectStatus } from '../types/Project';

// Mock modules
vi.mock('ethers');
vi.mock('../store/authStore');
vi.mock('../store/store');
vi.mock('axios');

const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('LoginPage', () => {
    const mockLogin = vi.fn();
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.mocked(useAuthStore).mockReturnValue({
            login: mockLogin,
            isLoggedIn: false,
            token: null,
            logout: vi.fn(),
        });
    });

    it('renders login form', () => {
        renderWithRouter(<LoginPage />);
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('handles login submission', async () => {
        renderWithRouter(<LoginPage />);

        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalled();
        });
    });
});

describe('CreateProjectPage', () => {
    const mockCreateProject = vi.fn();

    beforeEach(() => {
        vi.mocked(useDAppStore).mockReturnValue({
            createProject: mockCreateProject,
            account: '0x123',
            projects: [],
            provider: null,
            signer: null,
            crowdfundingContract: null,
            connectWallet: vi.fn(),
            loadAllProjects: vi.fn(),
            contribute: vi.fn(),
            refund: vi.fn(),
            withdrawFunds: vi.fn(),
            loadMyProjects: vi.fn(),
        });
    });

    it('renders project creation form', () => {
        render(<CreateProjectPage />);
        expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/description/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/goal/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/duration/i)).toBeInTheDocument();
    });

    it('handles project creation', () => {
        render(<CreateProjectPage />);

        fireEvent.change(screen.getByPlaceholderText(/name/i), { target: { value: 'Test Project' } });
        fireEvent.change(screen.getByPlaceholderText(/description/i), { target: { value: 'Test Description' } });
        fireEvent.change(screen.getByPlaceholderText(/goal/i), { target: { value: '1' } });
        fireEvent.change(screen.getByPlaceholderText(/duration/i), { target: { value: '30' } });
        fireEvent.click(screen.getByRole('button', { name: /create project/i }));

        expect(mockCreateProject).toHaveBeenCalledWith('Test Project', 'Test Description', '1', '30');
    });
});

describe('ProjectList', () => {
    const mockProjects = [
        {
            projectId: BigInt(1),
            owner: '0x123',
            name: 'Test Project',
            description: 'Test Description',
            goal: BigInt(1000000000000000000), // 1 ETH
            fundsRaised: BigInt(500000000000000000), // 0.5 ETH
            deadline: BigInt(Date.now() + 86400000),
            token: '0x456',
            status: ProjectStatus.Active,
            exists: true,
        }
    ];

    const mockContribute = vi.fn();
    const mockWithdrawFunds = vi.fn();

    beforeEach(() => {
        vi.mocked(useDAppStore).mockReturnValue({
            contribute: mockContribute,
            withdrawFunds: mockWithdrawFunds,
            account: '0x123',
            projects: [],
            provider: null,
            signer: null,
            crowdfundingContract: null,
            connectWallet: vi.fn(),
            loadAllProjects: vi.fn(),
            createProject: vi.fn(),
            refund: vi.fn(),
            loadMyProjects: vi.fn(),
        });
    });

    it('renders project list correctly', () => {
        render(<ProjectList projects={mockProjects} />);
        expect(screen.getByText('Test Project')).toBeInTheDocument();
        expect(screen.getByText(/0x123/)).toBeInTheDocument();
        expect(screen.getByText(/Test Description/)).toBeInTheDocument();
    });

    it('shows contribution input for active projects', () => {
        render(<ProjectList projects={mockProjects} />);
        expect(screen.getByPlaceholderText(/contribute/i)).toBeInTheDocument();
    });

    it('handles contribution submission', () => {
        render(<ProjectList projects={mockProjects} />);

        fireEvent.change(screen.getByPlaceholderText(/contribute/i), { target: { value: '0.1' } });
        fireEvent.click(screen.getByRole('button', { name: /contribute!/i }));

        expect(mockContribute).toHaveBeenCalledWith('1', '0.1');
    });
});

describe('ViewAllProjectsPage', () => {
    const mockLoadAllProjects = vi.fn();

    beforeEach(() => {
        vi.mocked(useDAppStore).mockReturnValue({
            loadAllProjects: mockLoadAllProjects,
            projects: [],
            account: '0x123',
            provider: null,
            signer: null,
            crowdfundingContract: null,
            connectWallet: vi.fn(),
            createProject: vi.fn(),
            contribute: vi.fn(),
            refund: vi.fn(),
            withdrawFunds: vi.fn(),
            loadMyProjects: vi.fn(),
        });
    });

    it('loads projects on mount', () => {
        render(<ViewAllProjectsPage />);
        expect(mockLoadAllProjects).toHaveBeenCalled();
    });

    it('renders projects heading', () => {
        render(<ViewAllProjectsPage />);
        expect(screen.getByText(/all projects/i)).toBeInTheDocument();
    });
});
