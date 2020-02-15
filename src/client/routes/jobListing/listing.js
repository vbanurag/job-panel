import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './listing.css';
import JobCard from '../../components/JobList'

class Listing extends React.Component {
  static propTypes = {
    news: PropTypes.arrayOf(
      PropTypes.shape({
        content: PropTypes.string,
      }),
    ),
  };

  renderJobs = (data) => {
    return data.map((job, index) => {
      return <JobCard job={job} index={index} />
    })
  }

  render() {

    const data = [
      {
        "_id": "5e47d32c495b0e28d68d5f9d",
        "title": "next user 1",
        "description": "asd@gmail.com",
        "status": "ACTIVE",
        "date": "2011-09-16T11:05:17.000Z",
        "location": "Location",
      },
      {
        "_id": "5e47d32c495b0e28d68d5f9d",
        "title": "next user 1",
        "description": "asd@gmail.com",
        "status": "ACTIVE",
        "date": "2011-09-16T11:05:17.000Z",
        "location": "Location",
      }
    ];

    return (
      <div className={s.root}>
        <div className={s.listContainer}> 
          {
            this.renderJobs(data)
          } 
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Listing);
