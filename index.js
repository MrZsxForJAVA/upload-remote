const { Client } = require("ssh2");
const archiver = require("archiver");
const fs = require("fs");
const { Separator } = require("path")

function connect(server) {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    conn.on("ready", () => {
      console.log("Connected to the remote.")
      resolve(conn);
    });
    conn.on("error",(err) => {reject(err)});
    conn.on("close",() => {console.log("Connection is closed.")});
    conn.connect(server);
  });
}

function uploadFiles(conn,local,remote,option={}) {
  return new Promise((resolve,reject) => {
    conn.sftp((err,sftp) => {
      if(err) {
        reject(err);
      }else{
        sftp.fastPut(local,remote,option,(err) => {err&&reject(err);resolve("上传成功")})
      }
    })
  })
}

function zipFiles(targetFiles,output,option={}) {
  if(output&&output instanceof String)
  const output = fs.createWriteStream(output);
  else 
  const output = fs.createWriteStream(__dirname + "/upload.zips")
  const archive = archiver("zip", option);
  return new Promise((resolve, reject) => {
    output.on("close", () => {
      console.log("output size: " + archive.pointer() + " total bytes.");
      console.log('zip file finished.');
      resolve("zip ok");
    });

    archive.on("warning", (err) => {
      if(err.code === 'ENOENT')
      console.warn(err);
      else
      reject(err);
    });

    archive.on("error", (err) => {
      reject(err);
    });

    archive.pipe(output);

    if (targetFiles) {
      switch (typeof targetFiles) {
        case "string":
          if (/[.][\w]+$/i.test(targetFiles)) {
            // archive.file(targetFiles, {name: targetFiles.slice(targetFiles.lastIndexOf()))
          }else {

          }
          break;

        case "object":
          !Array.isArray(targetFiles)&&reject("targetFiles must be file/dir path string, file/buffer array");
          break;
        default:
          reject("targetFiles must be file/dir path string, file/buffer array")
          break;
      }
    }

  });
  
}