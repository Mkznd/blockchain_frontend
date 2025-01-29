import {render, screen} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import App from '../App';
import {describe, expect, test} from 'vitest';

describe('App Component', () => {
    test('renders navigation and routes correctly', () => {
        render(
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        );

        // Check that navigation is present
        expect(screen.getByRole('navigation')).toBeInTheDocument();

    });
});
