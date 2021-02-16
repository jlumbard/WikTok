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

var linkStyle = {
  color:"black",
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

export default class CEMainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    }
  }
  componentDidMount() {
    this.getUserProfile()
  }
  pushToHomePage(){
    this.props.history.push('/LogIn')
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

      return (//This should be the informational area, it should have statistics about what the user is currently doing 
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
          <h4 style={{marginTop:"1rem"}}>
            <a style = {linkStyle} href="/accountPage">Manage your account</a>, <a style = {linkStyle} href="/logOut">log out</a>, or view a <a style = {linkStyle} href="https://en.wikipedia.org/wiki/Special:Random">random Wikipedia Article!</a>
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

        <Form>
        <button text="Log In" onClick={this.pushToHomePage}>Log In</button>
        </Form>

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

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  h3 {
    color: #666666;
    margin-bottom: 2rem;
  }
  button {
    width: 75%;
    max-width: 350px;
    min-width: 250px;
    height: 40px;
    border: none;
    margin: 1rem 0;
    box-shadow: 0px 14px 9px -15px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    background-color: #70edb9;
    color: #fff;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease-in;
    &:hover {
      transform: translateY(-3px);
    }
  }
`;

const LogoWrapper = styled.div`
  img {
    height: 4rem;
  }
  span {
    color: #5dc399;
    font-weight: 300;
    font-size: 18px;
  }
`;