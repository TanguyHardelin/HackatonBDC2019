import React from 'react'
import RavenComponent from './RavenComponent';

import {
    Button
} from 'reactstrap'


class SocialButton extends RavenComponent{
    constructor(props){
        super(props)
        this.state={
            icon:this.props.bw_icon,
            height:0
        }

        this.handleOnMouseEnter = this.handleOnMouseEnter.bind(this)
        this.handleOnMouseLeave = this.handleOnMouseLeave.bind(this)
    }

    

    handleOnMouseEnter(){
        let state = this.state;
        state.icon = this.props.color_icon
        this.setState(state)
    }

    handleOnMouseLeave(){
        let state = this.state;
        state.icon = this.props.bw_icon
        this.setState(state)
    }

    componentDidMount(){
        this.getSize();
        let state=this.state
        state.height = this.height
        this.setState(state)
    }

    render(){
        return(
            <button style={{background:'none',border:'none',color:'black'}} onMouseEnter={this.handleOnMouseEnter} onMouseLeave={this.handleOnMouseLeave}>
                <a href={this.props.url}>
                <img src={this.state.icon} width={this.state.height/100*5} />
                </a>
            </button>
        )
    }

}

export default SocialButton;