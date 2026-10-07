// --- Data --------------------------------------------------------------------
const militaryUnits = {
    union: [
        "19th Iowa Infantry",
        "20th Wisconsin Infantry",
        "13th Kansas Infantry",
        "1st Indian Home Guard"
    ],
    confederate: [
        "34th Arkansas Infantry",
        "2nd Arkansas Infantry",
        "10th Missouri Cavalry",
        "Blocher's Artillery Battery"
    ]
};

const sideNames = {
    union: "Union Army",
    confederate: "Confederate Army"
};

const unitImages = {
    "19th Iowa Infantry": {
        src: "images/units/19th-iowa.jpg",
        alt: "Soldiers of the 19th Iowa Infantry, circa 1862",
        credit: "Courtesy of Iowa State Historical Society"
    },
    "34th Arkansas Infantry": {
        src: "images/units/34th-arkansas.jpg",
        alt: "Flag and members of the 34th Arkansas Infantry",
        credit: "Courtesy of Arkansas State Archives"
    },
    "20th Wisconsin Infantry": {
        src: "images/units/20th-wisconsin.jpg",
        alt: "The 20th Wisconsin Infantry, 1862",
        credit: ""
    },
    "13th Kansas Infantry": {
        src: "images/units/13th-kansas.jpg",
        alt: "The 13th Kansas, 1863",
        credit: ""
    },
    "1st Indian Home Guard": {
        src: "images/units/1st-indian.jpg",
        alt: "The 1st Indian Home Guard, 1864",
        credit: ""
    },
    "2nd Arkansas Infantry": {
        src: "images/units/2nd-arkansas.jpg",
        alt: "The 2nd Arkansas, 1865",
        credit: ""
    },
    "10th Missouri Cavalry": {
        src: "images/units/10th-missouri.jpg",
        alt: "The 10th Missouri, 1863",
        credit: ""
    },
    "Blocher's Artillery Battery": {
        src: "images/units/blochers-battery.jpg",
        alt: "Blocher's Battery, 1864",
        credit: ""
    }
};

// --- State -------------------------------------------------------------------
let selectedSideKey = "";
let selectedUnitName = "";

// --- DOM references ----------------------------------------------------------
const startScreen = document.getElementById("startScreen");
const unitScreen = document.getElementById("unitScreen");
const selectionScreen = document.getElementById("selectionScreen");
const experienceScreen = document.getElementById("experienceScreen");

const sideLabel = document.getElementById("sideLabel");
const unitHeading = document.getElementById("unitHeading");
const unitInstructions = document.getElementById("unitInstructions");
const unitList = document.getElementById("unitList");
const selectedSide = document.getElementById("selectedSide");
const selectedUnit = document.getElementById("selectedUnit");
const selectionMessage = document.getElementById("selectionMessage");
const experienceSide = document.getElementById("experienceSide");
const experienceUnit = document.getElementById("experienceUnit");
const sideButtons = document.querySelectorAll("[data-side]");

const backButton = document.getElementById("backButton");
const beginButton = document.getElementById("beginButton");
const changeUnitButton = document.getElementById("changeUnitButton");
const restartButton = document.getElementById("restartButton");
const experienceRestartButton = document.getElementById("experienceRestartButton");

// --- Events: side choice & navigation ---------------------------------------
sideButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        showUnitOptions(button.dataset.side);
    });
});

backButton.addEventListener("click", showStartScreen);
beginButton.addEventListener("click", beginExperience);
changeUnitButton.addEventListener("click", returnToUnitOptions);
restartButton.addEventListener("click", restartExperience);
experienceRestartButton.addEventListener("click", restartExperience);

// --- Pressed state handling for touch/mouse ---------------------------------
document.addEventListener("pointerdown", function (event) {
    const button = event.target.closest(".touch-btn");

    if (!button || button.disabled) {
        return;
    }

    button.classList.add("is-pressed");
});

document.addEventListener("pointerup", clearPressedButtons);
document.addEventListener("pointercancel", clearPressedButtons);
document.addEventListener("pointerleave", function (event) {
    if (event.pointerType === "mouse") {
        clearPressedButtons();
    }
});
window.addEventListener("blur", clearPressedButtons);

function clearPressedButtons() {
    document.querySelectorAll(".touch-btn.is-pressed").forEach(function (button) {
        button.classList.remove("is-pressed");
    });
}

// --- Screen management --------------------------------------------------------
function hideAllScreens() {
    startScreen.classList.add("hidden");
    unitScreen.classList.add("hidden");
    selectionScreen.classList.add("hidden");
    experienceScreen.classList.add("hidden");
}

function showStartScreen() {
    selectedSideKey = "";
    selectedUnitName = "";

    hideAllScreens();
    startScreen.classList.remove("hidden");

    const firstSideButton = startScreen.querySelector("[data-side]");
    if (firstSideButton) {
        firstSideButton.focus();
    }
}

function showUnitOptions(sideKey) {
    if (!Object.prototype.hasOwnProperty.call(militaryUnits, sideKey)) {
        return;
    }

    selectedSideKey = sideKey;
    selectedUnitName = "";

    hideAllScreens();
    unitScreen.classList.remove("hidden");
    sideLabel.textContent = sideNames[sideKey];
    sideLabel.classList.remove("union-label", "confederate-label");
    sideLabel.classList.add(sideKey + "-label");
    unitHeading.textContent = "Choose a " + sideNames[sideKey] + " Unit";
    unitInstructions.textContent = "Select one of the military units below to continue.";

    createUnitButtons(militaryUnits[sideKey]);

    const firstUnitButton = unitList.querySelector(".unit-btn");
    if (firstUnitButton) {
        firstUnitButton.focus();
    }
}

function createUnitButtons(units) {
    unitList.replaceChildren();

    units.forEach(function (unitName) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "unit-btn touch-btn";
        button.textContent = unitName;
        button.setAttribute("aria-label", "Select " + unitName);
        button.addEventListener("click", function () {
            selectUnit(unitName);
        });
        unitList.appendChild(button);
    });
}

// --- Image rendering helpers -------------------------------------------------

/**
 * Ensures an <img> exists inside the given container; creates it if absent.
 * @param {string} imgId - The desired ID for the <img>.
 * @param {string} containerId - The figure/container element ID.
 * @returns {HTMLImageElement} - The ensured/created <img> element.
 */
function ensureImageElement(imgId, containerId) {
    let img = document.getElementById(imgId);
    if (!img) {
        const container = document.getElementById(containerId);
        if (!container) return null;
        img = document.createElement("img");
        img.id = imgId;
        container.insertBefore(img, container.firstChild);
    }
    return img;
}

/**
 * Renders a unit image (if available) into a figure container with caption.
 * If no image metadata exists for the unit, hides the container.
 * @param {string} containerId
 * @param {string} imgId
 * @param {string} captionId
 * @param {string} unitName
 */
function renderUnitImage(containerId, imgId, captionId, unitName) {
    const container = document.getElementById(containerId);
    const caption = document.getElementById(captionId);
    if (!container || !caption) return;

    const img = ensureImageElement(imgId, containerId);
    const meta = unitImages[unitName];

    if (meta && meta.src) {
        img.src = meta.src;
        img.alt = meta.alt || unitName;
        caption.textContent = meta.credit ? `Image: ${meta.credit}` : "";
        container.classList.remove("hidden");
    } else {
        // Hide image area if no image defined for this unit
        if (img) {
            img.removeAttribute("src");
            img.alt = "";
        }
        caption.textContent = "";
        container.classList.add("hidden");
    }
}

// Convenience wrappers for each screen
function renderSelectionImage(unitName) {
    renderUnitImage("selectionImageContainer", "selectionImage", "selectionImageCaption", unitName);
}

function renderExperienceImage(unitName) {
    renderUnitImage("experienceImageContainer", "experienceImage", "experienceImageCaption", unitName);
}

// --- Selection & experience flow --------------------------------------------
function selectUnit(unitName) {
    if (
        selectedSideKey === "" ||
        !militaryUnits[selectedSideKey].includes(unitName)
    ) {
        return;
    }

    selectedUnitName = unitName;
    selectedSide.textContent = sideNames[selectedSideKey];
    selectedUnit.textContent = selectedUnitName;
    selectionMessage.textContent =
        "You are ready to explore the experience for this unit.";

    // Show image on the selection page (only if defined)
    renderSelectionImage(selectedUnitName);

    hideAllScreens();
    selectionScreen.classList.remove("hidden");
    beginButton.focus();
}

function returnToUnitOptions() {
    if (selectedSideKey === "") {
        showStartScreen();
        return;
    }

    showUnitOptions(selectedSideKey);
}

function beginExperience() {
    if (selectedSideKey === "" || selectedUnitName === "") {
        return;
    }

    experienceSide.textContent = sideNames[selectedSideKey];
    experienceSide.classList.remove("union-label", "confederate-label");
    experienceSide.classList.add(selectedSideKey + "-label");
    experienceUnit.textContent = selectedUnitName;

    // Show image on the experience page (only if defined)
    renderExperienceImage(selectedUnitName);

    hideAllScreens();
    experienceScreen.classList.remove("hidden");
    experienceRestartButton.focus();
}

function restartExperience() {
    showStartScreen();
}

// --- Init --------------------------------------------------------------------
/* If you want to start on the first screen immediately, call showStartScreen().
   If you later add persistence/deep links, you can hydrate state here. */
showStartScreen();
