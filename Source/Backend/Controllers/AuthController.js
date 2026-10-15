const authServices = require('../Services/AuthServices.js');
const userRepository = require('../Database/UserRepository.js');

async function signup(request, response) {
    const userData = await authServices.userDataValidator(request.body);

    const newUser = await userRepository.createUser(userData);

    return response.status(201).json({
        message: 'User created successfully',
        user: newUser,
    });
}

module.exports = {
    signup,
};