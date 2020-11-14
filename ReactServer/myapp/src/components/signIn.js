import React from 'react';
import { TextField, DefaultButton } from '@fluentui/react';


var sectionStyle = {
    width: "50vw",
    height: "50vh",
    background: "rgba(0,0,0,0.5)",
    backdropFilter:"blur(10px)",
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center'
  };

  var formsStyle = {
      height:'50%',
      display:'flex',
      flexDirection:'column',
      alignItems:'center',
      justifyContent:'space-between'
  };




const SignIn = () => {

  return (
    <div style={ sectionStyle }>
    <div  style = { formsStyle}>
        <TextField label="Username" />
        <TextField label="Password" />
        <DefaultButton text="Standard" onClick={_alertClicked} allowDisabledFocus/>
    </div>
    </div>
  );
};

function _alertClicked(){
    alert('Clicked');
}

export default SignIn;