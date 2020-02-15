import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Page.css';

class Page extends React.Component {

  render() {
    const { title, html } = this.props;
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>{title}</h1>
          <div
            // eslint-disable-next-line react/no-danger
          />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean consequat tortor
            fermentum mi fermentum dignissim. Nullam vel ipsum ut ligula elementum lobortis.
            Maecenas aliquam, massa laoreet lacinia pretium, nisi urna venenatis tortor, nec
            imperdiet tellus libero efficitur metus. Fusce semper posuere ligula, et
            facilisis metus bibendum interdum. Mauris at mauris sit amet sem pharetra
            commodo a eu leo. Nam at est non risus cursus maximus. Nam feugiat augue libero,
            id consectetur tortor bibendum non. Quisque nec fringilla lorem. Nullam
            efficitur vulputate mauris, nec maximus leo dignissim id.
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Page);
