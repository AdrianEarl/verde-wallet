
// Dynamic greeting

const hour=new Date().getHours();

greetingText.textContent=
hour<12
? "Good Morning ☀️"
: hour<18
? "Good Afternoon 🌤️"
: "Good Evening 🌙";

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker.register("./service-worker.js")
            .then(() => console.log("Verde PWA Ready"))
            .catch(err => console.error("SW failed", err));

    });

}