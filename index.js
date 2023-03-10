import inquirer from 'inquirer';
import fs from 'fs';

import Employee from './classes/Employee.js';
import Manager from './classes/Manager.js';
import Engineer from './classes/Engineer.js';
import Intern from './classes/Intern.js';


/* 
TODO:
Clean code, make seperate files for big js functions.
*/

//formats html into a string to be written to an html file
const formatDiv = (data) => {
    let divString = "";
    for(let i = 0; i < allEmployees.length; i++) {
        divString+= '\n<div class="card">\n<div class="card-top"><div class="name">' + data[i].getName() + '\n</div>\n'
        divString+= '\n<div class="role">\n' + data[i].getRole() + '\n</div></div>\n'

        //division in css
        divString+= '\n<div class="card-bottom-info">\n<div>Id: ' + data[i].getId() + '\n</div>'
        divString+= '\n<div>Email: ' + '<a href="mailto:' + data[i].getEmail() + '">' +data[i].getEmail() + '\n</a></div>'

        //unique info based on role
        if(data[i].getRole() === "Manager") {
            divString+= "\n<div>Office Number: " + data[i].getOfficeNumber() + "\n</div></div></div>"
        }

        if(data[i].getRole() === "Engineer") {
            divString+= '\n<div> Github: <a target="_blank" href="https://github.com/' + data[i].getGithub() + '">' + data[i].getGithub() + '\n</a></div></div></div>'
        }

        if(data[i].getRole() === "Intern") {
            divString+= "\n<div>School: " + data[i].getSchool() + "\n</div></div></div>"
        }

    }
    return divString;
}
    //writes html to file using file system
    const writeHTML = (fileName, data) => {
    fs.writeFile(`./dist/${fileName}.html`, 
    `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Team Manager</title>
        <link rel="stylesheet" href="style.css">
    </head>
    <body>

    <div class="my-team">My Team</div>

    <div class="full-team-container">` +
    
    formatDiv(allEmployees)
    
    + 
    `</div>
    </body>
    </html>`, 

    (err) => {
        if(err) throw err;
      console.log('File "' + `${fileName}` +'" Created!')
    })
  }

  // arrays of questions
    const defaultQuestions = [{
        ame: 'name',
        message: "What is your team manager's name?",
        type: 'input'
        },{
        name: "id",
        message: "Enter your manager's Employee ID",
        type: "input"
        }, {
        name: "email",
        message: "Enter your manager's email",
        type: "input"
        },{
        name: "office",
        message: "Enter your manager's office number",
        type: "input"
         }];

    const addPeople = [{
        name: "person",
        message:"Who would you like to add to your team?",
        type: "list",
        choices: ["Engineer", "Intern", "Finish Team"]
     }]

    const internQuestions = [{
        name: "name",
        message: "What is your intern's name?",
        type: "input"
     },{
        name: "school",
        message: "What school is your intern attending?",
        type: "input"
     },{
        name: "id",
        message: "What is your intern's ID?",
        type: "input"
     },{
        name: "email",
        message: "What is your intern's email?",
        type: "input"
     },{
        name: "add",
        message: "Add more team members?",
        type: "list",
        choices: ["Add More", "Finish Team"]
     }]

     const engineerQuestions = [{
        name: "name",
        message: "What is your engineers's name?",
        type: "input"
     },{
        name: "github",
        message: "What is your engineer's Github username?",
        type: "input"
     },{
        name: "id",
        message: "What is your engineers's ID?",
        type: "input"
     },{
        name: "email",
        message: "What is your engineers's email?",
        type: "input"
     },{
        name: "add",
        message: "Add more team members?",
        type: "list",
        choices: ["Add More", "Finish Team"]
     }]

    let allEmployees = [];

    let userAnswersPeople;

    //prompts user to add more people or end prompts.
    async function defaultPrompt () { 
            let prompt = await inquirer.prompt(addPeople)
            .then(answers => {
                checkAnswer(answers)
             })
    }   

    //function to log inputted names
    async function displayNames  (array) {
        for(let i = 0; i < array.length; i++) {
            console.log(array[i].getName())
            console.log(array[i].constructor.name)
        }
    }

    // checks users inputs and send users new prompts based on input
   async function checkAnswer (answers) {
        if(answers.person === "Engineer") {
            let engineerPrompt = inquirer.prompt(engineerQuestions)
            .then(answers => {

                let newEngineer = new Engineer(answers.name, answers.id, answers.email, answers.github)
                allEmployees.push(newEngineer)

               if(answers.add === "Add More") {
                console.log('adding more')
                defaultPrompt();
               } else {

                displayNames(allEmployees)
                writeHTML("team", allEmployees)

               }

            })
           }
    
           if(answers.person === "Intern") {
            let internPrompt = inquirer.prompt(internQuestions)
            .then(answers => {

                let newIntern = new Intern(answers.name, answers.id, answers.email, answers.school)
                allEmployees.push(newIntern)

               if(answers.add === "Add More") {
                console.log('adding more')
                defaultPrompt();
               } else {

                displayNames(allEmployees)
                writeHTML("team", allEmployees)

               }
            })  
           }
    
           if(answers.person === "Finish Team") {
            displayNames(allEmployees)
            writeHTML("team", allEmployees)
           }
    }

  //initial prompt
  async function init  ()  {
    let userAnswers;
    let managerPrompt = await inquirer.prompt(defaultQuestions)
           .then(answers => {
            userAnswers = answers;
            let theManager = new Manager(answers.name, answers.id, answers.email, answers.office)
            allEmployees.push(theManager)
           })
       await defaultPrompt();
   
    }
        

init();
