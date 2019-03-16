import React from 'react'
import RavenComponent from './RavenComponent';
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


class Header extends RavenComponent{

    constructor(props){
        super(props);

        this.state={
            reference:0,
            height:0,
            navbarHeight:15,
            languageIconSelected:'',
            mobile:false,
            computer:true,
            collapsed:true,
            displayLanguageChoise:false
        }

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.changeLanguageChoice = this.changeLanguageChoice.bind(this);

        let self = this;
        
        window.onscroll = (event)=>{
            let state=self.state;
            //max size if at top
            if(window.pageYOffset === 0) {
                setInterval(()=>{
                    if(state.navbarHeight < 15 + 1){
                        state.navbarHeight+=1;
                        self.setState(state)
                    }
                },5)
            }
          
            //Else diminuce size
            state.navbarHeight-=1;

            if(state.navbarHeight<5)
                state.navbarHeight = 5;

            self.setState(state)
        }
    }

    componentDidMount(){
        this.getSize();
        let state = this.state;
        state.reference = this.reference;
        state.height = this.height;
        state.computer = this.computer;
        state.mobile = this.mobile;

        for(let i=0;i<this.settings.Header.language.length;i++){
            if(this.props.language === this.settings.Header.language[i].value)
                state.languageIconSelected = this.settings.Header.language[i].icon;
        }

        

        this.setState(state);
    }

    


    renderComputer(){
        return(
            <div className="text-center">
                {/*Deffine navbar*/}
                <Navbar color="none" expand="xs" className="navbar navbar-default fixed-top" style={{backgroundColor:"white"}}>
                    <Container style={{height:this.state.height/100*this.state.navbarHeight}}>
                        {/*Global icon of application*/}
                        <NavbarBrand><Button style={{background:'none',border:'none',color:'black'}} onClick={()=>this.goToPage("HOME")}><img src={this.settings.Header.icon} width={this.state.reference/100*2.5}/></Button></NavbarBrand>
                        
                        
                        {/*Each navbar item button*/}
                        <Nav className="ml-auto" navbar>
                            {
                                this.settings.Header.text[this.props.language].all_items.map((e)=>(
                                    <Button style={{background:'none',border:'none',color:'black',margin:this.state.reference/100}} onClick={()=>this.goToPage(e.page)}>{e.value}</Button>
                                ))
                            }

                            {/*Manage language*/}
                        
                            <UncontrolledButtonDropdown direction="down">
                                {/*Drop down button -> flag of current language*/}
                                <DropdownToggle caret style={{background:'none',border:'none',color:'black'}}>
                                    <img src={this.state.languageIconSelected} width={this.state.reference/100*2.5} />
                                </DropdownToggle>

                                {/*All language item*/}
                                <DropdownMenu right>
                                    {
                                        this.settings.Header.language.map((e)=>(
                                            <DropdownItem style={{background:'none',border:'none',color:'black'}} onClick={()=>this.changeLanguage(e.value)}>
                                                    <Container>
                                                        <Row>
                                                            <Col xs="6">
                                                                <img src={e.icon} width="100%" />
                                                            </Col>
                                                            <Col xs="6">
                                                                {e.name}
                                                            </Col>
                                                        </Row>
                                                    </Container>
                                            </DropdownItem>
                                        ))
                                    }
                                </DropdownMenu>
                            </UncontrolledButtonDropdown>
                        </Nav>
                    </Container>
                </Navbar>
            </div>
        )
    }

    renderMobile(){
        console.log(this.props)
        return(
            <div className="text-center">
                {/*Deffine navbar*/}
                <Navbar color="none" expand="xl" fixed>
                    <NavbarBrand><Button style={{background:'none',border:'none',color:'black'}} onClick={this.toggleNavbar}><img src={this.settings.Header.icon} width={this.state.reference/100*4}/></Button></NavbarBrand>
                    <Collapse isOpen={!this.state.collapsed} navbar>
                        <Nav navbar>
                            {/*Each navbar item button*/}
                            <NavItem><Button style={{background:'none',border:'none',color:'black'}} onClick={()=>this.goToPage("HOME")}>{this.settings.Header.text[this.props.language].home}</Button></NavItem>
                            {
                                this.settings.Header.text[this.props.language].all_items.map((e)=>(
                                    <NavItem><Button style={{background:'none',border:'none',color:'black'}} onClick={()=>this.goToPage(e.page)}>{e.value}</Button></NavItem>
                                ))
                            }
                            <NavItem><Button style={{background:'none',border:'none',color:'black'}} onClick={this.changeLanguageChoice}>{this.settings.Header.text[this.props.language].language}</Button></NavItem>
                            {this.state.displayLanguageChoise &&
                                this.settings.Header.language.map((e)=>(
                                    <NavItem><Button style={{background:'none',border:'none',color:'black'}} onClick={()=>this.changeLanguage(e.value)}><img src={e.icon} width="10%" /> {e.name}</Button></NavItem>
                                ))
                            }
                            
                        </Nav>
                    </Collapse>
                </Navbar>
                
            </div>
        )
    }

    //Utils functions:
    //Change app language by new_language_value
    changeLanguage(new_language_value){
        //Change icon:
        let state = this.state
        for(let i=0;i<this.settings.Header.language.length;i++){
            if(new_language_value === this.settings.Header.language[i].value)
                state.languageIconSelected = this.settings.Header.language[i].icon;
        }
        //For mobile version:
        state.displayLanguageChoise = false;
        this.setState(state)

        //Change language value:
        this.props.dispatch({type:'CHANGE_LANGUAGE',value:new_language_value})
    }
    //change component displayed in center of app
    goToPage(new_page_value){
        //Change language value:
        this.props.dispatch({type:'CHANGE_PAGE',value:new_page_value})
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }
    changeLanguageChoice(){
        this.setState({
            displayLanguageChoise:!this.state.displayLanguageChoise
        })
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.language.language
    }
  }
  
  export default connect(mapStateToProps)(Header)