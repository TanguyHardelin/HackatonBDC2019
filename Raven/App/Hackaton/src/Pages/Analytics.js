import React from 'react'
import RavenComponent from '../Components/RavenComponent';
import {connect} from 'react-redux'

import ReactDOM from 'react-dom';
import * as V from 'victory';


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


class Analytics extends RavenComponent{

    constructor(props){
        super(props);

        this.state={
            reference:0,
            data: this.getScatterData()
        }
    }

    
    getScatterData() {
        let data = [];
        for(let i=0;i<50;i++){
            let color=Math.round(Math.random(0,2))
            console.log(color)
            if(color == 0)
                data.push({
                    x: Math.random(1, 50),
                    y: Math.random(10, 90),
                    size: Math.random(8) + 3,
                    fill: "red"
                })
            else if(color == 1)
                data.push({
                    x: Math.random(1, 50),
                    y: Math.random(10, 90),
                    size: Math.random(8) + 3
                })
        }

        return data
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
                <Container>
                    <Row>
                        <Col xs="12">
                            <h3 className="text-center">{this.settings.Analysis.text[this.props.language].dataset}</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={{offset:2,size:8}}>
                            <V.VictoryChart
                                    
                                    height={this.state.reference/4}
                                    width={this.state.reference/4}
                                    responsive={true}
                                >
                                    <V.VictoryScatter
                                        data={this.state.data}
                                        theme={V.VictoryTheme.material}
                                        style={{
                                            data: {
                                                opacity: (d) =>  d.y % 5 === 0 ? 1 : 0.7,
                                                fill: (d) => d.fill
                                            }
                                        }}
                                        events={[{
                                            target: "data",
                                            eventHandlers: {
                                              onClick: () => {
                                                return [
                                                  {
                                                    target: "data",
                                                    mutation: (props) => {
                                                      const fill = props.style && props.style.fill;
                                                      return fill === "black" ? null : { style: { fill: "black" } };
                                                    }
                                                  }
                                                ];
                                              }
                                            }
                                          }]}
                                        
                                    />
                            </V.VictoryChart>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12">
                            <h3 className="text-center">{this.settings.Analysis.text[this.props.language].dataset}</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={{offset:2,size:8}}>
                            <V.VictoryChart
                                    
                                    height={this.state.reference/4}
                                    width={this.state.reference/4}
                                    responsive={true}
                                >
                                    <V.VictoryBar
                                        data={this.state.data}
                                        theme={V.VictoryTheme.material}
                                        style={{
                                            data: {
                                                opacity: (d) =>  d.y % 5 === 0 ? 1 : 0.7,
                                                fill: (d) => d.fill
                                            }
                                        }}
                                        
                                    />
                            </V.VictoryChart>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.language.language
    }
  }
  
  export default connect(mapStateToProps)(Analytics)