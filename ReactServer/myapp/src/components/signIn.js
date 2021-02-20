import React from 'react';
import styled from 'styled-components';
import logo from '../images/logo.png';
import { Link } from 'react-router-dom'

export default class SignIn extends React.Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.onSubmit.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("component did update.")
    console.log(this.props.text)
    if (this.state.loggedIn === false) {
      alert("Failed log in.")

    }
    else if (this.state.loggedIn === true) {
      alert("successfully logged in. Redirecting.")
      this.props.history.push('/')
    }
  }

  // I feel like this is where we need to put logic for validating inputs
  onSubmit() {
    alert('button clicked')
    fetch("https://127.0.0.1:5000/signIn", {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
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

      <Container>
        <LogoWrapper>
          <img src={logo} alt="" />
        </LogoWrapper>
        <Form>
     
          <StyledInput required placeholder="Username" ref={(ref) => { this.uname = ref }}></StyledInput>
          <StyledInput type="password" required placeholder="Password" ref={(ref) => { this.pword = ref }}></StyledInput>
          <button text="Sign In" onClick={this.handleSubmit}>Log In</button>
        </Form>
        <label>Don't have an account?</label>
        <Link style={{fontSize:"13px"}} to="/signUp"> Sign up here.</Link>
      </Container>

    );
  }
}

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

const StyledInput = styled.input`
  width: 80%;
  max-width: 350px;
  min-width: 250px;
  height: 40px;
  border: none;
  margin: 0.5rem 0;
  background-color: #f5f5f5;
  box-shadow: 0px 14px 9px -15px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  padding: 0 1rem;
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