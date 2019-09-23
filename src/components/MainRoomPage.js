import React from 'react';
import { connect } from 'react-redux';
import { joinLastCreatedRoom , startSendMessage,setEndVideo , removeVideo , countWords}  from '../actions/mainRoom';
import {getVideos} from '../actions/videos';
//import { startSendMessage} from '../actions/rooms';
import Messages from './Messages';
import VideoModal from '../ui/VideoModal';
import { removeBlockWords } from '../actions/blockedWords';

// const getMessages = () => {

// }

// const onSubmit = (e) => {
//   e.preventDefault();

// }

export class RoomPage extends React.Component {

state = {
showModal: false,
error: '',
joinError: ''
}

componentDidMount(){

    //store.dispatch(login(user.uid, name));
    const user = this.props.auth;
    this.props.getVideos();

}

  roomName = this.props.lastRoom.name;

  showJoinError = (joinError) => {
    this.setState({
      joinError 
    });
  }


  onSubmit = (e) => {
    e.preventDefault();
    const message = e.target.message.value;

    if(!message.trim()) {
      e.target.submit.diabled = true;
      return;
    }

    this.props.startSendMessage(message, this.props.lastRoom.name);
    e.target.reset();
  }


  componentDidUpdate() {
    const rooms = this.props.rooms;
    if (rooms.length > 0) {
      const a = rooms.find((room) => {
        return room.name === this.props.lastRoom.name;
        // const roomPath = a.id;
         this.props.startClearUnread(this.roomName);
      });
      
    }
  }
  onEndVideo(e){

    this.props.setEndVideo();
  }
  onCloseVideo (e) {
    e.preventDefault();
    this.props.removeVideo();
  }
  
  messageChanged(e){
      console.log('reffff on  change' , this.sendMessageInputRef.value);
      //this.sendMessageInputRef.blur();
      //this.refs.sendMessageInputRef.blur();
      const {roomUser} = this.props;
      const inputValue = e.target.value;
      const currentWordsCount = countWords(inputValue);

      let remainingWords = 140;
      if( roomUser ) {
         remainingWords = roomUser.totalWords - currentWordsCount;
      }
 
      if(remainingWords <= 0){
          e.target.value = inputValue.slice(0, -1)
      }else{
          //do nothing . Here we can trigger a field that user is typing if val.length > 0
      }
  }
  triggerVideoFront(){
    console.log('reffff value',this.sendMessageInputRef.value);
   // this.sendMessageInputRef.blur();
  }
  render() {
    
    const {triggerVideo,roomUser} = this.props;
    let hasVideos = false;
    let videoToView = false;
  
    if(triggerVideo && triggerVideo[0] ){

        if(triggerVideo[0].wasClosed === false){
            videoToView = triggerVideo[0].id;
            hasVideos = true;
            
            this.triggerVideoFront();
        }
    }
    let remainingWords = 140;
   

    return (
    <div className='container mainPageWrapper'>
        
        <div className="box-layout--messages mainPageBoxLayout">
        
                <div className="room-header">
                    <img className="logoImage" src="/images/logo.png" />
                </div>
                <Messages roomName={this.props.lastRoom.name} mainRoom />
                <form onSubmit={this.onSubmit} autoComplete="off" id="message-form">
                    <input type="text"  ref={(ref) => {this.sendMessageInputRef = ref}} name="message" className="text-input" placeholder="Send message" autoFocus onChange={(e)=>this.messageChanged(e)} />
                    <button name="submit" className="login-button sendMessageButton" >Send</button>
                </form>
                
                {hasVideos ? 
                
                    <VideoModal
                    canClose =  {triggerVideo[0].endVideo}
                    onEndVideo={() => this.onEndVideo()}
                    code={videoToView} 
                    videos={this.props.videos}
                    inputRef = {this.sendMessageInputRef}
                    onCloseVideo={(e) => this.onCloseVideo(e)}/>
                    : ''
                } 
         
        </div>
    </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  rooms: state.rooms,
  lastRoom: state.lastRoom,
  roomUser: state.lastRoom.user,
  triggerVideo: state.lastRoom.triggerVideo,
  videos: state.videos,
});

const mapDispatchToProps = (dispatch) => ({
  startSendMessage: (message, roomName) => dispatch(startSendMessage(message, roomName)),
  setEndVideo: () => dispatch(setEndVideo()),
  removeVideo : () => dispatch(removeVideo()),
  getVideos: () => dispatch(getVideos()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RoomPage);