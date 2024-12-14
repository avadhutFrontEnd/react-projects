import React, { Component } from "react";

class LoginForm extends Component {
  // Step 1: Create `ref` object --> using  `React.createRef()`
  username = React.createRef();

  // How we can set focus on a given input field
  // Sol 1 : use `ref` and add a lifecycle hook
  // componentDidMount() {
  //   this.username.current.focus();
  // }

  handleSubmit = (e) => {
    e.preventDefault();

    // Call the server
    // Step 3:  get the `value` of `input` field Element using "username" Ref :
    const username = this.username.current.value;
    console.log("Submitted");
  };

  render() {
    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            {/* Step 2: Set the `ref` Attribute on `input` Element  */}
            <input
            // How we can set focus on a given input field
            // Sol 2 : use "autofocus" Attribute
              autoFocus
              ref={this.username}
              id="username"
              type="text"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" type="text" className="form-control" />
          </div>
          <button className="btn btn-primary">Login</button>
        </form>
      </div>
    );
  }
}

export default LoginForm;
