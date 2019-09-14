import React from 'react';
import { connect } from 'react-redux';
import { startCreateRoom, startJoinRoom } from '../actions/rooms';
import {insertBlockWords , getBlockWords , removeBlockWords} from '../actions/blockedWords';
import ListBlockWords from './admin/blockWords';
export class AdminRoomPage extends React.Component {

  state = { 
    error: '',
    joinError: ''
   };

   componentDidMount () { 
    this.props.getBlockWords();
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
          <form onSubmit={this.onCreateRoom} autoComplete="off">
          <input className="text-input--join" placeholder="Enter Room name" name="rname" />
          <button className="button--join">Create</button>
          {this.state.error && <p className="message__time" style={{color: "black"}}>{this.state.error}</p>}
          </form>
        </div>
        <div className="box-layout__box--join">
          <h1 className="box-layout__title">Blocked Words</h1>
       <ListBlockWords
           words={this.props.blockedWords} 
           onWordSubmit={(word) => this.onWordSubmit(word) } 
           wordRemove={(event,word) => this.onDeleteWord(event,word)} 
        />
        </div>
        <div className="box-layout__box--join">
          <h1 className="box-layout__title">Join a room</h1>
          <p>If other admin created the room, you have to join to see it</p>
          <form onSubmit={this.onJoinRoom} autoComplete="off">
          <input className="text-input--join" placeholder="Enter Room name" name="rname" />
          <button className="button--join">Join</button>
          {this.state.joinError && <p className="message__time" style={{color: "black"}}>{this.state.joinError}</p>}
          </form>
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
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  blockedWords : state.blockedWords,
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminRoomPage);