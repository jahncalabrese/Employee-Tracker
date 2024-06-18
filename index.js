const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./db");

init();

// Display logo text, load main prompts
function init() {
  const logoText = logo({ name: "Employee Manager" }).render();
  console.log(logoText);
  loadMainPrompts();
}

function loadMainPrompts() {
  prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        { name: "View All Employees", value: "VIEW_EMPLOYEES" },
        { name: "View All Employees By Department", value: "VIEW_EMPLOYEES_BY_DEPARTMENT" },
        { name: "View All Employees By Manager", value: "VIEW_EMPLOYEES_BY_MANAGER" },
        { name: "Add Employee", value: "ADD_EMPLOYEE" },
        { name: "Remove Employee", value: "REMOVE_EMPLOYEE" },
        { name: "Update Employee Role", value: "UPDATE_EMPLOYEE_ROLE" },
        { name: "Update Employee Manager", value: "UPDATE_EMPLOYEE_MANAGER" },
        { name: "View All Roles", value: "VIEW_ROLES" },
        { name: "Add Role", value: "ADD_ROLE" },
        { name: "Remove Role", value: "REMOVE_ROLE" },
        { name: "View All Departments", value: "VIEW_DEPARTMENTS" },
        { name: "Add Department", value: "ADD_DEPARTMENT" },
        { name: "Remove Department", value: "REMOVE_DEPARTMENT" },
        { name: "View Total Utilized Budget By Department", value: "VIEW_UTILIZED_BUDGET_BY_DEPARTMENT" },
        { name: "Quit", value: "QUIT" }
      ]
    }
  ])
  .then(res => {
    let choice = res.choice;
    switch (choice) {
      case "VIEW_EMPLOYEES": viewEmployees(); break;
      case "VIEW_EMPLOYEES_BY_DEPARTMENT": viewEmployeesByDepartment(); break;
      case "VIEW_EMPLOYEES_BY_MANAGER": viewEmployeesByManager(); break;
      case "ADD_EMPLOYEE": addEmployee(); break;
      case "REMOVE_EMPLOYEE": removeEmployee(); break;
      case "UPDATE_EMPLOYEE_ROLE": updateEmployeeRole(); break;
      case "UPDATE_EMPLOYEE_MANAGER": updateEmployeeManager(); break;
      case "VIEW_DEPARTMENTS": viewDepartments(); break;
      case "ADD_DEPARTMENT": addDepartment(); break;
      case "REMOVE_DEPARTMENT": removeDepartment(); break;
      case "VIEW_UTILIZED_BUDGET_BY_DEPARTMENT": viewUtilizedBudgetByDepartment(); break;
      case "VIEW_ROLES": viewRoles(); break;
      case "ADD_ROLE": addRole(); break;
      case "REMOVE_ROLE": removeRole(); break;
      default: quit();
    }
  })
  .catch(err => {
    console.error("Error during prompts: ", err);
  });
}

function viewEmployees() {
  db.findAllEmployees()
    .then(([rows]) => {
      console.log("\n");
      console.table(rows);
    })
    .then(() => loadMainPrompts())
    .catch(err => console.error("Error fetching employees: ", err));
}

function viewEmployeesByDepartment() {
  db.findAllDepartments()
    .then(([rows]) => {
      const departmentChoices = rows.map(({ id, name }) => ({ name, value: id }));
      return prompt([
        { type: "list", name: "departmentId", message: "Which department?", choices: departmentChoices }
      ]);
    })
    .then(res => db.findAllEmployeesByDepartment(res.departmentId))
    .then(([rows]) => {
      console.log("\n");
      console.table(rows);
    })
    .then(() => loadMainPrompts())
    .catch(err => console.error("Error fetching employees by department: ", err));
}

function viewEmployeesByManager() {
  db.findAllEmployees()
    .then(([rows]) => {
      const managerChoices = rows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
      return prompt([
        { type: "list", name: "managerId", message: "Which manager?", choices: managerChoices }
      ]);
    })
    .then(res => db.findAllEmployeesByManager(res.managerId))
    .then(([rows]) => {
      console.log("\n");
      if (rows.length === 0) console.log("The selected employee has no direct reports");
      else console.table(rows);
    })
    .then(() => loadMainPrompts())
    .catch(err => console.error("Error fetching employees by manager: ", err));
}

// ... (add error handling to remaining functions similarly)

function quit() {
  console.log("Goodbye!");
  process.exit();
}
