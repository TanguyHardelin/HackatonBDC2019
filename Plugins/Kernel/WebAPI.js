const Plugin    = require('./Plugin');
const express   = require('express');
const fs        = require('fs');
const path      = require('path');
const fileUpload = require('express-fileupload');
var multer = require('multer');

class WebAPI extends Plugin{
    constructor(params){
        super(params);
        this.app=express();
        this.lanch_time=Date.now();
        this.list_app=[];

        
        this.bindAllFunction(this)
    }
    //Public:
    addApplication(name,applicationPath){
        let self=this;

        if(name!="/"){
            self.app.get('/'+name, function(req, res) {
                res.sendFile(path.join(__dirname+"/../.."+applicationPath, 'build', 'index.html'));
            });
        }
        else{
            self.app.get('/', function(req, res) {
                res.sendFile(path.join(__dirname+"/../.."+applicationPath, 'build', 'index.html'));
            });
        }
        
        if(name!="") this.__new_app_was_added__(name, () => {})
    }
    add(URL,cb){
        this.app.post(URL,(req,res,next)=>{
            cb(req,res,next);
        });
    }
    get(URL,cb){
        this.app.get(URL,(req,res,next)=>{
            cb(req,res,next);
        });
    }
    post(URL,cb){
        this.app.post(URL,this.upload.any(),(req,res,next)=>{
            cb(req,res,next);
        });
    }
    getExpressServer(){
        return this.app;
    }

    //Protected:
    __new_app_was_added__(name,cb=undefined){
        this.list_app.push(name);
        if(cb != undefined){
            cb(true);
        }
    }
    __include_svg__(req,res,next){
        let self=this;
        if(!req.originalUrl.includes("svg")){
            for(let i=0;i<this.params['url'].length;i++){
                res.header("Access-Control-Allow-Origin", this.params['url'][i]+":"+this.params['clientPort']);
            }
            
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            res.header("Access-Control-Allow-Credentials", "true");
        }
    }
    __send_file__(req,res,next){
        let self=this;
        let pathName=__dirname+'/../..'+req.originalUrl;
        //On essaye de voir si un fichier existe
        if(fs.existsSync(pathName) && req.originalUrl!="/"){
            let file=fs.readFileSync(pathName);
            res.end(file);
        }
        else{
            //Aucun fichier n'a été trouver on regarde si on essaye d'accéder à une API
            next();
        }
    }
    __send__raven_application__(req,res,next){
        let self=this;
        
        //On regarde si on essaye pas d'acceder a un fichier d'app:
        for(let i=0;i<self.list_app.length;i++){
            if(req.originalUrl.split('/')[1].toLowerCase()===self.list_app[i].toLowerCase() && req.originalUrl.split('/').length>2 && req.originalUrl!="/"&&self.list_app[i]!="/" ){
                
                if(fs.existsSync(__dirname+"/../../Raven/App"+req.originalUrl)){
                    self.log(__dirname+"/../../Raven/App"+req.originalUrl+" send")
                    let file=fs.readFileSync(__dirname+"/../../Raven/App"+req.originalUrl);
                    res.end(file);
                }
                else{
                    self.error(__dirname+"/../../Raven/App"+req.originalUrl+" not found")
                }
                
            }
            
            else if(self.list_app[i]=="/" && req.originalUrl.split('/').length>2 ){
                if(fs.existsSync(__dirname+"/../../Raven/App/CV"+req.originalUrl)){
                    let file=fs.readFileSync(__dirname+"/../../Raven/App/CV"+req.originalUrl);
                    
                    if(req.originalUrl.includes("svg")){
                        res.set('Content-Type', 'image/svg+xml');
                        res.end(file);
                    }
                    else{
                        res.end(file)
                    }
                    
                }
            }
        }
    }
    __start__(){
        let self=this;
        return new Promise((resolve,err)=>{
            self.app.set('views', path.join(__dirname, '../../EJS'));
            
            // Permet de set les header pour le client
            // Retourne un fichier si il est trouvé
            self.app.use('/',(req,res,next)=>{
                fileUpload();
                this.__include_svg__(req,res,next);
                this.__send__raven_application__(req,res,next)
                this.__send_file__(req,res,next);
                
            });
            self.app.get('/getTimeWithoutError',(req,res,next)=>{
                res.json({'time_without_error':Date.now()-this.lanch_time})
            });
            self.app.get("/getVersion",(req,res,next)=>{
                res.json({logo:this.params.kernel.Raven.logo,version:this.params.kernel.Raven.version})
            })

            this.upload = multer({ dest: './Raven/src/test_integration/images' })

            self.app.listen(this.params['ravenPort']);
            resolve();
        })
    }
}

module.exports = WebAPI;


