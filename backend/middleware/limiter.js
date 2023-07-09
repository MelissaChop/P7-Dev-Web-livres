const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  // 15 minutes
  windowMs: 15 * 60 * 1000,
  // Limite chaque utilisateur à 30 requêtes par 15 minutes
  max: 30,
  // Renvoyer l'information sur la limite de taux dans les en-têtes `RateLimit-*`.
  standardHeaders: true,
  // Désactiver les en-têtes `X-RateLimit-*`
  legacyHeaders: false,
});

module.exports = { limiter };
