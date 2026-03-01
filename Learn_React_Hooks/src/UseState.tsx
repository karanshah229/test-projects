import { useState } from "react";

export function UseStateComp() {
  //   const [test, setTest] = useState(function () {
  //     console.log("inital run");
  //     return false;
  //   });

  //   console.log(test);

  //   return (
  //     <div>
  //       <div>Test = {test.toString()}</div>
  //       <button onClick={() => setTest((test) => !test)}>
  //         Update test = !test
  //       </button>
  //     </div>
  //   );

  const [count, setCount] = useState(() => 0);
  console.log("test");
  const increment = () => setCount((previousCount) => previousCount + 1);
  return <button onClick={increment}>{count}</button>;
}
