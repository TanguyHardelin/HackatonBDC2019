const Plugin= require('./Plugin');
const cookieParser = require('cookie-parser')
const randomstring = require("randomstring");
const path      = require('path');
const express   = require('express');
const request   = require('request')
const removeRoute = require('express-remove-route');

//TODO LIST:
//        Faire en sorte de rajouter une API socket.io.

let time_before_kick=1000*60*5;             //5 minutes
let intervale_time=60*1000;

class Secure extends Plugin{
    constructor(params){
        super(params);
        this.addDependencies('webAPI');
        this._all_user_logged={};

        this.__logout_all_inactives_users__=this.__logout_all_inactives_users__.bind(this);

        
        this.bindAllFunction(this);
    }
    
    //Public functions:
    get(URL,cb,authorisation){
        this.plugins.WebAPI.get(URL,(req,res,next)=>{
            this.__is_authorized__({'req':req,'res':res,'authorisation':authorisation},(__is_authorized__)=>{
                if(__is_authorized__){
                    this.log(URL);
                    cb(req,res,next);
                }
                else{
                    res.json({error:true});
                }                
            });
        });
    }
    post(URL,cb,authorisation){
        this.plugins.WebAPI.post(URL,(req,res,next)=>{
            this.__is_authorized__({'req':req,'res':res,'authorisation':authorisation},(__is_authorized__)=>{
                if(__is_authorized__){
                    this.log(URL);
                    cb(req,res,next);
                }
                else{
                    res.json({error:true});
                }
            });
        });
    }
    addApplication(name,applicationPath,authorisation){
        this.plugins.WebAPI.get("/"+name.toLowerCase(),(req,res,next)=>{
            this.__is_authorized__({'req':req,'res':res,'authorisation':authorisation},(__is_authorized__)=>{
                if(__is_authorized__){
                    this.plugins.WebAPI.newAppWasAdded(name);
                    console.log(__dirname+"/../.."+path.join(__dirname+"/../.."+applicationPath, 'build', 'index.html'))
                    res.sendFile(path.join(__dirname+"/../.."+applicationPath, 'build', 'index.html'));
                }
                else{
                    //this.log(this.params.kernel.WebAPI.url+':'+this.params.kernel.WebAPI.ravenPort+'/'+this.params.ravenLoginPageName)
                    request("http://www."+this.params.url+'/'+this.params.ravenLoginPageName, { json: true }, (err, r, body) => {
                        if (err) { return this.error(err); }
                        res.send(r.body);
                    });
                }                
            });
        });
    }
    getAllUsersConnected(){
        return this._all_user_logged;
    }
    getAuthorisationList(){
        return this.params.authorisationList;
    }

    //Protected functions:
    __generate_key__(){
        let key='';
        for(let i=0;i<256;i++){
            key+=Math.floor(Math.random() * 255) + 1;
        }
        return key;
    }
    __logout_all_inactives_users__(){
        let self=this;
        let current_date=Date.now();
        for(let key in self._all_user_logged){
            let time_since_inactive=current_date-self._all_user_logged[key].lastTimeSeen;
            if(time_since_inactive>time_before_kick){
                delete self._all_user_logged[key];
            }
        }
    }
    __is_authorized__(data,cb){
        let self=this;
        let res=data.res;
        let req=data.req;

        let authorisation=data.authorisation;
        let sessionID=req.cookies.sessionID;
        if(self._all_user_logged[sessionID]){
            if(self._all_user_logged[sessionID]['user'].getAuthorisation()&&authorisation===authorisation)
                cb(true);
            else
                cb(false);
        }
        else{
            cb(false);
        }
    }
    __start__(){
        let self=this;
        //First we use cookies parser
        this.plugins.WebAPI.getExpressServer().use(cookieParser());
        //Then we create API            
        return new Promise((resolve,err)=>{
            // */login/:username/:password* 
            // **Permet de connecter un utilisateur**
            // Connecte l'utilisateur si l'username et password sont dans la bonne BDD
            this.plugins.WebAPI.get('/login/:username/:password',(req,res)=>{
                self.internalMessage({receiver:'SQL_BDD',data:{username:req.params.username,password:req.params.password},fct:'userLogin'},(json)=>{
                    if(json.success){
                        //We generate a unique key for user
                        let key;
                        do{
                            key=randomstring.generate(50);
                        }while(self._all_user_logged[key])

                        //We create user 
                        self._all_user_logged[key]={user:new User(json.username,json.id,json.authorisation,key),lastTimeSeen:Date.now()};

                        //We add cookie and send validation
                        res.cookie('sessionID',key);
                        res.json({logged:true});
                    }
                    else{
                        res.json({logged:false});
                    }
                });
            });
            // */login/isLogged* 
            // **Permet de savoir si on est connecté**
            // retourne {logged:true} si l'utilisateur est connecté
            // retourne {logged:false} sinon
            this.plugins.WebAPI.get('/login/isLogged',(req,res)=>{
                let sessionID=req.cookies.sessionID;
                if(self._all_user_logged[sessionID]){
                    self._all_user_logged[sessionID]['lastTimeSeen']=Date.now();
                    res.json({logged:true})
                }else{
                    res.json({logged:false});
                }
            });
            // */disconnect* 
            // **Permet de se déconnecté**
            // Deconnecte l'utilisateur connecté
            this.plugins.WebAPI.get('/disconnect',(req,res)=>{
                let sessionID=req.cookies.sessionID;
                delete self._all_user_logged[sessionID];
                res.json({error:false});
            });

            // */params.ravenLoginPageName* 
            // **Affiche la page de connection de raven**
            // Ajouter une application se fait en deux temps:
            // 1) On envoie son fichier HTML au client
            // 2) On informe WebAPI qu'il faut traiter tout les /nomApplication differement (Envoyer les bon fichiers)
            this.plugins.WebAPI.get('/'+this.params.ravenLoginPageName,(req,res)=>{
                //On envoie le fichier html de l'application de login
                res.sendFile(path.join(__dirname+"/../.."+this.params.ravenLoginPagePath, 'build', 'index.html'));
            });

            this.internalMessage({receiver:'WebAPI',data:this.params.ravenLoginPageName,fct:"__new_app_was_added__"},()=>{})
            //this.plugins.WebAPI.newAppWasAdded(params.ravenLoginPageName)
            resolve();
        })
        
        //We logout all inactives users:
        setInterval(self.__logout_all_inactives_users__,intervale_time)
    }
    
}

class User{
    constructor(username,id,authorisation,sessionID){
        this._username=username;
        this._id=id;
        this._auhorisation=authorisation;
        this._sessionID=sessionID;
    }
    getUsername(){
        return this._username;
    }
    getID(){
        return this._id;
    }
    getAuthorisation(){
        return this._auhorisation;
    }
    getSessionID(){
        return this._sessionID;
    }
}

module.exports = Secure;