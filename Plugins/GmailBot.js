const Plugin= require('./Kernel/Plugin');

class GmailBot extends Plugin{
    constructor(params){
        super(params);
    }
    
    sendEmail(data,cb){
        let self=this;
        if(data.userEmail===undefined || data.text===undefined || data.subject===undefined){
            self.error("[sendEmail] need text,userEmail,subject");
            cb(false);
        }
        else{
            var send = require('gmail-send')({
                //var send = require('../index.js')({
                user: this.params["login"],
                // user: credentials.user,                  // Your GMail account used to send emails
                pass: this.params["password"],
                // pass: credentials.pass,                  // Application-specific password
                to:   data.userEmail,
                // to:   credentials.user,                  // Send to yourself
                                                        // you also may set array of recipients:
                                                        // [ 'user1@gmail.com', 'user2@gmail.com' ]
                // from:    credentials.user,            // from: by default equals to user
                // replyTo: credentials.user,            // replyTo: by default undefined
                // bcc: 'some-user@mail.com',            // almost any option of `nodemailer` will be passed to it
                subject: data.subject,
                text:    data.text,         // Plain text
                //html:    '<b>html text</b>'            // HTML
                });
    
            send({},function (err, res) {
                if(err){
                    cb(false);
                }
                else{
                    cb(true);
                }
            });
        }
    }


    __start__(){
        let self=this;
        return new Promise((resolve,err)=>{
            //Zero REST API ---> access by prototype
            resolve();
        })
    }
}

module.exports = GmailBot;