import React from 'react';
import { Link } from 'react-router-dom'
import logo from '../images/logo.png';
import styled from 'styled-components';


const stylesForDashboard = `

#vitalStatsHolder{
  display:flex;
  flex-direction: column;
  justify-content: space-around;
  margin: 15px;
  width:100%;
  margin-bottom: 20px;
}

.vitalStats{
  margin: 20px;
  height:100%;
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  position: relative;
  width: 18%;
  height: 0;
  padding-bottom: 18%;
  color:white;
  display:flex;
  flex-direction: row;
  -moz-background-clip: padding;     /* Firefox 3.6 */
  -webkit-background-clip: padding;  /* Safari 4? Chrome 6? */
  background-clip: padding-box; 
}
.vitalStatsDecorativeLine{
  background-color: white;
  width:3px;
  height: 80%;
  padding-bottom: 80%;
  margin-right: 10px;
  margin-top:10%;
  margin-left:10%;
}

.statHolder{
  margin-top:10%;
  display: inline-block;
  height: min-content;
}

.statHolder h3{
  font-size:6vw;
  margin-bottom: 0px;
  margin-top: 0px;
}

.statHolder p{
  color: black;
  font-size: 1.5vw;
}

.statLabel {
  font-size: 
}


`

var textStyle = {

  textAlign: "center",
  fontFamily: "Open Sans",
  fontSize: "13vw",
  marginTop: "5px",
  marginBottom: "5px"

}

var linkStyle = {
  color: "black",
}

var textStyleSmall = {

  textAlign: "center",
  fontFamily: "Open Sans",
  fontSize: "4vw",
  marginTop: "5px",
  marginBottom: "5px",
  color: "white"

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
  pushToHomePage() {
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

          <style>{stylesForDashboard}</style>
          <div id="vitalStatsHolder">
          <div class="vitalStats">
            <div class="vitalStatsDecorativeLine"></div>
            <div class='statHolder'>
              <h3>9</h3>
              <p class="statLabel">Articles Today </p>
            </div>
          </div>
          <div class="vitalStats">
            <div class="vitalStatsDecorativeLine"></div>
            <div class='statHolder'>
              <h3>13</h3>
              <p class="statLabel">Minutes Spent</p>
            </div>
          </div>
          <div class="vitalStats">
            <div class="vitalStatsDecorativeLine"></div>
            <div class='statHolder'>
              <h3 >Music</h3>
              <p class="statLabel">Favourite topic</p>
            </div>
          </div>
          </div>



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