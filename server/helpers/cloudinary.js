const cloudinary = require('cloudinary').v2;
const multer = require('multer');


cloudinary.config({
    cloud_name:'dhl67ceun',
    api_key:'929524558335454',
    api_secret:'h_qwrNRtfz49rbX2c3UMqRaxljU'
})

const storage = new multer.memoryStorage();

async function ImageUploadUtils(file) {
    const result = await cloudinary.uploader.upload(file,{
        resource_type:'auto'
        
    });

    return result;
}


const upload = multer({storage});


module.exports ={ upload , ImageUploadUtils };