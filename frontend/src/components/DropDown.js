import React, { useEffect, useRef, useState } from 'react';
import classes from '../modules/Header.module.scss';
import { ClickAwayListener } from '@mui/base';

// const useOutsideAlerter = (ref) => {
//   useEffect(() => {
//     console.log('Use Effect');
//     /**
//      * Alert if clicked on outside of element
//      */
//     function handleClickOutside(event) {
//       if (ref.current) {
//         console.log(ref.current);
//         console.log(ref.current.className.split(' ')[0] !== 'dropdown-ref');
//         console.log('You clicked outside of me!');
//       }
//     }
//     // Bind the event listener
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       // Unbind the event listener on clean up
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [ref]);
// };

const DropDown = ({ title, children }) => {
  // const wrapperRef = useRef(null);
  // useOutsideAlerter(wrapperRef);

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
        {title}
        <i className="fa-solid fa-caret-down"></i>
        <div className={`${classes.dropdown} ${show && classes.showDropdown}`}>
          {children}
        </div>
      </div>
    </ClickAwayListener>
  );
};

export default DropDown;
