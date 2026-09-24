
exportBtn.onclick=()=>{

const blob=new Blob([
JSON.stringify({
transactions:Storage.getTransactions(),
budget:Storage.getBudget(),
theme:Storage.getTheme()
},null,2)
],{type:"application/json"});

const url=URL.createObjectURL(blob);

const a=document.createElement("a");

a.href=url;
a.download="verde-wallet-backup.json";

a.click();

};

importBtn.onclick=()=>importFile.click();

importFile.onchange=e=>{

const file=e.target.files[0];

if(!file) return;

const reader=new FileReader();

reader.onload=()=>{

const data=JSON.parse(reader.result);

localStorage.setItem("verde_transactions",JSON.stringify(data.transactions||[]));
localStorage.setItem("verde_budget",data.budget||5000);
localStorage.setItem("verde_theme",data.theme||"dark");

location.reload();

};

reader.readAsText(file);

};