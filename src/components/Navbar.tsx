import './Navbar.css';

import type { CSS } from './Home';

interface NavbarProps {
  css: CSS,
  setCss: React.Dispatch<React.SetStateAction<CSS>>,
  width: number,
}

export const Navbar = (props: NavbarProps) => {

  const { css, setCss, width } = props;

  const toggleLeftPane = () => {
    const values = 
      css.basis === '' 
        ? {
          basis: '99vw',
          border: '2px solid red',
        } : {
          basis: '',
          border: '',
        }
    setCss(values);
  }

  return (
    <div id='navbar'>
      {/* Navbar hamburger menu */}
      <div id='left'>
        <input type="button" value='left pane' onClick={toggleLeftPane}/>
      </div>

      {/* Reddit logo */}
      <div>
        <p>Reddit mini (logo)</p>
      </div>

      {/* Light / Dark mode button */}
      <div> 
        <input type="button" value='darkmode'></input>
      </div>
    </div>
  )
}