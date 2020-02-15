import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './cardList.css';

class JobCard extends React.Component {
  render() {
      console.log('this.props = ', this.props);
      const {
        job: {
            _id: id,
            description,
            status,
            title,
            location,
            date,
        },
        index,
      } = this.props;

      const _date = new Date(date).toDateString();

    return (
      <div key={`${id}_${index}`} className={s.cardContainer}>
        <div className={s.cardHeader}>
            <h3 className={s.cardTitle}>{title}</h3>
            <div>
                <h6 className={s.cardSubTitle}>{location}</h6> <span className={s.cardSubTitle} style={{float: 'right'}}>{_date}</span>
            </div>
        </div>
        <div className={s.cardDesc}>{description}</div>
        <div className={s.cardStatus}>{status}</div>
      </div>
    );
  }
}

export default withStyles(s)(JobCard);
