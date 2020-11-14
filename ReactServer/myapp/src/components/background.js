import React, {Component} from 'react';
import BackgroundImage from '../images/background2.jpg';

var sectionStyle = {
    width: "100vw",
    height: "100vh",
    backgroundImage: "url(" + BackgroundImage + ")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    backgroundSize: "cover",
    display: 'Flex',
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center'
  };


// var Wrapper = React.createClass({
//     render: function() {
//         return (
//             <section style={ sectionStyle }>
//             {this.props.children}
//         </section>
//         );
//       }
// })
// const Background = (props) => {
//   return (
//     <section style={ sectionStyle }>
//         {this.props.children}
//     </section>
//   );
// };

class Background extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <section style={ sectionStyle }>
                {this.props.children}
            </section>
        )

    }
}

export default Background;