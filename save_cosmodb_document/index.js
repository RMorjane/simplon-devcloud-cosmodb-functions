module.exports = async function (context, myBlob) {
    context.log("JavaScript blob trigger function processed blob \n Blob:", context.bindingData.blobTrigger, "\n Blob Size:", myBlob.length, "Bytes");

    const blobUrl = context.bindingData.blobTrigger;
    const blobName = blobUrl.slice(blobUrl.lastIndexOf("/")+1,blobUrl.lastIndexOf("."));
    const blobExtension = blobUrl.slice(blobUrl.lastIndexOf("."));
    const containerUrl = "https://morjanestore.blob.core.windows.net/"
    const file_name = `${blobName}${blobExtension}`;
    const file_url = `${containerUrl}${blobUrl}`;

    console.log(`file uploaded : ${file_url}`);

    const fs = require("fs");
    const https = require('https');

    const file = fs.createWriteStream(`./${file_name}`);

    https.get(file_url).on('response',function(response){

        const status = response.statusCode;
        console.log(status);

        if(status === 200){
            var stream = response.pipe(file);

            stream.on('finish',function(){
                console.log('done');

                fs.readFile(`./${file_name}`, 'utf8' , (err, data) => {
                    if (err) {
                        console.error(err)
                        return
                    }
                    console.log(data)
                })
            })
        }
    });

};