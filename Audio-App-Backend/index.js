const express = require("express");
const cors = require('cors');
const app = express();
require('dotenv/config');

var corsOptions = {
    origin: "http://localhost:19006"
}

// app.use(cors());
// app.options('*', cors());
///CONVERSOR DE FORMATO DE RUTAS
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('tiny'));


//ROUTES DEFINITION//

const api = process.env.API_URL;
const audiobookRouter = require('./routes/books');
const userRouter = require('./routes/users');
const categoryRouter = require('./routes/categories');
const db = require("./models/Users/index");
const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const storyRoute = require('./routes/story');

//CALLING ANOTHER INSTANCES OF MODELS
// const Role = db.role;
const { Role } = require("./models/Users/index");

//ENTITIES ROUTES
app.use(`${api}/books`, audiobookRouter);
app.use(`${api}/categories`, categoryRouter);
app.use(`${api}/users`, usersRoutes)
app.use(`${api}/auth`, authRoutes);
app.use(`${api}/story`, storyRoute);



//AUTH ROUTES
// require('./routes/auth.routes')(app);
// require('./routes/users.routes')(app);


//SET PORT LISTEN FOR REQUESTS
const port = process.env.PORT || 8081;
db.mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'Primary-Database'
})
.then(() =>{
    console.log("Database Connection is ready...");
    initial();
})
.catch((err) => {
    console.log(err);
    process.exit();
})

app.listen(port, () => {
    console.log(api);
    console.log(`Server running on port ${port}`);
});

async function initial() {
    try {
      const count = await Role.estimatedDocumentCount();
      if (count === 0) {
        await Promise.all([
          new Role({ name: "user" }).save(),
          new Role({ name: "moderator" }).save(),
          new Role({ name: "admin" }).save()
        ]);
        console.log("Added 'user', 'moderator', and 'admin' to roles collection");
      }
    } catch (err) {
      console.log("Error:", err);
    }
  }



