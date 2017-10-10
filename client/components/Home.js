import React, { Component } from 'react';

import Stats from './Stats';
import Poll from './Poll';
import Bar from './Bar';
import Create from './Create';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { List, ListItem } from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import axios from 'axios';

export default class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      polls : [],
      selected : -2,
    }
    this.hasVoted = this.hasVoted.bind(this),
    this.updateData = this.updateData.bind(this)
  }
  
  componentWillMount(){
    this.updateData();
  }
  
  updateData(){
    axios.get('/polls/list').then(res => {
      this.setState({
        polls : res.data,
        selected : -2
      });
    }).catch(err => {
      console.log(err);
    });
  }
  
  hasVoted(pollIndex){
    var votedIndex = null;
    if (this.props.match.params.id){
      this.state.polls[this.state.selected].options.map((option, index) => {
        option.votes.map(vote => {
          if (vote.facebookID === this.props.match.params.id){
            votedIndex = index;
          }
        })
      })
    }
    return(votedIndex);
  }
  
  render(){
    return(
      <MuiThemeProvider>
        <div>
          <Bar user={this.props.match.params.id} />
          <div className="container">
            <div className="flexHome">
              <div className="appList">
                <List>
                  <Divider />
                  <ListItem
                    onClick={() => this.setState({selected : -2})}
                    primaryText="Statistics"
                    rightIcon={
                      this.state.selected === -2 ?
                      <FontIcon className="fa fa-info-circle"/> :
                      <FontIcon />
                    }
                  />
                  {this.props.match.params.id && <ListItem 
                      onClick={() => this.setState({selected : -1})}
                      primaryText="Create A Poll"
                      rightIcon={
                        this.state.selected === -1 ?
                        <FontIcon className="fa fa-plus-circle"/> :
                        <FontIcon />
                    }
                  />}
                  <Divider />
                  <Subheader>
                    Polls
                  </Subheader>
                  <Divider />
                  {this.state.polls.map(function(item, index){
                    return(
                      <ListItem 
                        onClick={() => this.setState({selected : index})}
                        key={"poll" + index}
                        primaryText={item.title}
                        secondaryText={item.author.displayName}
                        rightIcon={
                          this.state.selected === index ?
                          <FontIcon className="fa fa-pie-chart"/> :
                          <FontIcon /> 
                        }
                      />
                  )}, this)}
                </List>
              </div>
              <div className="appDisplay">
                {this.state.selected === -2 &&  
                  <Stats 
                    data={this.state.polls} 
                  /> 
                }
                {this.state.selected === -1 &&
                  <Create 
                    dataCb={this.updateData}
                  />
                }
                {this.state.selected >= 0 &&
                  <Poll 
                    data={this.state.polls[this.state.selected]}
                    user={this.props.match.params.id}
                    hasVoted={this.hasVoted()}
                    dataCb={this.updateData}
                  />
                }
              </div>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}