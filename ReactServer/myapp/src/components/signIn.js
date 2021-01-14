import React from 'react';
import { Text, TextField, DefaultButton, TextStyles } from '@fluentui/react';


var sectionStyle = {
  width: "50vw",
  height: "50vh",
  background: "rgba(0,0,0,0.5)",
  backdropFilter: "blur(10px)",
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
};

var formsStyle = {
  minHeight: '50%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between'
};

var eachFormsStyle = {
  margin: "10px",
  color: "white"
}

var textStyle = {
  
  fontFamily : "Open Sans",
  fontSize : "26px",
  marginTop: "5px",
  marginBottom: "5px"

}

const overrideButtonStyles = {
  wrapper: {
    label: {
      color: "white"
    }

  },
};



export default class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.onSubmit.bind(this);
  }
  componentDidUpdate(prevProps, prevState){
    console.log("component did update.")
    console.log(this.props.text)
    if(this.state.loggedIn === false){
      alert("Failed log in.")
    }
    else if(this.state.loggedIn === true){
      alert("successfully logged in. Redirecting.")
      this.props.history.push('/')
    }
  }
  onSubmit() {
    alert('button clicked')
    fetch("https://127.0.0.1:5000/signIn", {
      method: 'POST',
      mode:'cors',
      credentials:'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uname: this.uname.value, pword: this.pword.value })
    })
      .then(res => res.json())
      .then(
        (result) => {
          console.log("got response")
          this.setState({
            isLoaded: true,
            loggedIn: true,
            user: result
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            loggedIn: false,
            error
          });
        }
      )

  }
  render() {

    return (
      <div style={sectionStyle}>
        <div style={formsStyle}>
          <div style={eachFormsStyle}>
            
          <p style={textStyle}>
          Sign In
          </p>

          </div>
          <div style={eachFormsStyle}>
            <TextField ref={(ref) => { this.uname = ref }} styles={overrideButtonStyles} label="Username" />
          </div>
          <div style={eachFormsStyle}>
            <TextField ref={(ref) => { this.pword = ref }} styles={overrideButtonStyles} label="Password" />
          </div>
          <div style={eachFormsStyle}>
            <DefaultButton styles={overrideButtonStyles} text="Sign In" onClick={this.handleSubmit} allowDisabledFocus />
          </div>
        </div>
      </div>
    );
  }
}