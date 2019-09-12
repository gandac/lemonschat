import React,{Component} from 'react';
import { connect } from 'react-redux';
import { startLogin , startEmailLogin } from '../actions/auth';
import LoginForm from '../ui/LoginForm';

class LoginPage extends Component {

   onFormSubmit(event) {
    const { startEmailLogin } = this.props;
    event.preventDefault();
    const data = new FormData(event.target);
    const email = data.get('email');
    const password = data.get('password');
   startEmailLogin(email,password);
  }
  render() {
    const { startLogin } = this.props;
    return ( 
  <div className="box-layout">
    <div className="box-layout__box">
      <h1 className="box-layout__title">Lemonschat admin</h1>
      <p>Enter in the admin area of Lemonchat</p>
      <LoginForm handleSubmit={(event) => this.onFormSubmit(event)}/>
      <p>OR </p>

      <button className="login-button" onClick={startLogin}>Login with Github</button>
    </div>
  </div>
    )
  }
};

const mapDispatchToProps = (dispatch) => ({
  startLogin: () => dispatch(startLogin()),
  startEmailLogin: (email,password) => dispatch(startEmailLogin(email,password))
});

export default connect(undefined, mapDispatchToProps)(LoginPage);
