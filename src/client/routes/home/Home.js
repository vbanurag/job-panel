import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Home.css';
import Link from '../../components/Link'

class Home extends React.Component {
  static propTypes = {
    news: PropTypes.arrayOf(
      PropTypes.shape({
        content: PropTypes.string,
      }),
    ),
  };

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <div className={s.contentBody}> 
            <Link className={[s.link]} to="/create-job">
              <div className={[s.selectionList]}>Create a Job</div>
            </Link>
            <Link className={[s.link]} to="/job-listing">
              <div className={[s.selectionList]}>List a job</div>
            </Link>
            <Link className={s.link} to="/job-listing">
              <div className={[s.selectionList]}>Analyse profile</div>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Home);
