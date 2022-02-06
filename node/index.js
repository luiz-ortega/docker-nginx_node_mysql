const mysql = require("mysql2/promise");
const express = require("express");
const { faker } = require("@faker-js/faker");

const app = express();
const port = 3000;

const config = {
  host: "db",
  user: "root",
  password: "root",
  database: "nodedb",
};

async function insertPeople() {
  const connection = await mysql.createConnection(config);
  const randomName = faker.name.findName();
  const sql = `INSERT INTO people(name) values("${randomName}")`;
  connection.query(sql);
  connection.end();
}

async function getPeoples() {
  const connection = await mysql.createConnection(config);
  const sql = `SELECT * FROM people`;
  const [rows] = await connection.execute(sql);
  connection.end();
  return rows;
}

app.get("/", async (req, res) => {
  try {
    await insertPeople();
    const peoples = await getPeoples();

    const peoplesList = peoples
      .map((people) => `<li>${people.name}</li>`)
      .join("");
    const header = "<h1>Full Cycle Rocks!</h1>";

    const html = `${header} <ul>${peoplesList}</ul>`;
    res.send(html);
  } catch (error) {
    throw new Error(error);
  }
});

app.listen(port, () => {
  console.log("Running on " + port);
});
