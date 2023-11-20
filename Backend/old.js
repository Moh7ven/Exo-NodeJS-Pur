import { log } from "node:console";
import http, { get } from "node:http";
import fs from "node:fs";

//Definir notre objet data
const data = {
  users: ["marie", "constance", "grâce", "dosso"],
  taches: {
    marie: ["coder", "manger", "cuisiner"],
    constance: ["dormir", "laver", "coiffer"],
    grâce: ["servir", "danser", "bouger"],
  },
};

// transformer nos elements en objet
function parString(chaine) {
  let monObjet = {};
  let decoup = chaine.split("&");
  console.log(decoup);
  for (let i = 0; i < decoup.length; i++) {
    console.log(decoup[i]);
    let element = decoup[i].split("=");
    console.log(element);
    monObjet[element[0]] = element[1];
    console.log(monObjet);
  }
  return monObjet;
}

//
const server = http.createServer((req, res) => {
  console.log(req.url);

  if (req.url === "/" && req.method === "GET") {
    fs.readFile("./index.html", "utf-8", (err, data) => {
      if (!err) {
        res.setHeader("content-type", "text/html");
        res.end(data);
      }
    });
    // on revoie les utilisateur apres les avoir transformés en chaine de caractère
  } else if (req.url === "/users" && req.method === "GET") {
    res.end(data.users.toString());
    // On renvoie les taches de l'utilisateur après avoir vérifié que l'utilisateur existe sinon on signifine que cet utilisateur n'existe pas
  } else if (req.url.startsWith("/taches") && req.url.split("/").length === 3 && req.method === "GET") {
    let result = req.url.split("/");
    let dernierelem = result[result.length - 1];
    let isCheck = data.users.includes(dernierelem);
    if (isCheck === false) {
      res.end("Not Found, ce utilisateur n'exixte pas !");
    } else {
      let tasks = data.taches[dernierelem];
      res.end(tasks ? tasks.toString() : "user n'as pas de taches !!!");
    }
    // On renvoie les informations reçu par le client
  } else if (req.url === "/addUser" && req.method === "POST") {
    res.setHeader("content-type", "application/json");
    let body = "";
    req.on("data", (check) => {
      body += check;
    });
    req.on("end", () => {
      body = parString(body);
      data.users = [...data.users, body.name];
      data.taches[body.name] = body.taches.split("-");
      res.end(data.taches[body.name].toString());
    });
   
  } else if (req.url.startsWith("/static") && req.method === "GET") {
    let receive = req.url.split("/");
    let dernierIndice = receive[receive.length - 1];
    let extension =
      dernierIndice.split(".")[dernierIndice.split(".").length - 1];
    //let path = `./assets/${dernierIndice}`;
    const path = "."+ req.url.replace("static", "assets");
    let isExist = fs.existsSync(path);
    console.log(dernierIndice, extension, path, isExist);
    console.log(receive);

    if (isExist) {
      let data = fs.readFileSync(path);
      console.log(data);
      res.end(data);
    } else {
      res.end(null);
    }
  } else {
    console.log("ok");
    res.end("ok");
  }
});
server.listen(4000, () => {
  console.log("server running");
});
