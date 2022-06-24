import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';

const Loader = () => {
  const divStyle = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    margin: '100px 0'
  };

  return (
    <div style={divStyle}>
      <CircularProgress size="7rem" thickness={1} color="warning" />
    </div>
  );
};

export default Loader;
