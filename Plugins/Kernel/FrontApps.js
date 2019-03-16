const Plugin= require('./Plugin');


class FrontApps extends Plugin{
    constructor(params){
        super(params);
        this.addDependencies('webAPI')
        this.addDependencies('Secure')

        this.bindAllFunction(this);
    }
    
    __start__(){
        let self=this;
        
        return new Promise((resolve,err)=>{
            //TODO: construire ça en fonction des parametres
            //self.plugins.Secure.addApplication("ravenBot","/RavenApp/ravenBot/",0x0);
            //self.plugins.Secure.addApplication("resumeMonitor","/RavenApp/resumeMonitor/",0x0);
            //self.plugins.Secure.addApplication("/","/RavenApp/CV/",0x0);
            self.plugins.WebAPI.addApplication("planetariumvr","/Raven/App/PlanetariumVR")
            self.plugins.WebAPI.addApplication("hackaton","/Raven/App/Hackaton")
            
            resolve();
        })
    }
}

module.exports = FrontApps;