const apiError = (statusCode, message = 'Something went wrong', errors = []) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.errors = errors;
    error.success = false;
    error.isApiError = true;
    return error;
};

module.exports = apiError;