import { Router } from 'express'
import * as archivoCtrl from '../controllers/archivo.controller'
const router = Router();
const { checkToken } = require('../auth/token_validation');
const { google } = require('googleapis');
const  { Readable } =require('stream');

const CLIENT_ID = '238294881843-22dpks11mfm1vl2kh7tdpscjqo22m8q5.apps.googleusercontent.com';
const CLIENT_SECRET = '9xQBcZ8vqe2ucoiWikRDRLvt';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04lw2UcYaX7njCgYIARAAGAQSNwF-L9IrEa4gbZy_F5m7Cx5ByKAExmGG6AyOeZw2yLsDMUubcjkaJMBBXhvgzE_5d3xazSt1JFc';
const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
});

var filePath;
var archivo;

router.post('/uploading',checkToken ,async (req, res)=>{ // 
    if(req.files){
        console.log(req.files)
        console.log(req.files.hola.data);
        var myBuffer = req.files.hola.data;
        const stream = Readable.from(myBuffer)
        filePath = stream;
        archivo = req.files.hola.name; // nombre del archivo 
        const tipo = req.files.hola.mimetype; // tipo del archivo
        const data = await uploadFile(tipo);
        res.send(data)
    }
})

async function uploadFile(tipo) {
    try {
        const response = await drive.files.create({
            requestBody: {
                name: archivo,
                mimeType: tipo
            },
            media: {
                body: filePath
            }
        })
        console.log(response.data);
        const data = await generatePublicUrl(response.data.id);
        console.log("uploadFile() va a retornar: " + data.link+', '+data.id)
        return data;
    } catch (error) {
        console.log(error.message);
    }
}

// do not touch
async function generatePublicUrl(id) {
    try {
        const fileId = id;
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone'
            }
        })
        const result = await drive.files.get({
            fileId: fileId,
            fields: 'webViewLink,webContentLink'
        });
        
        var data = {
            link: result.data.webViewLink,
            id: fileId
        }
        console.log("generatePublicUrl() va a retornar: " + data.link+' y '+ data.id);
        return data;
    } catch (error) {
        console.log(error.message);
    }
}

async function deleteFile(id){
    try {
        const response = await drive.files.delete({
            fileId:id
        });
        console.log(response.data,response.status);
        return response;
    } catch (error) {
        console.log(error.message);
    }
}
//alo
router.get("/:id", checkToken, archivoCtrl.listarArchivos);
router.post("/", checkToken, archivoCtrl.addArchivo);
router.delete("/:id", checkToken, archivoCtrl.delArchivo);

router.delete('/idurl/:idurl', checkToken, async (req, res)=>{
    if(req){
        console.log(req.params.idurl)
        const data = await deleteFile(req.params.idurl);
        res.send(data)
    }
})
export default router;