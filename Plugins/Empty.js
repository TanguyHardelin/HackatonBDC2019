const Plugin= require('./Kernel/Plugin');


class Empty extends Plugin{
    constructor(params){
        super(params);
        this.addDependencies('webAPI')
        this.addDependencies('Secure')
        //this.addDependencies('JsonBDD')
    }
    
    example(data){

    }


    __start__(){
        let self=this;
        return new Promise((resolve,err)=>{
            
            
            self.sub('exempleEvt0',(data)=>{
                //Fonction appelé lors d'un evenne

            });


            
            self.plugins.Secure.get('/empty',(req,res)=>{
                res.end("API with login and pwd !")
            });
            self.plugins.WebAPI.get('/emptyNotSecure',(req,res)=>{
                res.end("API without login and pwd !")
            });
            
            resolve();
        })
    }
}

module.exports = Empty;