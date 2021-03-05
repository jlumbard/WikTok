import React from 'react';
import { ScrollablePane, Text } from '@fluentui/react';
import { Link } from 'react-router-dom'
import LogoImage from '../images/logo.png';

var outerContainerStyle = {
  width: '100%',
  height: '100vh',
  background: "rgba(0,0,0,0.5)",
  backdropFilter: "blur(10px)",
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}

var sectionStyle = {
  width: "65vw",
  height: "65vh",
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom:"auto",
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
var skipButtonStyles = {
  padding: "5px",
  backdropFilter: "blur(10px)",
  background: "#70edb9",
  fontFamily: "arial",
  fontSize: "15px",
  color: "fff",
  cursor: "pointer",
  marginTop: "10px",
  marginBottom:"auto",
  "&:hover": {
    background: "#red"
  }
}

var topHeaderStyles = {
  marginBottom: "auto",
  width:"100%",
  display:"flex",
  flexDirection:"row",
  justifyContent:"flex-end",
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
  fontFamily: "Arial",
  fontSize: "18px",
  margin: '10px',
  textAlign: 'center'
}

var ImageStyle = {
  maxWidth: "30%",
}

var iFrameStyles = {
  marginBottom:"auto",
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
    this.pushOnboardingArticles = this.pushOnboardingArticles.bind(this);
    console.log("Set state")
  }
  componentDidMount() {
    console.log("component did mount")
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
          if(this.state.user == false){
            this.props.history.push('/')
          }
          else if(this.state.user.Onboarded == true){
            this.props.history.push('/')
          }
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log("error")
          this.props.history.push('/')
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

  pushOnboardingArticles() {
    console.log("Running post Onboarding")
    fetch("https://127.0.0.1:5000/pushOnboardArticles", {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body:JSON.stringify(this.state.likedArticles)
    })
      .then(res => res.json())
      .then(
        (json) => {
          console.log("got articles")
          console.log(json)
          //someday this should redirect to a wikipedia page, or a better home page
          this.props.history.push('/')
        },
        (error) => { console.log("error in onboarding") }
      )

    //Also need to update user to mark them as onboarded, this happens in the above API call


  }

  componentDidUpdate(prevProps, prevState) {
    console.log("component did update.")


    // if (this.state.loggedIn != true) {
    //   this.props.history.push('/')
    // }
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

    if(this.state.articles.length == 0){//Then they've gone through everything
      console.log("List is empty")
    }

    //Loop through categories, I.E. news, sports. 
    for (const category in tempArticles){

      for (const article of tempArticles[category]){

        //If article has been checked, discard it. Its been pushed onto the ratings array if they liked it!
        if(nextArticle === true){

          if((this.state.likedArticles.indexOf(article) == -1) && (this.state.dislikedArticles.indexOf(article) == -1)){
            document.querySelector('iframe').src = article + "?printable=yes"
            nextArticle = false;
          }
          //Set the iframe (the wikipedia subpage) to the next article
          //And turn this off so It doens't also set the next article
        }
        // console.log(article);
        // console.log(lastLink.replace("?printable=yes",""));
        if(encodeURI(article) === lastLink.replace("?printable=yes","")){
          nextArticle = true
          //Set this true so the next loop knows to push this. 
        }
      }
      if(category === undefined || category.length == 0){
        //Remove articleType from list if it doesn't exist. 
        tempArticles.splice(tempArticles.indexOf(category))
      }
    }
    if(nextArticle === true){
      console.log("GOT TO END OF LIST")
      document.getElementsByClassName("skipButton")[0].innerText = "Finish";
      var finishDiv = document.createElement('div');

      finishDiv.style = "display:flex; flex-direcation:column; align-items:center; justify-content:center; position:absolute; height:80%; width:80%; background-color:rgba(0,0,0,0.8)"
      var innerFinishDiv = document.createElement('div');
      innerFinishDiv.innerText = "Finish"
      innerFinishDiv.style = "color:white; font-size:1.3em;cursor:pointer;"
      finishDiv.appendChild(innerFinishDiv)
      finishDiv.onclick = this.pushOnboardingArticles

      document.getElementById('iframeSection').innerHTML=""
      document.getElementById('iframeSection').appendChild(finishDiv)
    }
  }



  render() {
    console.log("render")

    //redirect if they're not signed in?

    if (this.state.articles !== null) {
      return (
        <div className="testClass" style={outerContainerStyle}>
          <div className="topHeader" style={topHeaderStyles}>
            

          </div>
          <div id="iframeSection" style={sectionStyle}>
            <img style={ImageStyle} src={LogoImage}></img>


            <iframe style={iFrameStyles} src={this.state.articles[Object.keys(this.state.articles)[0]][0] + "?printable=yes"}>

            </iframe>
            <div style={belowTextStyles}>
              Is this an article you'd read?
              </div>
            <div style={{ display: 'inline' }}>
              <div onClick={this.likeButtonClicked} style={{ display: 'inline', margin: "10px", cursor: "pointer", fontSize: "30px" }}>&#128077;</div>
              <div onClick={this.disLikeButtonClicked} style={{ display: 'inline', margin: "10px", cursor: "pointer", fontSize: "30px" }}>&#128078;</div>
            </div>
            <div onClick={this.pushOnboardingArticles} className="skipButton" style={skipButtonStyles}>Finish Onboarding</div>

          </div>
        </div>
      )
    }
    else {
      console.log("empty articles")
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