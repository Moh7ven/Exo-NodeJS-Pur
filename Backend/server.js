import { log } from "node:console";
import http, { get } from "node:http";
import fs from "node:fs";
import path from "node:path";

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  console.log(req.url, req.method);

  if (req.url === "/auth/register" && req.method === "POST") {
    let body = "";
    req.on("data", (data) => {
      body += data;
    });
    req.on("end", () => {
      body = JSON.parse(body);

      if (body.password !== body.cpassword) {
        res.end("le password et le cpassword ne sont pas identiques !!");
      }

      let userData = fs.readFileSync(
        path.join("assets", "Data", "users.json"),
        { encoding: "UTF-8" }
      );
      userData = JSON.parse(userData);
      let verif = userData.find((user) => user.email === body.email);
      console.log(body);
      if (verif) {
        res.end("Désolé ce utilisateur exist déjà .");
      } else {
        let oldId = userData[userData.length - 1];
        let id = oldId === undefined ? 1 : parseInt(oldId.id) + 1;
        console.log(id);
        let data = { id: id, ...body };
        console.log(data);
        userData.push(data);
        fs.writeFileSync(
          path.join("assets", "Data", "users.json"),
          JSON.stringify(userData),
          { encoding: "UTF-8" }
        );
        res.end("Inscription effectué avec succes !!!");
      }
    });
  } else if (req.url === "/auth/login" && req.method === "POST") {
    let body = "";
    req.on("data", (data) => {
      body += data;
      console.log(body);
    });
    req.on("end", () => {
      body = JSON.parse(body);
      console.log(body);

      let userData = fs.readFileSync(
        path.join("assets", "Data", "users.json"),
        { encoding: "UTF-8" }
      );
      userData = JSON.parse(userData);
      let verify = userData.find(
        (items) =>
          items.email === body.email && items.password === body.password
      );
      if (verify) {
        const { email, name } = verify;
        console.log(email, name);
        let data = {
          status: true,
          email,
          name,
          id: verify.id,
          message: "Bienvenue vous êtes maintenant connecté",
        };
        res.end(JSON.stringify(data));
      } else {
        let data = {
          status: false,
          message: "Email ou mot de passe incorrecte",
        };
        res.end(JSON.stringify(data));
      }
    });
  } else if (req.url.startsWith("/getUser") && req.method === "GET") {
    let urlRecup = req.url.split("/");
    let idRecup = parseInt(urlRecup[urlRecup.length - 1]);
    // console.log(typeof idRecup);

    let userData = fs.readFileSync(path.join("assets", "Data", "users.json"), {
      encoding: "utf-8",
    });

    userData = JSON.parse(userData);
    // console.log(userData);
    userData.find((users) => {
      if (users.id === idRecup) {
        let userTasks = fs.readFileSync(
          path.join("assets", "Data", "tasks.json"),
          {
            encoding: "utf-8",
          }
        );
        userTasks = JSON.parse(userTasks);

        let tasks = userTasks.filter((element) => {
          return JSON.parse(element.userId) === idRecup;
        });
        // console.log(tasks);

        const { name } = users;
        // console.log(name);

        res.end(JSON.stringify({ name, tasks }));
      }
    });

    // console.log("entrer ...");
  } else if (req.url === "/addTasks" && req.method === "POST") {
    let body = "";
    req.on("data", (data) => {
      body += data;
      console.log(body);
    });
    req.on("end", () => {
      body = JSON.parse(body);
      console.log(body);
      let taks = fs.readFileSync(path.join("assets", "Data", "tasks.json"), {
        encoding: "UTF-8",
      });
      // console.log(taks);

      taks = JSON.parse(taks);

      taks.push({ ...body, id: taks.length + 1 });
      fs.writeFileSync(
        path.join(
          "assets",
          "Data",
          "tasks.json"
        ) /* J'ai apporté une modification ici, il y avait users.json au lieu de tasks.json */,
        JSON.stringify(taks),
        { encoding: "UTF-8" }
      );
      res.end(JSON.stringify("Tache bien enrégistré !"));
    });
  } else if (req.url.startsWith("/deleteTasks") && req.method === "GET") {
    let urlRecup = req.url.split("/");
    let idRecup = parseInt(urlRecup[urlRecup.length - 1]);

    console.log(idRecup);
    let tasks = fs.readFileSync(path.join("assets", "Data", "tasks.json"), {
      encoding: "UTF-8",
    });

    tasks = JSON.parse(tasks).filter((element) => {
      return idRecup !== element.id;
    });

    fs.writeFileSync(
      path.join("assets", "Data", "tasks.json"),
      JSON.stringify(tasks),
      {
        encoding: "UTF-8",
      }
    );
    res.end(JSON.stringify("deleted"));
  }
});

server.listen(4000, () => {
  console.log("server running");
});
