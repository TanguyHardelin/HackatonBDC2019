import React from 'react'
import RavenComponent from '../Components/RavenComponent';
import {connect} from 'react-redux'

import About from '../Pages/About'
import Home from '../Pages/Home'
import Analytics from '../Pages/Analytics'
import OurSolution from '../Pages/OurSolution';
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



class Empty extends RavenComponent{

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
        console.log(this.props.page)
        if(this.props.page=='ABOUT'){
            return <About />
        }
        else if(this.props.page=='OURSOLUTION'){
            return <OurSolution />
        }
        else if(this.props.page=='ANALYTICS'){
            return <Analytics />
        }
        else{
            return <Home />
        }
    }

    //Utils functions:
  
}

const mapStateToProps = (state) => {
    return {
        page: state.page.page
    }
  }
  
  export default connect(mapStateToProps)(Empty)