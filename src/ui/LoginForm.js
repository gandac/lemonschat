import React from 'react';

const loginForm = (props) => {
    return (
    <form onSubmit={props.handleSubmit}>
        <input name="email" type="email" placeholder="Email" />
        <input name="password" type="password" placeholder="Password"  />
        <input type="submit"  className="submitButton" value="Enter"/>
    </form>);
}
export default loginForm;