import React from 'react';
import classes from '../modules/Modal.module.css';

const Modal = ({ children, show, showHandler }) => {
  return (
    <>
      <div className={classes.bgdrop} onClick={() => showHandler(false)}></div>
      <div className={classes.content}>{children}</div>
    </>
  );
};

export default Modal;
