/* =========================================
   THE INVESTIGATION
   V1 - WINDOW SYSTEM
========================================= */


/* =========================================
   BOOT SYSTEM
========================================= */

const bootScreen = document.getElementById("bootScreen");
const loadingProgress = document.getElementById("loadingProgress");
const bootStatus = document.getElementById("bootStatus");

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

    loadingProgress.style.width = bootProgress + "%";

    const messageIndex = Math.min(
        Math.floor(bootProgress / 20),
        bootMessages.length - 1
    );

    bootStatus.textContent = bootMessages[messageIndex];

    if (bootProgress >= 100) {

        clearInterval(bootInterval);

        setTimeout(() => {

            bootScreen.style.opacity = "0";
            bootScreen.style.transition = "opacity 0.7s";

            setTimeout(() => {
                bootScreen.style.display = "none";
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

    const windowElement = windows[appName];

    if (!windowElement) {
        return;
    }

    /* If minimized, restore it */

    windowElement.classList.remove("minimized");

    /* Make visible */

    windowElement.classList.add("active");

    /* Bring to front */

    bringToFront(windowElement);

    /* Update taskbar */

    updateTaskbar();

}


/* =========================================
   CLOSE WINDOW
========================================= */

function closeWindow(windowElement) {

    windowElement.classList.remove("active");
    windowElement.classList.remove("minimized");

    updateTaskbar();

}


/* =========================================
   BRING WINDOW TO FRONT
========================================= */

function bringToFront(windowElement) {

    highestZIndex++;

    windowElement.style.zIndex = highestZIndex;

}


/* =========================================
   DESKTOP ICONS
========================================= */

const desktopIcons =
    document.querySelectorAll(".desktopIcon");


desktopIcons.forEach(icon => {

    icon.addEventListener("dblclick", () => {

        const app = icon.dataset.app;

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

        const app = button.dataset.app;

        const windowElement = windows[app];

        if (!windowElement) {
            return;
        }

        /*
            If the window isn't open,
            open it.
        */

        if (!windowElement.classList.contains("active")) {

            openApp(app);

            return;

        }

        /*
            If it's minimized,
            restore it.
        */

        if (windowElement.classList.contains("minimized")) {

            windowElement.classList.remove("minimized");

            bringToFront(windowElement);

            updateTaskbar();

            return;

        }

        /*
            Otherwise minimize it.
        */

        windowElement.classList.add("minimized");

        updateTaskbar();

    });

});


/* =========================================
   START MENU
========================================= */

const startButton =
    document.getElementById("startButton");

const startMenu =
    document.getElementById("startMenu");


startButton.addEventListener("click", event => {

    event.stopPropagation();

    startMenu.classList.toggle("open");

});


const startItems =
    document.querySelectorAll(".startItem");


startItems.forEach(item => {

    item.addEventListener("click", () => {

        const app = item.dataset.app;

        openApp(app);

    });

});


/* =========================================
   CLOSE BUTTONS
========================================= */

const closeButtons =
    document.querySelectorAll(".closeButton");


closeButtons.forEach(button => {

    button.addEventListener("click", event => {

        event.stopPropagation();

        const windowElement =
            button.closest(".window");

        closeWindow(windowElement);

    });

});


/* =========================================
   WINDOW FOCUS
========================================= */

Object.values(windows).forEach(windowElement => {

    windowElement.addEventListener("mousedown", () => {

        bringToFront(windowElement);

    });

});


/* =========================================
   MAKE WINDOWS DRAGGABLE
========================================= */

Object.values(windows).forEach(windowElement => {

    const header =
        windowElement.querySelector(".windowHeader");

    let dragging = false;

    let offsetX = 0;
    let offsetY = 0;


    header.addEventListener("mousedown", event => {

        /*
            Don't drag when clicking
            the close button.
        */

        if (event.target.classList.contains("closeButton")) {
            return;
        }


        dragging = true;


        const rect =
            windowElement.getBoundingClientRect();


        offsetX =
            event.clientX - rect.left;

        offsetY =
            event.clientY - rect.top;


        bringToFront(windowElement);

    });


    document.addEventListener("mousemove", event => {

        if (!dragging) {
            return;
        }


        let newX =
            event.clientX - offsetX;

        let newY =
            event.clientY - offsetY;


        /*
            Keep the window
            inside the screen.
        */

        const maxX =
            window.innerWidth -
            windowElement.offsetWidth;

        const maxY =
            window.innerHeight -
            windowElement.offsetHeight -
            46;


        newX =
            Math.max(0, Math.min(newX, maxX));

        newY =
            Math.max(0, Math.min(newY, maxY));


        windowElement.style.left =
            newX + "px";

        windowElement.style.top =
            newY + "px";


        /*
            Remove the old
            centering transform.
        */

        windowElement.style.transform =
            "none";

    });


    document.addEventListener("mouseup", () => {

        dragging = false;

    });

});


/* =========================================
   TASKBAR STATE
========================================= */

function updateTaskbar() {

    taskbarApps.forEach(button => {

        const app =
            button.dataset.app;

        const windowElement =
            windows[app];


        if (!windowElement) {
            return;
        }


        if (
            windowElement.classList.contains("active") &&
            !windowElement.classList.contains("minimized")
        ) {

            button.classList.add("running");

        } else {

            button.classList.remove("running");

        }

    });

}


/* =========================================
   CLOCK
========================================= */

const clock =
    document.getElementById("clock");


function updateClock() {

    const now =
        new Date();


    const hours =
        String(now.getHours())
            .padStart(2, "0");


    const minutes =
        String(now.getMinutes())
            .padStart(2, "0");


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
   CLOSE START MENU
========================================= */

document.addEventListener("click", event => {

    if (
        event.target !== startButton &&
        !event.target.closest("#startMenu")
    ) {

        startMenu.classList.remove("open");

    }

});


/* =========================================
   INITIALIZE
========================================= */

updateTaskbar();
