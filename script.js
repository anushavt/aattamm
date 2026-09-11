// ============================================================
// AATTAM
// Complete game script
// ============================================================


// ============================================================
// SUPABASE
// ============================================================

const SUPABASE_URL = "https://kmswwafxpulyivfovner.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_grjA8yu8WZVUUBiLooANzQ_1GRxMgn_";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


// ============================================================
// ELEMENTS
// ============================================================

const welcomeScreen = document.getElementById("welcomeScreen");
const gameScreen = document.getElementById("gameScreen");

const nameInput = document.getElementById("nameInput");
const startButton = document.getElementById("startButton");

const video = document.getElementById("camera");
const canvas = document.getElementById("canvas");

const scoreDisplay = document.getElementById("score");
const meterFill = document.getElementById("meterFill");
const chaosLevel = document.getElementById("chaosLevel");

const funnyMessage = document.getElementById("funnyMessage");

const statusText =
    document.getElementById("status") ||
    document.getElementById("statusText");

const analysisBox = document.getElementById("analysisBox");
const analysisText = document.getElementById("analysisText");

const playerLabel = document.getElementById("playerLabel");
const leaderboardList = document.getElementById("leaderboardList");
const leaderboardStatus = document.getElementById("leaderboardStatus");



// ============================================================
// PLAYER
// ============================================================

let playerName = "";


// ============================================================
// GAME VARIABLES
// ============================================================

let aattamScore = 0;

let shaking = false;
let gameFinished = false;

let shakeStopTimer = null;

let lastX = null;
let lastY = null;
let lastZ = null;

let photoData = null;
let photoCaptured = false;


// ============================================================
// SHAKE TRACKING
// ============================================================

// Used to make the score depend on both intensity
// and sustained chaotic movement.

let totalMovement = 0;
let shakeSamples = 0;

let strongestMovement = 0;


// ============================================================
// ROAST BANK
// ============================================================

const roastBank = {

    low: [

        "Ithaano nee paranja AATTAM? 😭",

        "Phone ninne nokki chirikkunnund.",

        "Ith shake aano?",

        "Kurach koode effort idu mone.",

        "AATTAM thudangan polum pattiyilla.",

        "Ithinu vendi aano njan camera thurannath?",

        "Nee ithrem shy aanennu arinjilla."

    ],


    medium: [

        "Phoneinu entha thettu cheythath?",

        "Ith AATTAM alla, oru personal grudge aanu.",

        "Camera pedich thudangi.",

        "Nee onnu calm aav.",

        "Ippo sherikkum AATTAM aayi.",

        "Ithokke kurach over alle?",

        "Nee phoneine enthina ingane torture cheyyunne?"

    ],


    high: [

        "Phone ninakku enthu cheythu?",

        "Nee phoneine enthina ingane torture cheyyunne?",

        "Ithrem aattam enthina da/di?",

        "Ninte phoneinu vendi oru minute silence.",

        "Nee sherikkum okay aano?",

        "Ith AATTAM alla, oru personal grudge aanu.",

        "Nee phone pottikkaan aano nokkunne?"

    ],


    absolute: [

        "DAA NEE PHONE KOLLUM 😭",

        "Ith AATTAM alla, poornamaaya pralayam aanu.",

        "Phone ippo veettil vilich parayum.",

        "AATTAM score 100. Buddhi score vere karyam. 💀",

        "Enthayalum oru kaaryam urappaanu — nee calm alla.",

        "Nee phoneine enthina ingane torture cheyyunne?",

        "Ith kanditt gyroscope karayunnund."

    ]

};


// ============================================================
// RANDOM ROAST
// ============================================================

function getRandomRoast(score) {

    let roastGroup;


    if (score < 20) {

        roastGroup = roastBank.low;

    }

    else if (score < 40) {

        roastGroup = roastBank.medium;

    }

    else if (score < 80) {

        roastGroup = roastBank.high;

    }

    else {

        roastGroup = roastBank.absolute;

    }


    const randomIndex =
        Math.floor(Math.random() * roastGroup.length);


    return roastGroup[randomIndex];
}


// ============================================================
// RANDOM SHAKE MESSAGES
// ============================================================

const shakeMessages = [

    "SHAKE IT 😭",

    "Kurach koode aatteda",

    "Phone pidichittundo? 👀",

    "Ithentha ithra decent?",

    "AATTAM KODUKKU 🌀",

    "Camera already regretting this.",

    "MORE CHAOS.",

    "Phoneinu pedi thudangi.",

    "Don't stop now 💀",

    "DAA SHAKE."

];


function randomShakeMessage() {

    const randomIndex =
        Math.floor(Math.random() * shakeMessages.length);

    return shakeMessages[randomIndex];
}


// ============================================================
// START BUTTON
// ============================================================

startButton.addEventListener(
    "click",
    startAattam
);


// Allow Enter key too.

nameInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            startAattam();

        }

    }
);


// ============================================================
// START AATTAM
// ============================================================

function startAattam() {

    playerName =
        nameInput.value.trim();

    if (playerLabel) {
        playerLabel.textContent = playerName;
    }


    if (playerName === "") {

        alert("Enter your name first 😭");

        return;

    }


    // Reset game variables.

    aattamScore = 0;

    shaking = false;

    gameFinished = false;

    photoCaptured = false;

    photoData = null;

    lastX = null;
    lastY = null;
    lastZ = null;

    totalMovement = 0;

    shakeSamples = 0;

    strongestMovement = 0;


    // Reset display.

    scoreDisplay.textContent = "0";

    meterFill.style.width = "0%";

    chaosLevel.textContent = "CALM";


    if (funnyMessage) {

        funnyMessage.textContent =
            "🌀 SHAKE YOUR PHONE.";

    }


    if (statusText) {

        statusText.textContent =
            "READY TO AATTAM?";

    }


    if (analysisBox) {

        analysisBox.style.display =
            "none";

    }


    // Show game.

    welcomeScreen.style.display =
        "none";

    gameScreen.style.display =
        "block";


    // Start camera.

    startCamera();

}


// ============================================================
// CAMERA
// ============================================================

async function startCamera() {

    try {

        const stream =
            await navigator.mediaDevices.getUserMedia({

                video: {
                    facingMode: "user"
                },

                audio: false

            });


        video.srcObject = stream;


        await video.play();


        console.log(
            "Camera started."
        );

    }

    catch (error) {

        console.error(
            "Camera error:",
            error
        );


        alert(
            "Camera permission is needed for AATTAM 😭"
        );

    }

}


// ============================================================
// PHONE MOTION
// ============================================================

function handleMotion(event) {

    if (gameFinished) {

        return;

    }


    const acceleration =
        event.accelerationIncludingGravity;


    if (!acceleration) {

        return;

    }


    const x =
        acceleration.x || 0;

    const y =
        acceleration.y || 0;

    const z =
        acceleration.z || 0;


    // Need previous reading.

    if (
        lastX !== null &&
        lastY !== null &&
        lastZ !== null
    ) {

        const deltaX =
            Math.abs(x - lastX);

        const deltaY =
            Math.abs(y - lastY);

        const deltaZ =
            Math.abs(z - lastZ);


        const movement =
            deltaX +
            deltaY +
            deltaZ;


        // Ignore tiny movements.

        if (movement > 12) {

            if (!shaking) {

                startRealShake();

            }


            addRealShakeScore(
                movement
            );


            // Keep resetting the timer
            // while the phone is moving.

            clearTimeout(
                shakeStopTimer
            );


            shakeStopTimer =
                setTimeout(

                    function() {

                        stopRealShake();

                    },

                    600

                );


            // Occasionally change message.

            if (
                funnyMessage &&
                Math.random() < 0.06
            ) {

                funnyMessage.textContent =
                    randomShakeMessage();

            }

        }

    }


    lastX = x;
    lastY = y;
    lastZ = z;

}


// ============================================================
// START REAL SHAKE
// ============================================================

function startRealShake() {

    if (gameFinished) {

        return;

    }


    shaking = true;


    if (statusText) {

        statusText.textContent =
            "KEEP AATTAM-ING... 🌀";

    }

}


// ============================================================
// STOP REAL SHAKE
// ============================================================

function stopRealShake() {

    if (!shaking) {

        return;

    }


    shaking = false;


    clearTimeout(
        shakeStopTimer
    );


    shakeStopTimer = null;


    if (statusText) {

        statusText.textContent =
            "CALCULATING AATTAM...";

    }


    // Give the phone a tiny moment
    // before capturing the photo.

    setTimeout(

        function() {

            if (
                !gameFinished &&
                aattamScore > 0
            ) {

                finishAattam();

            }

        },

        250

    );

}


// ============================================================
// AATTAM SCORING
// ============================================================

function addRealShakeScore(movement) {

    if (gameFinished) {

        return;

    }


    totalMovement +=
        movement;


    shakeSamples++;


    if (movement > strongestMovement) {

        strongestMovement =
            movement;

    }


    // --------------------------------------------------------
    // SCORE DESIGN
    // --------------------------------------------------------
    //
    // We deliberately make 100 difficult.
    //
    // Most normal vigorous shaking should land around:
    //
    // 40 - 90
    //
    // Extreme sustained chaos can reach:
    //
    // 90 - 99
    //
    // 100 should be rare.
    //
    // --------------------------------------------------------


    // Base contribution.

    let points =
        movement * 0.075;


    // Strong movement gets a bonus,
    // but not enough to instantly reach 100.

    if (movement > 25) {

        points += 0.4;

    }


    if (movement > 40) {

        points += 0.7;

    }


    if (movement > 60) {

        points += 1.0;

    }


    // Very strong individual movement.

    if (movement > 80) {

        points += 1.5;

    }


    // Sustained shaking matters.

    if (shakeSamples > 20) {

        points *= 1.05;

    }


    if (shakeSamples > 40) {

        points *= 1.08;

    }


    if (shakeSamples > 70) {

        points *= 1.10;

    }


    // Diminishing returns near the top.
    //
    // This makes the last few points much harder.

    if (aattamScore >= 60) {

        points *= 0.78;

    }


    if (aattamScore >= 75) {

        points *= 0.60;

    }


    if (aattamScore >= 88) {

        points *= 0.42;

    }


    if (aattamScore >= 95) {

        points *= 0.20;

    }


    aattamScore +=
        Math.max(
            0.1,
            points
        );


    // --------------------------------------------------------
    // SCORE CAP
    // --------------------------------------------------------

    if (aattamScore >= 100) {

        // 100 is only possible when the user has produced
        // genuinely extreme sustained movement.

        const extremeEnough =
            strongestMovement >= 75 &&
            shakeSamples >= 45;


        if (extremeEnough) {

            aattamScore = 100;

        }

        else {

            aattamScore = 99;

        }

    }


    // Display integer score.

    const displayScore =
        Math.floor(
            aattamScore
        );


    scoreDisplay.textContent =
        displayScore;


    meterFill.style.width =
        displayScore + "%";


    updateChaosLevel(
        displayScore
    );

}


// ============================================================
// CHAOS LEVEL
// ============================================================

function updateChaosLevel(score) {

    if (score < 20) {

        chaosLevel.textContent =
            "CALM";

    }

    else if (score < 40) {

        chaosLevel.textContent =
            "WARMING UP";

    }

    else if (score < 60) {

        chaosLevel.textContent =
            "CHAOTIC";

    }

    else if (score < 80) {

        chaosLevel.textContent =
            "DANGEROUS";

    }

    else {

        chaosLevel.textContent =
            "ABSOLUTE AATTAM 💀";

    }

}


// ============================================================
// FINISH AATTAM
// ============================================================

function finishAattam() {

    if (gameFinished) {

        return;

    }


    gameFinished = true;

    shaking = false;


    clearTimeout(
        shakeStopTimer
    );


    shakeStopTimer = null;


    // Make sure score is an integer.

    aattamScore =
        Math.min(
            100,
            Math.floor(
                aattamScore
            )
        );


    // --------------------------------------------------------
    // STATUS
    // --------------------------------------------------------

    if (statusText) {

        statusText.textContent =
            "AATTAM COMPLETE.";

    }


    // --------------------------------------------------------
    // ROAST
    // --------------------------------------------------------

    const roast =
        getRandomRoast(
            aattamScore
        );


    if (funnyMessage) {

        funnyMessage.textContent =
            "💀 " + roast;

    }


    // --------------------------------------------------------
    // ANALYSIS BOX
    // --------------------------------------------------------

    if (analysisBox) {

        analysisBox.style.display =
            "block";

    }


    if (analysisText) {

        analysisText.textContent =
            "💀 " + roast;

    }


    // --------------------------------------------------------
    // CAPTURE PHOTO
    // --------------------------------------------------------

    captureAattamPhoto();


    // --------------------------------------------------------
    // SAVE SCORE
    // --------------------------------------------------------

    saveScoreToLeaderboard();


    console.log(
        "Final AATTAM Score:",
        aattamScore
    );

}


// ============================================================
// CAPTURE AATTAM PHOTO
// ============================================================

function captureAattamPhoto() {

    if (photoCaptured) {

        return;

    }


    const width =
        video.videoWidth;

    const height =
        video.videoHeight;


    // Camera isn't ready.

    if (
        width === 0 ||
        height === 0
    ) {

        console.log(
            "Camera is not ready yet."
        );

        return;

    }


    photoCaptured = true;


    canvas.width =
        width;

    canvas.height =
        height;


    const context =
        canvas.getContext(
            "2d"
        );


    // --------------------------------------------------------
    // CREATE FAKE MOTION BLUR
    // --------------------------------------------------------

    context.clearRect(
        0,
        0,
        width,
        height
    );


    context.globalAlpha =
        0.20;


    context.drawImage(
        video,
        -24,
        0,
        width,
        height
    );


    context.drawImage(
        video,
        -16,
        0,
        width,
        height
    );


    context.drawImage(
        video,
        -8,
        0,
        width,
        height
    );


    context.drawImage(
        video,
        0,
        0,
        width,
        height
    );


    context.drawImage(
        video,
        8,
        0,
        width,
        height
    );


    context.drawImage(
        video,
        16,
        0,
        width,
        height
    );


    context.drawImage(
        video,
        24,
        0,
        width,
        height
    );


    context.globalAlpha =
        1;


    // --------------------------------------------------------
    // SAVE PHOTO
    // --------------------------------------------------------

    photoData =
        canvas.toDataURL(
            "image/jpeg",
            0.7
        );


    console.log(
        "AATTAM photo captured."
    );

}


// ============================================================
// SAVE SCORE TO SUPABASE
// ============================================================

async function saveScoreToLeaderboard() {

    const cleanName =
        playerName.trim();


    if (!cleanName) {

        console.log(
            "No player name found."
        );

        return;

    }


    try {

        const { data, error } =
            await supabaseClient
                .from("leaderboard")
                .insert([

                    {
                        name: cleanName,
                        score: aattamScore
                    }

                ])
                .select();


        if (error) {

            console.error(
                "Leaderboard save failed:",
                error
            );

            return;

        }


        console.log(
            "Score saved successfully:",
            data
        );

        // Refresh immediately for this player.
        loadLeaderboard();

    }

    catch (error) {

        console.error(
            "Unexpected leaderboard error:",
            error
        );

    }

}


// ============================================================
// LEADERBOARD
// ============================================================

async function loadLeaderboard() {

    if (!leaderboardList) {
        return;
    }

    leaderboardStatus.textContent = "Loading chaos...";

    const { data, error } = await supabaseClient
        .from("leaderboard")
        .select("id, name, score, created_at")
        .order("score", { ascending: false })
        .order("created_at", { ascending: true })
        .limit(20);

    if (error) {
        console.error("Leaderboard load failed:", error);
        leaderboardStatus.textContent = "Leaderboard took a vacation 😭";
        return;
    }

    renderLeaderboard(data || []);
}


function renderLeaderboard(rows) {

    if (!leaderboardList) {
        return;
    }

    leaderboardList.innerHTML = "";

    if (!rows.length) {
        leaderboardStatus.textContent = "No chaos yet. Be the first. 🌀";
        return;
    }

    leaderboardStatus.textContent = "LIVE • TOP 20";

    rows.forEach(function(row, index) {

        const item = document.createElement("div");
        item.className = "leaderboard-item";

        if (index === 0) {
            item.classList.add("rank-one");
        }

        const rank = document.createElement("div");
        rank.className = "leaderboard-rank";

        if (index === 0) {
            rank.textContent = "👑";
        } else if (index === 1) {
            rank.textContent = "🥈";
        } else if (index === 2) {
            rank.textContent = "🥉";
        } else {
            rank.textContent = "#" + (index + 1);
        }

        const name = document.createElement("div");
        name.className = "leaderboard-name";
        name.textContent = row.name || "Anonymous";

        const score = document.createElement("div");
        score.className = "leaderboard-score";
        score.textContent = Number(row.score) || 0;

        item.appendChild(rank);
        item.appendChild(name);
        item.appendChild(score);

        leaderboardList.appendChild(item);
    });
}


function subscribeToLeaderboard() {

    supabaseClient
        .channel("aattam-leaderboard-live")
        .on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "leaderboard"
            },
            function() {
                loadLeaderboard();
            }
        )
        .subscribe(function(status) {
            console.log("Leaderboard realtime:", status);
        });
}


// Load existing scores immediately.
loadLeaderboard();

// Listen for new scores from everyone.
subscribeToLeaderboard();


// ============================================================
// MOTION EVENT
// ============================================================

window.addEventListener(
    "devicemotion",
    handleMotion,
    true
);


// ============================================================
// RESET IF PAGE IS RELOADED
// ============================================================

window.addEventListener(
    "beforeunload",
    function() {

        clearTimeout(
            shakeStopTimer
        );


        // Stop camera stream.

        if (
            video &&
            video.srcObject
        ) {

            const tracks =
                video.srcObject.getTracks();


            tracks.forEach(
                function(track) {

                    track.stop();

                }
            );

        }

    }
);


// ============================================================
// DEBUG
// ============================================================

console.log(
    "AATTAM script loaded successfully. 🌀"
);