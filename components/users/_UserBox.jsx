import React from 'react';

import "./user_box.scss";

const UserBox = ({user}) => {
  return (
    <div className='user-box'>
      <img className='user-thumbnail' src={user.thumbnail}/>
      <div className='name'>{user.name}</div>
    </div>
  )
}

export default UserBox;