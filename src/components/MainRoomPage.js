import React from 'react';
import { connect } from 'react-redux';
import { joinLastCreatedRoom , startSendMessage} from '../actions/mainRoom';
//import { startSendMessage} from '../actions/rooms';
import Messages from './Messages';
import PeopleModal from './PeopleModal';

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
    if ( user.uid ){
        if(!this.props.rooms[0]){
        //this.props.joinLastCreatedRoom(user);
        }
        const data = {
            roomName: this.props.lastRoom.name,
            id: user.uid,
            name: user.displayName,
            unread: 0
        }
      
    }
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

  handleLeaveRoom = () => {
    this.props.startLeaveRoom(this.props.lastRoom.roomName);
  }

  showPeople = () => {
    this.setState({ showModal: true });
  }

  closeModal = () => {
    this.setState({ showModal: false });
  }

  // componentDidMount() {
  //   const rooms = this.props.rooms;
  //   if (rooms.length > 0) {
  //     const a = rooms.find((room) => {
  //       return room.name === this.roomName;
  //     });
  //     const roomPath = a.id;
  //     this.props.startClearUnread(roomPath, this.roomName);
  //   }
  // }

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

  render() {
    return (
      <div className="box-layout--messages">
        <div className="room-header">
          <button onClick={this.showPeople} className="button--leave-room">View People</button>
          <div className="room-header__title">{this.props.lastRoom.name}</div>
          <button onClick={this.handleLeaveRoom} className="button--leave-room">Leave room</button>
        </div>
        <Messages roomName={this.props.lastRoom.name} />
        <form onSubmit={this.onSubmit} autoComplete="off" id="message-form">
          <input type="text" name="message" className="text-input" placeholder="Send message" autoFocus />
          <button name="submit" className="login-button">Send</button>
        </form>
        <PeopleModal
          roomName={this.props.lastRoom.name}
          showModal={this.state.showModal}
          closeModal={this.closeModal}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  rooms: state.rooms,
  lastRoom: state.lastRoom
});

const mapDispatchToProps = (dispatch) => ({
  startSendMessage: (message, roomName) => dispatch(startSendMessage(message, roomName)),
  getLastAddedRoom: () => dispatch(getLastAddedRoom()),
  joinLastCreatedRoom: (user) => dispatch(joinLastCreatedRoom(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(RoomPage);