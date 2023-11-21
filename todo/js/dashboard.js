let loader = document.querySelector(".loader");
let noTasks = document.querySelector("#noTasks");
const userData = null;
const today = new Date();
let input = document.querySelector("input");
let addTasks = document.querySelector(".addTasks");

function fetchApi(url, method, options) {
  let baseUrl = "http://localhost:4000";
  return new Promise(async (next) => {
    let res = await fetch(baseUrl + url, { method, ...options });
    // console.log(res);

    res = await res.json();
    console.log(res);
    next(res);
  });
}

function deconnexion() {
  /* Function pour faire la deconnexion */
  let decoButton = document.querySelector(".deconnect");

  decoButton.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.clear("session");
    window.location.href = "./index.html";
  });
}

function formatDay() {
  /* Function pour mettre les jours en format français */
  let jour = today.getDay();
  switch (jour) {
    case 1:
      jour = "Lundi";
      break;
    case 2:
      jour = "Mardi";
      break;
    case 3:
      jour = "Mercredi";
      break;
    case 4:
      jour = "Jeudi";
      break;
    case 5:
      jour = "Vendredi";
      break;
    case 6:
      jour = "Samedi";
      break;
    case 7:
      jour = "Dimanche";
      break;
    default:
      jour = today.getDay();
      break;
  }
  return jour;
}

function formatMonth() {
  /* Function pour mettre les mois en format français */
  let mois = today.getMonth() + 1;
  switch (mois) {
    case 1:
      mois = "janvier";
      break;
    case 2:
      mois = "fevrier";
      break;
    case 3:
      mois = "mars";
      break;
    case 4:
      mois = "avril";
      break;
    case 5:
      mois = "mai";
      break;
    case 6:
      mois = "juin";
      break;
    case 7:
      mois = "juillet";
      break;
    case 8:
      mois = "aout";
      break;
    case 9:
      mois = "septembre";
      break;
    case 10:
      mois = "octobre";
      break;
    case 11:
      mois = "novembre";
      break;
    case 12:
      mois = "decembre";
      break;
    default:
      mois = today.getMonth() + 1;
      break;
  }
  return mois;
}

/* Variable pour mettre la date sous un format français */
const date = `${formatDay()} ${today.getDate()} ${formatMonth()} ${today.getFullYear()}`;

console.log(date);

async function deleteTasks(index, event) {
  await fetchApi(`/deleteTasks/${index}`, "GET");
  let tr = event.target.parentElement.parentElement;
  console.log(tr);
  document.querySelector("tbody").removeChild(tr);
}

window.addEventListener("DOMContentLoaded", async () => {
  let req = await fetchApi(
    `/getUser/${localStorage.getItem("session")}`,
    "GET"
  );

  console.log(req);

  /* Ici je verifie si l'utilisateur n'a aucune tache alors je lui affiche un message */
  if (req.tasks.length === 0) {
    noTasks.textContent = "Aucune tâche ajoutée pour l'instant.";
  }

  addTasks.addEventListener("submit", async (e) => {
    e.preventDefault();
    let dataTasks = {
      userId: localStorage.getItem("session"),
      title: input.value,
      date: date,
      status: "in progress...",
    };
    console.log(dataTasks);

    document.querySelector("#tasksTable").innerHTML += `
    <tr>
    <td class="title">
      ${dataTasks.title}
    </td>
    <td>${dataTasks.date}</td>
    <td class="status">${dataTasks.status}</td>
    <td class="actions">
      <button><i class="fa fa-edit"></i> edit</button>
      <button><i class="fa fa-check"></i> done</button>
      <button onclick="deleteTasks(${dataTasks.id}, event)"><i class="fa fa-trash"></i> delete</button>
    </td>
  </tr>

    `;
    await fetchApi("/addTasks", "POST", {
      body: JSON.stringify(dataTasks),
    });
  });

  /* Ici je recupère toutes ces tâches */
  let html = "";
  req.tasks.forEach((element) => {
    html += `
    <tr>
    <td class="title">
      ${element.title}
    </td>
    <td>${element.date}</td>
    <td class="status">${element.status}</td>
    <td class="actions">
      <button><i class="fa fa-edit"></i> edit</button>
      <button><i class="fa fa-check"></i> done</button>
      <button onclick="deleteTasks(${element.id}, event)"><i class="fa fa-trash"></i> delete</button>
    </td>
  </tr>
    `;
  });
  /* Ici, j'affiche ces taches sur son dashboard */
  document.querySelector("#tasksTable").innerHTML = html;

  document.querySelector("#username").innerText = req.name;
  loader.style.display = "none";

  deconnexion();
});
