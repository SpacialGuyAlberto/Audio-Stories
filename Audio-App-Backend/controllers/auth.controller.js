const config = require("../config/auth.config");
const db = require("../models/Users/index");
const nodemailer = require('nodemailer');
const User = db.User;
const Role = db.Role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

//API KEY: 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
const generateTemporaryActivationToken = () => {
  const token = jwt.sign({}, 'secretKey', { expiresIn: '1h' });
  return token;
};

exports.signup = async (req, res) => {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    console.log('Hashed Password:', hashedPassword);

    const activationToken = generateTemporaryActivationToken();

    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password:  hashedPassword,
      activationToken: activationToken,
      isActivated: false,
    });

      savedUser = await user.save();

      // Enviar correo electrónico de activación
      const activationLink = `http://192.168.2.105:8081/api/v1/auth/activate/${savedUser.activationToken}`;

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'enkivergamel@gmail.com', // Coloca tu correo electrónico aquí
          pass: 'bwmjzagdkvazvnym' // Coloca tu contraseña aquí
        }
      });

      const mailOptions = {
        from: 'enkivergamel@gmail.com', // Coloca tu correo electrónico aquí
        to: req.body.email, // Correo del usuario recién registrado
        subject: 'Activación de cuenta',
        text: `Para activar tu cuenta, haz clic en el siguiente enlace: ${activationLink}`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error al enviar el correo electrónico:', error);
          // Puedes manejar el error de envío de correo electrónico aquí
        } else {
          console.log('Correo electrónico enviado:', info.response);
        }
      });

    res.send({ message: "User was registered successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};


""
exports.activateUser = async (req, res) => {
  try {
    const activationToken = req.params.activationToken;

    // Verificar el token temporal en la base de datos
    const user = await User.findOne({ activationToken });

    if (!user) {
      return res.status(404).send({ message: 'Invalid activation token.' });
    }

    // Realizar las acciones necesarias para activar al usuario
    user.isActivated = true;
    user.activationToken = null;
    await user.save();

    res.send({ message: 'User activated successfully!' });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};


exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }).populate("roles", "-__v").exec();
    ////TODO CONCLUYE A QUE NO ESPECIFIQUE UN USERNAME
    ///EL PROGRAMA ESTA CONFUNDIDO Y LO MEJOR ES QUE ESPECIFIQUE UN
    /// USERNAME POR QUE NO EXISTE ESE CAMPO Y QUIERE LEERLO
    
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = await bcrypt.compare(req.body.password, user.password);

    console.log(req.body.password)
    console.log(user.email)
    console.log(user.username)
    console.log('Secret from config', config.secret);
    if (!passwordIsValid){
        console.log("Invalid Password");
    }

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!"
      });
    }

    const accessToken = jwt.sign({ id: user.id },
      config.secret,
      {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
      });

    const refreshToken = jwt.sign({ id: user.id }, config.secret, {
      algorithm: 'HS256',
      allowInsecureKeySizes: true,
      expiresIn: 604800, // 7 days or any suitable duration for refresh token
    });

    console.log('Access token', accessToken);
    console.log('Refresh token', refreshToken);

    const authorities = user.roles.map(role => "ROLE_" + role.name.toUpperCase());

    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: authorities,
      access: accessToken,
      refresh: refreshToken
    });
    console.log(res);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
