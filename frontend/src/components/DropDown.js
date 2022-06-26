import React, { useState } from 'react';
import classes from '../modules/Header.module.scss';
import { ClickAwayListener } from '@mui/base';

const DropDown = ({ title, children }) => {
  const [show, setShow] = useState(false);

  return (
    <ClickAwayListener
      onClickAway={() => {
        setShow(false);
      }}
    >
      <div
        className={`dropdown-ref ${classes.profile}`}
        onClick={() => setShow(!show)}
      >
        <div className={classes['dropdown-title']}>
          {title}
          <i className="fa-solid fa-caret-down"></i>
        </div>
        <div className={`${classes.dropdown} ${show && classes.showDropdown}`}>
          {children}
        </div>
      </div>
    </ClickAwayListener>
  );
};

export default DropDown;
