import React from 'react';
import { connect } from 'react-redux';
import formFields from './formFields';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import * as actions from '../../actions';

// SurveyFormReview shows users their form inputs for review
const SurveyFormReview = ( { onCancel, formValues, submitSurvey, history }) => {
  // const reviewFields = _.map(formFields, field => {
  const reviewFields = _.map(formFields, ({ name, label }) => {
    return (
      // <div key={field.name}>
      <div key={name}>
        <label>
          {label}
        </label>
        <div>
          {formValues[name]}
        </div>
      </div>
    )
  })

  return (
    <div>
      <h5>
        Please confirm your entries
      </h5>
      {reviewFields}
      {/* <button className="yellow darken-3 btn-flat" onClick={onCancel} > */}
      <button className="yellow darken-3 white-text btn-flat" onClick={onCancel} >
        Back
      </button>
      <button 
        onClick={() => submitSurvey(formValues, history)}
        className="green darken-3 btn-flat right white-text"
      >
        Send Survey <i className="material-icons right">email</i>
      </button>
    </div>
  );
};

function mapStateToProps(state){
  // console.log(state);
  return {
    formValues: state.form.surveyForm.values
  };
}


export default connect(mapStateToProps, actions)(withRouter(SurveyFormReview));