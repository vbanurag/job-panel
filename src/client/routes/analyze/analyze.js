import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
// import s from './analyze.css';
import s from '../createJob/job.css';
import Link from '../../components/Link'
import pdfParser from 'pdf-parser'
import axios from 'axios';

class Analyze extends React.Component {
  static propTypes = {
    news: PropTypes.arrayOf(
      PropTypes.shape({
        content: PropTypes.string,
      }),
    ),
  };

  constructor(props){
    super(props)
    this.state = {
      resume: null,
    }
    this.submitHandler = this.submitHandler.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
  }

  onChangeHandler(name, e) {
    this.setState({[name]: e.target.files[0]});
  }

  submitHandler() {
    const dataForm = new FormData();
    const { resume } = this.state;
    dataForm.append('file', resume);
    axios
      .post(`${'http://localhost:3000'}/api/v1/job/file-analyze`, dataForm)
      .then(res => {
        console.log(res)
      })
      .catch(err => console.log(err));
  }

  render() {
    const { resume } = this.state;
    return (
      <div className={s.root}>
        <div className={s.analyzeContent}>
          <div className={s.formContainer} style={{margin: '10px 5px', width: '45%', display: 'inline-block'}}>

            <h1 className={s.formHeading}>Upload Resume</h1>

            <form>
              <label className={s.formLabels}>
                Upload Resume:
                <input type="file" name="resume" onChange={(e) => this.onChangeHandler('resume', e)} value={resume} className={s.formTextFields} style={{borderBottom: '0'}} />
              </label>
              <button value="Submit" onClick={this.submitHandler} className={s.buttonFields}> Submit </button>
            </form>
          </div>

          <div className={s.formContainer} style={{margin: '10px 5px', display: 'inline-block', width: '49%', verticalAlign: 'top',}}>

            <h1 className={s.formHeading}>Preview Resume</h1>

            <div className={s.details}>
              <span className={s.previewLabels} style={{fontWeight: '800'}}>Name: </span> <span className={s.previewLabels}> Abcd Xyz</span>
            </div>  
            <div className={s.details}>
              <span className={s.previewLabels} style={{fontWeight: '800'}}>Name: </span> <span className={s.previewLabels}> Abcd Xyz</span>
            </div>            
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Analyze);
