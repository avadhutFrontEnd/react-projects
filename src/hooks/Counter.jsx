import React, { useState } from "react";
import { Fragment } from "react";

function Counter(props) {
  const [count, setState] = useState(0);
  const [name, setName] = useState("");
  
// ******* Note :  don't call "Hooks" inside Loops, conditions, or Nested-Functions
//   if (count == 0) {
//     const [name, setName] = useState("");
//   }

  //   const array = useState(0);
  //   const count = array[0]; // this.state.count
  //   const setState = array[1]; // this.setState()

  return (
    <Fragment>
      <input type="text" onChange={(e) => setName(e.target.value)} />
      <div>
        {name} has clicked {count} times!
      </div>
      <button onClick={() => setState(count + 1)}>Increase</button>
    </Fragment>
  );
}

export default Counter;
