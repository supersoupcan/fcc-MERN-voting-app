import React, { Component } from 'react';
import { VictoryPie, VictoryLegend, VictoryTheme, VictoryTooltip, Flyout } from 'victory';
import { List, ListItem } from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';

export default class Poll extends Component{
  constructor(props){
    super(props);
    this.state = {
      selected : null,
      active : true,
    },
    this.processVote = this.processVote.bind(this);
  }
  
  selectOption(index, event){
    if (this.state.selected === index){
      this.setState({
        selected : null
      })
    }else{
      this.setState({
        selected : index
      })
    }
  }
  
  processVote(){
    this.setState({active : false});
    axios({
        method: 'post',
        url: '/polls/vote',
        data: {
          index : this.state.selected,
          id : this.props.data._id,
        }
    }).then(res => {
      console.log('calling dataCB');
      this.props.dataCb();
    }).catch(err => {
      if (err) throw err;
    })
  }
  
  render(){
    const indexMode = Number.isInteger(this.props.hasVoted) ? 
      this.props.hasVoted : this.state.selected;
      
    var victoryFormat = this.props.data.options.map(option => {
     return {x : option.label, y : option.votes.length}
    });
    
    return(
      <div>
        <div className="statistics">
          <h2>{this.props.data.title}</h2>
          <h4>Created By {this.props.data.author.displayName}</h4>
        </div>
        <div className="pollFlex">
          <div className="pollList">
            {(this.props.user) &&
                <RaisedButton 
                  style = {{width : "100%", margin : "10px"}}
                  label="Vote"
                  secondary={true}
                  disabled={
                    !(!Number.isInteger(this.props.hasVoted) &&
                    Number.isInteger(this.state.selected))
                  }
                  onClick={this.processVote}
                />
              }
            <List>
              <Divider />
              {this.props.data.options.map((option, index) => {
                return(
                  <ListItem
                    onClick={event => this.selectOption(index, event)}
                    disabled={!this.props.user || Number.isInteger(this.props.hasVoted)}
                    key={"option" + index}
                    primaryText={option.label}
                    secondaryText={"Votes: " + option.votes.length}
                    rightIcon={
                      <FontIcon 
                        className = {
                          indexMode === index ?
                          "fa fa-check-circle-o" : "fa fa-circle-o"}
                    />
                    }
                  />
                )
              })}
              <Divider />
            </List>
          </div>
          <div className="pollGraph">
            <VictoryPie
              labelRadius={90}
              data={victoryFormat}
              theme={VictoryTheme.material}
              labelComponent={
                <VictoryTooltip />
              }
            />
          </div>
        </div>
      </div>
    )
  }
}
