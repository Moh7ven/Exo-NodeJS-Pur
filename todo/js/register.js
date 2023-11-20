let formulaire = document.getElementsByTagName("form")[0];
console.log(formulaire);
formulaire.addEventListener("submit", async (e) => {
  e.preventDefault();
  let input = document.querySelectorAll("input");
  console.log(input);
  let monObjet = {};
  console.log(monObjet);
  input.forEach((element, indice) => {
    console.log(element.name, element.value);
    monObjet[element.name] = element.value;
  });

  let message = document.querySelector(".alerte");

  if (monObjet.password !== monObjet.cpassword) {
    return (message.textContent =
      "Désolé le password et le cpassword ne sont pas les mêmes");
  }
  console.log(monObjet);

  const sendData = await fetch("http://localhost:4000/auth/register", {
    method: "POST",
    body: JSON.stringify(monObjet),
  })
    .then((res) => res.text())
    .then((data) => {
      message.textContent = data;
      if (data === "Inscription effectué avec succes !!!") {
        setTimeout(() =>{
          window.location.href = "./index.html";
        },[5000])
       
      }
    })
    .catch((erreur) => {                     
      console.log(erreur);
    });
});
