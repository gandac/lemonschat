import React from 'react';
import { connect } from 'react-redux';
import selectMessages from '../selectors/messages';
import moment from 'moment';

export const MessageItem = ( props ) => {
  const {name , text, time, words , id , isObfuscated} = props;
  return (<li className={`message ${isObfuscated  === true ? 'isObfuscated' : ''}`}>
          <div className="messageHeader">
          <span className="messageName"> {name} </span>
          <span className="messageMeta"> 
          {words} 
          <span style={{"float":"right"}}>{time} </span>
          </span>
          </div>
          <div className="messageText">{text}</div>
          {isObfuscated === true ? <div className="censoredLabel">{name} a fost cenzurat</div> : ''}
        </li>
  )
}

class Messages extends React.Component {


  scrollToBottom = (options) => {
    this.messagesEnd.scrollIntoView(options);
  }
  
  componentDidMount() {
    this.scrollToBottom(false);
  }
  
  componentDidUpdate() {
    this.scrollToBottom({block: 'end', behavior: "smooth"});
  }

  displayMessages = (messages) => {
    if (typeof messages === 'string') {
      return <li className="message__time" key={'12'}>{messages}</li>;
    }
    let a = [],  prevSender;
    messages.forEach((message) => {
      const name = message.sender.anonimNumber ? message.sender.anonimNumber : 'Lemonschat';
      const time = moment(message.createdAt).format('H:mm');
      const words = <span> words remaining: {message.sender.totalWords}</span>
      const text = <p className="message__text">{message.text}</p>;
      if(message.status) {
        a.push(<MessageItem key={message.id} name={name + ' joined'} time={time} words={words} id={message.id} isObfuscated={message.isObfuscated}/>);
        prevSender = null;
      }else if( !message.sender.isAnonymous ) {
        a.push(<MessageItem key={message.id} time={time} text={text} id={message.id} isObfuscated={message.isObfuscated}/>);
      }else if(prevSender === message.sender.uid) {
        a.push(<MessageItem key={message.id} name={name} time={time} words={words} text={text} id={message.id} isObfuscated={message.isObfuscated}/>);
      }
      
      else {
        prevSender = message.sender.uid;
        a.push(<MessageItem key={message.id}  name={name} time={time} words={words} text={text} id={message.id} isObfuscated={message.isObfuscated}/>);
      }
    }); 
    return a;
  }

  render() {
    let className = "messages-box";
     if( this.props.mainRoom )
        className = "messages-box mainRoom"
    return (
      <div className={className}>
        <ul>
        {
          this.displayMessages(this.props.messages)
        }
        <li ref={(el) => { this.messagesEnd = el; }}></li>
        </ul> 
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  messages: selectMessages(state.rooms, props.roomName)
});

export default connect(mapStateToProps)(Messages);