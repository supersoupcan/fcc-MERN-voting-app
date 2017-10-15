import React, { Component } from 'react';
import axios from 'axios';



import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon'
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';
import { pinkA200, red500 } from 'material-ui/styles/colors';

export default class Create extends Component {
  constructor(props){
    super(props)
    this.state = {
      options : ["", ""],
      title : "",
      firstVote : null,
      allowCustom : false,
      error : [],
    },
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  
  handleSubmit(){
    //check fields
    var error = [];
    
    if (this.state.firstVote === null){
      error.push("error : Poll needs to be intialized with a vote");
    }
    if (this.state.title === ""){
      error.push("error - Poll has no Title");
    }
    if (this.state.title > 100){
      error.push("error - Title is " + 
      (this.state.title.length - 100) + " characters too long");
    }
    if(this.state.options <= 2 && this.state.allowCustom === false){
      error.push("error - Polls without customized voting must have 2 Options");
    }
    
    this.state.options.map(function(item, index){
      if(item === ""){
        error.push("error - Option " + (index + 1) + " has no text");
      }
      if (item.length > 100){
        error.push("error - Option " + (index + 1) + " is " + 
        (item.length - 100) + " characters too long");
      }
    });
    
    if (error.length === 0){
      axios({
        method: 'post',
        url: '/polls/create',
        data: {
          title : this.state.title,
          allowCustom : this.state.allowCustom,
          options : this.state.options,
          firstVote : this.state.firstVote
        }
      }).then(res => {
        this.props.dataCb();
      }).catch(err => {
        console.log(err);
      })
    }else(
      this.setState({
        error : error
      })
    )
  }
  
  setTitle(event){
    this.setState({
      title : event.target.value
    })
  }
  
  optionChange(index, event){
    const newOptions = [
        ...this.state.options.slice(0, index),
        event.target.value,
        ...this.state.options.slice(index + 1)
      ];
      
      this.setState({
        options : newOptions
      })
  }
  
  setFirstVote(index, event){
    if(this.state.firstVote === index){
      this.setState({
        firstVote : null
      })
    }else{
      this.setState({
        firstVote : index
      })
    }
  }
  
  addOption(event){
    const newOptions = [
      ...this.state.options.slice(),
      ""
    ]
    
    this.setState({
      options : newOptions
    })
  }
  
  deleteOption(index, event){
    const newOptions = [
      ...this.state.options.slice(0, index),
      ...this.state.options.slice(index + 1)
    ];
    
    if(this.state.firstVote === index){
      this.setState({
        options : newOptions,
        firstVote : null,
      })
    }else(
      this.setState({
        options : newOptions,
      })
    )
  }
  
  render(){
    return(
        <div className="create">
          <div style={{marginBottom : '10px'}}>
            <h2>Create A Poll</h2>
          </div>
          <div>
            <TextField
              style={{width : "70%", marginBottom : "10px"}}
              floatingLabelText="Title"
              name='title'
              value={this.state.title}
              onChange={(event) => {this.setTitle(event)}}
            />
            <br />
            {this.state.options.map(function(item, index){
              return(
                <div key={"option" + index}>
                  <span onClick={(event) => this.deleteOption(index, event)}>
                    <FontIcon 
                      style={{marginRight : "10px"}}
                      className="fa fa-times"
                      color={pinkA200}
                      hoverColor={red500}
                    />
                  </span>
                  <TextField
                    hintText={"Option " + (index + 1)}
                    value={this.state.options[index]}
                    onChange={(event) => this.optionChange(index, event)}
                    style={{width : "70%"}}
                  />
                  <span onClick={(event) => this.setFirstVote(index, event)}>
                    <FontIcon
                      color='black'
                      style={{marginLeft : "10px"}}
                      className={
                        this.state.firstVote === index ?
                        "fa fa-check-circle-o" : "fa fa-circle-o"
                      }
                    />
                  </span>
                  <br />
                </div>
            )}, this)}
            <RaisedButton
              style={{width : "35%", marginTop : '10px', marginBottom : '20px'}}
              label="Add Option"
              secondary={true}
              onClick={(event) => this.addOption(event)}
            />
            <br />
            <div style={{width : "35%", margin : 'auto'}}>
              <Checkbox 
                label="Allow Custom User Options"
                checked={this.state.allowCustom}
                onCheck={() => {
                  this.setState({
                    allowCustom : !this.state.allowCustom
                  })}
                }
              />
            </div>
            <br />
            <RaisedButton
              style={{width : "35%", marginTop : '10px'}}
              label="Publish Poll"
              primary={true}
              onClick={this.handleSubmit}
            />
          </div>
          <div>
            {this.state.error.map(function(item, index){
              return(
                <p key={"error" + index}> 
                  {item}
                </p>
              )
            })}
          </div>
        </div>
    )
  }
}