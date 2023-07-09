const passwordValidator = require("password-validator");

const schema = new passwordValidator();

schema
  .is()
  .min(5)
  .is()
  .max(100)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits(2) // Doit comporter au moins 2 chiffres
  .has()
  .not()
  .spaces() // Ne doit pas comporter d'espaces
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123", "Azerty123", "Qwerty123"]); // Mettre ces valeurs sur liste noire

module.exports = (req, res, next) => {
  if (schema.validate(req.body.password)) {
    next();
  } else {
    return res.status(401).json({
      error:
        "Mot de passe invalide: " +
        schema.validate(req.body.password, { list: true }),
    });
  }
};
