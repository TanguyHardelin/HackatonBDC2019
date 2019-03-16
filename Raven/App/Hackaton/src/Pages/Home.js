import React from 'react'
import RavenComponent from '../Components/RavenComponent';
import {connect} from 'react-redux'

import L from 'leaflet';

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
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    UncontrolledButtonDropdown
} from 'reactstrap';

import Space from '../Components/Space'
import About from './About';

class Home extends RavenComponent{

    constructor(props){
        super(props);

        this.state={
            reference:0,
            width:0,
            height:0,
            initialized:false
        }

        this.sendImageToRaven = this.sendImageToRaven.bind(this)
    }

    componentDidMount(){
        

        this.getSize();
        let state = this.state;
        state.reference = this.reference;
        state.width  = this.width; 
        state.height = this.height; 
        state.initialized = true;
        this.setState(state);
        
    
        if(this.state.initialized){
            setTimeout(()=>{
                this.map = L.map('map', {
                    center: [45.501045,-73.569525],
                    zoom: 10,
                    layers: [
                      L.tileLayer('http://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png'),
                    ]
                })
                this.map.touchZoom.disable();
                this.map.doubleClickZoom.disable();
                this.map.scrollWheelZoom.disable();
                this.map.boxZoom.disable();
                this.map.keyboard.disable();

                
            },100)
        }
        
    }


    render(){
        return(
            <div id="home">
                {/*Video banner*/}
                <video style={{minHeight:"100%",minWidth:"100%",height:"auto",width:"100%"}} autoPlay loop muted>
                    <source src="/hackaton/build/videos/videoBanner.mp4" type="video/mp4"/>
                    Your browser does not support the video tag.
                </video>

                {/*Context*/}
                <Container>
                    <Space size={3} />
                    <Row>
                        <Col lg="4">
                            <h2>{this.settings.Home.text[this.props.language].context}</h2>
                            <p style={{textAlign:"justify"}}>
                                {this.settings.Home.text[this.props.language].contextContent}
                            </p>
                        </Col>
                        <Col lg="8">
                            <img src="/hackaton/build/images/context.jpg" style={{width:"100%",padding:"2%"}} />
                        </Col>
                    </Row>
                    <Space size={3} />
                </Container>

                {/*Map*/}
                <div id="map" style={{width:this.state.width,height:this.state.height/100*45}}>
            
                </div>

                {/*Solution*/}
                <Container>
                    <Space size={3} />
                    <Row>
                        <Col lg="8">
                            <img src="/hackaton/build/images/context.jpg" style={{width:"100%",padding:"2%"}} />
                        </Col>
                        <Col lg="4">
                            <h2>{this.settings.Home.text[this.props.language].solution}</h2>
                            <p style={{textAlign:"justify"}}>
                                {this.settings.Home.text[this.props.language].solutionContent}
                            </p>
                        </Col>
                    </Row>
                    <Space size={3} />

                     {/*Raven Test*/}
                   
                </Container>

                <form method="post" enctype="multipart/form-data" action="/upload">
                    <input type="hidden" name="msgtype" value="2"/>
                    <input type="file" name="images" />
                    <input type="submit" value="Upload" />
                </form>

               
                {/*Team presentation*/}
                <About />
               
            </div>
        )
    }

    //Utils functions:
    sendImageToRaven(){
        
        let file=document.querySelector("#imageForm").files[0];
        this.sendToRaven("/upload",file);
    }
  
}

const mapStateToProps = (state) => {
    return {
        language: state.language.language
    }
  }
  
  export default connect(mapStateToProps)(Home)