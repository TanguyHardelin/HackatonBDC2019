//Raven modules functions:
const ravenFunction      = require ('./Raven/Utils/ravenFunctions')

/*
    Lecture et decriptage de la ligne de commande
*/
switch(process.argv[2]){
    case '--runCommand':
        runCommand()
        break;
    case '--compile':
        compile()
        break;
    case '--configure':
        configre()
        break;
    case '--install':
        install()
        break;
    case '--start':
        startRaven()
        break;
    default:
        startRaven()
        break;
}

/*
    Les différentes fonctions associées
*/
function runCommand(){
    //On verifie si la syntax est correct
    if(process.argv[3]!==undefined && process.argv[4]!==undefined){
        let result = ravenFunction.findFunctionPlugin(process.argv[3],process.argv[4])
        if(result.error){
            console.log('\x1b[31;1m/!\\ ERROR: '+result.reason+'\x1b[0m');
            runCommandHelp();
        }
        else{
            let allArgument=[];
            for(let i=5;i<process.argv.length;i++){
                allArgument.push(process.argv[i])
            }
            
            result.fct(allArgument);
        }
    }
    else{
        console.log('\x1b[31;1m/!\\ ERROR: bad syntax\x1b[0m');
        runCommandHelp()
    }
}
function compile(){
    ravenFunction.callAllFunctionsOfPlugins("compile");
}
function configre(){
    ravenFunction.callAllFunctionsOfPlugins("configure");
}
function install(){
    //Installation des modules NPM

    //Configuration des plugins

    //Vérification SQL

}
function startRaven(){
    //Display icon and name:
    ravenFunction.displayRaven();

    //Find and create all plugins:
    let all_plugins = ravenFunction.findAndCreatePlugins();

    //We write protoype in interface.js
    ravenFunction.createInterfaces(all_plugins.pluginDescription)


    //Setup protypes for all_plugins:
    ravenFunction.addProtypesToAllPlugins(all_plugins.pluginArray,all_plugins.pluginDescription)


    //Create internal communication system:
    ravenFunction.createInternalCommunicationSystem(all_plugins.pluginArray)

    //Start all plugins:
    ravenFunction.startAllPlugins(all_plugins.pluginArray)
}


/*
    Fonctions utiles
*/
function runCommandHelp(){
    console.log('\x1b[33;1m/?\\ Syntax: \x1b[0mnpm run command pluginName functionName arguments');
}












