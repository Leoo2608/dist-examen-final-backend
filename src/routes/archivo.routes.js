import { Router } from 'express'
import * as archivoCtrl from '../controllers/archivo.controller'
const router = Router();
const { checkToken } = require('../auth/token_validation');
const { google } = require('googleapis');
const  { Readable } =require('stream');

const CLIENT_ID = '238294881843-22dpks11mfm1vl2kh7tdpscjqo22m8q5.apps.googleusercontent.com';
const CLIENT_SECRET = '9xQBcZ8vqe2ucoiWikRDRLvt';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04Fnqdt1QIBuVCgYIARAAGAQSNwF-L9IrJNvTqNbzxRRwbpnqhkNm4hDSNFVjC4H1tCqDFti30GVy-fGKXZoVn64RMK-sNHK3gWI';
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

router.post('/uploading', async (req, res)=>{ // 
    if(req.files){
        console.log(req.files)
        console.log(req.files.hola.data);
        var myBuffer = req.files.hola.data;
        const stream = Readable.from(myBuffer)
        filePath = stream;
        archivo = req.files.hola.name; // nombre del archivo 
        const tipo = req.files.hola.mimetype; // tipo del archivo
        const link = await uploadFile(tipo);
        res.send(link)
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
        const link = await generatePublicUrl(response.data.id);
        console.log("uploadFile() va a retornar: " + link)
        return link;
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
        console.log("generatePublicUrl() va a retornar: " + result.data.webViewLink);
        return result.data.webViewLink;
    } catch (error) {
        console.log(error.message);
    }
}


router.get("/:id", checkToken, archivoCtrl.listarArchivos);
router.post("/", checkToken, archivoCtrl.addArchivo);
router.delete("/:id", checkToken, archivoCtrl.delArchivo);
export default router;