# Overview
This tutorial shows you how to get started developing for Alexa with Node.  

# Getting Started
- Clone the Amazon Alexa Skills Kit for JavaScript repo:  
https://github.com/amzn/alexa-skills-kit-js

- Setup the Bespoken Tools (instructions here):
https://github.com/bespoken/bst/blob/master/README.md

- Run the helloWorld Sample project  
```
$ bst proxy lambda <NODE_ID> <SKILLS_KIT_JS>/samples/helloWorld/src/index.js
```

- Sign up for Amazon Developer account (if you have not already):  
https://developer.amazon.com/appsandservices

Click on the Sign In or Create Account link on the top-right

# Configure your skill
__Select the Alexa tab__  
__Choose Get Started__  
__Choose Add a New Skill__  
__Fill out the Information tab (give a name and invocation phrase)__  
__Fill out the Interaction Model__  
Copy the Intent Schema from here:  
https://github.com/amzn/alexa-skills-kit-js/blob/master/samples/helloWorld/speechAssets/IntentSchema.json

Copy the Utterances from here:  
https://github.com/amzn/alexa-skills-kit-js/blob/master/samples/helloWorld/speechAssets/SampleUtterances.txt

__Configure the Endpoint:__  
The endpoint should be set to:  
```
https://proxy.bespoken.tools?node-id=<YOUR_NODE>
```

Here is an example endpoint:  
```
https://proxy.bespoken.tools/hello?node-id=1b84270f-5b58-4176-a8b6-7b5b1c03a308
```

The proxy tool prints out the URL to be used when it starts up.  
You can also generate it for an existing URL via the `proxy urlgen` command. 

Set account linking to "No"

__Configure SSL__  
Select "My development endpoint is a subdomain of a domain that has a wildcard certificate from a certificate authority"

__Test!__  
Go to the service simulator, and type: "Hello World"  
Hit "Ask Test"  
You should get a valid JSON in reply  

# Next Steps
You can now start adding functionality to your skill. To learn more about coding Alexa skills, look here:  
https://github.com/amzn/alexa-skills-kit-js

You can also try it out on an Alexa device like an Echo, as long as it is registered with your account.
Just say "Open \<Invocation Name>" to use it.
