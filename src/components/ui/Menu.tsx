import { useState } from 'react';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { IconType } from 'react-icons/lib';
import { useClickout } from '../../app/hooks/useClickout';

import './Menu.css';

interface MenuProps {
  className?: string,
  icon?: IconType
  openRight?: boolean,
  children?: React.ReactNode
}

export const Menu = ({className = '', icon, openRight = false, children}: MenuProps) => {
  const MenuIcon = icon || BiDotsHorizontalRounded;

  const [open, setOpen] = useState<boolean>(false);

  useClickout(() => setOpen(false), [], ['.ui-menu'], ['.menu-item']);
  
  return (
    <div className={`ui-menu ${className}`} style={{position: 'relative'}}>
      <div className='ui-menu-trigger' onClick={() => setOpen(p => !p)}>
        <MenuIcon />
      </div>
      {open && <div className='ui-menu-dropdown' 
          style={openRight ? {left: 0} : {right: 0}}
        >
          {children}
        </div>}
    </div>
     
  )
}