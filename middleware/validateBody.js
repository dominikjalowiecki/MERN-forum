const Ajv = require('ajv').default;
const addFormats = require('ajv-formats');

function validateBody(schema) {
  const ajv = new Ajv({
    allErrors: true,
    $data: true,
  });
  addFormats(ajv);
  const validate = ajv.compile(schema);

  return (req, res, next) => {
    const valid = validate(req.body);
    if (!valid)
      return res.status(400).json({ message: validate.errors });
    
    next();
  };
}

module.exports = validateBody;
