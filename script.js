/* =========================================
   THE INVESTIGATION
   V1 JAVASCRIPT
========================================= */


/* =========================================
   BOOT SYSTEM
========================================= */

const bootScreen = document.getElementById("bootScreen");

const loadingProgress =
    document.getElementById("loadingProgress");

const bootStatus =
    document.getElementById("bootStatus");


let bootProgress = 0;


const bootMessages = [
    "Initializing...",
    "Checking system files...",
    "Loading user profile...",
    "Checking storage...",
    "Starting desktop...",
    "Ready."
];


const bootInterval = setInterval(() => {

    bootProgress += 10;

    loadingProgress.style.width =
        bootProgress + "%";


    const messageIndex =
        Math.min(
            Math.floor(bootProgress / 20),
            bootMessages.length - 1
        );


    bootStatus.textContent =
        bootMessages[messageIndex];


    if (bootProgress >= 100) {

        clearInterval(bootInterval);


        setTimeout(() => {

            bootScreen.style.opacity = "0";

            bootScreen.style.transition =
                "opacity 0.7s";


            setTimeout(() => {

                bootScreen.style.display =
                    "none";

            }, 700);

        }, 400);

    }

}, 250);


/* =========================================
   APP WINDOWS
========================================= */

const windows = {

    files: document.getElementById("filesWindow"),

    mail: document.getElementById("mailWindow"),

    notes: document.getElementById("notesWindow"),

    cctv: document.getElementById("cctvWindow"),

    browser: document.getElementById("browserWindow"),

    search: document.getElementById("searchWindow"),

    trash: document.getElementById("trashWindow")

};


let highestZIndex = 100;


/* =========================================
   OPEN APP
========================================= */

function openApp(appName) {

    const windowElement =
        windows[appName];


    if (!windowElement) {
        return;
    }


    highestZIndex++;

    windowElement.style.zIndex =
        highestZIndex;


    windowElement.classList.add("active");


    /* Close start menu */

    document
        .getElementById("startMenu")
        .classList.remove("open");

}


/* =========================================
   CLOSE APP
========================================= */

function closeWindow(windowElement) {

    windowElement.classList.remove("active");

}


/* =========================================
   DESKTOP ICONS
========================================= */

const desktopIcons =
    document.querySelectorAll(".desktopIcon");


desktopIcons.forEach(icon => {

    icon.addEventListener("dblclick", () => {

        const app =
            icon.dataset.app;

        openApp(app);

    });

});


/* =========================================
   TASKBAR APPS
========================================= */

const taskbarApps =
    document.querySelectorAll(".taskbarApp");


taskbarApps.forEach(button => {

    button.addEventListener("click", () => {

        const app =
            button.dataset.app;

        openApp(app);

    });

});


/* =========================================
   START MENU
========================================= */

const startButton =
    document.getElementById("startButton");

const startMenu =
    document.getElementById("startMenu");


startButton.addEventListener("click", () => {

    startMenu.classList.toggle("open");

});


/* Start menu applications */

const startItems =
    document.querySelectorAll(".startItem");


startItems.forEach(item => {

    item.addEventListener("click", () => {

        const app =
            item.dataset.app;

        openApp(app);

    });

});


/* =========================================
   CLOSE BUTTONS
========================================= */

const closeButtons =
    document.querySelectorAll(".closeButton");


closeButtons.forEach(button => {

    button.addEventListener("click", () => {

        const windowElement =
            button.closest(".window");

        closeWindow(windowElement);

    });

});


/* =========================================
   BRING WINDOWS TO FRONT
========================================= */

Object.values(windows).forEach(windowElement => {

    windowElement.addEventListener("mousedown", () => {

        highestZIndex++;

        windowElement.style.zIndex =
            highestZIndex;

    });

});


/* =========================================
   CLOCK
========================================= */

const clock =
    document.getElementById("clock");


function updateClock() {

    const now =
        new Date();


    let hours =
        now.getHours();

    let minutes =
        now.getMinutes();


    hours =
        String(hours).padStart(2, "0");

    minutes =
        String(minutes).padStart(2, "0");


    clock.textContent =
        hours + ":" + minutes;

}


updateClock();


setInterval(updateClock, 1000);


/* =========================================
   SEARCH
========================================= */

const searchInput =
    document.getElementById("searchInput");

const searchResults =
    document.getElementById("searchResults");


searchInput.addEventListener("input", () => {

    const query =
        searchInput.value
            .trim()
            .toLowerCase();


    if (query === "") {

        searchResults.textContent =
            "No search performed.";

        return;

    }


    const searchableItems = [

        "readme.txt",

        "Personal",

        "Work",

        "Daniel Mercer",

        "Basement",

        "The basement is not empty.",

        "Don't trust the camera.",

        "deleted_log.txt"

    ];


    const results =
        searchableItems.filter(item =>
            item.toLowerCase().includes(query)
        );


    if (results.length === 0) {

        searchResults.textContent =
            "No results found.";

        return;

    }


    searchResults.innerHTML =
        results
            .map(item => "• " + item)
            .join("<br>");

});


/* =========================================
   CLOSE START MENU WHEN CLICKING DESKTOP
========================================= */

document
    .getElementById("desktop")
    .addEventListener("click", event => {

        if (
            event.target !== startButton &&
            !event.target.closest("#startMenu")
        ) {

            startMenu.classList.remove("open");

        }

    });
