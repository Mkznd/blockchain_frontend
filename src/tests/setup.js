import {afterEach} from 'vitest'
import 'jest';
import {cleanup} from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// runs a clean after each tests case (e.g. clearing jsdom)
afterEach(() => {
    cleanup();
})
