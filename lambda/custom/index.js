'use strict';
const Alexa = require('alexa-sdk');

//=========================================================================================================================================
//TODO: The items below this comment need your attention
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this:  const APP_ID = "amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1";
const APP_ID = "amzn1.ask.skill.35e96692-b7f2-43b1-a748-441fbf0e8dd4";

//This function returns a descriptive sentence about your data.  Before a user starts a quiz, they can ask about a specific data element,
//like "Ohio."  The skill will speak the sentence from this function, pulling the data values from the appropriate record in your data.
function getSpeechDescription(item)
{
    let sentence = item.PokemonName + " is the " + item.PokeDexNumber + "th in the Poke Dex. " + item.PokemonName + " is a " + item.Type + " pokemon. " + item.PokemonName + " evolves into " + item.NextEvolution + " at level " + item.EvolutionLevel + ". Which other pokemon would you like to know about?";
    return sentence;
}

//We have provided two ways to create your quiz questions.  The default way is to phrase all of your questions like: "What is X of Y?"
//If this approach doesn't work for your data, take a look at the commented code in this function.  You can write a different question
//structure for each property of your data.
function getQuestion(counter, property, item)
{
    //return "Here is your " + counter + "th question.  What is the " + formatCasing(property) + " of "  + item.StateName + "?";
    switch(property)
    {
        case "PokemonName":
            return "Here is your " + counter + "th question. What is the name of the pokemon with pokedex number "  + item.PokeDexNumber + "?";
        case "PokeDexNumber":
            return "Here is your " + counter + "th question. What is the pokedex number of " + item.PokemonName + "?";
        case "NextEvolution":
            return "Here is your " + counter + "th question. What is the next evolution of " + item.PokemonName + "?";
        case "EvolutionLevel":
            return "Here is your " + counter + "th question. At what level does " + item.PokemonName + " evolve?";
        case "Type":
            return "Here is your " + counter + "th question.  What type of pokemon is " + item.PokemonName + "?";
        default:
            return "Here is your " + counter + "th question.  What is the " + formatCasing(property) + " of the "  + item.PokemonName + "?";
    }
}

//This is the function that returns an answer to your user during the quiz.  Much like the "getQuestion" function above, you can use a
//switch() statement to create different responses for each property in your data.  For example, when this quiz has an answer that includes
//a state abbreviation, we add some SSML to make sure that Alexa spells that abbreviation out (instead of trying to pronounce it.)
function getAnswer(property, item)
{
    switch(property)
    {
        case "PokemonName":
            return "The " + formatCasing(property) + " with " + item.PokeDexNumber + " is <say-as interpret-as='spell-out'>" + item[property] + "</say-as>. "
        default:
            return "The " + formatCasing(property) + " of " + item.PokemonName + " is " + item[property] + ". "
    }
}

//This is a list of positive speechcons that this skill will use when a user gets a correct answer.  For a full list of supported
//speechcons, go here: https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speechcon-reference
const speechConsCorrect = ["Booya", "All righty", "Bam", "Bazinga", "Bingo", "Boom", "Bravo", "Cha Ching", "Cheers", "Dynomite",
"Hip hip hooray", "Hurrah", "Hurray", "Huzzah", "Oh dear.  Just kidding.  Hurray", "Kaboom", "Kaching", "Oh snap", "Phew",
"Righto", "Way to go", "Well done", "Whee", "Woo hoo", "Yay", "Wowza", "Yowsa"];

//This is a list of negative speechcons that this skill will use when a user gets an incorrect answer.  For a full list of supported
//speechcons, go here: https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speechcon-reference
const speechConsWrong = ["Argh", "Aw man", "Blarg", "Blast", "Boo", "Bummer", "Darn", "D'oh", "Dun dun dun", "Eek", "Honk", "Le sigh",
"Mamma mia", "Oh boy", "Oh dear", "Oof", "Ouch", "Ruh roh", "Shucks", "Uh oh", "Wah wah", "Whoops a daisy", "Yikes"];

//This is the welcome message for when a user starts the skill without a specific intent.
const WELCOME_MESSAGE = "Welcome to the Pokemon Quiz Game!  You can ask me about any of the first 151 pokemon and their basic information, or you can ask me to start a quiz.  What would you like to do?";

//This is the message a user will hear when they start a quiz.
const START_QUIZ_MESSAGE = "OK.  I will ask you 10 questions about the first 151 pokemon.";

//This is the message a user will hear when they try to cancel or stop the skill, or when they finish a quiz.
const EXIT_SKILL_MESSAGE = "Thank you for playing the Pokemon Quiz Game!  Let's play again soon!";

//This is the message a user will hear after they ask (and hear) about a specific data element.
const REPROMPT_SPEECH = "Which other pokemon would you like to know about?";

//This is the message a user will hear when they ask Alexa for help in your skill.
const HELP_MESSAGE = "I know lots of things about the first 151 pokemon.  You can ask me about a pokemon, and I'll tell you what I know.  You can also test your knowledge by asking me to start a quiz.  What would you like to do?";


//This is the response a user will receive when they ask about something we weren't expecting.  For example, say "pizza" to your
//skill when it starts.  This is the response you will receive.
function getBadAnswer(item) { return "I'm sorry. " + item + " is not something I know very much about in this skill. " + HELP_MESSAGE; }

//This is the message a user will receive after each question of a quiz.  It reminds them of their current score.
function getCurrentScore(score, counter) { return "Your current score is " + score + " out of " + counter + ". "; }

//This is the message a user will receive after they complete a quiz.  It tells them their final score.
function getFinalScore(score, counter) { return "Your final score is " + score + " out of " + counter + ". "; }

//These next four values are for the Alexa cards that are created when a user asks about one of the data elements.
//This only happens outside of a quiz.

//If you don't want to use cards in your skill, set the USE_CARDS_FLAG to false.  If you set it to true, you will need an image for each
//item in your data.
const USE_CARDS_FLAG = true;

//This is what your card title will be.  For our example, we use the name of the state the user requested.
function getCardTitle(item) { return item.PokemonName;}

//This is the small version of the card image.  We use our data as the naming convention for our images so that we can dynamically
//generate the URL to the image.  The small image should be 720x400 in dimension.
function getSmallImage(item) { return "https://s3.amazonaws.com/unofficialpokemonquiz/small_home_card.png"; }

//This is the large version of the card image.  It should be 1200x800 pixels in dimension.
function getLargeImage(item) { return "https://s3.amazonaws.com/unofficialpokemonquiz/large_home_card.png"; }

//=========================================================================================================================================
// TODO: Replace this data with your own.
// This data quizzes users about the pokedex number, evolution, evolution level and type of the first 151 pokemon
// Data for this list came from: https://pokemondb.net/evolution
//=========================================================================================================================================
const data = [
                {PokemonName: "Bulbasaur",  PokeDexNumber: 1, NextEvolution: "Ivysaur",     EvolutionLevel: 16, Type: "Grass/Poison" },
                {PokemonName: "Ivysaur",  PokeDexNumber: 2, NextEvolution: "Venusaur",     EvolutionLevel: 32, Type: "Grass/Poison" },
                {PokemonName: "Venusaur",  PokeDexNumber: 3, NextEvolution: "None",     EvolutionLevel: 0, Type: "Grass/Poison" },
                {PokemonName: "Charmandar",  PokeDexNumber: 4, NextEvolution: "Charmeleon",     EvolutionLevel: 16, Type: "Fire" },
                {PokemonName: "Charmeleon",  PokeDexNumber: 5, NextEvolution: "Charizard",     EvolutionLevel: 36, Type: "Fire" },
                {PokemonName: "Charizard",  PokeDexNumber: 6, NextEvolution: "None",     EvolutionLevel: 16, Type: "Fire/Flying" },
                {PokemonName: "Squirtle",  PokeDexNumber: 7, NextEvolution: "Wartortle",     EvolutionLevel: 16, Type: "Water" },
                {PokemonName: "Wartortle",  PokeDexNumber: 8, NextEvolution: "Blastoise",     EvolutionLevel: 36, Type: "Water" },
                {PokemonName: "Blastoise",  PokeDexNumber: 9, NextEvolution: "None",     EvolutionLevel: 0, Type: "Water" },
                {PokemonName: "Caterpie",  PokeDexNumber: 10, NextEvolution: "Metapod",     EvolutionLevel: 7, Type: "Bug" },
                {PokemonName: "Metapod",  PokeDexNumber: 11, NextEvolution: "Butterfree",     EvolutionLevel: 10, Type: "Bug" },
                {PokemonName: "Butterfree",  PokeDexNumber: 12, NextEvolution: "None",     EvolutionLevel: 0, Type: "Bug/Flying" },
                {PokemonName: "Weedle",  PokeDexNumber: 13, NextEvolution: "Kakuna",     EvolutionLevel: 7, Type: "Bug/Poison" },
                {PokemonName: "Kakuna",  PokeDexNumber: 14, NextEvolution: "Beedrill",     EvolutionLevel: 10, Type: "Bug/Poison" },
                {PokemonName: "Beedrill",  PokeDexNumber: 15, NextEvolution: "None",     EvolutionLevel: 0, Type: "Bug/Poison" },
                {PokemonName: "Pidgey",  PokeDexNumber: 16, NextEvolution: "Pidgeotto",     EvolutionLevel: 18, Type: "Flying/Normal" },
                {PokemonName: "Pidgeotto",  PokeDexNumber: 17, NextEvolution: "Pidgeot",     EvolutionLevel: 36, Type: "Flying/Normal" },
                {PokemonName: "Pidgeot",  PokeDexNumber: 18, NextEvolution: "None",     EvolutionLevel: 0, Type: "Flying/Normal" },
                {PokemonName: "Rattata",  PokeDexNumber: 19, NextEvolution: "Raticate",     EvolutionLevel: 20, Type: "Normal" },
                {PokemonName: "Raticate",  PokeDexNumber: 20, NextEvolution: "None",     EvolutionLevel: 0, Type: "Normal" },
                {PokemonName: "Spearow",  PokeDexNumber: 21, NextEvolution: "Fearow",     EvolutionLevel: 20, Type: "Flying/Normal" },
                {PokemonName: "Fearow",  PokeDexNumber: 22, NextEvolution: "None",     EvolutionLevel: 0, Type: "Flying/Normal" },
                {PokemonName: "Ekans",  PokeDexNumber: 23, NextEvolution: "Arbok",     EvolutionLevel: 22, Type: "Poison" },
                {PokemonName: "Arbok",  PokeDexNumber: 24, NextEvolution: "None",     EvolutionLevel: 0, Type: "Poison" },
                {PokemonName: "Pikachu",  PokeDexNumber: 25, NextEvolution: "Raichu",     EvolutionLevel: 0, Type: "Electric" },
                {PokemonName: "Raichu",  PokeDexNumber: 26, NextEvolution: "None",     EvolutionLevel: 0, Type: "Electric" },
                {PokemonName: "Sandshrew",  PokeDexNumber: 27, NextEvolution: "Sandslash",     EvolutionLevel: 22, Type: "Ground" },
                {PokemonName: "Sandslash",  PokeDexNumber: 28, NextEvolution: "None",     EvolutionLevel: 0, Type: "Ground" },
                {PokemonName: "Female Nidoran",  PokeDexNumber: 29, NextEvolution: "Nidorina",     EvolutionLevel: 16, Type: "Poison" },
                {PokemonName: "Nidorina",  PokeDexNumber: 30, NextEvolution: "Nidoqueen",     EvolutionLevel: 0, Type: "Poison" },
                {PokemonName: "Nidorqueen",  PokeDexNumber: 31, NextEvolution: "None",     EvolutionLevel: 0, Type: "Ground/Poison" },
                {PokemonName: "Male Nidoran",  PokeDexNumber: 32, NextEvolution: "Nidorino",     EvolutionLevel: 16, Type: "Poison" },
                {PokemonName: "Nidorino",  PokeDexNumber: 33, NextEvolution: "Nidoking",     EvolutionLevel: 0, Type: "Poison" },
                {PokemonName: "Nidoking",  PokeDexNumber: 34, NextEvolution: "None",     EvolutionLevel: 0, Type: "Ground/Poison" },
                {PokemonName: "Clefairy",  PokeDexNumber: 35, NextEvolution: "Clefable",     EvolutionLevel: 0, Type: "Fairy" },
                {PokemonName: "Clefable",  PokeDexNumber: 36, NextEvolution: "None",     EvolutionLevel: 0, Type: "Fairy" },
                {PokemonName: "Vulpix",  PokeDexNumber: 37, NextEvolution: "Ninetales",     EvolutionLevel: 0, Type: "Fire" },
                {PokemonName: "Ninetales",  PokeDexNumber: 38, NextEvolution: "None",     EvolutionLevel: 0, Type: "Fire" },
                {PokemonName: "JigglyPuff",  PokeDexNumber: 39, NextEvolution: "WigglyTuff",     EvolutionLevel: 0, Type: "Fairy" },
                {PokemonName: "WigglyTuff",  PokeDexNumber: 40, NextEvolution: "None",     EvolutionLevel: 0, Type: "Fairy" },
                {PokemonName: "Zubat",  PokeDexNumber: 41, NextEvolution: "Golbat",     EvolutionLevel: 22, Type: "Flying/Poison" },
                {PokemonName: "Golbat",  PokeDexNumber: 42, NextEvolution: "None",     EvolutionLevel: 0, Type: "Flying/Poison" },
                {PokemonName: "Oddish",  PokeDexNumber: 43, NextEvolution: "Gloom",     EvolutionLevel: 21, Type: "Grass/Poison" },
                {PokemonName: "Gloom",  PokeDexNumber: 44, NextEvolution: "Vileplume",     EvolutionLevel: 0, Type: "Grass/Poison" },
                {PokemonName: "Vileplume",  PokeDexNumber: 45, NextEvolution: "None",     EvolutionLevel: 0, Type: "Grass/Poison" },
                {PokemonName: "Vileplume",  PokeDexNumber: 45, NextEvolution: "None",     EvolutionLevel: 0, Type: "Grass/Poison" },
                {PokemonName: "Paras",  PokeDexNumber: 46, NextEvolution: "Parasect",     EvolutionLevel: 24, Type: "Bug/Grass" },
                {PokemonName: "Parasect",  PokeDexNumber: 47, NextEvolution: "None",     EvolutionLevel: 0, Type: "Bug/Grass" },
                {PokemonName: "Venonat",  PokeDexNumber: 48, NextEvolution: "Venomoth",     EvolutionLevel: 31, Type: "Bug/Poison" },
                {PokemonName: "Venomoth",  PokeDexNumber: 49, NextEvolution: "None",     EvolutionLevel: 0, Type: "Bug/Poison" },
                {PokemonName: "Diglett",  PokeDexNumber: 50, NextEvolution: "Dugtrio",     EvolutionLevel: 26, Type: "Ground" },
                {PokemonName: "Dugtrio",  PokeDexNumber: 51, NextEvolution: "None",     EvolutionLevel: 0, Type: "Ground" },
                {PokemonName: "Meowth",  PokeDexNumber: 52, NextEvolution: "Persian",     EvolutionLevel: 28, Type: "Normal" },
                {PokemonName: "Persian",  PokeDexNumber: 53, NextEvolution: "None",     EvolutionLevel: 0, Type: "Normal" },
                {PokemonName: "Psyduck",  PokeDexNumber: 54, NextEvolution: "Golduck",     EvolutionLevel: 33, Type: "Water" },
                {PokemonName: "Golduck",  PokeDexNumber: 55, NextEvolution: "None",     EvolutionLevel: 0, Type: "Water" },
                {PokemonName: "Mankey",  PokeDexNumber: 56, NextEvolution: "Primeape",     EvolutionLevel: 28, Type: "Fighting" },
                {PokemonName: "Primeape",  PokeDexNumber: 57, NextEvolution: "None",     EvolutionLevel: 0, Type: "Fighting" },
                {PokemonName: "Growlithe",  PokeDexNumber: 58, NextEvolution: "Arcanine",     EvolutionLevel: 0, Type: "Fire" },
                {PokemonName: "Arcanine",  PokeDexNumber: 59, NextEvolution: "None",     EvolutionLevel: 0, Type: "Fire" },
                {PokemonName: "Poliwag",  PokeDexNumber: 60, NextEvolution: "Poliwhirl",     EvolutionLevel: 25, Type: "Water" },
                {PokemonName: "Poliwhirl",  PokeDexNumber: 61, NextEvolution: "Poliwrath",     EvolutionLevel: 0, Type: "Water" },
                {PokemonName: "Poliwrath",  PokeDexNumber: 62, NextEvolution: "None",     EvolutionLevel: 0, Type: "Water" },
                {PokemonName: "Abra",  PokeDexNumber: 63, NextEvolution: "Kadabra",     EvolutionLevel: 16, Type: "Psychic" },
                {PokemonName: "Kadabra",  PokeDexNumber: 64, NextEvolution: "Alakazam",     EvolutionLevel: 0, Type: "Psychic" },
                {PokemonName: "Alakazam",  PokeDexNumber: 65, NextEvolution: "None",     EvolutionLevel: 0, Type: "Psychic" },
                {PokemonName: "Machop",  PokeDexNumber: 66, NextEvolution: "Machoke",     EvolutionLevel: 28, Type: "Fighting" },
                {PokemonName: "Machoke",  PokeDexNumber: 67, NextEvolution: "Machamp",     EvolutionLevel: 0, Type: "Fighting" },
                {PokemonName: "Machamp",  PokeDexNumber: 68, NextEvolution: "None",     EvolutionLevel: 0, Type: "Fighting" },
                {PokemonName: "Bellsprout",  PokeDexNumber: 69, NextEvolution: "Weepinbell",     EvolutionLevel: 21, Type: "Grass/Poison" },
                {PokemonName: "Weepinbell",  PokeDexNumber: 70, NextEvolution: "Victreebel",     EvolutionLevel: 0, Type: "Grass/Poison" },
                {PokemonName: "Victreebel",  PokeDexNumber: 71, NextEvolution: "None",     EvolutionLevel: 0, Type: "Grass/Poison" },
                {PokemonName: "Tentacool",  PokeDexNumber: 72, NextEvolution: "Tentacruel",     EvolutionLevel: 30, Type: "Poison/Water" },
                {PokemonName: "Tentacruel",  PokeDexNumber: 73, NextEvolution: "Tentacruel",     EvolutionLevel: 0, Type: "Poison/Water" },
                {PokemonName: "Geodude",  PokeDexNumber: 74, NextEvolution: "Graveler",     EvolutionLevel: 25, Type: "Ground/Rock" },
                {PokemonName: "Graveler",  PokeDexNumber: 75, NextEvolution: "Golem",     EvolutionLevel: 0, Type: "Ground/Rock" },
                {PokemonName: "Golem",  PokeDexNumber: 76, NextEvolution: "None",     EvolutionLevel: 0, Type: "Ground/Rock" },
                {PokemonName: "Ponyta",  PokeDexNumber: 77, NextEvolution: "Rapidash",     EvolutionLevel: 40, Type: "Fire" },
                {PokemonName: "Rapidash",  PokeDexNumber: 78, NextEvolution: "None",     EvolutionLevel: 0, Type: "Fire" },
                {PokemonName: "Slowpoke",  PokeDexNumber: 79, NextEvolution: "Slowbro",     EvolutionLevel: 37, Type: "Psychic/Water" },
                {PokemonName: "Slowbro",  PokeDexNumber: 80, NextEvolution: "None",     EvolutionLevel: 0, Type: "Psychic/Water" },
                {PokemonName: "Magnemite",  PokeDexNumber: 81, NextEvolution: "Magneton",     EvolutionLevel: 30, Type: "Electric/Steel" },
                {PokemonName: "Magneton",  PokeDexNumber: 82, NextEvolution: "Magnezone",     EvolutionLevel: 0, Type: "Electric/Steel" },
                {PokemonName: "Farfetch'd",  PokeDexNumber: 83, NextEvolution: "None",     EvolutionLevel: 0, Type: "Flying/Normal" },
                {PokemonName: "Doduo",  PokeDexNumber: 84, NextEvolution: "Dodrio",     EvolutionLevel: 31, Type: "Flying/Normal" },
                {PokemonName: "Dodrio",  PokeDexNumber: 85, NextEvolution: "None",     EvolutionLevel: 0, Type: "Flying/Normal" },
                {PokemonName: "Seel",  PokeDexNumber: 86, NextEvolution: "Dewgong",     EvolutionLevel: 34, Type: "Water" },
                {PokemonName: "Dewgong",  PokeDexNumber: 87, NextEvolution: "None",     EvolutionLevel: 0, Type: "Ice/Water" },
                {PokemonName: "Grimer",  PokeDexNumber: 88, NextEvolution: "Muk",     EvolutionLevel: 38, Type: "Poison" },
                {PokemonName: "Muk",  PokeDexNumber: 89, NextEvolution: "None",     EvolutionLevel: 0, Type: "Poison" },
                {PokemonName: "Shellder",  PokeDexNumber: 90, NextEvolution: "Cloyster",     EvolutionLevel: 0, Type: "Water" },
                {PokemonName: "Cloyster",  PokeDexNumber: 91, NextEvolution: "None",     EvolutionLevel: 0, Type: "Ice/Water" },
                {PokemonName: "Gastly",  PokeDexNumber: 92, NextEvolution: "Haunter",     EvolutionLevel: 25, Type: "Ghost/Poison" },
                {PokemonName: "Haunter",  PokeDexNumber: 93, NextEvolution: "Gengar",     EvolutionLevel: 0, Type: "Ghost/Poison" },
                {PokemonName: "Gengar",  PokeDexNumber: 94, NextEvolution: "None",     EvolutionLevel: 0, Type: "Ghost/Poison" },
                {PokemonName: "Onix",  PokeDexNumber: 95, NextEvolution: "None",     EvolutionLevel: 0, Type: "Ground/Rock" },
                {PokemonName: "Drowzee",  PokeDexNumber: 96, NextEvolution: "Hypno",     EvolutionLevel: 26, Type: "Psychic" },
                {PokemonName: "Hypno",  PokeDexNumber: 97, NextEvolution: "None",     EvolutionLevel: 0, Type: "Psychic" },
                {PokemonName: "Krabby",  PokeDexNumber: 98, NextEvolution: "Kingler",     EvolutionLevel: 28, Type: "Water" },
                {PokemonName: "Kingler",  PokeDexNumber: 99, NextEvolution: "None",     EvolutionLevel: 0, Type: "Water" },
                {PokemonName: "Voltorb",  PokeDexNumber: 100, NextEvolution: "Electrode",     EvolutionLevel: 30, Type: "Electric" },
                {PokemonName: "Electrode",  PokeDexNumber: 101, NextEvolution: "None",     EvolutionLevel: 0 , Type: "Electric" },
                {PokemonName: "Exeggcute",  PokeDexNumber: 102, NextEvolution: "Exeggutor",     EvolutionLevel: 0, Type: "Grass/Psychic" },
                {PokemonName: "Exeggutor",  PokeDexNumber: 103, NextEvolution: "None",     EvolutionLevel: 0 , Type: "Grass/Psychic" },
                {PokemonName: "Cubone",  PokeDexNumber: 104, NextEvolution: "Marowak",     EvolutionLevel: 28 , Type: "Ground" },
                {PokemonName: "Marowak",  PokeDexNumber: 105, NextEvolution: "None",     EvolutionLevel: 0 , Type: "Ground" },
                {PokemonName: "Hitmonlee",  PokeDexNumber: 106, NextEvolution: "None",     EvolutionLevel: 0 , Type: "Fighting" },
                {PokemonName: "Hitmonchan",  PokeDexNumber: 107, NextEvolution: "None",     EvolutionLevel: 0 , Type: "Fighting" },
                {PokemonName: "Lickitung",  PokeDexNumber: 108, NextEvolution: "None",     EvolutionLevel: 0 , Type: "Normal" },
                {PokemonName: "Koffing",  PokeDexNumber: 109, NextEvolution: "Weezing",     EvolutionLevel: 35 , Type: "Poison" },
                {PokemonName: "Weezing",  PokeDexNumber: 110, NextEvolution: "None",     EvolutionLevel: 0 , Type: "Poison" },
                {PokemonName: "Rhyhorn",  PokeDexNumber: 111, NextEvolution: "Rhydon",     EvolutionLevel: 42 , Type: "Ground/Rock" },
                {PokemonName: "Rhydon",  PokeDexNumber: 112, NextEvolution: "None",     EvolutionLevel: 0 , Type: "Ground/Rock" },
                {PokemonName: "Chansey",  PokeDexNumber: 113, NextEvolution: "None",     EvolutionLevel: 0 , Type: "Normal" },
                {PokemonName: "Tangela",  PokeDexNumber: 114, NextEvolution: "None",     EvolutionLevel: 0 , Type: "Grass" },
                {PokemonName: "Kangaskhan",  PokeDexNumber: 115, NextEvolution: "None",     EvolutionLevel: 0 , Type: "Normal" },
                {PokemonName: "Horsea",  PokeDexNumber: 116, NextEvolution: "Seadra",     EvolutionLevel: 32 , Type: "Water" },
                {PokemonName: "Seadra",  PokeDexNumber: 117, NextEvolution: "None",     EvolutionLevel: 0 , Type: "Water" },
                {PokemonName: "Goldeen",  PokeDexNumber: 118, NextEvolution: "Seaking",     EvolutionLevel: 33 , Type: "Water" },
                {PokemonName: "Seaking",  PokeDexNumber: 119, NextEvolution: "None",     EvolutionLevel: 0 , Type: "Water" },
                {PokemonName: "Staryu",  PokeDexNumber: 120, NextEvolution: "Starmie",     EvolutionLevel: 0 , Type: "Water" },
                {PokemonName: "Starmie",  PokeDexNumber: 121, NextEvolution: "None",     EvolutionLevel: 0 , Type: "Water" },
                {PokemonName: "Mr. Mime",  PokeDexNumber: 122, NextEvolution: "None",     EvolutionLevel: 0 , Type: "Fairy/Psychic" },
                {PokemonName: "Scyther",  PokeDexNumber: 123, NextEvolution: "None",     EvolutionLevel: 0 , Type: "Bug/Flying" },
                {PokemonName: "Jynx",  PokeDexNumber: 124, NextEvolution: "None",     EvolutionLevel: 0 , Type: "Ice/Psychic" },
                {PokemonName: "Electabuzz",  PokeDexNumber: 125, NextEvolution: "None",     EvolutionLevel: 0 , Type: "Electric" },
                {PokemonName: "Magmar",  PokeDexNumber: 126, NextEvolution: "None",     EvolutionLevel: 0 , Type: "Fire" },
                {PokemonName: "Pinsir",  PokeDexNumber: 127, NextEvolution: "None",     EvolutionLevel: 0 , Type: "Bug" },
                {PokemonName: "Tauros",  PokeDexNumber: 128, NextEvolution: "None",     EvolutionLevel: 0 , Type: "Normal" },
                {PokemonName: "Magikarp",  PokeDexNumber: 129, NextEvolution: "Gyarados",     EvolutionLevel: 20 , Type: "Water" },
                {PokemonName: "Gyarados",  PokeDexNumber: 130, NextEvolution: "None",     EvolutionLevel: 0 , Type: "Flying/Water" },
                {PokemonName: "Lapras",  PokeDexNumber: 131, NextEvolution: "None",     EvolutionLevel: 0 , Type: "Ice/Water" },
                {PokemonName: "Ditto",  PokeDexNumber: 132, NextEvolution: "None",     EvolutionLevel: 0 , Type: "Normal" },
                {PokemonName: "Eevee",  PokeDexNumber: 133, NextEvolution: "Vaporeon, Jolteon, Flareon",     EvolutionLevel: 0 , Type: "Normal" },
                {PokemonName: "Vaporeon",  PokeDexNumber: 134, NextEvolution: "None",     EvolutionLevel: 0 , Type: "Water" },
                {PokemonName: "Jolteon",  PokeDexNumber: 135, NextEvolution: "None",     EvolutionLevel: 0 , Type: "Electric" },
                {PokemonName: "Flareon",  PokeDexNumber: 136, NextEvolution: "None",     EvolutionLevel: 0 , Type: "Fire" },
                {PokemonName: "Porygon",  PokeDexNumber: 137, NextEvolution: "None",     EvolutionLevel: 0 , Type: "Normal" },
                {PokemonName: "Omanyte",  PokeDexNumber: 138, NextEvolution: "Omastar",     EvolutionLevel: 40 , Type: "Rock/Water" },
                {PokemonName: "Omastar",  PokeDexNumber: 139, NextEvolution: "None",     EvolutionLevel: 0 , Type: "Rock/Water" },
                {PokemonName: "Kabuto",  PokeDexNumber: 140, NextEvolution: "Kabutops",     EvolutionLevel: 40 , Type: "Rock/Water" },
                {PokemonName: "Kabutops",  PokeDexNumber: 141, NextEvolution: "None",     EvolutionLevel: 0 , Type: "Rock/Water" },
                {PokemonName: "Aerodactyl",  PokeDexNumber: 142, NextEvolution: "None",     EvolutionLevel: 0 , Type: "Flying" },
                {PokemonName: "Snorlax",  PokeDexNumber: 143, NextEvolution: "None",     EvolutionLevel: 0 , Type: "Normal" },
                {PokemonName: "Articuno",  PokeDexNumber: 144, NextEvolution: "None",     EvolutionLevel: 0 , Type: "Flying/Ice" },
                {PokemonName: "Zapdos",  PokeDexNumber: 145, NextEvolution: "None",     EvolutionLevel: 0 , Type: "Electric/Flying" },
                {PokemonName: "Moltres",  PokeDexNumber: 146, NextEvolution: "None",     EvolutionLevel: 0 , Type: "Fire/Flying" },
                {PokemonName: "Dratini",  PokeDexNumber: 147, NextEvolution: "Dragonair",     EvolutionLevel: 30 , Type: "Dragon" },
                {PokemonName: "Dragonair",  PokeDexNumber: 148, NextEvolution: "Dragonite",     EvolutionLevel: 55 , Type: "Dragon" },
                {PokemonName: "Dragonite",  PokeDexNumber: 149, NextEvolution: "None",     EvolutionLevel: 0 , Type: "Dragon/Flying" },
                {PokemonName: "Mewtwo",  PokeDexNumber: 150, NextEvolution: "None",     EvolutionLevel: 0 , Type: "Psychic" },
                {PokemonName: "Mew",  PokeDexNumber: 151, NextEvolution: "None",     EvolutionLevel: 0 , Type: "Psychic" }
            ];

//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================

const counter = 0;

const states = {
    START: "_START",
    QUIZ: "_QUIZ"
};

const handlers = {
     "LaunchRequest": function() {
        this.handler.state = states.START;
        this.emitWithState("Start");
     },
    "QuizIntent": function() {
        this.handler.state = states.QUIZ;
        this.emitWithState("Quiz");
    },
    "AnswerIntent": function() {
        this.handler.state = states.START;
        this.emitWithState("AnswerIntent");
    },
    "AMAZON.HelpIntent": function() {
        this.response.speak(HELP_MESSAGE).listen(HELP_MESSAGE);
        this.emit(":responseReady");
    },
    "Unhandled": function() {
        this.handler.state = states.START;
        this.emitWithState("Start");
    }
};

const startHandlers = Alexa.CreateStateHandler(states.START,{
    "Start": function() {
        this.response.speak(WELCOME_MESSAGE).listen(HELP_MESSAGE);
        this.emit(":responseReady");
    },
    "AnswerIntent": function() {
        let item = getItem(this.event.request.intent.slots);

        if (item && item[Object.getOwnPropertyNames(data[0])[0]] != undefined)
        {
          console.log("\nMEMO's TEST\n");
            if (USE_CARDS_FLAG)
            {
                let imageObj = {smallImageUrl: getSmallImage(item), largeImageUrl: getLargeImage(item)};

                this.response.speak(getSpeechDescription(item)).listen(REPROMPT_SPEECH);
                this.response.cardRenderer(getCardTitle(item), getTextDescription(item), imageObj);            }
            else
            {
                this.response.speak(getSpeechDescription(item)).listen(REPROMPT_SPEECH);
            }
        }
        else
        {
            this.response.speak(getBadAnswer(item)).listen(getBadAnswer(item));

        }

        this.emit(":responseReady");
    },
    "QuizIntent": function() {
        this.handler.state = states.QUIZ;
        this.emitWithState("Quiz");
    },
    "AMAZON.StopIntent": function() {
        this.response.speak(EXIT_SKILL_MESSAGE);
        this.emit(":responseReady");
    },
    "AMAZON.CancelIntent": function() {
        this.response.speak(EXIT_SKILL_MESSAGE);
        this.emit(":responseReady");
    },
    "AMAZON.HelpIntent": function() {
        this.response.speak(HELP_MESSAGE).listen(HELP_MESSAGE);
        this.emit(":responseReady");
    },
    "Unhandled": function() {
        this.emitWithState("Start");
    }
});


const quizHandlers = Alexa.CreateStateHandler(states.QUIZ,{
    "Quiz": function() {
        this.attributes["response"] = "";
        this.attributes["counter"] = 0;
        this.attributes["quizscore"] = 0;
        this.emitWithState("AskQuestion");
    },
    "AskQuestion": function() {
        if (this.attributes["counter"] == 0)
        {
            this.attributes["response"] = START_QUIZ_MESSAGE + " ";
        }

        let random = getRandom(0, data.length-1);
        let item = data[random];

        let propertyArray = Object.getOwnPropertyNames(item);
        let property = propertyArray[getRandom(1, propertyArray.length-1)];

        this.attributes["quizitem"] = item;
        this.attributes["quizproperty"] = property;
        this.attributes["counter"]++;

        let question = getQuestion(this.attributes["counter"], property, item);
        let speech = this.attributes["response"] + question;

        this.emit(":ask", speech, question);
    },
    "AnswerIntent": function() {
        let response = "";
        let speechOutput = "";
        let item = this.attributes["quizitem"];
        let property = this.attributes["quizproperty"]

        let correct = compareSlots(this.event.request.intent.slots, item[property]);

        if (correct)
        {
            response = getSpeechCon(true);
            this.attributes["quizscore"]++;
        }
        else
        {
            response = getSpeechCon(false);
        }

        response += getAnswer(property, item);

        if (this.attributes["counter"] < 10)
        {
            response += getCurrentScore(this.attributes["quizscore"], this.attributes["counter"]);
            this.attributes["response"] = response;
            this.emitWithState("AskQuestion");
        }
        else
        {
            response += getFinalScore(this.attributes["quizscore"], this.attributes["counter"]);
            speechOutput = response + " " + EXIT_SKILL_MESSAGE;

            this.response.speak(speechOutput);
            this.emit(":responseReady");
        }
    },
    "AMAZON.RepeatIntent": function() {
        let question = getQuestion(this.attributes["counter"], this.attributes["quizproperty"], this.attributes["quizitem"]);
        this.response.speak(question).listen(question);
        this.emit(":responseReady");
    },
    "AMAZON.StartOverIntent": function() {
        this.emitWithState("Quiz");
    },
    "AMAZON.StopIntent": function() {
        this.response.speak(EXIT_SKILL_MESSAGE);
        this.emit(":responseReady");
    },
    "AMAZON.CancelIntent": function() {
        this.response.speak(EXIT_SKILL_MESSAGE);
        this.emit(":responseReady");
    },
    "AMAZON.HelpIntent": function() {
        this.response.speak(HELP_MESSAGE).listen(HELP_MESSAGE);
        this.emit(":responseReady");
    },
    "Unhandled": function() {
        this.emitWithState("AnswerIntent");
    }
});

function compareSlots(slots, value)
{
    for (let slot in slots)
    {
        if (slots[slot].value != undefined)
        {
            if (slots[slot].value.toString().toLowerCase() == value.toString().toLowerCase())
            {
                return true;
            }
        }
    }
    return false;
}

function getRandom(min, max)
{
    return Math.floor(Math.random() * (max-min+1)+min);
}

function getRandomSymbolSpeech(symbol)
{
    return "<say-as interpret-as='spell-out'>" + symbol + "</say-as>";
}

function getItem(slots)
{
    let propertyArray = Object.getOwnPropertyNames(data[0]);
    let value;

    for (let slot in slots)
    {
        if (slots[slot].value !== undefined)
        {
            value = slots[slot].value;
            for (let property in propertyArray)
            {
                let item = data.filter(x => x[propertyArray[property]].toString().toLowerCase() === slots[slot].value.toString().toLowerCase());
                if (item.length > 0)
                {
                    return item[0];
                }
            }
        }
    }
    return value;
}

function getSpeechCon(type)
{
    let speechCon = "";
    if (type) return "<say-as interpret-as='interjection'>" + speechConsCorrect[getRandom(0, speechConsCorrect.length-1)] + "! </say-as><break strength='strong'/>";
    else return "<say-as interpret-as='interjection'>" + speechConsWrong[getRandom(0, speechConsWrong.length-1)] + " </say-as><break strength='strong'/>";
}

function formatCasing(key)
{
    key = key.split(/(?=[A-Z])/).join(" ");
    return key;
}

function getTextDescription(item)
{
    let text = "";

    for (let key in item)
    {
        text += formatCasing(key) + ": " + item[key] + "\n";
    }
    return text;
}

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers, startHandlers, quizHandlers);
    alexa.execute();
};
