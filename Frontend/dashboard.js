/* =========================================
   AUTH PROTECTION
========================================= */

const token =
localStorage.getItem("token");

if(!token){

    window.location.href =
    "login.html";
}


/* =========================================
   USER DATA
========================================= */

const user =
JSON.parse(
    localStorage.getItem("user")
);

if(user){

    document.getElementById(
        "userName"
    ).innerText =
    user.name;

    document.getElementById(
        "welcomeName"
    ).innerText =
    user.name;

    document.getElementById(
        "profileAvatar"
    ).src =

    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=00ffc3&color=041019`;
}


/* =========================================
   DYNAMIC GREETING
========================================= */

const hour =
new Date().getHours();

let greeting =
"Hello";

if(hour < 12){

    greeting =
    "Good Morning ☀️";
}

else if(hour < 17){

    greeting =
    "Good Afternoon 🌤";
}

else{

    greeting =
    "Good Evening 🌙";
}

document.getElementById(
    "greetingText"
).innerHTML =

`${greeting}
<span id="userName">
${user ? user.name : "User"}
</span>`;


/* =========================================
   TARGET COMPANY TRACKER
========================================= */

const companySelect =
document.getElementById(
    "companySelect"
);

const otherCompany =
document.getElementById(
    "otherCompany"
);

const saveCompany =
document.getElementById(
    "saveCompany"
);

const currentCompany =
document.getElementById(
    "currentCompany"
);


/* LOAD COMPANY */

const savedCompany =
localStorage.getItem(
    "targetCompany"
);

if(savedCompany){

    currentCompany.innerText =
    savedCompany;
}


/* SHOW OTHER INPUT */

companySelect.addEventListener(

    "change",

    ()=>{

        if(
            companySelect.value ===
            "Other"
        ){

            otherCompany.style.display =
            "block";
        }

        else{

            otherCompany.style.display =
            "none";
        }
    }
);


/* SAVE COMPANY */

saveCompany.addEventListener(

    "click",

    ()=>{

        let selected =
        companySelect.value;

        if(
            selected ===
            "Other"
        ){

            selected =
            otherCompany.value.trim();
        }

        if(!selected){

            alert(
                "Please select a company"
            );

            return;
        }

        localStorage.setItem(

            "targetCompany",

            selected
        );

        currentCompany.innerText =
        selected;

        alert(
            "🎯 Target Company Updated!"
        );
    }
);


/* =========================================
   STREAK TRACKER
========================================= */

const modal =
document.getElementById(
    "trackerModal"
);

const openTracker =
document.getElementById(
    "openTracker"
);

if(openTracker){

    openTracker.onclick = ()=>{

        modal.style.display =
        "flex";
    };
}


/* =========================================
   SHOW EXTRA QUESTIONS
========================================= */

document.getElementById(
    "studiedToday"
).addEventListener(

    "change",

    function(){

        if(
            this.value ===
            "yes"
        ){

            document.getElementById(
                "extraQuestions"
            ).style.display =
            "block";
        }

        else{

            document.getElementById(
                "extraQuestions"
            ).style.display =
            "none";
        }
    }
);


/* =========================================
   SAVE PROGRESS
========================================= */

document.getElementById(
    "saveProgress"
).addEventListener(

    "click",

    ()=>{

        const studied =
        document.getElementById(
            "studiedToday"
        ).value;

        if(studied === ""){

            alert(
                "Please answer Question 1"
            );

            return;
        }

        if(studied === "no"){

            modal.style.display =
            "none";

            alert(
                "Tomorrow is another opportunity 💪"
            );

            return;
        }


        const topic =
        document.getElementById(
            "topic"
        ).value.trim();

        const time =
        document.getElementById(
            "timeSpent"
        ).value.trim();

        const rating =
        document.getElementById(
            "rating"
        ).value;


        if(!topic || !time){

            alert(
                "Please fill all fields"
            );

            return;
        }


        const today =
        new Date()
        .toISOString()
        .split("T")[0];


        let history =
        JSON.parse(

            localStorage.getItem(
                "dsaHistory"
            )

        ) || [];


        const alreadyUpdated =
        history.find(

            item =>

            item.date === today
        );


        if(alreadyUpdated){

            alert(

                "You already updated today's progress ✅"
            );

            return;
        }


        history.push({

            date:today,

            topic,

            time,

            rating
        });


        localStorage.setItem(

            "dsaHistory",

            JSON.stringify(history)
        );


        updateStreak();

        renderHistory();


        modal.style.display =
        "none";


        document.getElementById(
            "studiedToday"
        ).value = "";

        document.getElementById(
            "topic"
        ).value = "";

        document.getElementById(
            "timeSpent"
        ).value = "";

        document.getElementById(
            "rating"
        ).value = "5";


        alert(
            "🔥 Progress Updated Successfully!"
        );
    }
);


/* =========================================
   UPDATE STREAK
========================================= */

function updateStreak(){

    let history =

    JSON.parse(

        localStorage.getItem(
            "dsaHistory"
        )

    ) || [];


    history.sort(

        (a,b)=>

        new Date(a.date)
        -
        new Date(b.date)
    );


    let streak = 0;


    for(

        let i =
        history.length-1;

        i>=0;

        i--

    ){

        let current =
        new Date(
            history[i].date
        );

        let expected =
        new Date();

        expected.setDate(

            expected.getDate()
            -
            streak
        );


        if(

            current.toDateString()

            ===

            expected.toDateString()

        ){

            streak++;
        }

        else{

            break;
        }
    }


    document.getElementById(
        "streakCount"
    ).innerText =

    `${streak} 🔥`;
}


/* =========================================
   HISTORY
========================================= */

function renderHistory(){

    const history =

    JSON.parse(

        localStorage.getItem(
            "dsaHistory"
        )

    ) || [];


    document.getElementById(
        "historyCount"
    ).innerText =

    `${history.length} Days`;


    const container =

    document.getElementById(
        "historyContainer"
    );

    container.innerHTML = "";


    history
    .slice()
    .reverse()
    .forEach(day=>{

        container.innerHTML +=

        `
        <div class="history-card">

            <h4>
                📅 ${day.date}
            </h4>

            <p>
                📚 Topic:
                <strong>${day.topic}</strong>
            </p>

            <p>
                ⏱ Study Time:
                <strong>${day.time}</strong>
            </p>

            <p>
                ⭐ Productivity:
                <strong>${day.rating}/5</strong>
            </p>

        </div>
        `;
    });
}

/* =========================================
   INITIAL LOAD
========================================= */

updateStreak();

renderHistory();


/* =========================================
   CLOSE MODAL
========================================= */

window.addEventListener(

    "click",

    (e)=>{

        if(
            e.target === modal
        ){

            modal.style.display =
            "none";
        }
    }
);
/* =========================================
   HISTORY TOGGLE
========================================= */

let historyOpen = false;

toggleHistory.addEventListener(

    "click",

    ()=>{

        historyOpen = !historyOpen;

        if(historyOpen){

            historyWrapper.style.maxHeight =
            "500px";

            historyWrapper.style.opacity =
            "1";

            document.getElementById(
                "historyArrow"
            ).innerHTML = "▼";
        }

        else{

            historyWrapper.style.maxHeight =
            "0";

            historyWrapper.style.opacity =
            "0";

            document.getElementById(
                "historyArrow"
            ).innerHTML = "➜";
        }
    }
);

/* =========================================
   ALGOBOT TIPS
========================================= */

const tips = [

"🚀 Ready to crack dream company today?",

"🔥 Consistency beats talent every time.",

"💡 Solve one extra problem today.",

"⚡ Revision is where placements are won.",

"🎯 Focus on patterns, not solutions.",

"🏆 Future SDE loading...",

"📚 Arrays + Binary Search = Interview Gold.",

"🤖 Don't break your streak today!"
];


const botText =
document.getElementById(
"botText"
);

let tipIndex = 0;


setInterval(()=>{

    tipIndex++;

    if(tipIndex >= tips.length){

        tipIndex = 0;
    }

    botText.innerText =
    tips[tipIndex];

},4000);

const streak =
parseInt(
document.getElementById(
"streakCount"
).innerText
) || 0;

if(streak >= 30){

    botText.innerText =
    "🏆 Legendary Streak! FAANG is waiting.";
}

else if(streak >= 10){

    botText.innerText =
    "🔥 Amazing consistency. Keep going!";
}

else{

    botText.innerText =
    "🚀 Start your streak journey today!";
}

/* =========================================
   READINESS SCORE
========================================= */

const readinessModal =
document.getElementById(
"readinessModal"
);

document.getElementById(
"updateReadinessBtn"
).addEventListener(

"click",

()=>{

    const today =
    new Date()
    .toISOString()
    .split("T")[0];

    const lastUpdate =

    localStorage.getItem(
    "readinessDate"
    );

    if(lastUpdate === today){

        alert(
        "🎯 Today's readiness has already been updated."
        );

        return;
    }

    readinessModal.style.display =
    "flex";
});

document.getElementById(
"saveReadiness"
).addEventListener(

"click",

()=>{

    const today =
    new Date()
    .toISOString()
    .split("T")[0];

    const lastUpdate =

    localStorage.getItem(
    "readinessDate"
    );

    /* CHECK IF ALREADY UPDATED TODAY */

    if(lastUpdate === today){

        alert(
        "✅ You have already updated today's readiness score."
        );

        return;
    }

    let studyScore = 0;
    let timeScore = 0;
    let problemScore = 0;
    let revisionScore = 0;

    const studied =
    document.getElementById(
    "studyToday"
    ).value;

    const time =
    Number(
    document.getElementById(
    "studyTime"
    ).value
    );

    const problem =
    document.getElementById(
    "problemSolved"
    ).value;

    const revision =
    document.getElementById(
    "revisionDone"
    ).value;


    if(studied === "yes"){

        studyScore = 100;
    }

    if(time > 50){

        timeScore = 100;
    }

    else if(time > 30){

        timeScore = 75;
    }

    else if(time > 20){

        timeScore = 50;
    }

    if(problem === "yes"){

        problemScore = 100;
    }

    if(revision === "yes"){

        revisionScore = 100;
    }

    const readiness = Math.round(

        (
            studyScore +
            timeScore +
            problemScore +
            revisionScore
        ) / 4
    );


    localStorage.setItem(
    "readinessScore",
    readiness
    );

    localStorage.setItem(
    "readinessDate",
    today
    );

    updateReadinessUI();

    readinessModal.style.display =
    "none";

    alert(
    `🎯 Readiness Updated: ${readiness}%`
    );
});
/* =========================================
   UPDATE RING
========================================= */

function updateReadinessUI(){

    const score = Number(
        localStorage.getItem(
        "readinessScore"
        )
    ) || 0;

    document.getElementById(
    "readinessScore"
    ).innerText =
    score + "%";

    const circle =
    document.querySelector(
    ".progress"
    );

    const circumference = 471;

    const offset =

    circumference -
    (score / 100) * circumference;

    circle.style.strokeDashoffset =
    offset;

    const status =
    document.getElementById(
    "readinessStatus"
    );

    if(score >= 85){

        status.innerHTML =
        "🟢 Strong Interview Ready";
    }

    else if(score >= 60){

        status.innerHTML =
        "🟡 Needs More Revision";
    }

    else{

        status.innerHTML =
        "🔴 Focus On Fundamentals";
    }

    const updateDate =

    localStorage.getItem(
    "readinessDate"
    );

    document.getElementById(
    "lastReadinessUpdate"
    ).innerHTML =

    updateDate ?

    `📅 Last Updated: ${updateDate}`

    :

    "📅 Last Updated: Never";
}

updateReadinessUI();

/* =========================================
   DAILY CHALLENGE DATABASE
========================================= */

const challenges = [

{
company:"Amazon Medium",
problem:"Longest Substring Without Repeating Characters",
time:"20 Minutes",
link:"https://leetcode.com/problems/longest-substring-without-repeating-characters/"
},

{
company:"Google Medium",
problem:"Number of Islands",
time:"25 Minutes",
link:"https://leetcode.com/problems/number-of-islands/"
},

{
company:"Microsoft Medium",
problem:"Binary Tree Level Order Traversal",
time:"20 Minutes",
link:"https://leetcode.com/problems/binary-tree-level-order-traversal/"
},

{
company:"Meta Medium",
problem:"Clone Graph",
time:"30 Minutes",
link:"https://leetcode.com/problems/clone-graph/"
},

{
company:"Uber Medium",
problem:"K Closest Points to Origin",
time:"25 Minutes",
link:"https://leetcode.com/problems/k-closest-points-to-origin/"
},

{
company:"Amazon Medium",
problem:"LRU Cache",
time:"35 Minutes",
link:"https://leetcode.com/problems/lru-cache/"
},

{
company:"Google Medium",
problem:"Word Ladder",
time:"40 Minutes",
link:"https://leetcode.com/problems/word-ladder/"
},

{
company:"Meta Medium",
problem:"Course Schedule",
time:"25 Minutes",
link:"https://leetcode.com/problems/course-schedule/"
},

{
company:"Microsoft Medium",
problem:"Top K Frequent Elements",
time:"20 Minutes",
link:"https://leetcode.com/problems/top-k-frequent-elements/"
},

{
company:"Uber Medium",
problem:"Network Delay Time",
time:"35 Minutes",
link:"https://leetcode.com/problems/network-delay-time/"
},

{
company:"Google Hard",
problem:"Median of Two Sorted Arrays",
time:"45 Minutes",
link:"https://leetcode.com/problems/median-of-two-sorted-arrays/"
},

{
company:"Amazon Hard",
problem:"Trapping Rain Water",
time:"30 Minutes",
link:"https://leetcode.com/problems/trapping-rain-water/"
}

];

/* =========================================
   DAILY CHALLENGE GENERATOR
========================================= */

function loadDailyChallenge(){

    const today =
    new Date()
    .toISOString()
    .split("T")[0];

    let history =

    JSON.parse(

        localStorage.getItem(
        "challengeHistory"
        )

    ) || [];


    let challengeIndex;


    if(

        localStorage.getItem(
        "challengeDate"
        ) === today

    ){

        challengeIndex =

        Number(

            localStorage.getItem(
            "todayChallenge"
            )

        );
    }

    else{

        const recent =

        history.slice(-10);

        let available =

        challenges.map(

            (_,index)=>index
        )

        .filter(

            index =>

            !recent.includes(index)
        );


        challengeIndex =

        available[
            Math.floor(
            Math.random() *
            available.length
            )
        ];


        history.push(
        challengeIndex
        );


        localStorage.setItem(

            "challengeHistory",

            JSON.stringify(history)
        );

        localStorage.setItem(

            "todayChallenge",

            challengeIndex
        );

        localStorage.setItem(

            "challengeDate",

            today
        );
    }


    const challenge =

    challenges[
        challengeIndex
    ];


    document.getElementById(
    "challengeCompany"
    ).innerText =

    challenge.company;


    document.getElementById(
    "challengeProblem"
    ).innerText =

    challenge.problem;


    document.getElementById(
    "challengeTime"
    ).innerText =

    "Estimated Time: "
    +
    challenge.time;


    document.getElementById(
    "challengeLink"
    ).href =

    challenge.link;
}


loadDailyChallenge();

/* =========================================
   DAILY INSIGHT QUOTES
========================================= */

const dailyQuotes = [

"😂 Your code compiles? Congratulations, you're already ahead of yesterday.",

"☕ Every senior developer was once a confused beginner staring at semicolons.",

"🚀 One problem a day keeps the rejection emails away.",

"🐛 Debugging: where you spend 2 hours fixing a typo.",

"🔥 Consistency beats motivation. Motivation sleeps. Consistency doesn't.",

"🎯 The interview doesn't care how many tutorials you watched.",

"😎 Future You is begging Present You to solve one more problem.",

"💻 Ctrl + C and Ctrl + V won't help in interviews.",

"🧠 DSA is basically learning how to panic in a structured way.",

"☕ Coffee + Arrays = Productivity.",

"😴 If procrastination were a skill, you'd already be at Google.",

"🔥 Every accepted solution started as a wrong solution.",

"🚀 Your dream company won't appear magically. Keep coding.",

"😂 Stack Overflow can't attend the interview for you.",

"💡 Reading solutions is easy. Solving yourself is where growth happens.",

"🏆 Small progress every day beats one huge burst of motivation.",

"🤖 Remember: the bug isn't personal. It hates everyone equally.",

"⚡ If DSA feels hard, congratulations. Your brain is upgrading.",

"🦖 Dinosaurs went extinct. Hardcoded values should too.",

"🎯 One extra problem today = one less regret tomorrow."

];

/* =========================================
   DAILY INSIGHT GENERATOR
========================================= */

function loadDailyQuote(){

    const today =
    new Date()
    .toISOString()
    .split("T")[0];

    let history =

    JSON.parse(

        localStorage.getItem(
        "quoteHistory"
        )

    ) || [];

    let quoteIndex;


    if(

        localStorage.getItem(
        "quoteDate"
        ) === today

    ){

        quoteIndex =

        Number(

            localStorage.getItem(
            "todayQuote"
            )

        );
    }

    else{

        const recent =

        history.slice(-10);


        const available =

        dailyQuotes

        .map((_,i)=>i)

        .filter(

            i =>

            !recent.includes(i)
        );


        quoteIndex =

        available[
            Math.floor(
            Math.random()
            *
            available.length
            )
        ];


        history.push(
        quoteIndex
        );


        localStorage.setItem(

            "quoteHistory",

            JSON.stringify(history)
        );

        localStorage.setItem(

            "todayQuote",

            quoteIndex
        );

        localStorage.setItem(

            "quoteDate",

            today
        );
    }


    const quoteElement =
document.getElementById(
"dailyQuote"
);

const quote =
dailyQuotes[quoteIndex];

quoteElement.innerHTML = "";

let i = 0;

function typeQuote(){

    if(i < quote.length){

        quoteElement.innerHTML +=
        quote.charAt(i);

        i++;

        setTimeout(
        typeQuote,
        18
        );
    }
}

typeQuote();
const icons = [

"🚀",
"🔥",
"😎",
"💻",
"🎯",
"🤖",
"⚡",
"🏆",
"☕",
"🧠"
];

document.querySelector(
".quote-icon"
).innerText =

icons[
Math.floor(
Math.random()
*
icons.length
)
];
}

loadDailyQuote();

const openProblemsBtn =
document.getElementById(
"openProblemsBtn"
);

const problemsModal =
document.getElementById(
"problemsModal"
);

const saveProblem =
document.getElementById(
"saveProblem"
);

const problemsList =
document.getElementById(
"problemsList"
);

openProblemsBtn.addEventListener(

"click",

()=>{

    problemsModal.style.display =
    "flex";

    renderProblems();
});

window.addEventListener(

"click",

(e)=>{

    if(e.target === problemsModal){

        problemsModal.style.display =
        "none";
    }
});

saveProblem.addEventListener(

"click",

()=>{

    const name =
    document.getElementById(
    "problemName"
    ).value;

    const time =
    document.getElementById(
    "problemTime"
    ).value;

    if(!name || !time){

        alert(
        "Fill all fields"
        );

        return;
    }

    let problems =

    JSON.parse(

    localStorage.getItem(
    "solvedProblems"
    )) || [];

    problems.push({

        name,
        time,
        date:
        new Date()
        .toLocaleDateString()

    });

    localStorage.setItem(

        "solvedProblems",

        JSON.stringify(
        problems
        )
    );

    document.getElementById(
    "problemName"
    ).value="";

    document.getElementById(
    "problemTime"
    ).value="";

    renderProblems();
});

function renderProblems(){

    const problems =

    JSON.parse(

    localStorage.getItem(
    "solvedProblems"
    )

    ) || [];


    problemsList.innerHTML = "";


    let totalTime = 0;


    problems.forEach(problem=>{

        totalTime += parseInt(problem.time) || 0;

        problemsList.innerHTML += `

<div class="problem-item">

    <div class="problem-left">

        <div class="problem-icon">
            💻
        </div>

        <div>

            <h4>
                ${problem.name}
            </h4>

            <span class="problem-date">
                📅 ${problem.date}
            </span>

        </div>

    </div>

    <div class="problem-right">

        <div class="time-pill">

            ⏱ ${problem.time} min

        </div>

    </div>

</div>

`;

    });


    document.getElementById(
    "totalProblems"
    ).innerText =
    problems.length;


    document.getElementById(
    "totalTimeSpent"
    ).innerText =
    totalTime + " Min";


    const solvedCount =
    document.getElementById(
    "problemsSolvedCount"
    );

    if(solvedCount){

        solvedCount.innerText =
        problems.length;
    }
}

renderProblems();