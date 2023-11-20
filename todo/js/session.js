document.addEventListener('DOMContentLoaded',()=>{
    let getLocalSt = localStorage.getItem("session");
    let passName = location.href;
    console.log(getLocalSt,passName);
    if (getLocalSt && (passName.endsWith("index.html") || passName.endsWith("register.html"))) {
        location.href = "./dashboard.html";
    }
    else if(!getLocalSt && passName.endsWith("dashboard.html")){
        location.href = "./index.html";
    }
});