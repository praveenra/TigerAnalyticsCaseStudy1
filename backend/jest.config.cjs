module.exports = {
    testEnvironment: 'node',
    transform: {
        '^.+\\.js$': 'babel-jest'
    },
    testTimeout: 30000,
    setupFiles: ['<rootDir>/tests/setup.js']
};