import React from 'react';
import { connect } from 'react-redux';
import { startCreateRoom, startJoinRoom } from '../actions/rooms';
import {insertBlockWords , getBlockWords , removeBlockWords} from '../actions/blockedWords';
import {insertVideo,getVideos,changeVideo} from '../actions/videos';
import ListBlockWords from './admin/blockWords';

const Videos = (props) => { 
  const {video1,video2} = props.videos;
  console.log('video 1 rendeeeeeeeereeeed',video1);
  return (<div>
    <hr />
    <p>Video1: Use code <code> ladmincode1t </code> in room<br/>
    https://youtube.com/?v=
    <input 
    className="text-input--join" 
    placeholder="2g811Eo7K8U"
    name="video1"
    style={{maxWidth:'8em'}}
    onChange={(event)=>props.handleVideoInputChange(event)} 
    value={video1.id}
    />
    {video1.hasChanged ? <button className="button--join" onClick = {(e)=>props.onVideoSave(e)} name='video1'>Save</button>  : '' }
    </p>
    <hr />
    <p>Video2: Use code <code> ladmincode2t </code> in room</p>
    <p>
    https://youtube.com/?v=<input className="text-input--join" placeholder="2g811Eo7K8U" name="video2" style={{maxWidth:'8em'}}  value={video2.id} onChange={(event)=>props.handleVideoInputChange(event)} />
    {video2.hasChanged ? <button className="button--join" onClick = {(e)=>props.onVideoSave(e)} name='video2'>Save</button> : '' } 
    </p>
    <hr />
    <p className="smaller">Both codes will be displayed in main page as l*********t (lemonchat)</p>
    </div>);
}
export class AdminRoomPage extends React.Component {

  state = { 
    error: '',
    joinError: ''
   };

   componentDidMount () { 
    this.props.getBlockWords();
    this.props.getVideos();
   }
   componentDidUpdate(){

   }
  onCreateRoom = (e) => {
    e.preventDefault();
    const user = this.props.auth;
    const value = e.target.rname.value.trim();
    if(user) {
      const name = user.displayName;
      const thisTime = Date.now();
      if(value) {
        this.setState({error: ''});
        
        const room = {
          name: value,
          date: thisTime,
          people: {
            id: user.uid,
            name,
            unread: 0,
            lastRead: 0
          }
        }
        this.props.startCreateRoom(room, this.showCreateError);
      } else {
        this.setState({error: 'Please enter a valid room name!'});
      }
      
    }
    
  }

  onWordSubmit = (e) => {
    e.preventDefault();
    const value = e.target.word.value.trim();
      if(value){
        this.props.insertBlockWords(value);
        e.target.word.value='';
      }
  }

  onDeleteWord = (e,word) => {
    e.preventDefault();
    this.props.removeBlockWords(word);
  }
  handleVideoInputChange(event){
    event.preventDefault();
    console.log('handleINputChange',event.target.name , event.target.value);
    this.props.changeVideo(event.target.name , event.target.value);
  }
  onVideoSave(event){
    event.preventDefault();
    //console.log(event.target.name);
    this.props.insertVideo(event.target.name);
  }
  showCreateError = (error) => {
    this.setState({
      error 
    });
  }

  showJoinError = (joinError) => {
    this.setState({
      joinError 
    });
  }

  onJoinRoom = (e) => {
    e.preventDefault();
    const user = this.props.auth;
    const data = {
      roomName: e.target.rname.value,
      id: user.uid,
      name: user.displayName,
      unread: 0
    }
    this.props.startJoinRoom(data, this.showJoinError);
  }

  render() {
    const blockedWords = this.props.blockedWords;
    return (
      <div className="box-layout--join">
        <div className="box-layout__box--join">
          <h1 className="box-layout__title">Create a room</h1>
          <p>The created room will show up in the main page</p>
          <form onSubmit={this.onCreateRoom} autoComplete="off">
          <input className="text-input--join" placeholder="Enter Room name" name="rname" />
          <button className="button--join">Create</button>
          {this.state.error && <p className="message__time" style={{color: "black"}}>{this.state.error}</p>}
          </form>
          <hr/>
          <p>If other admin created the room, you have to join to see it</p>
          <form onSubmit={this.onJoinRoom} autoComplete="off">
          <input className="text-input--join" placeholder="Enter Room name" name="rname" />
          <button className="button--join">Join</button>
          {this.state.joinError && <p className="message__time" style={{color: "black"}}>{this.state.joinError}</p>}
          </form>
        </div>
        <div className="box-layout__box--join">
          <h1 className="box-layout__title">Blocked Words</h1>
          <p>Words replaced in homepage. Visible in admin</p>
            <ListBlockWords
                words={this.props.blockedWords} 
                onWordSubmit={(word) => this.onWordSubmit(word) } 
                wordRemove={(event,word) => this.onDeleteWord(event,word)} 
              />
        </div>
        <div className="box-layout__box--join">
          <h1 className="box-layout__title">Trigger Videos</h1>
          <p>The videos will trigger by entering one of the special key in a room.<br/>
          The video will show on all connected devices. These keywords should be always blocked so the users cannot see the code</p>         
          {this.props.videos.video1 ? <Videos videos={this.props.videos}
                                        onVideoSave={(e)=>this.onVideoSave(e)}
                                        handleVideoInputChange={(event)=>this.handleVideoInputChange(event)}/>: ''}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  startCreateRoom: (room, showCreateError) => dispatch(startCreateRoom(room, showCreateError)),
  startJoinRoom: (data, showJoinError) => dispatch(startJoinRoom(data, showJoinError)),
  getBlockWords: () => dispatch(getBlockWords()),
  insertBlockWords: (word) => dispatch(insertBlockWords(word)),
  removeBlockWords: (word) => dispatch(removeBlockWords(word)),
  getVideos: () => dispatch(getVideos()),
  changeVideo: (name,value) => dispatch(changeVideo(name,value)),
  insertVideo : (name) => dispatch(insertVideo(name))
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  blockedWords : state.blockedWords,
  videos : state.videos
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminRoomPage);