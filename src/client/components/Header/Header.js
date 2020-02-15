import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.css';
import Link from '../Link';
import Navigation from '../Navigation';
import logoUrl from './logo-small.png';
import logoUrl2x from './logo-small@2x.png';

class Header extends React.Component {
  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          {/* <Navigation /> */}
          <div className={s.banner}>
            <h1 className={s.bannerTitle}>Job Panel</h1>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Header);
