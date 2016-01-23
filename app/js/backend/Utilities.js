import fs from "fs"

class Utilities {

    constructor() {

    }

    rmdir(path, done) {
        fs.readdir(path, (err, files) => {
            if(err) {
                done(err, [])
                return
            }

            var wait = files.length,
                count = 0,
                folderDone = (err) => {
                    count++
                    if( count >= wait || err) {
                        fs.rmdir(path, done)
                    }
                }

            if( ! wait) {
                folderDone()
                return
            }

            path = path.replace(/\/+$/,"")
            files.forEach((file) => {

                var curPath = path + "/" + file

                fs.lstat(curPath, (err, stats) => {
                    if( err ) {
                        done(err, [])
                        return
                    }

                    if(stats.isDirectory()) {
                        this.rmdir(curPath, folderDone)
                    } else {
                        fs.unlink(curPath, folderDone)
                    }
                })
            })
        })
    }

}

module.exports = new Utilities()