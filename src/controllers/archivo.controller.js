import { pool } from '../database'
export const listarArchivos = async (req, res) => {
    try {
        const response = await pool.query('select * from fc_list_archivos()');
        return res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Internal Server error...!')
    }
}
export const addArchivo=async(req,res)=>{
    try {
        const{nombre,tipo,url, idusuario}=req.body;
        await pool.query('select fc_add_archivo($1,$2,$3,$4)',[nombre,tipo, url, idusuario]);
        return res.status(200).json(`El archivo '${nombre}' se ha subido correctamente`);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Internal Server error...!')
    }
}
export const delArchivo=async(req,res)=>{
    try {
        const id=parseInt(req.params.id);
        await pool.query('select fc_delete_archivo($1)',[id]);
        return res.status(200).json(`El archivo se ha elimindo correctamente.`);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Internal Server error...!')
    }
}