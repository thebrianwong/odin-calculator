let totalValue = 0;

let firstValue = 0;
let secondValue;
let tempValue = [0];
let currentOperator;

const CHARCODE1 = 48;
const CHARCODE9 = 57;

const COLORSCHEME1 = ["#b0dcdc", "#dcb0b0", "#c6dcb0", "#9bc274", "#c27474"];
const COLORSCHEME2 = ["#c999c5", "#adc999", "#c9bf99", "#b0a163", "#83b063"];
const COLORSCHEME3 = ["#e0dace", "#ddcee0", "#ced4e0", "#7474c2", "#be90c7"];
let currentColorScheme = COLORSCHEME1;

// EVENT LISTENER FUNCTIONS

const addNumberClickers = () => {
    const numberButtons = document.querySelectorAll(".number-button");
    let buttonValue;
    numberButtons.forEach((button) => {
        button.addEventListener("click", () => {
            // Clears coloring then adds coloring to the number clicked.
            resetSpecificColors(numberButtons);
            addButtonColor(button, "number");
            buttonValue = Number(button.getAttribute("id"));
            inputNumber(buttonValue);
        })
    })
    document.addEventListener("keydown", (event) => {
        if (event.key.charCodeAt() >= CHARCODE1 && event.key.charCodeAt() <= CHARCODE9) {
            resetSpecificColors(numberButtons);
            numberButtons.forEach((button) => {
                if (button.innerText === event.key) {
                    addButtonColor(button, "number");
                }
            })
            buttonValue = Number(event.key);
            inputNumber(buttonValue);
        }
    })
}

const addOperatorClickers = () => {
    const operatorButtons = document.querySelectorAll(".operator-button");
    operatorButtons.forEach((button) => {
        button.addEventListener("click", () => {
            // Allows for calculations with multiple values and operators.
            if (secondValue !== undefined) {
                chainOperators();
            }
            resetSpecificColors(operatorButtons);
            addButtonColor(button, "operator");
            inputOperator(button, "click");
        })
    })
    document.addEventListener("keydown", (event) => {
        if (event.key === "+" || event.key === "-" || event.key === "*" || event.key === "/") {
            if (secondValue !== undefined) {
                chainOperators();
            }
            resetSpecificColors(operatorButtons);
            operatorButtons.forEach((button) => {
                if (button.getAttribute("id") === event.key) {
                    addButtonColor(button, "operator");
                }
            })
            inputOperator(event, "keydown");
        }
    })
}

const addEqualsClicker = () => {
    const equalsButton = document.querySelector("#equals");
    equalsButton.addEventListener("click", () => {
        if (secondValue !== undefined) {
            evaluateOperation();
        }
    })
    document.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && secondValue !== undefined) {
            /* Addresses usage where the second value's number is inputted via clicking but the equals is inputted via keyboard.
            Without removing button focus, hitting equals on the keyboard would input the second value's number again.*/
            removeButtonFocus();
            evaluateOperation();
        }
    })
}

const addClearClicker = () => {
    const clearButton = document.querySelector("#clear");
    clearButton.addEventListener("click", () => {
        clearEverything();
    })
    document.addEventListener("keydown", (event) => {
        if (event.key === "Delete") {
            clearEverything();
        }
    })
}

const addUndoClicker = () => {
    const undoButton = document.querySelector("#undo");
    undoButton.addEventListener("click", () => {
        determineValueToUndo();
    })
    document.addEventListener("keydown", (event) => {
        if (event.key === "Backspace") {
            determineValueToUndo();
        }
    })
}

const addDecimalClicker = () => {
    const decimalButton = document.querySelector("#decimal");
    decimalButton.addEventListener("click", () => {
        // Prevents decimal point from being input multiple times.
        if (!tempValue.includes(".")) {
            inputDecimalPoint();
        }
    })
    document.addEventListener("keydown", (event) => {
        if (event.key === "." && !tempValue.includes(".")) {
            inputDecimalPoint();
        }
    })
}

const addCalculatorColorClicker = () => {
    const colorChangeButtons = document.querySelectorAll(".color-button");
    colorChangeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const colorSchemeIdentifier = button.getAttribute("id");
            changeColorScheme(colorSchemeIdentifier);
        })
    })
}

// NUMBER SPECIFIC SUPPORT FUNCTIONS

const inputNumber = (buttonValue) => {
    // Prevents multiple 0's from being inputted.
    if (tempValue[0] === 0 && tempValue.length === 1 && buttonValue === "0") {
        return;
    // Prevents display from having a leading 0 (0125 instead of 125).
    } else if (tempValue[0] == 0 && tempValue.length === 1) {
        tempValue = [];
    }
    tempValue.push(buttonValue);
    trackValues();
    currentOperator === undefined ? updateDisplayValue(firstValue) : updateDisplayValue(secondValue);
}

// OPERATOR SPECIFIC SUPPORT FUNCTIONS

const chainOperators = () => {
    secondValue = Number(secondValue);
    checkZeroDivision();
    resetValues("partial");
}

const inputOperator = (userInput, inputType) => {
    inputType === "click" ? currentOperator = userInput.innerText : currentOperator = userInput.key;
    convertToFunction();
    firstValue = Number(firstValue);
    tempValue = [0];
}

const convertToFunction = () => {
    switch (currentOperator) {
        case "+":
            currentOperator = add;
            break;
        case "-":
            currentOperator = subtract;
            break;
        // "*" is for keyboard input and "x" is for click input.
        case "*":
        case "x":
            currentOperator = multiply;
            break;
        case "/":
            currentOperator = divide;
    }
}

// EQUALS SPECIFIC SUPPORT FUNCTIONS

const removeButtonFocus = () => {
    const allButtons = document.querySelectorAll("button");
    allButtons.forEach((button) => {
        button.blur();
    })
}

const evaluateOperation = () => {
    secondValue = Number(secondValue);
    resetAllColors();
    checkZeroDivision();
    resetValues("partial");
}

// CLEAR SPECIFIC SUPPORT FUNCTIONS

const clearEverything = () => {
    resetAllColors();
    resetValues("all");
    updateDisplayValue(totalValue);
}

// UNDO SPECIFIC SUPPORT FUNCTIONS

const determineValueToUndo = () => {
    undoLatestDigit();
    trackValues();
    currentOperator === undefined ? displayPostUndo(firstValue) : displayPostUndo(secondValue);
}

const undoLatestDigit = () => {
    tempValue.length === 1 ? tempValue = [0] : tempValue.pop();
}

const displayPostUndo = (value) => {
    value === firstValue ? updateDisplayValue(firstValue) : updateDisplayValue(secondValue);
}

// DECIMAL SPECIFIC SUPPORT FUNCTIONS

const inputDecimalPoint = () => {
    tempValue.push(".");
    trackValues();
    currentOperator === undefined ? updateDisplayValue(firstValue) : updateDisplayValue(secondValue);
}

// GENERAL VALUE RELATED SUPPORT FUNCTIONS

const updateDisplayValue = (value) => {
    const displaySection = document.querySelector(".display-container");
    displaySection.innerText = value;
}

const trackValues = () => {
    // tempValue stores inputted values as an array, which are then converted into a single value with .join().
    currentOperator === undefined ? firstValue = tempValue.join("") : secondValue = tempValue.join("");
}

const resetValues = (type) => {
    // The "partial" variant occurs when the equals sign is inputted. It allows the user to continue making calculations to the final value.
    type === "partial" ? firstValue = totalValue : firstValue = 0;
    secondValue = undefined;
    tempValue = [0];
    currentOperator = undefined;
    totalValue = 0;
}

const acceptEvaluation = () => {
    totalValue = operate(currentOperator,firstValue,secondValue);
    totalValue = Math.round(totalValue * 10000) / 10000;
    updateDisplayValue(totalValue);
}

// DIVIDE BY ZERO RELATED SUPPORT FUNCTIONS

const checkZeroDivision = () => {
    if (secondValue === 0 && currentOperator === divide) {
        rejectEvaluation();
        resetValues("all");
    } else {
        acceptEvaluation();
    }
}

const rejectEvaluation = () => {
    const displaySection = document.querySelector(".display-container");
    displaySection.innerText = "What're you crazy!?!?!?!?!";
}

// BUTTON COLOR RELATED SUPPORT FUNCTIONS

const resetSpecificColors = (allButtons) => {
    allButtons.forEach((button) => {
        button.style.backgroundColor = "";
    })
}

const resetAllColors = () => {
    const numberButtons = document.querySelectorAll(".number-button");
    const operatorButtons = document.querySelectorAll(".operator-button");
    numberButtons.forEach((button) => {
        button.style.backgroundColor = "";
    })
    operatorButtons.forEach((button) => {
        button.style.backgroundColor = "";
    })
}

// COLOR SCHEME RELATED SUPPORT FUNCTIONS

const changeColorScheme = (colorSchemeIdentifier) => {
    chooseColorScheme(colorSchemeIdentifier);
    changeCalculatorColors();
    changeClickedColors();
}

// Determines which array of hexadecimal values to use.
const chooseColorScheme = (id) => {
    if (id === "color-1") {
        currentColorScheme = COLORSCHEME1;
    } else if (id === "color-2") {
        currentColorScheme = COLORSCHEME2;
    } else {
        currentColorScheme = COLORSCHEME3;
    }
}

const changeCalculatorColors = () => {
    const bottomColor = 0;
    const topColor = 1;
    const displayColor = 2;
    const bottomSection = document.querySelector(".bottom-container");
    const topSection = document.querySelector(".top-container");
    const displaySection = document.querySelector(".display-container");
    bottomSection.style.backgroundColor = currentColorScheme[bottomColor];
    topSection.style.backgroundColor = currentColorScheme[topColor];
    displaySection.style.backgroundColor = currentColorScheme[displayColor];
}

const addButtonColor = (button, type) => {
    if (type === "number") {
        const numberColor = 3;
        button.style.backgroundColor = currentColorScheme[numberColor];
    } else {
        const operatorColor = 4;
        button.style.backgroundColor = currentColorScheme[operatorColor];
    }
}

// Changes the color of already clicked buttons to the appropriate color in the new color scheme if the color scheme is changed mid-calculation.
const changeClickedColors = () => {
    const numberButtons = document.querySelectorAll(".number-button");
    const operatorButtons = document.querySelectorAll(".operator-button");
    numberButtons.forEach((button) => {
        if (button.style.backgroundColor !== "") {
            addButtonColor(button, "number");
        }
    })
    operatorButtons.forEach((button) => {
        if (button.style.backgroundColor !== "") {
            addButtonColor(button, "operator");
        }
    })
}

// MATH OPERATORS

const add = (x,y) => {
    return x + y;
}

const subtract = (x,y) => {
    return x - y;
}

const multiply = (x,y) => {
    return x * y;
}

const divide = (x,y) => {
    return x / y;
}

const operate = (operatorFunction,x,y) => {
    return operatorFunction(x,y);
}

// INITIALIZE BUTTON FUNCTIONALITIES

addNumberClickers();
addOperatorClickers();
addEqualsClicker();
addClearClicker();
addUndoClicker();
addDecimalClicker();
addCalculatorColorClicker();
updateDisplayValue(totalValue);
