const io=require('socket.io');
const request=require('request')
const Plugin= require('./Plugin');

class WebSocket extends Plugin{
    constructor(params){
        super(params);
        this.addDependencies('webAPI');

        this.list_of_function={};
        this.socket_list=[]
        
        this.bindAllFunction(this);

        this._manageNewConnection_=this._manageNewConnection_.bind(this)
        this._setupConnection_ = this._setupConnection_.bind(this)
    }
    __start__(){
        return new Promise((resolve,err)=>{
            this.createSocketIOServer(this.plugins.WebAPI.getExpressServer());

            this.plugins.WebAPI.get("/WebSocket/getAllClients",(req,res)=>{
                let result=[]

                for(let i=0;i<this.socket_list.length;i++){
                    //this.log("send")
                    result.push({id:i,headsetNumer:i+1,position:""})
                }

                res.json({"allClients":result})
            })
            resolve();
        });
    }
    _redirectToWebAPI_(data){
        let URL=data.url;
        let method=data.method||'GET';
        let cb=data.cb;

        request('127.0.0.1:5000'+URL,(error, response, body)=>{
            cb(body);
        });
    }
    createSocketIOServer(expressServer){
        let self=this;
        //Create server:
        self.server=require('http').createServer();


        self.socketIO=io(self.server);

        self.server.listen(5001)
        //Add redirect option:
        this.list_of_function['redirect']=self.redirectToWebAPI;

       

        //Manage new clients connections:
        self.socketIO.on('connection',this._manageNewConnection_);
    }   

    _manageNewConnection_(socket){
        //self.log("TOTO")
        if(this.params.needReadyMessage)
            socket.on(this.params.readyMessage,(data)=>{
                //Le client nous signal que tout est bon pour lui on peut commencer a communiquer avec lui
                this._setupConnection_(socket)
            })
        else
            this._setupConnection_(socket)
    }
    _setupConnection_(socket){
        this.socket_list.push(socket)
        for(let fct in this.list_of_function){
            socket.on(fct,(socket)=>this.list_of_function[fct](socket));
        }
        //On permet de gerer la connection d'un nouvel utilisateur:
        this.emit("newClientConnection",socket)
    }

    getSocketIO(){
        return this.socketIO;
    }

    sendToAllClient(evt,msg){
        for(let i=0;i<this.socket_list.length;i++){
            //this.log("send")
            this.socket_list[i].emit(evt,msg)
        }
    }

    //Internal communication fonction
    addSocketAPI(evt,cb){
        if(!this.list_of_function[evt])this.list_of_function[evt]=cb;
        else this.error("ERROR ["+evt+"] already used");
    }

    handleNewConnection(cb){
        this.on("newClientConnection",(socket)=>{
            cb(socket);
        })
    }
}

module.exports = WebSocket;