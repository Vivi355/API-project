const { validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);

    // if there are validation errors, create an error with all the validation error messages
    if (!validationErrors.isEmpty()) {
      const errors = {};
      validationErrors
        .array()
        .forEach(error => errors[error.path] = error.msg);

      const err = Error("Bad request.");
      err.errors = errors;
      err.status = 400;
      err.title = "Bad request.";
      next(err); //invoke the next error-handling middleware
    }
    // if there are no validation errors return from the function, invoke next middleware
    next();
};

module.exports = {
    handleValidationErrors
};
