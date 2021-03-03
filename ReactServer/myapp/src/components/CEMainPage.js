import React from 'react';
import { Link } from 'react-router-dom'
import logo from '../images/logo.png';
import styled from 'styled-components';
import $ from 'jquery';
import { Textfit } from 'react-textfit';


const stylesForDashboard = `

#vitalStatsHolder{
  display:flex;
  flex-direction: column;
  justify-content: space-around;
  margin: 15px;
  width:100%;
  margin-bottom: 20px;
  align-items: center;
  height:80%;
}

.vitalStats{
  margin: 10px;
  height:100%;
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  position: relative;
  width: 58%;
  height: 0;
  padding-bottom: 38%;
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
  height: 38%;
  padding-bottom: 45%;
  margin-right: 10px;
  margin-top:10%;
  margin-left:10%;
}

.statHolder{
  margin-top:10%;
  display: inline-block;
  height: min-content;
  width:100%;
}

.statHolder h3{
  font-size:6vw;
  margin-bottom: 0px;
  margin-top: 0px;
  width:100%;
}

.statHolder p{
  color: black;
  font-size: 3.5vw;
}

.statLabel {
  margin:0px;
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
      user: null,
      favoriteTopic: null,
      mostRecentTopic: null,
      minutesRead: null,
      articlesRead: null
    }
  }
  resize(el, factor) {

    // Get element width
    var width = el.offsetWidth;
  
    // set default for factor
    if (typeof factor == 'undefined') {
      factor = 5;
    }
  
    // Set fontsize to new size
    el.style.fontSize = (width / factor | 0) + 'px';
  }
  componentDidMount() {
    this.getUserProfile()
  }

  pushToHomePage() {
    this.props.history.push('/LogIn')
  }
  getUserDashboardData() {
    this.getCurrentStats()
  }

  getCurrentStats(){
    fetch("https://127.0.0.1:5000/getRecentStats", {
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
            articlesRead: json['articlesRead'],
            minutesRead: json['minutesRead'],
            favoriteTopic: json['favoriteTopic'],
            mostRecentTopic:json['mostRecentTopic']
          });
          
        },
        (error) => {
          console.log("error")
        }
      )
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
          if (this.state.articlesToday == null) {
            console.log('here')
            this.getUserDashboardData()
          }
          // if ($('.statHolder').length > 0) {
          //   console.log("Fitting text")
          //   $(".statHolder h3").fitText(0.90);
          // }
          this.resize(document.querySelectorAll('.statHolder h3')[0],2.7)
          this.resize(document.querySelectorAll('.statHolder h3')[1],2.7)
          this.resize(document.querySelectorAll('.statHolder h3')[2],2.8)
          this.resize(document.querySelectorAll('.statHolder h3')[3],2.8)

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
            <div className="vitalStats">
              <div className="vitalStatsDecorativeLine"></div>
              <div className='statHolder'>
                <h3>{this.state.articlesRead}</h3>
                <p className="statLabel">Articles Today </p>
              </div>
            </div>
            <div className="vitalStats">
              <div className="vitalStatsDecorativeLine"></div>
              <div className='statHolder'>
                <h3>{this.state.minutesRead}</h3>
                <p className="statLabel">Minutes Spent</p>
              </div>
            </div>
            <div className="vitalStats">
              <div className="vitalStatsDecorativeLine"></div>
              <div className='statHolder'>
                <h3 >{this.state.favoriteTopic}</h3>
                <p className="statLabel">Favourite topic</p>
              </div>
            </div>
            <div className="vitalStats">
              <div className="vitalStatsDecorativeLine"></div>
              <div className='statHolder'>
                <h3 >{this.state.mostRecentTopic}</h3>
                <p className="statLabel">Last topic</p>
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
  min-height:100vh;
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
    height: 2.5rem;
  }
  span {
    color: #5dc399;
    font-weight: 300;
    font-size: 18px;
  }
`;