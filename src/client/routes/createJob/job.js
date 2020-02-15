import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './job.css';
import Link from '../../components/Link';

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
        jobTitle: '',
        jobLocation: '',
        jobDescription: '',
        jobDate: '',
        jobStatus: '',
      }
    };

    this.onChangeHandler = this.onChangeHandler.bind(this);
  }

  onChangeHandler(name, e) {
    console.log('onChangeHandler', name, e.target.value);
    const { job } = this.state;
    this.setState({ job: { ...job, [name]: e.target.value } }, () => console.log('Saved in staet = ', this.state));
  }

  render() {

    const {
      job: {
        jobTitle,
        jobLocation,
        jobDescription,
        jobDate,
        jobStatus,
      },
    } = this.state;

    return (
      <div className={s.root} style={{padding:0}}>
        <div className={s.background}>
          <div className={s.formContainer}>

            <h1 className={s.formHeading}>JOB!!</h1>

            <form>
              <label className={s.formLabels}>
                Title:
                <input type="text" name="jobTitle" onChange={(e) => this.onChangeHandler('jobTitle', e)} value={jobTitle} className={s.formTextFields} />
              </label>
              <label className={s.formLabels}>
                Location:
                <input type="text" name="jobLocation" onChange={(e) => this.onChangeHandler('jobLocation', e)} value={jobLocation} className={s.formTextFields} />
              </label>
              <label className={s.formLabels}>
                Description:
                <textarea type="text" name="jobDescription" onChange={(e) => this.onChangeHandler('jobDescription', e)} value={jobDescription} className={s.formTextFields} rows="4" cols="50" wrap="soft" draggable="false"></textarea>
              </label>
              <label className={s.formLabels}>
                Date:
                <input type="date" name="jobDate" onChange={(e) => this.onChangeHandler('jobDate', e)} value={jobDate} className={s.formTextFields} />
              </label>
              <label className={s.formLabels}>
                Status:
                <label className={s.formLabels}>
                  <input type="radio" name="jobStatus" value={JOB_STATUS.open} onChange={(e) => this.onChangeHandler('jobStatus', e)} checked={jobStatus === JOB_STATUS.open} className={s.radioFields} />
                  {JOB_STATUS.open}
                </label>
                <label className={s.formLabels}>
                  <input type="radio" name="jobStatus" value={JOB_STATUS.closed} onChange={(e) => this.onChangeHandler('jobStatus', e)} checked={jobStatus === JOB_STATUS.closed} className={s.radioFields} />
                  {JOB_STATUS.closed}
                </label>
              </label>
              <button value="Submit" className={s.buttonFields}> Submit </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Home);
