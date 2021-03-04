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
  color:"white",
  fontFamily: "Arial",
  textDecorationLine: "none"

}



export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    }
    this.hideModal = this.hideModal.bind(this);
    this.goToOnboarding = this.goToOnboarding.bind(this);
  }
  componentDidMount() {
    this.getUserProfile()
  }
  hideModal(){
    document.getElementById('modal').remove()
  }
  goToOnboarding(){
    this.props.history.push("/Onboarding")
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

      //Have they onboarded?
      console.log(this.state.user)
      if(this.state.user.hasOwnProperty('Onboarded') && this.state.user.Onboarded == false || !this.state.user.hasOwnProperty('Onboarded')){
        console.log("has not onboarded.")
        return (
          <Container>
            <CoveredDiv id="modal">
              <div>
              You haven't onboarded yet. Onboarding helps us predict what kind of articles you like!
              </div>
              <button onClick={this.hideModal}>Skip</button>
              {/* need to mark as onboarded */}
              <button onClick={this.hideModal}>Remind Me Later</button>
              <button onClick={this.goToOnboarding} >Onboard Now</button>
            </CoveredDiv>
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

      //The've already done onboarding.
      else{
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

          <StyledButton>
            <a style = {linkStyle} href="/accountPage">Manage Account</a>
          </StyledButton>
          <StyledButton>
            <a style = {linkStyle} href="/logOut">Log Out</a>
          </StyledButton>
          <StyledButton>
            <a style = {linkStyle} href="https://en.wikipedia.org/wiki/Special:Random">View Random Article</a>
          </StyledButton>

        </Container>
      );
      }
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

const CoveredDiv = styled.div`
  width: 80%;
  height: 70%;
  background-color: rgba(0,0,0,0.87);
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
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
  div{
    color:white;
    text-align:center;
    width:60%;
    font-size:1.3em;
    margin-bottom: 2rem;
  }
  

`;


const Container = styled.div`
  min-width: 100%;
  min-height:100vh;
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

const StyledButton = styled.button`
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