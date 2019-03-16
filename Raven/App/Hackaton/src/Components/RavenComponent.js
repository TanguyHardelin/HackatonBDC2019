import React from 'react'
import settings from '../Settings/settings'
import { resolve } from 'url';

class RavenComponent extends React.Component{
    constructor(props){
        super(props);
        this.settings = settings;

        this.width = 0;
        this.height = 0;
        this.reference = 0;     //max (height,width)

        this.mobile = true;
        this.computer = false;
    }
    //Call API method:
    callRavenAPI(URL){
        return new Promise((resolve,err)=>{
            fetch(URL)
            .then(response => response.json())
            .then(data =>{
                resolve(data)
            });
        })
    }

    sendToRaven(URL,data){
        return new Promise((resolve,err)=>{
            fetch(URL,{
                method: 'POST',
                headers: {
                    "Content-Type": "File"
                  },
                body: data
            })
            .then(()=>{
                resolve();
            });
        })
    }

    //Get size of windows:
    getSize(){
        this.width = isNaN(window.innerWidth) ? window.clientWidth : window.innerWidth;
        this.height = isNaN(window.innerHeight) ? window.clientHeight : window.innerHeight;
        this.reference = this.height;

        if(this.width > this.height){
            this.computer = true;
            this.mobile = false;

            this.reference = this.width;
        }
            
    }


    //Renders methods
    render(){
        //You have to overload this method !
        if(this.width > this.height){
            return this.renderComputer();
        }
        else{
            return this.renderMobile();
        }
    }
    //Or you overload these methods
    renderMobile(){
        return(
            <div></div>
        )
    }
    renderComputer(){
        return(
            <div></div>
        )
    }
}

export default RavenComponent;