import express from 'express'
import morgan from 'morgan'
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import archivoRoutes from './routes/archivo.routes'
import correoRoutes from './routes/correo.routes'
const uploadings = require('express-fileupload');
const app = express();
var cors = require('cors');

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.get('/',function(req, res, next){
    res.send('Bienvenido a NodeJS...!');
});
app.use(uploadings())//
app.use('/api/auth',authRoutes);
app.use('/api/auth/users', userRoutes);
app.use('/api/auth/correos', correoRoutes)
app.use('/api/auth/archivos', archivoRoutes)

export default app;