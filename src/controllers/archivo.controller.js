import { pool } from '../database'
export const listarArchivos = async (req, res) => {
    try {
        const id=parseInt(req.params.id);
        const response = await pool.query('select * from fc_listar_archivos($1)',[id]);
        return res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Internal Server error...!')
    }
}
export const addArchivo=async(req,res)=>{
    try {
        const{nombre,tipo,url, idusuario, idurl}=req.body;
        await pool.query('select fc_add_archivos($1,$2,$3,$4,$5)',[nombre,tipo, url, idusuario, idurl]);
        return res.status(200).json(`El archivo '${nombre}' se ha subido correctamente`);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Internal Server error...!')
    }
}
export const delArchivo=async(req,res)=>{
    try {
        const id=parseInt(req.params.id);
        await pool.query('select fc_delete_archivos($1)',[id]);
        return res.status(200).json(`El archivo se ha elimindo correctamente.`);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Internal Server error...!')
    }
}