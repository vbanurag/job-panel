import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './job.css';
import Link from '../../components/Link';
import { postDataService } from '../../utils/apiService'

const JOB_STATUS = {
  open: 'Open',
  closed: 'Closed',
}

class Home extends React.Component {
  static propTypes = {
    news: PropTypes.arrayOf(
      PropTypes.shape({
        content: PropTypes.string,
      }),
    ),
  };

  constructor(props) {
    super(props);
    this.state = {
      job: {
        title: '',
        location: '',
        description: '',
        date: '',
        status: '',
      },
      message: ''
    };

    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }

  onChangeHandler(name, e) {
    const { job } = this.state;
    this.setState({ job: { ...job, [name]: e.target.value } });
  }

  async submitHandler (e) {
    e.preventDefault()

    let _data = await postDataService(`${window.App.authUrl}/api/v1/job`, this.state.job)
    this.setState({
      message: _data,
      job: {
        title: '',
        location: '',
        description: '',
        date: '',
        status: '',
      },
    })

  }

  render() {

    const {
      job: {
        title,
        location,
        description,
        date,
        status,
      },
      message,
    } = this.state;

    return (
      <div className={s.root} style={{padding:0}}>
        <div className={s.background}>
          <div>
            {
              message && <div className={s.alertMsg}>{message}</div>
            }
          </div>
          <div className={s.formContainer}>

            <h1 className={s.formHeading}>JOB!!</h1>

            <form>
              <label className={s.formLabels}>
                Title:
                <input type="text" name="title" onChange={(e) => this.onChangeHandler('title', e)} value={title} className={s.formTextFields} />
              </label>
              <label className={s.formLabels}>
                Location:
                <input type="text" name="location" onChange={(e) => this.onChangeHandler('location', e)} value={location} className={s.formTextFields} />
              </label>
              <label className={s.formLabels}>
                Description:
                <textarea type="text" name="description" onChange={(e) => this.onChangeHandler('description', e)} value={description} className={s.formTextFields} rows="4" cols="50" wrap="soft" draggable="false"></textarea>
              </label>
              <label className={s.formLabels}>
                Date:
                <input type="date" name="date" onChange={(e) => this.onChangeHandler('date', e)} value={date} className={s.formTextFields} />
              </label>
              <label className={s.formLabels}>
                Status:
                <label className={s.formLabels}>
                  <input type="radio" name="status" value={JOB_STATUS.open} onChange={(e) => this.onChangeHandler('status', e)} checked={status === JOB_STATUS.open} className={s.radioFields} />
                  {JOB_STATUS.open}
                </label>
                <label className={s.formLabels}>
                  <input type="radio" name="status" value={JOB_STATUS.closed} onChange={(e) => this.onChangeHandler('status', e)} checked={status === JOB_STATUS.closed} className={s.radioFields} />
                  {JOB_STATUS.closed}
                </label>
              </label>
              <button value="Submit" onClick={this.submitHandler} className={s.buttonFields}> Submit </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Home);
