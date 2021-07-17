import { pool } from '../database'
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const refreshTokens = [];
const secret = "dad-secret-access-token";
const refreshTokenSecret = "dad-secret-refresh-access-token";
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        //console.log(pass);
        const response = await pool.query('SELECT * FROM usuario u join persona p on p.idpersona = u.idpersona where username = $1', [username]);
        if (response.rows.length != 0) {
            const passold = response.rows[0].password;
            if (await bcrypt.compare(password, passold)) {
                const usuario = {
                    idusuario : response.rows[0].idusuario,
                    username : response.rows[0].username,
                    nombres : response.rows[0].nombres,
                    apellidos : response.rows[0].apellidos,
                    telefono: response.rows[0].telefono,
                    idpersona:response.rows[0].idpersona
                }
                const accessToken = jwt.sign({ usuario }, secret, { expiresIn: '7200s' });
                const refreshToken = jwt.sign({ usuario }, refreshTokenSecret);
                refreshTokens.push(refreshToken);
                return res.status(200).json({
                    accessToken,
                    refreshToken
                });
            } else {
                return res.status(403).json({
                    message: 'Username o Password incorrectos...!'
                });
            }
            
        }
        return res.status(403).json({
            message: 'Username o Password incorrectos...!'
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Error al validar usuario...!' });
    }
};