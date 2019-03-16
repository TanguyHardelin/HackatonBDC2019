const Plugin    = require('./Plugin');
const mysql     = require('mysql');




class SQL_BDD extends Plugin{
    constructor(params){
        super(params);
        this.addDependencies('webAPI');
        this.addDependencies('webSocket');

        this.canAccesToSQL = false;
        this.bindAllFunction(this)

    }
    __start__(){
        let self=this
        return new Promise((resolve,err)=>{
            self.connection = mysql.createConnection({
                host     : this.params['host'],
                user     : this.params['user'],
                password : this.params['password'],
                database : this.params['database']
            });
            self.connection.connect(function(err) {
                if (err) {
                    self.error('error connecting: ' + err.stack);
                    self.canAccesToSQL = false;
                    return;
                }
                else{
                    self.log('SQL plugin connected');
                    self.canAccesToSQL= true;
                }
                
               
            });
            resolve();
        });
    }
    _check_if_connected_(data,cb){
        if(this.canAccesToSQL) return true
        else{
            this.error("No SQL connection: impossible to access to SQL")
            cb({success:false});
            return false
        }
    }
   
    //Internal communication fonction:
    userLogin(data,cb){
        if(!this._check_if_connected_(data,cb)) return ;

        let self=this;
        let username=data.username || '';
        let password=data.password || '';
        
        //Check if user and password are good:
        this.connection.query('SELECT * FROM Users WHERE username="'+username+'" AND password="'+password+'"', (error, results, fields) => {
            if (error) self.error('Unexpected error: '+error);
            if(results.length){
                let id=results[0].id;
                let authorisation=results[0].authorisation;
                self.log("User: "+username+" was logged successfully");
                cb({success:true,username:username,id:id,authorisation:authorisation});
            }
            else{
                self.log("User: "+username+" try to longin unsuccessfully",'light magenta');
                cb({success:false});
            }
        });
    
        
    }
    addUser(data,cb){
        if(!this._check_if_connected_(data,cb)) return ;

        let self=this;
        let username        = data.username || '';
        let password        = data.password || '';
        let authorisation   = data.authorisation || '';
        
        this.connection.query("INSERT INTO Users(id,username,password,authorisation) VALUES (NULL,'"+username+"','"+password+"',"+authorisation+")", (error, results, fields) => {
            if (error) self.error('Unexpected error: '+error);
        });
    }

    //WARNING !!!
    //This function is dangerous
    //Never allow client to use this !!!
    runSQLCommand(command,cb){
        let self=this;
        this.connection.query(command, (error, results, fields) => {
            if (error){
                self.error('Unexpected error: '+error);
                self.error('command "'+command+'" failed');
            } 
            else{
                cb(results)
            }
        });
    }
    
}

module.exports = SQL_BDD;