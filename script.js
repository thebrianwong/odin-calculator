let totalValue = 0;

let firstValue = 0;
let secondValue;
let tempValue = [0];
let currentOperator;

const CHARCODE1 = 48;
const CHARCODE9 = 57;

// EVENT LISTENER FUNCTIONS

const addNumberClickers = () => {
    const numberButtons = document.querySelectorAll(".number-button");
    let buttonValue;
    numberButtons.forEach((button) => {
        button.addEventListener("click", () => {
            resetSpecificColors(numberButtons, "numbers");
            button.classList.add("number-clicked");
            buttonValue = Number(button.getAttribute("id"));
            inputNumber(buttonValue);
        })
    })
    document.addEventListener("keydown", (event) => {
        if (event.key.charCodeAt() >= CHARCODE1 && event.key.charCodeAt() <= CHARCODE9) {
            resetSpecificColors(numberButtons, "numbers");
            numberButtons.forEach((button) => {
                if (button.innerText === event.key) {
                    button.classList.add("number-clicked");
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
            if (secondValue !== undefined) {
                chainOperators();
            }
            resetSpecificColors(operatorButtons, "operators");
            button.classList.add("operator-clicked")
            inputOperator(button, "click");
        })
    })
    document.addEventListener("keydown", (event) => {
        if (event.key === "+" || event.key === "-" || event.key === "*" || event.key === "/") {
            if (secondValue !== undefined) {
                chainOperators();
            }
            resetSpecificColors(operatorButtons, "operators");
            operatorButtons.forEach((button) => {
                if (button.getAttribute("id") === event.key) {
                    button.classList.add("operator-clicked")
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
    trackValues()
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
    trackValues()
    currentOperator === undefined ? updateDisplayValue(firstValue) : updateDisplayValue(secondValue);
}

// GENERAL VALUE RELATED SUPPORT FUNCTIONS

const updateDisplayValue = (value) => {
    const displayValueContainer = document.querySelector(".display-container");
    displayValueContainer.innerText = value;
}

const trackValues = () => {
    if (currentOperator === undefined) {
        firstValue = tempValue.join("");
    } else if (currentOperator !== undefined) {
        secondValue = tempValue.join("");
    }
}

const resetValues = (type) => {
    if (type === "partial") {
        firstValue = totalValue;
    } else {
        firstValue = 0;
    }
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
    const displayValueContainer = document.querySelector(".display-container");
    displayValueContainer.innerText = "What're you crazy!?!?!?!?!";
}

// BUTTON COLOR RELATED SUPPORT FUNCTIONS

const resetSpecificColors = (allButtons, buttonType) => {
    if (buttonType === "numbers") {
        allButtons.forEach((button) => {
            button.classList.remove("number-clicked");
        })
    } else if (buttonType === "operators") {
        allButtons.forEach((button) => {
            button.classList.remove("operator-clicked")
        })
    }
}

const resetAllColors = () => {
    const numberButtons = document.querySelectorAll(".number-button");
    const operatorButtons = document.querySelectorAll(".operator-button");
    numberButtons.forEach((button) => {
        button.classList.remove("number-clicked");
    })
    operatorButtons.forEach((button) => {
        button.classList.remove("operator-clicked");
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
updateDisplayValue(totalValue);
