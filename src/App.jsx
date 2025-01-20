import React, { Component } from "react";
import MoviePage from "./context/MoviePage";
import UserContext from "./context/userContext";
import Login from "./context/login";

class App extends Component {
  handleLoggedIn = (username) => {
    console.log("Getting the user: " + username);
    const user = { name: "Mosh" };
    this.setState({ currentUser: user });
  };

  state = { currentUser: null };

  render() {
    return (
      <UserContext.Provider
      // This is the object that we're passing down in our component tree using  "context" :            
        value={{
          currentUser: this.state.currentUser,
          onLoggedIn: this.handleLoggedIn,
        }}
      >
        <div>
          <MoviePage />
          <Login />
        </div>
      </UserContext.Provider>
    );
  }
}

export default App;
