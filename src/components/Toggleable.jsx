import React, {useImperativeHandle} from 'react';
import { forwardRef } from 'react'

const Toggleable = forwardRef((props, ref) => {
  const [visible, setVisible] = React.useState(false);

  const hideWhenVisiable = { display: visible ? 'none' : 'block' };
  const showWhenVisiable = { display: visible ? 'block' : 'none' };
  const toggleVsible = () => setVisible(!visible);

  useImperativeHandle(ref, () => {
    return {
      toggleVsible
    }
  })

  return (
    <div>
      <div style={hideWhenVisiable}>
        <button onClick={toggleVsible}>
          {props.label}
        </button>
      </div>
      <div style={showWhenVisiable}>
        {props.children}
        <button onClick={toggleVsible}>cancel</button>
      </div>
    </div>
  )
})

export default Toggleable