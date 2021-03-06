import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import SurveyForm from './SurveyForm';
import SurveyFormReview from './SurveyFormReview';

//SurveyNew shows SurveyForm and SurveyFormReview
class SurveyNew extends Component {
  //BELOW CODEs ARE EXACTLY THE SAME AS : `state = { formReview: false } `
  // constructor(props) {
  //   super(props);

  //   this.state = {new: true};
  // }

  state = { showFormReview: false } ;

  renderContent() {
    if ( this.state.showFormReview ) {
      return (
        <SurveyFormReview 
          onCancel={() => this.setState ({ showFormReview: false })}
      />
      );
    }

    return <SurveyForm onSurveySubmit={() => this.setState({ showFormReview: true })} />;
  }

  render() {
    return (
      <div>
        {/* <SurveyForm /> */}
        {this.renderContent()}
      </div>
    )
  }
}

export default reduxForm({
  form: 'surveyForm'
}) (SurveyNew);