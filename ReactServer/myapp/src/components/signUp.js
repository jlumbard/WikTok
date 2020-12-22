import React from 'react';
import { Text, TextField, DefaultButton } from '@fluentui/react';


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

const overrideButtonStyles = {
  wrapper: {
    label: {
      color: "white"
    }

  },
};



export default class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.onSubmit.bind(this);
  }
  componentDidUpdate(prevProps, prevState){
    console.log("component did update.")
    console.log(this.props.text)
    if(this.state.text === "FAILED"){
      alert("that username already exists.")
    }
    else if(this.state.text === "SUCCESS"){
      alert("successfully signed up. Redirecting.")
      this.props.history.push('/')
    }
  }

  onSubmit() {
    console.log("called alert")
    alert('button clicked')
    fetch("https://127.0.0.1:5000/signUp", {
      method: 'POST',
      mode:'cors',
      credentials:'include',
      headers: {
        'Accept': 'text/html',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: this.email.value, password: this.pword.value, fname:this.fname.value, lname:this.lname.value })
    })
      .then(res => res.text())
      .then(
        (text) => {
          console.log("got response")
          console.log(text)
          this.setState({
            isLoaded: true,
            text: text
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
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
            <Text styles={{ fontSize: "36px" }} variant={'mega'} block>
              Sign Up
        </Text>

          </div>
          <div style={eachFormsStyle}>
            <TextField ref={(ref) => { this.email = ref }} styles={overrideButtonStyles} label="Username" />
          </div>
          <div style={eachFormsStyle}>
            <TextField ref={(ref) => { this.pword = ref }} styles={overrideButtonStyles} label="Password" />
          </div>
          <div style={eachFormsStyle}>
            <TextField ref={(ref) => { this.fname = ref }} styles={overrideButtonStyles} label="First Name" />
          </div>
          <div style={eachFormsStyle}>
            <TextField ref={(ref) => { this.lname = ref }} styles={overrideButtonStyles} label="Last Name" />
          </div>
          <div style={eachFormsStyle}>
            <DefaultButton styles={overrideButtonStyles} text="Sign Up" onClick={this.handleSubmit} allowDisabledFocus />
          </div>
        </div>
      </div>
    );
  }
}