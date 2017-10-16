import React, { Component } from 'react';
import { VictoryPie, VictoryLegend, VictoryTheme, VictoryTooltip, Flyout } from 'victory';
import { List, ListItem } from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import axios from 'axios';

//grey100, grey300, grey400, grey500

export default class Poll extends Component{
  constructor(props){
    super(props);
    this.state = {
      selected : null,
      active : true,
      customOption: '',
    },
    this.processVote = this.processVote.bind(this)
  }
  
  
  updateCustom(event){
    this.setState({
      customOption : event.target.value
    })
  }
  
  selectOption(index, event){
    if (this.state.selected === index){
      this.setState({
        selected : null
      })
    }
    else{
      this.setState({
        selected : index
      })
    }
  }
  
  processVote(){
    this.setState({active : false});
    if(this.state.selected === -1){
      axios({
        method : 'post',
        url: '/polls/customVote',
        data: {
          newOption : this.state.customOption,
          id : this.props.data._id,
        }
      }).then(res => {
        this.props.dataCb()
      }).catch(err => {
        if (err) throw err;
      })
    }else{
      axios({
          method: 'post',
          url: '/polls/vote',
          data: {
            index : this.state.selected,
            id : this.props.data._id,
          }
      }).then(res => {
        this.props.dataCb();
      }).catch(err => {
        if (err) throw err;
      })
    }
  }
  
  render(){
    const indexMode = Number.isInteger(this.props.hasVoted) ? 
      this.props.hasVoted : this.state.selected;
      
    var victoryFormat = this.props.data.options.map(option => {
     return {x : option.label, y : option.votes.length}
    });
    
    //Booleans to assist in view rendering
    const hasVoted = Number.isInteger(this.props.hasVoted);
    const hasSelected =  Number.isInteger(this.state.selected);
    const hasSignedIn = Boolean(this.props.user);
    const allowCustom = this.props.data.allowCustom;
    
    return(
      <div>
        <div style={{textAlign : 'center'}}>
          <h2>{this.props.data.title}</h2>
          <h4>Created By {this.props.data.author.displayName}</h4>
        </div>
        <div className="pollFlex">
          <div className="pollList">
            {hasSignedIn &&
                <RaisedButton 
                  style = {{width : "100%", margin : "10px 20px"}}
                  label="Vote"
                  secondary={true}
                  disabled={!(!hasVoted && hasSelected)}
                  onClick={this.processVote}
                />
              }
              <Divider />
              {(allowCustom && hasSignedIn && !hasVoted) &&
                <div onClick={event => this.selectOption(-1, event)}>
                  <TextField
                    style={{width : '80%', margin : '0px 20px'}}
                    floatingLabelText="Custom User Vote"
                    value={this.state.customOption}
                    onChange={(event) => this.updateCustom(event)}
                  />
                  <span
                    style={{float : 'right', margin: '30px 20px'}}>
                    <FontIcon
                      className = {
                        indexMode === -1 ?
                        "fa fa-check-circle-o" : "fa fa-circle-o"
                      }
                    />
                  </span>
                </div>
              }
            <List>
              {this.props.data.options.map((option, index) => {
                return(
                  <ListItem
                    onClick={event => this.selectOption(index, event)}
                    disabled={!hasSignedIn || hasVoted}
                    key={"option" + index}
                    primaryText={option.label}
                    secondaryText={"Votes: " + option.votes.length}
                    rightIcon={
                      <FontIcon
                        color={hasVoted || !hasSignedIn ? "grey" : "black"}
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
