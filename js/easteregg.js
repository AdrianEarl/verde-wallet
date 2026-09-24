
let taps=0;

logoTitle.onclick=()=>{

taps++;

if(taps<7) return;

taps=0;

alert(`🫡 AEGIS Developer Mode

Commander Online.

Transactions: ${Storage.getTransactions().length}

Theme: ${Storage.getTheme()}

Budget: ₱${Storage.getBudget()}

Status: All systems green.
`);

};