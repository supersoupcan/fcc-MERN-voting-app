import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom'


import Home from "./Home";


export default class App extends Component{
  render(){
    return(
      <Switch>
        <Route exact path='/' component={ Home } />
        <Route exact path='/user/:id' component={ Home } />
      </Switch>
    )
  }
}