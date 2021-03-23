import React, { useState } from "react";

type Props = {
  msg: string;
  wait?: number;
  onHide(): void;
  autoHide?: boolean;
};

const ShowTip: React.FC<Props> = ({
  msg,
  wait = 1000,
  onHide,
  autoHide = true,
}) => {
  const [show,setShow] = useState(true);
  if (autoHide) {
    setTimeout(() => {
      onHide();
    }, wait);
  }
  return (
    <div className={`main`} style={{'display':show?'block':'none'}}>
      <div
        onClick={() => {
          setShow(false);
          onHide();
        }}
      >
        {msg} x
      </div>
    </div>
  );
};

export default ShowTip;
