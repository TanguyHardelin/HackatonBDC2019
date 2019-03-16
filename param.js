module.exports=
{
    "kernel":{
        "WebAPI":{
            "url":[
                "http://127.0.0.1"
            ],
            "ravenPort":5000,
            "clientPort":5000
        },
        "Secure":{
            "authorisationList":{
                "BONAPP":0x1,
                "EUREKART":0x1<<2,
                "TANGUY_WEBSITE":0x1<<3,
                "RAVENBOT_USER":0x1<<4,
                "RAVENBOT_ADMIN":0x1<<5,

                "ADD_USER":0x1<<28,
                "MESSAGES_AUTHORISATION":0x1<<29,
                "ADMIN_AUTHORISATION":0x1<<30,
                "SUPER_ADMIN_AUTHORISATION":0x1<<31
            },
            "ravenLoginPagePath":"/RavenApp/ravenLogin/",
            "ravenLoginPageName":"ravenLogin"
        },
        "SQL_BDD":{
            "host"     : "localhost",
            "user"     : "raven",
            "password" : "4VXQgAyhnB$",
            "database" : "raven"
        },
        "Raven":{
            "logo":""+
            "                                                 ,::::.._\n"+
            "                                               ,':::::::::.\n"+
            "                                           _,-'`:::,::(o)::`-,.._\n"+
            "                                        _.', ', `:::::::::;'-..__`.\n"+
            "                                   _.-'' ' ,' ,' ,\:::,'::-`'''\n"+
            "                               _.-'' , ' , ,'  ' ,' `:::/\n"+
            "                         _..-'' , ' , ' ,' , ,' ',' '/::\n"+
            "                 _...:::'`-..'_, ' , ,'  , ' ,'' , ,'::|\n"+
            "              _`.:::::,':::::,'::`-:..'_',_'_,'..-'::,'|\n"+
            "      _..-:::'::,':::::::,':::,':,'::,':::,'::::::,':::;\n"+
            "       `':,'::::::,:,':::::::::::::::::':::,'::_:::,'/\n"+
            "        __..:'::,':::::::--''' `-:,':,':::'::-' ,':::/\n"+
            "   _.::::::,:::.-''-`-`..'_,'. ,',  , ' , ,'  ', `','\n"+
            " ,::SSt:''''`                 \\:. . ,' '  ,',' '_,'\n"+
            "                               ``::._,'_'_,',.-'\n"+
            "                                   \\\\ \\\\\n"+
            "                                    \\\\_\\\\\n"+
            "                                     \\\\`-`.-'_\n"+
            "                                  .`-.\\\\__`. ``\n"+
            "                                    ``-.-._\n"+
            "                                         `\n"+
            "\n\n"+
            "\t     888d888 8888b. 888  888 .d88b. 88888b.\n"+  
            "\t     888P        88b888  888d8P  b888    88b\n"+
            "\t     888    .d888888Y88  88P88888888888  888\n"+ 
            "\t     888    888  888 Y8bd8P Y8b.    888  888\n"+ 
            "\t     888     Y888888  Y88P    Y8888 888  888\n\n\n"
            ,
            "version":"Raven v1.0"
        }
    },
    "plugins":{
        
    }
}