import React from 'react';

const Message = () => <div>Message</div>;

const message = {
  error: console.error,
  info: console.info,
  success: console.log,
};

export { Message };
export default message;
