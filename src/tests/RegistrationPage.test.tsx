import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import axios from 'axios';
import RegistrationPage from '../pages/RegistrationPage';
import {beforeEach, describe, expect, test, vi} from 'vitest';

// Mock axios
vi.mock('axios');

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

// Mock auth store
vi.mock('../store/authStore', () => ({
    default: () => ({
        login: vi.fn(),
    }),
}));

describe('RegistrationPage Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renders registration form with all fields', () => {
        render(
            <BrowserRouter>
                <RegistrationPage/>
            </BrowserRouter>
        );

        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /register/i})).toBeInTheDocument();
    });

    test('submits registration form successfully', async () => {
        // Setup mock response
        const mockResponse = {data: {token: 'fake-token'}};
        (axios.post as jest.Mock).mockResolvedValueOnce(mockResponse);

        render(
            <BrowserRouter>
                <RegistrationPage/>
            </BrowserRouter>
        );

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/username/i), {
            target: {value: 'testuser', name: 'username'}
        });
        fireEvent.change(screen.getByLabelText(/full name/i), {
            target: {value: 'Test User', name: 'name'}
        });
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: {value: 'test@example.com', name: 'email'}
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: {value: 'password123', name: 'password'}
        });

        // Submit the form
        fireEvent.click(screen.getByRole('button', {name: /register/i}));

        // Wait for and verify the API call
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                expect.stringContaining('/user'),
                {
                    username: 'testuser',
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123'
                }
            );
        });

        // Verify navigation
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });
    });

    test('displays error message on registration failure', async () => {
        // Setup mock error response
        const errorMessage = 'Username already exists';
        (axios.post as jest.Mock).mockRejectedValueOnce({
            response: {data: {detail: errorMessage}}
        });

        render(
            <BrowserRouter>
                <RegistrationPage/>
            </BrowserRouter>
        );

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/username/i), {
            target: {value: 'existinguser', name: 'username'}
        });
        fireEvent.change(screen.getByLabelText(/full name/i), {
            target: {value: 'Test User', name: 'name'}
        });
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: {value: 'test@example.com', name: 'email'}
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: {value: 'password123', name: 'password'}
        });

        // Submit the form
        fireEvent.click(screen.getByRole('button', {name: /register/i}));

        // Wait for error message to appear
        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });
    });

    test('navigates to login page when clicking login link', () => {
        render(
            <BrowserRouter>
                <RegistrationPage/>
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText(/login here/i));
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
});
