import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './listing.css';
import JobCard from '../../components/JobList'
import { getDataService } from '../../utils/apiService'

class Listing extends React.Component {
  static propTypes = {
    
  };

  constructor(props) {
    super(props)
    this.state = {
      data:[],
      loading: true
    }
  }

  async componentDidMount () {
    console.log(this.props, '----props', window.App.authUrl)
    if(window.App.authUrl) {
      let data = await getDataService(`${window.App.authUrl}/api/v1/job`)
      console.log(data, '----')
      this.setState({
        loading: false,
        data: data
      })
    }
  }

  renderJobs = (data) => {
    return data.map((job, index) => {
      return <JobCard job={job} index={index} />
    })
  }

  render() {

    const {data, loading} = this.state;

    // const data = [
    //   {
    //     "_id": "5e47d32c495b0e28d68d5f9d",
    //     "title": "next user 1",
    //     "description": "asd@gmail.com",
    //     "status": "ACTIVE",
    //     "date": "2011-09-16T11:05:17.000Z",
    //     "location": "Location",
    //   },
    //   {
    //     "_id": "5e47d32c495b0e28d68d5f9d",
    //     "title": "next user 1",
    //     "description": "asd@gmail.com",
    //     "status": "ACTIVE",
    //     "date": "2011-09-16T11:05:17.000Z",
    //     "location": "Location",
    //   }
    // ];

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
