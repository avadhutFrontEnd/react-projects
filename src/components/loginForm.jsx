import React, { Component } from "react";
import Input from "./common/input";

class LoginForm extends Component {
  // Step 1: Create `ref` object --> using  `React.createRef()`
  username = React.createRef();

  state = {
    account: { username: "", password: "" },
  };

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

  handleChange = ({ currentTarget: input }) => {
    const account = { ...this.state.account };
    account[input.name] = input.value;
    this.setState({ account });
  };

  render() {
    const { account } = this.state;

    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          <Input
            name={"username"}
            value={account.username}
            label={"Username"}
            onChange={this.handleChange}
          />
          <Input
            name={"password"}
            value={account.password}
            label={"Password"}
            onChange={this.handleChange}
          />
          <button className="btn btn-primary">Login</button>
        </form>
      </div>
    );
  }
}

export default LoginForm;
