/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';
const Alexa = require('alexa-sdk');

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = "amzn1.ask.skill.740d3d11-c1d1-4ff2-a3eb-53af680b466a";

const SKILL_NAME = 'Animal Facts';
const GET_FACT_MESSAGE = "Here's your fact: ";
const HELP_MESSAGE = 'You can say tell me an animal fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

//=========================================================================================================================================
//TODO: Replace this data with your own.  You can find translations of this data at http://github.com/alexa/skill-sample-node-js-fact/lambda/data
//=========================================================================================================================================
const data = [
    'Koalas usually get all the water they need from eucalyptus leaves.',
    'Koalas can be ferocious when resisting capture. They growl, fight, and bite.',
    'Koalas often return to trees they consider their territory.',
    'When temperature rises, koalas press their bodies close to tree trunks, which cools them off.',
    'Koala twins are very rare.',
    'In the wild, koalas live about 10 to 15 years.',
    'A tiger\'s roar can be heard as far as two miles away.',
    'Wild tigers are in drastic decline, with perhaps 3,000 left.',
    'The toro toucan\'s bill is a third of the bird\'s length.',
    'Toucan bills are strong but light.',
    'Toucans are found in the wild only in the Americas.',
    'A toucan bill exterior is made of keratin; the interior, bone.',
    'Wild turkeys can run 25 miles an hour in short bursts.',
    'Wild turkeys can reach flyign speeds of 55 miles an hour.',
    'An arctic fox burrow complex can spread over 500 square feet and have 100 entrances.',
    'A giraffe\'s heart weighs about 25 pounds - it has to be that big to pump blood all the way to its brain.',
    'Giraffes arch their necks to force air through their windpipes, creating very low frequency sounds.',
    'A long sticky tongue lets aardvarks slurp up termites from thier mounds.',
    'The pupils of the oriental fire-bellied toad are triangular.',
    'California sea lions can hunt continuously for up to 30 hours.',
    'The bobcat is the most abundant wildcat in the U.S.',
    'Bobcats roam from Canada to Mexico.',
    'Baby elephants are dependent on their mothers\' milk for the first 2 years of life.',
    'Elephants are the largest land animals.',
    'Emperor penguins are the largest of all penguins.',
    'Whale sharks are the biggest fish in the sea.',
    'A whale shark can be as long as a school bus and weigh as much as 50,000 pounds.',
    'Whale sharks are one of only three known shark species that filter feed, as baleen whales do.',
    'The tiger shark is the world\'s most dangerous shark, after the great white.',
    'Tiger sharks will eat anything, including other sharks, license plates, and tires.',
    'Tiger sharks migrate to Hawaii each June to prey on albatross.',
    'To avoid stepping on a stringray, shuffle your feet. The vibrations alert the rays.',
    'Electric eels aren\'t eels. Their scientific classification is closer to carp and catfish.',
    'Electric eels are air breathers and must come to the water\'s surface frequently.'
];

//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
        this.emit('GetNewFactIntent');
    },
    'GetNewFactIntent': function () {
        const factArr = data;
        const factIndex = Math.floor(Math.random() * factArr.length);
        const randomFact = factArr[factIndex];
        const speechOutput = GET_FACT_MESSAGE + randomFact;

        this.response.cardRenderer(SKILL_NAME, randomFact);
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
};
