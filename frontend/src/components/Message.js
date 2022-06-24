import React from 'react';

const Message = ({ children, variant }) => {
  let bgColor, textColor;
  if (variant === 'success') {
    bgColor = 'lightgreen';
    textColor = 'green';
  } else if (variant === 'danger') {
    bgColor = '#fddbd0';
    textColor = '#d9534f';
  } else if ((variant = 'info')) {
    bgColor = 'hsl(196, 77%, 80%)';
    textColor = 'hsl(195, 100%, 20%)';
  }

  const messageStyle = {
    backgroundColor: bgColor,
    color: textColor,
    margin: '15px 0 0',
    padding: '15px',
    borderRadius: '.2rem',
    fontSize: '14px',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '2px',
  };

  return (
    <div style={messageStyle}>
      <p>{children}</p>
    </div>
  );
};

export default Message;
