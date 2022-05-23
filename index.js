const express = require ('express')
const config = require ('config')
const mongoose = require ("mongoose")
const cookieParser = require ('cookie-parser')
const cors = require ('cors')
const authRoutes = require ('./routes/auth')
const mongoUri = config.get('mongoUri')
const PORT = config.get('port')


const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use('/auth', authRoutes)

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