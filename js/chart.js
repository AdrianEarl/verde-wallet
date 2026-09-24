/* =========================================
   VERDE WALLET
   ANALYTICS ENGINE
========================================= */


/* =========================================
   CENTER TEXT PLUGIN
========================================= */

const centerTextPlugin = {

    id: "centerText",

    afterDraw(chart) {

        if (chart.canvas.id !== "expenseChart") {
            return;
        }

        const dataset =
            chart.data.datasets[0];

        const total =
            dataset.data.reduce(
                (a, b) => a + Number(b || 0),
                0
            );

        const { ctx } = chart;

        ctx.save();

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillStyle =
            document.body.classList.contains("light")
                ? "#1b2b1f"
                : "#fff";

        ctx.font =
            "bold 26px Arial";

        ctx.fillText(
            `₱${total.toLocaleString(
                undefined,
                {
                    maximumFractionDigits: 0
                }
            )}`,
            chart.width / 2,
            chart.height / 2
        );

        ctx.restore();

    }

};

Chart.register(centerTextPlugin);


/* =========================================
   CATEGORY LIST
========================================= */

const analyticsCategories = [
    "Food",
    "Transport",
    "Bills",
    "Shopping",
    "Entertainment",
    "Other"
];


/* =========================================
   HELPER
========================================= */

function getAnalyticsTransactions() {

    return Storage
        .getTransactions()
        .filter(
            transaction =>
                transaction.type === "expense"
        );

}


/* =========================================
   CURRENT MONTH TRANSACTIONS
========================================= */

function getCurrentMonthExpenses() {

    const now = new Date();

    const currentMonth =
        now.getMonth();

    const currentYear =
        now.getFullYear();

    return getAnalyticsTransactions()
        .filter(transaction => {

            const date =
                new Date(transaction.date);

            return (
                date.getMonth() === currentMonth &&
                date.getFullYear() === currentYear
            );

        });

}


/* =========================================
   MONTHLY TOTAL
========================================= */

function getMonthlyExpenseTotal() {

    return getCurrentMonthExpenses()
        .reduce(
            (total, transaction) =>
                total +
                Number(transaction.amount || 0),
            0
        );

}


/* =========================================
   EXPENSE COUNT
========================================= */

function getMonthlyExpenseCount() {

    return getCurrentMonthExpenses()
        .length;

}


/* =========================================
   AVERAGE DAILY SPENDING
========================================= */

function getAverageDailySpending() {

    const expenses =
        getCurrentMonthExpenses();

    if (!expenses.length) {
        return 0;
    }

    const now = new Date();

    const currentDay =
        now.getDate();

    const total =
        expenses.reduce(
            (sum, transaction) =>
                sum +
                Number(transaction.amount || 0),
            0
        );

    return total / currentDay;

}


/* =========================================
   CATEGORY TOTALS
========================================= */

function getCategoryTotals() {

    const totals = {};

    analyticsCategories.forEach(
        category => {
            totals[category] = 0;
        }
    );

    getCurrentMonthExpenses()
        .forEach(transaction => {

            const category =
                analyticsCategories.includes(
                    transaction.category
                )
                    ? transaction.category
                    : "Other";

            totals[category] +=
                Number(transaction.amount || 0);

        });

    return totals;

}


/* =========================================
   TOP CATEGORY
========================================= */

function getAnalyticsTopCategory() {

    const totals =
        getCategoryTotals();

    let topCategory = "None";
    let highest = 0;

    Object.keys(totals)
        .forEach(category => {

            if (totals[category] > highest) {

                highest =
                    totals[category];

                topCategory =
                    category;

            }

        });

    return {
        category: topCategory,
        amount: highest
    };

}


/* =========================================
   CURRENT WEEK RANGE
========================================= */

function getStartOfWeek(date) {

    const result =
        new Date(date);

    const day =
        result.getDay();

    const difference =
        day === 0
            ? -6
            : 1 - day;

    result.setDate(
        result.getDate() + difference
    );

    result.setHours(
        0,
        0,
        0,
        0
    );

    return result;

}


/* =========================================
   WEEKLY SPENDING
========================================= */

function getWeeklySpending() {

    const now =
        new Date();

    const startOfWeek =
        getStartOfWeek(now);

    const dailyTotals =
        [
            0,
            0,
            0,
            0,
            0,
            0,
            0
        ];

    getAnalyticsTransactions()
        .forEach(transaction => {

            const transactionDate =
                new Date(transaction.date);

            transactionDate.setHours(
                0,
                0,
                0,
                0
            );

            const difference =
                Math.floor(
                    (
                        transactionDate -
                        startOfWeek
                    ) /
                    86400000
                );

            if (
                difference >= 0 &&
                difference <= 6
            ) {

                dailyTotals[difference] +=
                    Number(
                        transaction.amount || 0
                    );

            }

        });

    return dailyTotals;

}


/* =========================================
   CREATE EXPENSE DOUGHNUT
========================================= */

window.expenseChart = new Chart(

    document.getElementById(
        "expenseChart"
    ),

    {

        type: "doughnut",

        data: {

            labels:
                analyticsCategories,

            datasets: [

                {

                    data:
                        [
                            0,
                            0,
                            0,
                            0,
                            0,
                            0
                        ],

                    backgroundColor:
                        [
                            "#2ECC71",
                            "#3498DB",
                            "#F39C12",
                            "#E74C3C",
                            "#9B59B6",
                            "#1ABC9C"
                        ],

                    borderWidth: 0,

                    cutout: "70%"

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    display: false

                }

            }

        }

    }

);


/* =========================================
   CREATE WEEKLY CHART
========================================= */

window.weeklyChart = new Chart(

    document.getElementById(
        "weeklyChart"
    ),

    {

        type: "line",

        data: {

            labels:
                [
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                    "Sun"
                ],

            datasets: [

                {

                    label: "Spent",

                    data:
                        [
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0
                        ],

                    tension: 0.35,

                    fill: true

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            interaction: {

                intersect: false,

                mode: "index"

            },

            plugins: {

                legend: {

                    display: false

                }

            },

            scales: {

                y: {

                    beginAtZero: true,

                    ticks: {

                        callback: value =>
                            `₱${Number(value)
                                .toLocaleString()}`

                    }

                }

            }

        }

    }

);


/* =========================================
   UPDATE EXPENSE CHART
========================================= */

function updateExpenseChart() {

    const totals =
        getCategoryTotals();

    expenseChart
        .data
        .datasets[0]
        .data =
            analyticsCategories.map(
                category =>
                    totals[category]
            );

    expenseChart.update();

}


/* =========================================
   UPDATE WEEKLY CHART
========================================= */

function updateWeeklyChart() {

    const weeklyData =
        getWeeklySpending();

    weeklyChart
        .data
        .datasets[0]
        .data =
            weeklyData;

    weeklyChart.update();

}


/* =========================================
   UPDATE ANALYTICS SUMMARY
========================================= */

function updateAnalyticsSummary() {

    const total =
        getMonthlyExpenseTotal();

    const count =
        getMonthlyExpenseCount();

    const average =
        getAverageDailySpending();

    const top =
        getAnalyticsTopCategory();


    /* TOTAL EXPENSE */

    const totalExpense =
        document.getElementById(
            "totalExpenseAnalytics"
        );

    if (totalExpense) {

        totalExpense.textContent =
            `₱${total.toLocaleString(
                undefined,
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            )}`;

    }


    /* TOP CATEGORY */

    const topCategory =
        document.getElementById(
            "topCategory"
        );

    if (topCategory) {

        topCategory.textContent =
            top.category;

    }


    /* EXPENSE COUNT */

    const expenseCount =
        document.getElementById(
            "expenseCount"
        );

    if (expenseCount) {

        expenseCount.textContent =
            count;

    }


    /* AVERAGE DAILY */

    const averageDaily =
        document.getElementById(
            "averageDailySpending"
        );

    if (averageDaily) {

        averageDaily.textContent =
            `₱${average.toLocaleString(
                undefined,
                {
                    maximumFractionDigits: 0
                }
            )}`;

    }

}


/* =========================================
   UPDATE CATEGORY BREAKDOWN
========================================= */

function updateCategoryBreakdown() {

    const container =
        document.getElementById(
            "analyticsCategoryList"
        );

    if (!container) {
        return;
    }

    const totals =
        getCategoryTotals();

    const total =
        getMonthlyExpenseTotal();

    container.innerHTML = "";

    analyticsCategories
        .forEach(category => {

            const amount =
                totals[category];

            const percentage =
                total > 0
                    ? (amount / total) * 100
                    : 0;


            const item =
                document.createElement("div");

            item.className =
                "analytics-category";


            item.innerHTML = `

                <div class="analytics-category-header">

                    <span>
                        ${category}
                    </span>

                    <strong>
                        ₱${amount.toLocaleString(
                            undefined,
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }
                        )}
                    </strong>

                </div>

                <div class="analytics-category-bar">

                    <div
                        class="analytics-category-fill"
                        style="width:${percentage}%"
                    ></div>

                </div>

                <small>
                    ${percentage.toFixed(1)}%
                </small>

            `;

            container.appendChild(item);

        });

}


/* =========================================
   UPDATE INSIGHTS
========================================= */

function updateAnalyticsInsights() {

    const total =
        getMonthlyExpenseTotal();

    const average =
        getAverageDailySpending();

    const top =
        getAnalyticsTopCategory();

    const weekly =
        getWeeklySpending();


    /* TOP CATEGORY INSIGHT */

    const topInsight =
        document.getElementById(
            "topCategoryInsight"
        );

    if (topInsight) {

        if (top.category === "None") {

            topInsight.textContent =
                "No spending data yet.";

        } else {

            topInsight.textContent =
                `${top.category} is your biggest expense at ₱${top.amount.toLocaleString(
                    undefined,
                    {
                        maximumFractionDigits: 0
                    }
                )}.`;

        }

    }


    /* AVERAGE INSIGHT */

    const averageInsight =
        document.getElementById(
            "averageInsight"
        );

    if (averageInsight) {

        averageInsight.textContent =
            total > 0
                ? `You're averaging ₱${average.toLocaleString(
                    undefined,
                    {
                        maximumFractionDigits: 0
                    }
                )} per day this month.`
                : "No spending data yet.";

    }


    /* HIGHEST DAY */

    const highestDay =
        document.getElementById(
            "highestSpendingDay"
        );

    if (highestDay) {

        const labels =
            [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
            ];

        const highest =
            Math.max(...weekly);

        const index =
            weekly.indexOf(highest);

        highestDay.textContent =
            highest > 0
                ? `${labels[index]} was your highest spending day at ₱${highest.toLocaleString(
                    undefined,
                    {
                        maximumFractionDigits: 0
                    }
                )}.`
                : "No spending recorded this week.";

    }

}


/* =========================================
   MASTER ANALYTICS UPDATE
========================================= */

window.updateAnalytics = function() {

    updateExpenseChart();

    updateWeeklyChart();

    updateAnalyticsSummary();

    updateCategoryBreakdown();

    updateAnalyticsInsights();

};


/* =========================================
   INITIAL LOAD
========================================= */

updateAnalytics();