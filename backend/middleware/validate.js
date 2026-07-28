const { z } = require("zod");

// Middleware to validate req.body, req.query, or req.params against a Zod schema
const validate = (schema) => async (req, res, next) => {
  try {
    if (schema.body) {
      req.body = await schema.body.parseAsync(req.body);
    }
    if (schema.query) {
      req.query = await schema.query.parseAsync(req.query);
    }
    if (schema.params) {
      req.params = await schema.params.parseAsync(req.params);
    }
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Format Zod errors nicely for the frontend
      const errorMessages = error.errors.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return res.status(400).json({
        message: "Validation Error",
        errors: errorMessages,
      });
    }
    next(error);
  }
};

module.exports = validate;
