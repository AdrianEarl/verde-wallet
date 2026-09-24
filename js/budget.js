
// ========================================
// VERDE WALLET - BUDGET SYSTEM
// ========================================

let MONTHLY_BUDGET = Storage.getBudget();


// ========================================
// GET CURRENT EXPENSES
// ========================================

function getTotalExpenses() {

    const transactions = Storage.getTransactions();

    return transactions
        .filter(transaction => transaction.type === "expense")
        .reduce(
            (total, transaction) =>
                total + Number(transaction.amount || 0),
            0
        );
}


// ========================================
// UPDATE BUDGET DISPLAY
// ========================================

function updateBudget(expense = getTotalExpenses()) {

    // Make sure budget is valid
    if (!Number.isFinite(MONTHLY_BUDGET) || MONTHLY_BUDGET <= 0) {
        MONTHLY_BUDGET = 5000;
        Storage.saveBudget(MONTHLY_BUDGET);
    }


    // Calculate remaining
    const remaining =
        MONTHLY_BUDGET - expense;


    // Calculate percentage
    const percent =
        MONTHLY_BUDGET > 0
            ? (expense / MONTHLY_BUDGET) * 100
            : 0;


    const safePercent =
        Math.min(Math.max(percent, 0), 100);


    // ========================================
    // MONTHLY BUDGET
    // ========================================

    const budgetAmountBig =
        document.getElementById("budgetAmountBig");

    if (budgetAmountBig) {

        budgetAmountBig.textContent =
            `₱${MONTHLY_BUDGET.toLocaleString()}`;

    }


    // ========================================
    // PROGRESS BAR
    // ========================================

    const budgetFill =
        document.getElementById("budgetFill");

    if (budgetFill) {

        budgetFill.style.width =
            `${safePercent}%`;

    }


    // ========================================
    // BUDGET USED
    // ========================================

    const budgetUsed =
        document.getElementById("budgetUsed");

    if (budgetUsed) {

        budgetUsed.textContent =
            `${Math.round(safePercent)}% Used`;

    }


    // ========================================
    // REMAINING
    // ========================================

    const budgetRemaining =
        document.getElementById("budgetRemaining");

    if (budgetRemaining) {

        budgetRemaining.textContent =
            `₱${remaining.toLocaleString()} left`;

    }


    // ========================================
    // DAILY SAFE SPEND
    // ========================================

    const dailySafeSpend =
    document.getElementById("dailySafeSpend");

        if (dailySafeSpend) {

            const now = new Date();

            const daysInMonth =
                new Date(
                    now.getFullYear(),
                    now.getMonth() + 1,
                    0
                ).getDate();

            const remainingDays =
                daysInMonth - now.getDate() + 1;

            const dailyAmount =
                remaining > 0
                    ? remaining / remainingDays
                    : 0;

            dailySafeSpend.textContent =
                `₱${Math.round(dailyAmount).toLocaleString()}/day`;

        }
    
    // ========================================
    // SMART BUDGET STATUS
    // ========================================

    const now = new Date();

    const daysInMonth =
        new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0
        ).getDate();

    const monthElapsed =
        (now.getDate() / daysInMonth) * 100;

    const budgetUsedPercent =
        safePercent;

    const statusCard =
        document.getElementById("budgetStatusCard");

    const statusTitle =
        document.getElementById("budgetStatusTitle");

    const statusText =
        document.getElementById("budgetStatusText");

    const statusMessage =
        document.getElementById("budgetStatusMessage");

    if (
        statusCard &&
        statusTitle &&
        statusText &&
        statusMessage
    ) {

        statusCard.classList.remove(
            "status-good",
            "status-warning",
            "status-danger"
        );

        if (budgetUsedPercent <= monthElapsed) {

            statusCard.classList.add("status-good");

            statusTitle.textContent = "On Track";
            statusText.textContent = "On Track";

            statusMessage.textContent =
                `You've used ${Math.round(budgetUsedPercent)}% of your budget with ${Math.round(monthElapsed)}% of the month elapsed.`;

        } else if (budgetUsedPercent <= monthElapsed + 10) {

            statusCard.classList.add("status-warning");

            statusTitle.textContent = "Watch Spending";
            statusText.textContent = "Watch Spending";

            statusMessage.textContent =
                `You're spending slightly faster than planned (${Math.round(budgetUsedPercent)}% vs ${Math.round(monthElapsed)}%).`;

        } else {

            statusCard.classList.add("status-danger");

            statusTitle.textContent = "Over Pace";
            statusText.textContent = "Over Pace";

            statusMessage.textContent =
                `You're spending significantly faster than planned (${Math.round(budgetUsedPercent)}% vs ${Math.round(monthElapsed)}%).`;

        }

    }
}


// ========================================
// EDIT MONTHLY BUDGET
// ========================================

const editBudgetBtn =
    document.getElementById("editBudgetBtn");


if (editBudgetBtn) {

    editBudgetBtn.addEventListener(
        "click",
        () => {

            // Show current budget
            const value = prompt(
                "Monthly Budget",
                MONTHLY_BUDGET
            );


            // Cancel
            if (value === null) {
                return;
            }


            // Remove commas and spaces
            const cleanValue =
                value
                    .replace(/,/g, "")
                    .trim();


            // Convert to number
            const newBudget =
                Number(cleanValue);


            // Validate
            if (
                !Number.isFinite(newBudget) ||
                newBudget <= 0
            ) {

                alert(
                    "Please enter a valid budget amount."
                );

                return;
            }


            // ========================================
            // SAVE NEW BUDGET
            // ========================================

            MONTHLY_BUDGET =
                newBudget;

            Storage.saveBudget(
                MONTHLY_BUDGET
            );


            // ========================================
            // IMMEDIATELY REFRESH BUDGET
            // ========================================

            updateBudget(
                getTotalExpenses()
            );


            // ========================================
            // DEBUG CONFIRMATION
            // ========================================

            console.log(
                "Budget updated:",
                MONTHLY_BUDGET
            );

        }
    );

}


// ========================================
// INITIAL LOAD
// ========================================

updateBudget();