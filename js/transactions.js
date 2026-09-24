
const icons={
Food:"restaurant",
Transport:"local_gas_station",
Bills:"receipt_long",
Shopping:"shopping_bag",
Entertainment:"stadia_controller",
Salary:"payments",
Other:"wallet"
};

let transactions=Storage.getTransactions();
let transactionType="income";

const sheet=document.getElementById("sheetOverlay");
const addBtn=document.getElementById("addBtn");

addBtn.onclick=()=>sheet.classList.remove("hidden");

document.getElementById("cancelBtn").onclick=closeSheet;

document.getElementById("incomeBtn").onclick=()=>setType("income");
document.getElementById("expenseBtn").onclick=()=>setType("expense");

function setType(type){

transactionType=type;

incomeBtn.classList.toggle("active",type==="income");
expenseBtn.classList.toggle("active",type==="expense");

}

function closeSheet(){

sheet.classList.add("hidden");

amountInput.value="";
noteInput.value="";

}

document.getElementById("saveBtn").onclick=()=>{

const amount=Number(amountInput.value);

if(!amount) return alert("Enter amount.");

transactions.unshift({
type:transactionType,
amount,
category:categoryInput.value,
note:noteInput.value,
date:Date.now()
});

Storage.saveTransactions(transactions);

renderTransactions();
updateTotals();

closeSheet();

};

document.querySelectorAll(".quick-add button").forEach(btn=>{

btn.onclick=()=>{

transactions.unshift({
type:"expense",
amount:Number(btn.dataset.amount),
category:btn.dataset.category,
note:"Quick Add",
date:Date.now()
});

Storage.saveTransactions(transactions);

renderTransactions();
updateTotals();

};

});

function formatTransactionTime(timestamp){

    const date=new Date(timestamp);
    const now=new Date();

    const today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
    const yesterday=new Date(today);

    yesterday.setDate(today.getDate()-1);

    const target=new Date(date.getFullYear(),date.getMonth(),date.getDate());

    const time=date.toLocaleTimeString([],{
    hour:"numeric",
    minute:"2-digit"
    });

    if(target.getTime()===today.getTime()){

    return `Today • ${time}`;

    }

    if(target.getTime()===yesterday.getTime()){

    return `Yesterday • ${time}`;

    }

    return date.toLocaleDateString([],{
    month:"short",
    day:"numeric"
    })+" • "+time;

}

function renderTransactions(){

transactionList.innerHTML="";

if(!transactions.length){

transactionList.innerHTML=`<li class="empty-state">
<span class="material-symbols-rounded empty-icon">wallet</span>
<p>No transactions yet.</p>
</li>`;

return;

}

transactions.forEach((t,index)=>{

const li=document.createElement("li");

li.innerHTML=`
<div class="transaction-row">

<div class="transaction-left">

<div class="icon-circle">

<span class="material-symbols-rounded">
${icons[t.category]||"wallet"}
</span>

</div>

<div>

<div class="category-name">${t.category}</div>
<div class="transaction-note">${t.note||"No note"}</div>
<div class="transaction-time">${formatTransactionTime(t.date)}</div>

</div>

</div>

<div class="transaction-right">

<strong class="${t.type==="income"?"amount-income":"amount-expense"}">
${t.type==="income"?"+":"-"}₱${t.amount.toFixed(2)}
</strong>

<button class="delete-btn">🗑️</button>

</div>

</div>
`;

li.querySelector(".delete-btn").onclick=()=>{

    if(!confirm("Delete this transaction?")) return;

    transactions.splice(index,1);

    Storage.saveTransactions(transactions);

    renderTransactions();
    updateTotals();

};

transactionList.appendChild(li);

});

}

window.updateTotals=function(){

const income=transactions.filter(t=>t.type==="income").reduce((a,b)=>a+b.amount,0);
const expense=transactions.filter(t=>t.type==="expense").reduce((a,b)=>a+b.amount,0);

balance.textContent=`₱${(income-expense).toFixed(2)}`;
incomeTotal.textContent=`₱${income.toFixed(2)}`;
expenseTotal.textContent=`₱${expense.toFixed(2)}`;

updateBudget(expense);

topCategory.textContent=getTopCategory();

totalExpenseAnalytics.textContent=`₱${expense.toFixed(2)}`;

updateAnalytics();

};

function getTopCategory(){

const sums={};

transactions.filter(t=>t.type==="expense").forEach(t=>{

sums[t.category]=(sums[t.category]||0)+t.amount;

});

return Object.keys(sums).sort((a,b)=>sums[b]-sums[a])[0]||"None";

}

function updateExpenseChart(){

const cats=["Food","Transport","Bills","Shopping","Entertainment","Other"];

expenseChart.data.datasets[0].data=cats.map(cat=>
transactions
.filter(t=>t.type==="expense"&&t.category===cat)
.reduce((a,b)=>a+b.amount,0)
);

expenseChart.update();

}

renderTransactions();
updateTotals();