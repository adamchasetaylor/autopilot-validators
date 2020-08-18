require("google-closure-library");
goog.require("goog.i18n.NumberFormat");

exports.handler = function(context, event, callback) {
  // get the Memory from Autopilot Redirect
  const memory = JSON.parse(event.Memory)

  // get HH:mm time from Autopilot Memory
  const autopilot_currency = memory.twilio.collected_data.collect_currency.answers.currency.answer;
  let response = new Twilio.Response();
  let actions = [];

  currency_formatter = new goog.i18n.NumberFormat(goog.i18n.NumberFormat.Format.CURRENCY,context.CURRENCY_INPUT)
  number = currency_formatter.parse(autopilot_currency)
  currency = currency_formatter.format(number)

  let remember = {
    "remember": {
      "currency": currency
    }
  }
  let collect = {
    "collect": {
      "name": "validate_currency",
      "questions":[{
        "name": "currency",
        "question": `Just to be certain, are you sure you want to pay me ${currency}?`,
        "type": "Twilio.YES_NO",
        "validate": {
          "allowed_values": {
            "list": [
              "Yes"
            ]
          },
          "on_failure": {
            "messages": [
              {
                "say": "I'm sorry, I must have misunderstood."
              }
            ],
            "repeat_question": false
          },
          "on_success": {
            "say": "Great."
          },
          "max_attempts": {
            "redirect": `task://${event.CurrentTask}`,
            "num_attempts": 1
          }
        }
      }],
      "on_complete": {
        "redirect": "task://goodbye"
      }
    }
  }
  actions.push(remember);
  actions.push(collect);

  let respObj = {
    "actions": actions
  };

  response.appendHeader('Content-Type', 'application/json');
  response.setBody(respObj)

  callback(null, response);   
};
