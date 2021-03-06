Bespoken Tools (bst) - CLI Tools for Alexa Skills Development
====================

[![Build Status](https://travis-ci.org/bespoken/bst.svg?branch=master)](https://travis-ci.org/bespoken/bst) [![Coverage Status](https://coveralls.io/repos/github/bespoken/bst/badge.svg?branch=master)](https://coveralls.io/github/bespoken/bst?branch=master) [![npm version](https://img.shields.io/npm/v/bespoken-tools.svg)](https://www.npmjs.com/package/bespoken-tools)
[![Stories in Ready](https://badge.waffle.io/bespoken/bst.svg?label=ready&title=Ready)](http://waffle.io/bespoken/bst)

## Overview
The **bst** (aka Bespoken Tools aka the BEAST) makes it easy to develop for Alexa/Echo.

The current version provides three commands - **proxy http**, **proxy lambda** and **speak**.

The proxies make it super-easy to develop and debug your Alexa skill on your local machine.
Just point the bst at the local service running on your machine, and your code changes will be instantaneously available via Alexa.  

The proxies can work either with a service listening on a port (**proxy http**),  
or directly with a Lambda written with Node/JavaScript (**proxy lambda**).

The **speak** command simulates the Alexa service by sending any utterance from the command-line to your service.  
The request sent to your service is a properly formatted intent request.  
It then prints out the JSON payload returned by your service.

Keep an eye out as we add more features and commands in the future. Current plans:  
- **deploy**: Automatically deploy Alexa Lambdas to the cloud with a single command

## Getting Started

Make sure you have NPM and node installed:
```
$ node --version && npm --version
```
We support node version `4.x.x` and above.  For help installing, see see [How To Install NPM](http://blog.npmjs.org/post/85484771375/how-to-install-npm)


Next, install the bespoken tools command line tool (bst):
```
$ npm install bespoken-tools -g
```
__Note:__ If you are on MacOS and the command fails, it is probably because you need to run it with sudo, like this:
```
$ sudo npm install bespoken-tools -g
```
Verify the installation by typing:
```
$ bst
```

## bst proxy Command

The proxy command allows you to interact with a local service running on your machine via an Alexa device.  
Read more here:  
https://github.com/bespoken/bst/blob/master/docs/PROXY.md

## bst speak Command

The speak command generates intent requests for your service as if they were coming from Alexa itself.  
It works in a manner very similar to the Alexa simulator available via the Alexa developer console.  

Read more here:  
https://github.com/bespoken/bst/blob/master/docs/SPEAK.md


## Questions/Feedback?
Email jpk@xappmedia.com with any questions or comments. We love to hear feedback.
