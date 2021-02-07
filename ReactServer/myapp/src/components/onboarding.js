import React from 'react';
import { Text } from '@fluentui/react';
import { Link } from 'react-router-dom'
import LogoImage from '../images/logo.png';


var sectionStyle = {
  width: "65vw",
  height: "65vh",
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

  textAlign: "center",
  fontFamily: "Open Sans",
  fontSize: "13vw",
  marginTop: "5px",
  marginBottom: "5px"

}

var textStyleSmall = {

  textAlign: "center",
  fontFamily: "Open Sans",
  fontSize: "4vw",
  marginTop: "5px",
  marginBottom: "5px",
  color: "white"

}

var belowTextStyles = {
  color: "White",
  fontFamily: "Open Sans",
  margin: '10px',
  textAlign: 'center'
}

var ImageStyle = {
  maxWidth: "30%",
}

var iFrameStyles = {
  width: "80%",
  height: "70%",
  margin: "10px"
}

export default class Onboarding extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      articles: null
    }
  }
  componentDidMount() {
    this.getUserProfile()
    this.getOnboardingArticles()
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
  getOnboardingArticles() {
    console.log("Running get Onboarding")
    fetch("https://127.0.0.1:5000/getOnboardArticles", {
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
          console.log("got articles")
          console.log(json)
          this.setState({
            articles: json
          });
        },
        (error) => { console.log("error in onboarding") }
      )
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("component did update.")
    console.log(this.props.text)

    if (this.state.loggedIn != true) {
      alert("successfully logged in. Redirecting.")
    }
  }


  render() {
    //redirect if they're not signed in?

    if (this.state.articles !== null) {
      return (
        <div style={sectionStyle}>
          <img style={ImageStyle} src={LogoImage}></img>


          <iframe style={iFrameStyles} src={this.state.articles['Sports'][0] + "?printable=yes"}>

          </iframe>
          <div style={belowTextStyles}>
            Do you think you'd like this article?
              </div>
          <div style={{display:'inline'}}>
            <div style={{display:'inline', margin:"10px"}}>&#128077;</div>
            <div style={{display:'inline', margin:"10px"}}>&#128078;</div>
          </div>

        </div>
      )
    }
    else {
      return (
        <div style={sectionStyle}>
          <img style={ImageStyle} src={LogoImage}></img>
          <div style={formsStyle}>
            <div style={eachFormsStyle}>
            </div>
          </div>
        </div>
      )
    }
  }
}