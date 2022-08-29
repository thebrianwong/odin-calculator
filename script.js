let totalValue = 0;

let firstValue;
let secondValue;
let tempValue = "";
let currentOperator;

// EVENT LISTENER FUNCTIONS

const addNumberClickers = () => {
    const numberButtons = document.querySelectorAll(".number-button");
    let buttonValue;
    numberButtons.forEach((button) => {
        button.addEventListener("click", () => {
            resetSpecificColors(numberButtons, "numbers");
            button.classList.add("number-clicked");
            buttonValue = button.getAttribute("id").toString();
            inputNumber(buttonValue);
        })
    })
    document.addEventListener("keydown", (event) => {
        if (event.key.charCodeAt() >= 48 && event.key.charCodeAt() <= 57) {
            resetSpecificColors(numberButtons, "numbers");
            numberButtons.forEach((button) => {
                if (button.innerText === event.key) {
                    button.classList.add("number-clicked");
                }
            })
            buttonValue = event.key;
            inputNumber(buttonValue);
        }
    })
}

const addOperatorClickers = () => {
    const operatorButtons = document.querySelectorAll(".operator-button");
    operatorButtons.forEach((button) => {
        button.addEventListener("click", () => {
            chainOperators();
            if (firstValue !== undefined && tempValue.length > 0) {
                resetSpecificColors(operatorButtons, "operators");
                button.classList.add("operator-clicked")
                currentOperator = button.innerText;
                convertToFunction();
                firstValue = Number(firstValue);
                tempValue = "";
            }
        })
    })
    document.addEventListener("keydown", (event) => {
        if (event.key === "+" || event.key === "-" || event.key === "*" || event.key === "/") {
            chainOperators();
            if (firstValue !== undefined && tempValue.length > 0) {
                resetSpecificColors(operatorButtons, "operators");
                operatorButtons.forEach((button) => {
                    if (button.getAttribute("id") === event.key) {
                        button.classList.add("operator-clicked")
                    }
                })
                currentOperator = event.key;
                convertToFunction();
                firstValue = Number(firstValue);
                tempValue = "";
            }
        }
    })
}

const addEqualsClicker = () => {
    const equalsButton = document.querySelector("#equals");
    equalsButton.addEventListener("click", () => {
        evaluateOperation();
    })
    document.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
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
    document.addEventListener("keydown", (event => {
        if (event.key === "Backspace") {
            determineValueToUndo();
        }
    }))
}

const addDecimalClicker = () => {
    const decimalButton = document.querySelector("#decimal");
    decimalButton.addEventListener("click", () => {
        inputDecimalPoint();
    })
    document.addEventListener("keydown", (event) => {
        if (event.key === ".") {
            inputDecimalPoint();
        }
    })
}

// NUMBER SPECIFIC SUPPORT FUNCTIONS

const inputNumber = (buttonValue) => {
    tempValue = tempValue.concat(buttonValue);
    trackValues()
    if (currentOperator === undefined) {
        updateDisplayValue(firstValue);
    } else if (currentOperator !== undefined) {
        updateDisplayValue(secondValue);
    }
}

// OPERATOR SPECIFIC SUPPORT FUNCTIONS

const chainOperators = () => {
    if (firstValue !== undefined && secondValue !== undefined) {
        secondValue = Number(secondValue);
        checkZeroDivision();
        firstValue = totalValue;
        secondValue = undefined;
    }
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
    if (secondValue !== undefined && secondValue.length > 0) {
        resetAllColors();
        secondValue = Number(secondValue);
        checkZeroDivision();
        resetValues();
    }
}

// CLEAR SPECIFIC SUPPORT FUNCTIONS

const clearEverything = () => {
    resetAllColors();
    resetValues();
    updateDisplayValue(totalValue);
}

// UNDO SPECIFIC SUPPORT FUNCTIONS

const determineValueToUndo = () => {
    if (currentOperator === undefined && tempValue.length > 0) {
        undoLatestDigit();
        trackValues()
        displayPostUndo(firstValue);
    } else if (currentOperator !== undefined && secondValue !== undefined) {
        undoLatestDigit();
        trackValues()
        displayPostUndo(secondValue);
    }
}

const undoLatestDigit = () => {
    let latestDigit = tempValue.length - 1;
    if (latestDigit === 0) {
        tempValue = "";
    } else if (latestDigit > 0) {
        tempValue = tempValue.slice(0,latestDigit);
    }
    if (tempValue === "0") {
        tempValue = "";
    }
}

const displayPostUndo = (value) => {
    if (value === firstValue) {
        if (firstValue !== "") {
            updateDisplayValue(firstValue);
        } else {
            updateDisplayValue(totalValue);
        }
    } else if (value === secondValue) {
        if (secondValue !== "") {
            updateDisplayValue(secondValue);
        } else {
            updateDisplayValue(0);
        }
    }
}

// DECIMAL SPECIFIC SUPPORT FUNCTIONS

const inputDecimalPoint = () => {
    if (!tempValue.includes(".")) {
        if (tempValue === "") {
            tempValue = "0.";
        } else {
            tempValue = tempValue.concat(".");
        }
        trackValues()
        if (currentOperator === undefined) {
            updateDisplayValue(firstValue);
        } else if (currentOperator !== undefined) {
            updateDisplayValue(secondValue);
        }
    }   
}

// GENERAL VALUE RELATED SUPPORT FUNCTIONS

const updateDisplayValue = (value) => {
    const displayValueContainer = document.querySelector(".display-container");
    displayValueContainer.innerText = value;
}

const trackValues = () => {
    if (currentOperator === undefined) {
        firstValue = tempValue
    } else if (currentOperator !== undefined) {
        secondValue = tempValue;
    }
}

const resetValues = () => {
    firstValue = undefined;
    secondValue = undefined;
    tempValue = "";
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
