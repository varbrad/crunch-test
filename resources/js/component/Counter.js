import React, { useState } from "react"
import thing from "./thing"

const Counter = () => {
    const [state, setState] = useState(0)
    return (
        <div>
            <p>helllooasodakosd: {state}</p>
            <p>{thing}</p>
            <button onClick={() => setState(state + 1)}>+1</button>
        </div>
    )
}

export default Counter
