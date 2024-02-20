class CompteInexistantError extends Error {
    constructor(message) {
        super(message); 
        this.name = 'CompteInexistantError';
    }
}

module.exports = CompteInexistantError