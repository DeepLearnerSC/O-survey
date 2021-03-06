const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');
const _ = require('lodash');
const Path = require('path-parser').default;
// const Path = require('Typescript');
const { URL } = require('url');

const Survey = mongoose.model('surveys')

module.exports = app => {
  app.get('/api/surveys/:surveyId/:choice', (req, res) => {
    res.send('Thanks for voting!');
  });

  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;

    // console.log(req.body);

    const survey = new Survey ({
      title,
      subject,
      body,
      // recipients: recipients.split(',').map(email => ({ email })), // = .map(email => { return {email: email} },
      recipients: recipients.split(',').map(email => ({email})),
      _user: req.user.id,
      dateSent: Date.now()
    });

    // send a emailt 
    const mailer = new Mailer( survey, surveyTemplate(survey) );
    
    // console.log(mailer.body, "sdfsdf");

    try {
      await mailer.send();
      await survey.save();

      req.user.credits -=1;
      const user = await req.user.save();
      // console.log(user,"this is user");
      res.send(user)
      } catch (err) {
        res.status(422).send(err);
      }
  });

  app.post('/api/surveys/webhooks', (req, res)=>{
    //console.log(req.body);
    const p = new Path('/api/surveys/:surveyId/:choice');
    
    // const events = _.chain(req.body)
    _.chain(req.body)
      .map(({ email, url }) => {
        const pathname = new URL(url).pathname;   
        const match = p.test(pathname);
        if (match) {
          return { email, surveyId: match.surveyId, choice: match.choice };
        }
      })
      //remove undefined
      .compact()
      // no duplicate
      .uniqBy('email', 'surveyId')
      .each( ({ surveyId, email, choice }) => {
      //rule #1 monogoDB id should be _id
        Survey.updateOne({
          _id: surveyId,
          recipients: {
            $elemMatch: { email: email, responded: false }
          }
        }, {
          $inc: { [choice]:1 },
          $set: { 'recipients.$.responded': true },
          lastResponded: new Date()
        //rule 2: we need to execute...  
        }).exec();

      })
      .value();
    // console.log(events);

    res.send({});
  });

  app.get('/api/surveys', requireLogin, async (req, res) => {
    //req.user
    const surveys = await Survey.find({
      _user: req.user.id
    })
    .select({ recipients: false})
    // console.log(surveys);
    res.send(surveys);
  });





};

//before refactoring
    // const events = _.map(req.body, (event) => {
      // const events = _.map(req.body, ({ email, url }) => {
      //   // const pathname = new URL(event.url).pathname;
      //     const pathname = new URL(url).pathname;   
      //     // console.log(p.test(pathname));
      //     const match = p.test(pathname);
      //     if (match) {
      //       // return { email: email, surveyId: match.surveyId, choice: match.choice};
      //       return { email, surveyId: match.surveyId, choice: match.choice };
      //     }
      //   });
      //   //remove undefined
      //   const compactEvents = _.compact(events);
      //   // no duplicate
      //   const uniqueEvents = _.uniqBy(compactEvents, 'email', 'surveyId' );
      //   console.log(uniqueEvents);