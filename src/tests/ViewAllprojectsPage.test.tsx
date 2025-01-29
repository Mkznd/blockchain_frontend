import {fireEvent, render, screen} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import ViewAllProjectsPage from '../pages/ViewAllProjectsPage';
import {beforeEach, describe, expect, test, vi} from 'vitest';

const mockLoadAllProjects = vi.fn();
const mockProjects = [
    {
        id: '1',
        name: 'Project 1',
        description: 'Description 1',
        goal: '1.5',
        durationInDays: '30',
        owner: '0x123',
        currentAmount: '0.5',
        isActive: true,
    }
];

vi.mock('../store/store', () => ({
    default: () => ({
        projects: mockProjects,
        loadAllProjects: mockLoadAllProjects,
        totalPages: 3,
        currentPage: 2
    }),
}));

// Mock ProjectList component
vi.mock('../components/ProjectList', () => ({
    default: ({projects}: { projects: typeof mockProjects }) => (
        <div data-testid="project-list">
            {projects.map(project => (
                <div key={project.id}>{project.name}</div>
            ))}
        </div>
    ),
}));

describe('ViewAllProjectsPage Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renders page title and project list', () => {
        render(
            <BrowserRouter>
                <ViewAllProjectsPage/>
            </BrowserRouter>
        );

        expect(screen.getByText(/all projects/i)).toBeInTheDocument();
        expect(screen.getByTestId('project-list')).toBeInTheDocument();
        expect(screen.getByText('Project 1')).toBeInTheDocument();
    });

    test('renders pagination controls', () => {
        render(
            <BrowserRouter>
                <ViewAllProjectsPage/>
            </BrowserRouter>
        );

        expect(screen.getByText(/page 2 of 3/i)).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /previous/i})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /next/i})).toBeInTheDocument();
    });

    test('loads projects on mount with current page', () => {
        render(
            <BrowserRouter>
                <ViewAllProjectsPage/>
            </BrowserRouter>
        );

        expect(mockLoadAllProjects).toHaveBeenCalledWith(2);
    });

    test('handles pagination correctly', () => {
        render(
            <BrowserRouter>
                <ViewAllProjectsPage/>
            </BrowserRouter>
        );

        fireEvent.click(screen.getByRole('button', {name: /next/i}));
        expect(mockLoadAllProjects).toHaveBeenCalledWith(3);

        fireEvent.click(screen.getByRole('button', {name: /previous/i}));
        expect(mockLoadAllProjects).toHaveBeenCalledWith(1);
    });
});
