import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import axios from 'axios';
import LoginPage from '../pages/LoginPage';
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
const mockLogin = vi.fn();
vi.mock('../store/authStore', () => ({
    default: () => ({
        login: mockLogin,
    }),
}));

describe('LoginPage Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renders login form with all fields', () => {
        render(
            <BrowserRouter>
                <LoginPage/>
            </BrowserRouter>
        );

        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /login/i})).toBeInTheDocument();
    });

    test('submits login form successfully', async () => {
        const mockToken = 'fake-token';
        const mockResponse = {data: {token: mockToken}};
        (axios.post as jest.Mock).mockResolvedValueOnce(mockResponse);

        render(
            <BrowserRouter>
                <LoginPage/>
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/username/i), {
            target: {value: 'testuser', name: 'username'}
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: {value: 'password123', name: 'password'}
        });

        fireEvent.submit(screen.getByRole('button', {name: /login/i}));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                expect.stringContaining('/auth/login'),
                {
                    username: 'testuser',
                    password: 'password123'
                }
            );
        });

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith(mockToken);
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });

    test('displays error message on login failure', async () => {
        const errorMessage = 'Invalid credentials';
        (axios.post as jest.Mock).mockRejectedValueOnce({
            response: {data: {detail: errorMessage}}
        });

        render(
            <BrowserRouter>
                <LoginPage/>
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/username/i), {
            target: {value: 'wronguser', name: 'username'}
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: {value: 'wrongpass', name: 'password'}
        });

        fireEvent.submit(screen.getByRole('button', {name: /login/i}));

        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });
    });

    test('navigates to registration page when clicking register link', () => {
        render(
            <BrowserRouter>
                <LoginPage/>
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText(/register here/i));
        expect(mockNavigate).toHaveBeenCalledWith('/register');
    });
});
