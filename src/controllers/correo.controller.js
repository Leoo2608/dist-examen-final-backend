import { transporter } from '../libs/helper.email';
import { pool } from '../database'
async function sendEmail(dest, title, text){
    try {
        await transporter.sendMail({
            from: 'Leoo2608 <catdoupeu@gmail.com>', // sender address
            to: dest, // list of receivers
            subject: title, // Subject line
            html: '<!DOCTYPE html>' +
                '<html><head><title>Appointment</title>' +
                '</head><body><div>' +
                '<img src="https://i.ibb.co/0ypLN6W/cursosonline.png"">' +
                '<p>' + text + '</p>'
        });
    } catch (e) {
        console.log(e);
    }
}

export const registerEmail=async(req, res)=>{
    try {
        const {destinatario, titulo, mensaje, idusuario} = req.body;
        const response = await pool.query('select fc_register_email($1,$2,$3,$4)', [destinatario, titulo, mensaje, idusuario]);
        if(response){
           await sendEmail(destinatario,titulo,mensaje);
        }
        return res.status(200).json(`Correo ${titulo} registrado correctamente`);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Internal Server error...!')
    }
}
