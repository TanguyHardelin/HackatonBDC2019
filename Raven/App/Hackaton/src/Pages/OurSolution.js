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


class OurSolution extends RavenComponent{

    constructor(props){
        super(props);

        this.state={
            reference:0,
        }
    }

    componentDidMount(){
        this.getSize();
        let state = this.state;
        state.reference = this.reference;

        this.setState(state);
    }


    render(){
        return(
            <div>
               
            </div>
        )
    }

    //Utils functions:
  
}

const mapStateToProps = (state) => {
    return {
        language: state.language
    }
  }
  
  export default connect(mapStateToProps)(OurSolution)