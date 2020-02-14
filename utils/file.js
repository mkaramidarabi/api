const fs = require('fs');

const deleteFile = (filePath) => {
    fs.access(filePath, async (err) => {
        try {
            if (err) {
                console.log("The requested file for deletion wasn't on server")
            } else {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        throw (err);
                    }
                })
            }
        } catch (e) {}
    })
}

exports.deleteFile = deleteFile;