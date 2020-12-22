import React from 'react';
import { Text } from '@fluentui/react';
import {Link} from 'react-router-dom'


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
      mode:'cors',
      credentials:'include',
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
          <div style={formsStyle}>
            <div style={eachFormsStyle}>
              <Text styles={{ fontSize: "36px" }} variant={'mega'} block>
                Home
        </Text>
              <Text styles={{ fontSize: "36px" }} variant={'large'} block>
                Welcome, {this.state.user.fname} !
        </Text>

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
              <Text styles={{ fontSize: "36px" }} variant={'mega'} block>
                Home
        </Text>
              <Text styles={{ fontSize: "36px" }} variant={'large'} block>
                You're not logged in. 
                <Link to="/signIn">Sign in Here</Link>

        </Text>
        

            </div>
          </div>
        </div>
      );
    }
  }
}