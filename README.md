# autopilot-validators

1. Deploy Functions using Servereless Toolkit

cd autopilot-validators
twilio serverless:deploy

2. Create a Bot from Scratch

https://www.twilio.com/console/autopilot/list 

This example depends on the "greeting" and "goodbye" tasks being setup in your Autopilot bot.

3. Modify your "greeting" task to redirect to a collect_phonenumber

https://www.twilio.com/console/autopilot/{YOUR_BOT}/tasks

```
{
	"actions": [
		{
		    "say": "Hello"
		},
		{
		    "redirect": "task://collect_phonephone"
		}
	]
}
```

## To Validate Phone Numbers

![Screenshot](/images/PhoneNumberValidation.png)

4. Set up the environment variable in your functions environment for PHONE_INPUT to the country code where the phone numbers should be validated.

5. Update the task "greeting" in your bot

https://www.twilio.com/console/autopilot/{YOUR_BOT}/tasks

greeting

```
{
    "actions": [
        {
            "collect": {
                "name": "collect_phonenumber",
                "questions": [
                    {
                        "question": "What's your mobile phone number?",
                        "name": "phone_number"
                    }
                ],
                "on_complete": {
                    "redirect": "https://{YOUR_FUNCTION_URL}/validate_phonenumber"
                }
            }
        }
    ]
}
```

## To Validate Times

![Screenshot](/images/TimeValidation.png)

4. Set up the environment variable in your functions environment for TIME_INPUT to the time mask you are expecting (HH:mm is what comes from Twilio.TIME)

5. Update the task "greeting" in your bot

https://www.twilio.com/console/autopilot/{YOUR_BOT}/tasks

greeting

```
{
    "actions": [
        {
            "collect": {
                "name": "collect_time",
                "questions": [
                    {
                        "question": "What time would you like the appointment?",
                        "type": "Twilio.TIME",
                        "name": "time"
                    }
                ],
                "on_complete": {
                    "redirect": "https://{YOUR_FUNCTION_URL}/validate_time"
                }
            }
        }
    ]
}
```
## To Validate Currency

![Screenshot](/images/CurrencyValidation.png)

4. Set up the environment variable in your functions environment for CURRENCY_INPUT to the currency you are using.

5. Update the task "greeting" in your bot

https://www.twilio.com/console/autopilot/{YOUR_BOT}/tasks

greeting

```
{
    "actions": [
        {
            "collect": {
                "name": "collect_currency",
                "questions": [
                    {
                        "question": "How much are you willing to pay?",
                        "name": "currency"
                    }
                ],
                "on_complete": {
                    "redirect": "https://{YOUR_FUNCTION_URL}/validate_currency"
                }
            }
        }
    ]
}
```

