module.exports = {
    setupFiles: ['<rootDir>/src/setupTests.ts'],
    transform: {
        '^.+\\.[tj]sx?$': 'babel-jest',
    },
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '\\.css$': '<rootDir>/styleMock.js',
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
};
