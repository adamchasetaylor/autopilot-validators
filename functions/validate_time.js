require('google-closure-library');
goog.require('goog.i18n.DateTimeParse');
goog.require('goog.i18n.DateTimeFormat');

exports.handler = function (context, event, callback) {
  // get the Memory from Autopilot Redirect
  const memory = JSON.parse(event.Memory);

  // get HH:mm time from Autopilot Memory
  const autopilot_time = memory.twilio.collected_data.collect_time.answers.time.answer;

  let response = new Twilio.Response();
  let actions = [];

  time_parser = new goog.i18n.DateTimeParse(context.TIME_INPUT);
  time_formatter = new goog.i18n.DateTimeFormat(goog.i18n.DateTimeFormat.Format.SHORT_TIME);

  datetime = new Date();
  time_parser.parse(autopilot_time, datetime);
  time = time_formatter.format(datetime);

  let remember = {
    remember: {
      time: time,
    },
  };
  let collect = {
    collect: {
      name: 'validate_time',
      questions: [
        {
          name: 'time',
          question: `Just checking, do you mean ${time}?`,
          type: 'Twilio.YES_NO',
          validate: {
            allowed_values: {
              list: ['Yes'],
            },
            on_failure: {
              messages: [
                {
                  say: "I'm sorry, I must have missed that.",
                },
              ],
              repeat_question: false,
            },
            on_success: {
              say: 'Great.',
            },
            max_attempts: {
              redirect: `task://${event.CurrentTask}`,
              num_attempts: 1,
            },
          },
        },
      ],
      on_complete: {
        redirect: 'task://goodbye',
      },
    },
  };
  actions.push(remember);
  actions.push(collect);

  let respObj = {
    actions: actions,
  };

  response.appendHeader('Content-Type', 'application/json');
  response.setBody(respObj);

  callback(null, response);
};
