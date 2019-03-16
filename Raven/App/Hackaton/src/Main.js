import React, { Component } from 'react';
import Header from './Components/Header';
import Footer from './Components/Footer';
import MainContent from './Components/MainContent';
import { Provider } from 'react-redux'
import Store from './Redux/store.js'

import './global.css'

class Main extends Component {
  render() {
    return (
      <Provider store={Store}>
        <div id="page-container">
            <Header />
            <div id="content-wrap">
             <MainContent />
          </div>
          <footer id="footer">
          <Footer />
          </footer>
        </div>
          

          
      </Provider>
    );
  }
}

export default Main;
