import React, { Component } from 'react';
import { List, ListItem } from 'material-ui/List';
import axios from 'axios';

import FontIcon from 'material-ui/FontIcon';
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton';

export default class Profile extends Component{
  constructor(props){
    super(props);
    
    this.state = {
      isOpen : false,
      selectedIndex : 0
    },
    this.handleOpen = this.handleOpen.bind(this),
    this.handleClose = this.handleClose.bind(this),
    this.deletePoll = this.deletePoll.bind(this)
  }
  
  handleOpen(index){
    this.setState({
      isOpen: true,
      selectedIndex : index
    });
  };

  handleClose(){
    this.setState({
      isOpen: false,
      selectedIndex : 0
    });
  };
  
  deletePoll(){
    axios({
      method : 'post',
      url : '/polls/delete',
      data : {
        id : this.props.data[this.state.selectedIndex]._id,
      }
    }).then(res =>{
      this.props.dataCb();
    }).catch(err => {
      if (err) throw err;
    })
  }
  
  render(){
    const actions = [      
      <FlatButton
        label="Cancel"
        secondary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Delete"
        primary={true}
        onClick={this.deletePoll}
      />
    ]
    
    return(
      <div style={{margin : 'auto', width : '80%'}}>
        <h2 style={{textAlign : 'center'}}> My Polls </h2>
        <List>
          {this.props.data.map((poll, index) => {
            return(
              <ListItem
                disabled={true}
                key={index}
                primaryText={poll.title}
                rightIcon = {
                  <FontIcon 
                    className="fa fa-trash-o"
                    onClick={() => this.handleOpen(index)}
                    hoverColor='black'
                  />
                }
              />
            )
          })}
          <Dialog
            title="Delete Poll"
            actions={actions}
            modal={true}
            open={this.state.isOpen}
          >
            {"Are you sure you want to delete " + 
              this.props.data[this.state.selectedIndex].title
            }
          </Dialog>
        </List>
      </div>
    )
  }
}