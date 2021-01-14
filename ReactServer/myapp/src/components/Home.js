import React from 'react';
import { Text } from '@fluentui/react';
import { Link } from 'react-router-dom'
import LogoImage from '../images/logo.png';


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

  textAlign:"center",
  fontFamily: "Open Sans",
  fontSize: "13vw",
  marginTop: "5px",
  marginBottom: "5px"

}

var textStyleSmall = {

  textAlign:"center",
  fontFamily: "Open Sans",
  fontSize: "4vw",
  marginTop: "5px",
  marginBottom: "5px",
  color:"white"

}

var ImageStyle = {
  width: "50%",
}

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    }
  }
  componentDidMount() {
    this.getUserProfile()
  }
  getUserProfile() {
    fetch("https://127.0.0.1:5000/getUser", {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(
        (json) => {
          console.log("got response")
          console.log(json)
          this.setState({
            isLoaded: true,
            user: json
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log("error")
          // this.setState({
          //   isLoaded: true,
          //   error
          // });
        }
      )
  }


  render() {
    if (this.state.user != null) {

      return (
        <div style={sectionStyle}>
          <img style={ImageStyle} src ={LogoImage}></img>
          <div style={formsStyle}>
            <div style={eachFormsStyle}>
              <p style={textStyle}>
                Home
          </p>
    
        <p style={textStyleSmall}>
        Welcome, {this.state.user.fname} !
          </p>

            </div>
          </div>
        </div>
      );
    }
    else {

      return (
        <div style={sectionStyle}>
          <div style={formsStyle}>
            <div style={eachFormsStyle}>
            <p style={textStyle}>
                Home
          </p>

          <p style={textStyleSmall}>
                
                You're not logged in. 
                <Link style={{color:"white"}} to="/signIn"> Sign in Here</Link>

              </p>


            </div>
          </div>
        </div>
      );
    }
  }
}