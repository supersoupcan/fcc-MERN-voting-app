import React, { Component } from 'react';

import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';

const Bar = ({user}) => {
  return(
    <AppBar
      style={{marginBottom : "40px"}}
      title="Voting App"
      showMenuIconButton={false}
      iconElementLeft={
        <FontIcon className="fa fa-free-code-camp" />
      }
      iconElementRight={
        <FlatButton 
          label={user ? "Logout" : "Login"}
          icon={<FontIcon className="fa fa-facebook" />}
          href={user ? "auth/logout" : "/auth/facebook"}
        />
      }
    />
  )
}

export default Bar;