import React from 'react';
import { Link } from 'react-router-dom'
import logo from '../images/logo.png';
import styled from 'styled-components';


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
        <Container>
          <LogoWrapper>
            <img src={logo} alt="" />
          </LogoWrapper>
          <h1>
            Home
          </h1>

          <h4 >
            Welcome, {this.state.user.fname}!
          </h4>

        </Container>
      );
    }
    else {

      return (
        <Container>
        <LogoWrapper>
          <img src={logo} alt="" />
        </LogoWrapper>

          <h4>    
                You're not logged in. 
                
            </h4>
            <Link style={{fontSize:"13px"}} to="/signIn"> Sign in here.</Link>

            
        </Container>
      );
    }
  }
}


const Container = styled.div`
  min-width: 100%;

  background-color: rgba(255, 255, 255, 0.8);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 2rem;

  h4 {
    color: #808080;
    font-weight: bold;
    font-size: 13px;
    margin-top: 2rem;
    span {
      color: #ff8d8d;
      cursor: pointer;
    }
  }
  text {
    font-size: 13px;
    
  }
`;

const LogoWrapper = styled.div`
  img {
    height: 6rem;
  }
  span {
    color: #5dc399;
    font-weight: 300;
    font-size: 18px;
  }
`;