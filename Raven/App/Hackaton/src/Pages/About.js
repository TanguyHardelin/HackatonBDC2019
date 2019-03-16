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
import Space from '../Components/Space';


class About extends RavenComponent{

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
            <div style={{backgroundColor:"#1F1F1F",color:"white"}}>
                <Container >
                    <Space size={2} />
                    <Row>
                        <Col xs="12">
                            <h2 className="text-center">{this.settings.About.text[this.props.language].teamTitle}</h2>
                        </Col>
                    </Row>
                    <Space size={2} />
                    {
                        this.settings.About.text[this.props.language].teamContent.map((e)=>(
                            <Row>
                                <Col lg="6">
                                    <img src={e.photo} width="75%" style={{padding:"1%",marginLeft:"auto",marginRight:"auto",display:"block"}} />
                                </Col>
                                <Col lg="6">
                                    <Container>
                                        <Space size={2} />
                                        <Row>
                                            <Col xs="12">
                                                <h4>{e.name}</h4>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12">
                                                <h6>{this.settings.About.text[this.props.language].role} {e.role}</h6>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12">
                                            <p style={{textAlign:"justify"}}>
                                                {e.content}
                                            </p>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Col>
                            </Row>
                        ))
                    }

                <Space size={2} />

                </Container>
            </div>
        )
    }

    //Utils functions:
  
}

const mapStateToProps = (state) => {
    return {
        language: state.language.language
    }
  }
  
  export default connect(mapStateToProps)(About)