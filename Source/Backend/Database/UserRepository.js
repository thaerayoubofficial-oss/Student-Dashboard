const databaseServices = require('../Database/DatabaseServices.js');

async function createUser(userData) { 
const [result] = await databaseServices.query(
    `INSERT INTO users
     (first_name, last_name, email, password_hash)
     VALUES (?, ?, ?, ?)`,
    [
        userData.first_name,
        userData.last_name,
        userData.email,
        userData.password_hash
    ]
);}

module.exports = {
    createUser,
};