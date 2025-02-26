const bcrypt = require('bcryptjs');
bcrypt.hash('MotDePasseSecurise', 10).then(hash => console.log(hash));