const argon2 = require('argon2');
const service = require('../Services/Services.js');

async function hashPassword(password) {
    return await argon2.hash(password);
}

async function verifyPassword(hash, password) { 
    return await argon2.verify(hash, password);
}

