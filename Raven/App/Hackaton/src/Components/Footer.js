import React from 'react'
import RavenComponent from './RavenComponent';
import Space from './Space'
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
import SocialButton from './SocialButton';


class Footer extends RavenComponent{

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
            <div style={{backgroundColor:'#1F1F1F',color:'white'}}>
                <Container>
                    <Space size={3} />
                    <Row>
                        <Col xs={{offset:4,size:1}}>
                            <SocialButton bw_icon={this.settings.Footer.icons.facebook.bw} color_icon={this.settings.Footer.icons.facebook.color} url={this.settings.Footer.icons.facebook.url}/>
                        </Col>
                        <Col xs={{size:1}}>
                            <SocialButton bw_icon={this.settings.Footer.icons.twitter.bw} color_icon={this.settings.Footer.icons.twitter.color} url={this.settings.Footer.icons.twitter.url}/>
                        </Col>
                        <Col xs={{size:1}}>
                            <SocialButton bw_icon={this.settings.Footer.icons.instagram.bw} color_icon={this.settings.Footer.icons.instagram.color} url={this.settings.Footer.icons.instagram.url}/>
                        </Col>
                        <Col xs={{size:1}}>
                            <SocialButton bw_icon={this.settings.Footer.icons.linkedin.bw} color_icon={this.settings.Footer.icons.linkedin.color} url={this.settings.Footer.icons.linkedin.url}/>
                        </Col>
                    </Row>
                    <Space size={1} />
                    <Row>
                        <Col xs="12">
                            <p className="text-center">
                                {this.settings.Footer.text[this.props.language].all_rigth_reserved}
                            </p>
                        </Col>
                    </Row>
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
  
  export default connect(mapStateToProps)(Footer)