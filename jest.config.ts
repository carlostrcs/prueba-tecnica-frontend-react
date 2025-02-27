import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    testPathIgnorePatterns: ['<rootDir>/src/tests/e2e/'],
    coverageDirectory: '<rootDir>/src/tests/unit/coverage',
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',  // Transforma archivos TypeScript/TSX con ts-jest

    },
    moduleNameMapper: {
        // Mocks para archivos estáticos (CSS, imágenes, etc.)
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
        '\\.(gif|png|jpe?g|svg)$': '<rootDir>/src/test/__mocks__/fileMock.js'
    },
    setupFilesAfterEnv: ['<rootDir>/setupTests.ts']

};

export default config;
