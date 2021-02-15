import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../images/logo.png';




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
      <Container>

        <LogoWrapper>
          <img src={logo} alt="" />
        </LogoWrapper>
        

        <Form>

        <StyledInput required placeholder="Email" ref={(ref) => { this.email = ref }} label="Username" />


        <StyledInput required placeholder="Password" ref={(ref) => { this.pword = ref }} label="Password" />


        <StyledInput required placeholder="First Name" ref={(ref) => { this.fname = ref }} label="First Name" />


        <StyledInput required placeholder="Last Name" ref={(ref) => { this.lname = ref }} label="Last Name" />


        <button text="Sign Up" onClick={this.handleSubmit}>Sign Up</button>
        </Form>
        <label>Already have an account?</label>
        <Link style={{fontSize:"13px"}} to="/signIn"> Log in here.</Link>
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