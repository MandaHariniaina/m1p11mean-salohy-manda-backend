const path=require('path');

module.exports = {
    // projectDirectory: "/home/manda/Documents/Etudes/M1/web avance/MEAN stack/m1p11mean-salohy-manda-backend",
    //projectDirectory: __dirname.replace('/config', ''),
    
    projectDirectory: __dirname.replace(path.sep+"config", ''),
    
    projectUrl: process.env.PROJECT_URL
}