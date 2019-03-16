import React from 'react'
import RavenComponent from '../Components/RavenComponent';
import {connect} from 'react-redux'

import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Container,
    Row,
    Col,
    Button,
    UncontrolledButtonDropdown
} from 'reactstrap';

/*
    Principe:
    We create n <Row><p> </p></Row>
*/

class Space extends RavenComponent{

    constructor(props){
        super(props);
        this.state={
            spaceElement:[]
        }
    }

    componentDidMount(){
        this.getSize();
        let state = this.state;

        let spaceElement=[]
        for(let i=0;i<this.props.size;i++){
            spaceElement.push(' ')
        }

        state.spaceElement=spaceElement
        this.setState(state);
    }

    render(){
        return(
            <div>
                {
                    this.state.spaceElement.map((e)=>(
                        <Row>
                            <p>{e}</p>
                        </Row>
                    ))
                }
            </div>
        )
    }

    //Utils functions:
  
}

export default Space