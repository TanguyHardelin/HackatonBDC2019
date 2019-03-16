//TODO: Ajouter une installation !
// pour après pouvoir faire un raven-install qui nous demande tout !


const event = require('events');
const fs    = require('fs')

// # Classe *Plugin*
//Cette classe sert de base à tout les autres plugins qu'ils soient du noyeau ou d'ailleurs.
//Cette classe fornit un certain nombre de services commmuins à tout les plugins.


class Plugin extends event{
    // ## Constructor:
    constructor(params){
        super();
        //Liste des dependences nécéssaires au démarage du plugin
        this.dependencies=new Array();
        //Etat du démarage
        this.started=false;
        //On setup les parametres:
        this.params=params;
        
        //Protype interne:
        this.prototype=new PluginPrototype();
    }
    _createPrototypeLink_(all_prototypes){
        //Explications:
        // Le fichier interfaces.js contient tout les prototypes des fonctions pour l'autocompletion
        // On creer un objet interface puis on vient remplacer toutes les fonctions par les bonne pour pouvoir les executer
        const Interfaces = require("../../interfaces")
        this.plugins=new Interfaces();

        for(let key1 in all_prototypes){
            for(let key2 in all_prototypes[key1]){
                this.plugins[key1][key2]=all_prototypes[key1][key2]
            }
        }
    }
    // ## Utils methods:
    getName(){
        return this.constructor.name;
    }
    // ### Fonction *log*
    // #### this.log(message,color)
    //› [NomDuPlugin] message
    log(message,color,stream=undefined){
        let text=""
        if(color===undefined || color === "regular"){
            //Regular log:
            text="\x1b["+getColorFromName("valid")+";1m ▹ ["+this.constructor.name+"] \x1b[0m-> ";
        }
        else{
            text="\x1b["+getColorFromName(color)+";1m ▹ "+getIdententifierFromName(color)+" ["+this.constructor.name+"] \x1b["+getColorFromName("default")+";1m-> ";

        }

        if(isJson(message)){
            console.log(text);
            console.log(message);
        }
        else{
            text+=message+'\x1b[0m';
            console.log(text);
        }
    }
    // ### Fonction *error*
    // #### this.error(message,color)
    // [✘] [NomDuPlugin] -> message
    // Ecriture de l'erreur dans un fichier errors.txt
    error(message){
        this.log(message,"error",true);
    }
    // ### Fonction *valid*
    // #### this.valid(message,color)
    // [✓] [NomDuPlugin] -> message
    valid(message){
        this.log(message,"valid",true);
    }

    // ### Fonction *addDependencies*
    // #### this.addDependencies(nomDeLaDependence)
    // Permet de démarer le plugin après les dépendeences spécifiés.
    // ###### Exemple:
    // this.addDependencies('webAPI')
    // this.addDependencies('Secure') 
    // this.addDependencies('JsonBDD')
    //
    // ↦ Raven s'assurera que les plugins webAPI, Secure et JsonBDD sont démarés avant de démarer le plugin
    addDependencies(dependency){
        this.dependencies.push(dependency.toUpperCase());
    }
    
    bindAllFunction(){
        let all_prototype = getInstanceMethodNames(this)
        let result = {}

        const template = require("./Plugin")
        let pluginTemplate =new template()

        for(let i=0;i<all_prototype.length;i++){
            if(all_prototype[i][0] != '_' && all_prototype[i] != 'constructor' && typeof this[all_prototype[i]] == 'function' && pluginTemplate[all_prototype[i]] === undefined){
                //console.log(Object.getOwnPropertyNames(this[all_prototype[i]]))
                this.prototype.addFctArguments(this[all_prototype[i]].name.replace("bound ",""), getFunctionArguments(this[all_prototype[i]]))
                this[all_prototype[i]] = this[all_prototype[i]].bind(this);
                this.prototype.add(this[all_prototype[i]].name.replace("bound ",""),this[all_prototype[i]]);
            }
        }
        return result;
    }

    getCommandFunction(){
        let all_prototype = getInstanceMethodNames(this)
        let result = {}

        for(let i=0;i<all_prototype.length;i++){
            if(all_prototype[i][0] === '_' && all_prototype[i][1] === '_'){
                result[this[all_prototype[i]].name]=this[all_prototype[i]];
            }
        }
        return result;
    }

    getPrototype(){
        return this.prototype.getPrototype();
    }
    getPrototypeWithInfos(){
        return this.prototype.getInfos();
    }

    // ### Fonction *_start_*
    _start_(){
        let self=this;
        if(self.dependencies.length>0){
            //We subscribe to the evt 'plugin.started'
            self.sub('plugin.started',(data)=>{
                if(self.dependencies.indexOf(data)>-1){
                    self.dependencies.splice(self.dependencies.indexOf(data),1);
                }
            });
        }
        else{
            if(!self.started){
                self.__start__();
                //TODO: add then and catch !!
                self.started=true;
                //TODO: add this in green
                self.valid("started");

                this.bindAllFunction(this)
            }
            self.pub('plugin.started',self.constructor.name.toUpperCase());
        }
        return self.started;
    }
    // ### Fonction *start*
    // Fonction appelée par _start une fois que toute les dépendences sont résolus
    // Fonction virtuelle pure
    __start__(){

    }
    /*
        Configure function
    */

   __configure__(){

    }

    /*
        Compile Function
    */
    __compile__(){
    
    }
    
    //Internal messaging:
    pub(evt,data){
        this.emit('pub',evt,data);
    }
    sub(evt,cb){
        this.emit('sub',evt,cb);
    }
    internalMessage(message,cb){
        this.emit('internalMessage',message,cb);
    }


    // A METTRE DANS UN PLUGIN UTILS:
    replace(t,s,a){
        return t.split(s).join(a);
    }
    stringToSQLString(s){
        s=this.replace(s,' ','_SPACE_');
        s=this.replace(s,';','_POINTVIRGULE_');
        s=this.replace(s,"'",'_SIMPLEC_');
        s=this.replace(s,'"','_SIMPLED_');
        s=this.replace(s,'\r','_CHARIOT_');
        s=this.replace(s,'\t','_TAB_');
        s=this.replace(s,'\n','_RETURN_');
        return s;
    }
    SQLStringToString(s){
        s=this.replace(s,'_SPACE_',' ');
        s=this.replace(s,'_POINTVIRGULE_',';');
        s=this.replace(s,"_SIMPLEC_","'");
        s=this.replace(s,'_SIMPLED_','"');
        s=this.replace(s,'_CHARIOT_','\r');
        s=this.replace(s,'_TAB_','\t');
        s=this.replace(s,'_RETURN_','\n');
        return s;
    }


    findAllSettingParameters(){
        let name=this.getName();
        let actualSetting = JSON.parse(fs.readFileSync("./package.json"))
        console.log(actualSetting)
    }
    getSettingParameterValue(name){

    }
    setSettingParameterValue(name,value){
        
    }
}

module.exports = Plugin;

//Fonction utiles:
function getColorFromName(color){
    switch(color){
        case "default":
            return 0;
        case "error":
            return 31;
        case "valid":
            return 32;
        case "yellow":
            return 33;
        case "blue":
            return 34;
        case "magenta":
            return 35;
        case "cyan":
            return 36;
        case "gray":
            return 37;
        case "light red":
            return 91;
        case "light green":
            return 92;
        case "light yellow":
            return 93;
        case "light blue":
            return 94;
        case "light magenta":
            return 95;
        case "light cyan":
            return 96;
        case "white":
            return 97;
        default:
            return 0;
    }
}
function getIdententifierFromName(color){
    switch(color){
        case "error":
            return "[✘]";
        case "valid":
            return "[✓]";
        default:
            return "";
    }
}

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


//Interface Prototype:
class PluginPrototype{
    constructor(){
        this.protype={};
        this.infos={};
    }
    add(name,fct){
        this.protype[name]=fct;
        //this.infos[name]=[]
    }
    addFctArguments(fctName,args){
        this.infos[fctName]=args
    }
    getPrototype(){
        return this.protype;
    }
    getInfos(){
        return this.infos;
    }
}
function getInstanceMethodNames (obj) {
    let array = [];
    let proto = Object.getPrototypeOf (obj);
    while (proto) {
      const names = Object.getOwnPropertyNames (proto);
      names.forEach (name => {
          if (name !== 'constructor' && typeof obj[name] === 'function') {
            array.push (name);
          }
        });
      proto = Object.getPrototypeOf (proto);
    }
    return array;
}



function getFunctionArguments(fn){
    let args=[]
    let tmp = fn.toString().split('(')[1].split(',');
  
    for(let i=0;i<tmp.length;i++){
        let arg= tmp[i].replace(' ','').replace('(','').replace(')','').replace('=','').replace('>','').replace('\n','').split('{')[0]
        if(arg) args.push(arg)
        if(tmp[i].includes('{')) break;
    }

    return args
}