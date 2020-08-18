const libphonenumber = require('google-libphonenumber')
const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();

exports.handler = function(context, event, callback) {

  // get the Memory from Autopilot Redirect
  const memory = JSON.parse(event.Memory)

  // get Phone Number from Autopilot Memory
  const autopilot_number = memory.twilio.collected_data.collect_phonenumber.answers.phone_number.answer;

  let response = new Twilio.Response();
  let actions = [];

  number = phoneUtil.parseAndKeepRawInput(autopilot_number, context.PHONE_INPUT);
  national_number =  phoneUtil.format(number, libphonenumber.PhoneNumberFormat.NATIONAL);
  e164_number =  phoneUtil.format(number, libphonenumber.PhoneNumberFormat.E164);

    let remember = {
      "remember": {
        "phonenumber": national_number,
        "e164phonenumber": e164_number
      }
    }
    let collect = {
      "collect": {
        "name": "validate_phone",
        "questions":[{
          "name": "phone_number",
          "question": `Is your phone number ${national_number}?`,
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
                  "say": "I'm sorry, I must have missed that."
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
