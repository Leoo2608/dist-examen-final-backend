import { pool } from "../database"
const helpers=require('../libs/helpers');

export const createUser=async(req,res)=>{
    try {
        const{username,password,idpersona}=req.body;
        const passwordEncrypt=await helpers.encryptPassword(password);
        await pool.query('select fc_create_user($1,$2,$3)',[username,passwordEncrypt,idpersona]);
        return res.status(200).json(`Usuario ${username} creado correctamente`);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Internal Server error...!')
    }
}