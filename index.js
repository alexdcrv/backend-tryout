const express = require ('express')
const config = require ('config')
const mongoose = require ("mongoose")
const cookieParser = require ('cookie-parser')
const cors = require ('cors')
const authRoutes = require ('./routes/auth')
const usersRoutes = require ('./routes/users')
const seasonRoutes = require ('./routes/season')
const gamesRoutes = require ('./routes/games')
const mongoUri = config.get('mongoUri')
const PORT = config.get('port')

const app = express();

app.use(express.json())
app.use(cookieParser())
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next();
  });
app.use(cors({
    credential: true,
    origin: 'http://localhost:3000/'
}))

app.use('/auth', authRoutes)
app.use('/users', usersRoutes)
app.use('/season', seasonRoutes)
app.use('/games', gamesRoutes)
const start = async () =>{
    try {
        await mongoose.connect (mongoUri) 
        app.listen(PORT, () => {
            console.log(`%cHello index.js line:1 SERVER WORKING on port: ${PORT}`);
          });
    } catch (e) {
        console.log('%cindex.js line:16 e', 'color: #007acc;', e);
    }
}
start()
// /get/?test=123&structure="asdasda"