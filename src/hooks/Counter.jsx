import React, { useEffect, useState } from "react";
import { Fragment } from "react";

function Counter(props) {
  const [count, setState] = useState(0);
  const [name, setName] = useState("");

  useEffect(() => {
    document.title = `${name} has clicked ${count} times!`;

    return () => {
      // any code that we previously wrote in "componentWillUnmount" would end up here
      console.log("Clean up");
    };
  }, [count, name]);

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
