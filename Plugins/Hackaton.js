const Plugin= require('./Kernel/Plugin');
const {exec} = require('child_process')


class Hackaton extends Plugin{
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

            this.plugins.WebAPI.post("/upload",(req,res)=>{
                console.log(req.files)

                let process = exec('python Raven/src/test_integration/mnist_prod.py Raven/src/test_integration/images/'+req.files[0].filename,(error, stdout, stderr) => {
                    if (error) {
                      console.error(`exec error: ${error}`);
                      return;
                    }
                    console.log(`stdout: ${stdout}`);
                    console.log(`stderr: ${stderr}`);
                });
            })
            
            resolve();
        })
    }
}

module.exports = Hackaton;