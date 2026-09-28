const errorHandler = (error, request, response, next) => {
    console.log(error.stack);

    response.status(error.status || 500).json ({
        Error: true,
        Message: error.message || "Something went wrong"
    });
};


module.exports = {errorHandler};