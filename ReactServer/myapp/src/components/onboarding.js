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
      articles: null,
      likedArticles: [],
      dislikedArticles:[],
    }
    this.likeButtonClicked = this.likeButtonClicked.bind(this);
    this.transitionNextArticle = this.transitionNextArticle.bind(this);
    this.disLikeButtonClicked = this.disLikeButtonClicked.bind(this);
    console.log("Set state")
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

  likeButtonClicked(event) {
      var currentLink = document.querySelector('iframe').src
      this.state.likedArticles.push(currentLink)
      this.transitionNextArticle(currentLink)
  }
  disLikeButtonClicked(event) {
    var currentLink = document.querySelector('iframe').src
    console.log("disLikeButton")
    this.state.dislikedArticles.push(currentLink)
    this.transitionNextArticle(currentLink)
}

  transitionNextArticle(lastLink){
    //remove last article
    //This is the dummy variable that lets us know if the next article is the one to switch to while still being O(n)
    var nextArticle = false
    var tempArticles = this.state.articles
    console.log(this.state.articles)
    console.log(Object.prototype.toString.call(this.state.articles))
    //Loop through categories, I.E. news, sports. 
    for (const category in tempArticles){
      console.log(tempArticles[category])
      for (const article of tempArticles[category]){
        console.log(article)
        //If article has been checked, discard it. Its been pushed onto the ratings array if they liked it!
        if(nextArticle === true){
          console.log("changing article.")
          if((this.state.likedArticles.indexOf(article) == -1) && (this.state.dislikedArticles.indexOf(article) == -1)){
            document.querySelector('iframe').src = article + "?printable=yes"
            nextArticle = false;
          }
          //Set the iframe (the wikipedia subpage) to the next article
          //And turn this off so It doens't also set the next article
        }
        if(article === lastLink.replace("?printable=yes","")){
          nextArticle = true
          //Set this true so the next loop knows to push this. 
        }
      }
      if(category === undefined || category.length == 0){
        //Remove articleType from list if it doesn't exist. 
        tempArticles.splice(tempArticles.indexOf(category))
      }
    }
  }



  render() {
    //redirect if they're not signed in?

    if (this.state.articles !== null) {
      return (
        <div style={sectionStyle}>
          <img style={ImageStyle} src={LogoImage}></img>


          <iframe style={iFrameStyles} src={this.state.articles[Object.keys(this.state.articles)[0]][0] + "?printable=yes"}>

          </iframe>
          <div style={belowTextStyles}>
            Do you think you'd like this article?
              </div>
          <div style={{display:'inline'}}>
            <div onClick={this.likeButtonClicked} style={{display:'inline', margin:"10px", cursor:"pointer"}}>&#128077;</div>
            <div onClick={this.disLikeButtonClicked} style={{display:'inline', margin:"10px", cursor:"pointer"}}>&#128078;</div>
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