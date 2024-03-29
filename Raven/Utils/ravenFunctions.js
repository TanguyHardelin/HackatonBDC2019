const fs     = require('fs');
const params = JSON.parse(fs.readFileSync("./package.json"));





/*
    Interfaces functions
*/

/*
    Structure of pluginDescriptions:
    {
        kernel:  Array of Plugin
        plugins: Array of Plugin
    }

    Plugin description:
    {
        name:           string
        params:         JSON
        functions:      Array functions,
        functionsCode:  Code des fonctions
    }
*/
function getProtypesOfPluginArray(plugginList){
    let text="\n";

    for(let i=0;i<plugginList.length;i++){
        text+="class "+plugginList[i].name+" extends Plugin{\n"
        text+="\tconstructor(){\n\t\tsuper()\n";
        text+="\t\tthis.params = "+JSON.stringify(plugginList[i].params)+";\n"
        text+="\t}\n\n"

        
        for(let functionName in plugginList[i].functions){
            text+="\t"+functionName+"(";
            
            let args = plugginList[i].functions[functionName]
            for(let k=0;k<args.length;k++){
                text+=args[k];
                if(k!=args.length-1) text += ","
            }
            text+="){}\n"
            
        }
        text += "}\n\n"
    }

    return text;
}

function getAllPluginsInPlugginList(plugginList){
    let p=[]
    for(let i=0;i<plugginList.length;i++){
        p.push(plugginList[i].name)
    }
    return p
}

function createInterfaces(pluginDescription){
    let text =  "// This file was generated by Raven\n"
    text     += "const Plugin = require('./Plugins/Kernel/Plugin')\n";

    text += getProtypesOfPluginArray(pluginDescription.kernel)
    text += getProtypesOfPluginArray(pluginDescription.plugins)

    let kernel_plugin = getAllPluginsInPlugginList(pluginDescription.kernel)
    let plugins       = getAllPluginsInPlugginList(pluginDescription.plugins)

    text += "class Interfaces extends Plugin{\n\tconstructor(){\n\t\tsuper()\n";

    for(let i=0;i<kernel_plugin.length;i++){
        text += "\t\tthis."+kernel_plugin[i]+"= new "+kernel_plugin[i]+"();\n"
    }

    for(let i=0;i<plugins.length;i++){
        text += "\t\tthis."+plugins[i]+"= new "+plugins[i]+"();\n"
    }

    text+="\t}\n}\n"

    text+= "module.exports = Interfaces"

    fs.writeFileSync("./interfaces.js",text)
}

function getAllPrototypes(pluginDescription){
    let result={};

    let kernel_plugin = getAllPluginsInPlugginList(pluginDescription.kernel)
    let plugins       = getAllPluginsInPlugginList(pluginDescription.plugins)
    
    for(let i=0;i<kernel_plugin.length;i++){
        result[kernel_plugin[i]]=pluginDescription.kernel[i].functionsCode;
    }

    for(let i=0;i<plugins.length;i++){
        result[plugins[i]]=pluginDescription.plugins[i].functionsCode;
    }

    return result
}




/*
    Pluggin builder
*/

function find_and_create_plugins(){
    let plugin_array=new Array();
    let plugin_descriptions={};
    //Import kernel plugin:
    files=fs.readdirSync('./Plugins/Kernel');
    plugin_descriptions.kernel = [];
    for(let i=0;i<files.length;i++){
        if(files[i]!="Plugin.js"){
            let plugin=require('../../Plugins/Kernel/'+files[i]);
            
            //On regarde si des parmetres sont deffinit
            let plugin_params={}
            if(params.kernel[files[i].split('.js')[0]]){
                //Si oui on les rajoutes
                plugin_params=params.kernel[files[i].split('.js')[0]]
            }
            let p=new plugin(plugin_params);
        
            plugin_descriptions.kernel.push({
                name:           p.getName(),
                params:         plugin_params,
                functions:      p.getPrototypeWithInfos(),
                functionsCode:  p.getPrototype()
            })

            plugin_array.push(p);
        }
    }
    //Import all plugins:
    files=fs.readdirSync('./Plugins');
    plugin_descriptions.plugins = [];
    for(let i=0;i<files.length;i++){
        if(files[i]!="Kernel"){
            let plugin=require('../../Plugins/'+files[i]);

            //On regarde si des parmetres sont deffinit
            let plugin_params={}
            if(params.kernel[files[i]]){
                //Si oui on les rajoutes
                plugin_params=params.plugins[files[i]]
            }
            let p=new plugin(plugin_params);

            //TODO: ADD allert if the name is empty -> fileName

            plugin_descriptions.plugins.push({
                name:           p.getName(),
                params:         plugin_params,
                functions:      p.getPrototypeWithInfos(),
                functionsCode:  p.getPrototype()
            })
            plugin_array.push(p);
        }
    }

    return {pluginArray:plugin_array,pluginDescription:plugin_descriptions}
}

function add_prototype_to_all_plugins(plugin_array,plugin_descriptions){
    //We add prototypes:
    for(let i=0;i<plugin_array.length;i++){
        plugin_array[i]._createPrototypeLink_(getAllPrototypes(plugin_descriptions));
    }
}

/*
    Start functions
*/

function create_internal_communication_system(plugins_array){
    let internal_callback_system={};
    for(let i=0;i<plugins_array.length;i++){
        ((index)=>{
            //Manage pub:
            plugins_array[index].on('pub',(evt,data)=>{
                //console.log("PUB " + evt+" "+data)
                if(internal_callback_system[evt]){
                    internal_callback_system[evt].forEach((cb)=>{
                        cb(data);
                    });
                }
            });

            //Manage sub:
            plugins_array[index].on('sub',(evt,callback)=>{
                //console.log("SUB " + evt+" "+callback)
                if(!internal_callback_system[evt]){
                    internal_callback_system[evt]=new Array();
                }
                internal_callback_system[evt].push(callback);
            });

            //Manage internal message:
            plugins_array[index].on('internalMessage',(message,cb)=>{
                let receiver=message.receiver;
                let data=message.data;
                let fct=message.fct;
                for(let k=0;k<plugins_array.length;k++){
                    if(receiver.toUpperCase()==plugins_array[k].getName().toUpperCase()){
                        plugins_array[k][fct](data,cb);
                    }
                }
            });
        })(i);
    }
}

function start_all_plugins(plugins_array){
    new Promise((resolve,reject)=>{
        let c=true;
        for(let j=0;j<100&&c;j++){
            c=true;
            for(let i=0;i<plugins_array.length;i++){
                //console.log("try to start "+ plugins_array[i].getName())
                c&=plugins_array[i]._start_();
            }
            c=!c;
        }
        resolve();
    }).catch((reason)=>{
        console.log('\x1b[31;1m/!\\ ERROR: \x1b[0m'+reason);
    });
}

/*
    Display raven logo
*/
function display_raven(){
    let logo    = fs.readFileSync("./Raven/Data/logo.txt")
    let version = params.kernel.Raven.version;
    console.log(logo+"\n"+version);
}

/*
    Others:
*/
let reserved_function=["start"]
function find_function_plugin(pluginName,fctName){
    if(fs.existsSync('./Plugins/'+pluginName+".js")){
        let plugin=require('../../Plugins/'+pluginName);

        let p=new plugin();

        let realFctName="__"+fctName+"__"
        if(reserved_function.indexOf(fctName)>-1){
            return {
                error:true,
                reason:fctName+' function is reserved'
            }
        }
        else if(p.getCommandFunction()[realFctName]){
            return {
                error:false,
                fct:p.getCommandFunction()[realFctName]
            }
        }
        else{
            return {
                error:true,
                reason:pluginName+' found but fct not'
            }
        }
    }
    else if(fs.existsSync('./Plugins/Kernel/'+pluginName+".js")){
        let plugin=require('../../Plugins/Kernel/'+pluginName);

        let p=new plugin();

        let realFctName="__"+fctName+"__"
        if(reserved_function.indexOf(fctName)>-1){
            return {
                error:true,
                reason:fctName+' function is reserved'
            }
        }
        else if(p.getCommandFunction()[realFctName]){
            return {
                error:false,
                fct:p.getCommandFunction()[realFctName]
            }
        }
        else{
            return {
                error:true,
                reason:pluginName+' found but fct not'
            }
        }
    }
    else{
        return {
            error:true,
            reason:'file not found'
        }
    }
}
function call_all_functions_of_plugins(fctName){
    files=fs.readdirSync('./Plugins/Kernel');
    for(let i=0;i<files.length;i++){
        if(files[i]!="Plugin.js"){
            let plugin=require('../../Plugins/Kernel/'+files[i]);
            let p=new plugin();
            p["__"+fctName+"__"]();
        }
    }
    files=fs.readdirSync('./Plugins');
    for(let i=0;i<files.length;i++){
        if(files[i]!="Kernel"){
            let plugin=require('../../Plugins/'+files[i]);
            let p=new plugin();
            p["__"+fctName+"__"]();
        }
    }
}

/*
    Export
*/
module.exports={
    createInterfaces: createInterfaces,
    getAllPrototypes: getAllPrototypes,
    findAndCreatePlugins: find_and_create_plugins,
    addProtypesToAllPlugins: add_prototype_to_all_plugins,
    createInternalCommunicationSystem:create_internal_communication_system,
    startAllPlugins:start_all_plugins,
    findFunctionPlugin:find_function_plugin,
    callAllFunctionsOfPlugins:call_all_functions_of_plugins,
    displayRaven:display_raven
}






