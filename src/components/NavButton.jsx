import React from 'react';
import { Link } from 'react-router-dom';

function NavButton(props) {
  return (
    <Link
      to={`${props.link}`}
      className="flex items-center justify-center w-20 h-20 mx-4 object-contain"
    >
      <img
        src={`${process.env.PUBLIC_URL}/icons/Nav${props.icon}${props.selected ? 'On' : 'Off'}.svg`}
        alt={`${props.icon}`}
      />
    </Link>
  );
}

export default NavButton;
