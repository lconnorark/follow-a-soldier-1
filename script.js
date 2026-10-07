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
        "Blocker's Artillery Battery"
    ]
};

const sideNames = {
    union: "Union Army",
    confederate: "Confederate Army"
};

let selectedSideKey = "";
let selectedUnitName = "";

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

    hideAllScreens();
    experienceScreen.classList.remove("hidden");
    experienceRestartButton.focus();
}

function restartExperience() {
    showStartScreen();
}
