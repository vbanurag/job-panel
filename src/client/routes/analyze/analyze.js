import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
// import s from './analyze.css';
import s from '../createJob/job.css';
import Link from '../../components/Link'
import { postDataService } from '../../utils/apiService'

class Analyze extends React.Component {
  static propTypes = {
  };

  constructor(props) {
    super(props)
    this.state = {
      resume: null,
      data: '',
      filePath: '',
    }
    this.submitHandler = this.submitHandler.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onLoad = this.onLoad.bind(this);
  }

  onChangeHandler(name, e) {
    const dataForm = new FormData();
    const fReader = new FileReader();

    dataForm.append('file', e.target.files[0]);
    this.setState({ [name]: dataForm, });

    fReader.readAsDataURL(e.target.files[0]);
    fReader.onloadend = (event) => {
      this.onLoad(event);
    }
  }

  onLoad(event) {
    this.setState({ filePath: event.target.result });
  }

  async submitHandler(e) {
    e.preventDefault();
    const { resume } = this.state;
    let data = await postDataService(`${window.App.authUrl}/api/v1/job/file-analyze`, resume)
    let final = data.data.flat().map(i => i.texts)
    let _final = final.flat().reduce((acc, curr) => {
      if(curr.text) {
        acc['data'] += " " + curr.text
        return acc
      }
    }, {})
    this.setState({
      data: _final
    })
  }

  render() {
    const { filePath } = this.state;
    return (
      <div className={s.root}>
        <div className={s.analyzeContent}>


          <div style={{ margin: '10px 5px', width: '45%', display: 'inline-block', textAlign: 'left' }}>
            <div className={s.formContainer}>

              <h1 className={s.formHeading}>Upload Resume</h1>

              <form>
                <label className={s.formLabels}>
                  <input type="file" name="resume" onChange={(e) => this.onChangeHandler('resume', e)} className={s.formTextFields} style={{ borderBottom: '0' }} />
                </label>
                <button value="Submit" onClick={this.submitHandler} className={s.buttonFields}> Parse Data </button>
              </form>
            </div>

            <div className={s.formContainer} style={{ margin: '10px auto', display: 'block', verticalAlign: 'top', textAlign: 'left' }}>

              <h1 className={s.formHeading}>Preview Resume</h1>

              <div className={s.details}>
                <span className={s.previewLabels}> {this.state.data.data}</span>
              </div>

            </div>

          </div>

          <div className={s.formContainer} style={{ margin: '10px 5px', display: 'inline-block', width: '49%', verticalAlign: 'top', textAlign: 'left' }}>

            <h1 className={s.formHeading}>Preview Resume</h1>

            <embed src={filePath} type="application/pdf" width="100%" height="600px" />
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Analyze);
