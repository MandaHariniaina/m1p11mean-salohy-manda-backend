class CompteMontantError extends Error {
    constructor(message) {
        super(message); 
        this.name = 'CompteMontantError';
    }
}

module.exports = CompteMontantError