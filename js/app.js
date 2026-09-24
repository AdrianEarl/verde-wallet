
// Dynamic greeting

const hour=new Date().getHours();

greetingText.textContent=
hour<12
? "Good Morning ☀️"
: hour<18
? "Good Afternoon 🌤️"
: "Good Evening 🌙";

// Register Service Worker

if("serviceWorker" in navigator){

window.addEventListener("load",()=>{

navigator.serviceWorker.register("./sw.js");

});

}