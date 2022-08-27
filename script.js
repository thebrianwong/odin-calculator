let totalValue = 0;

let firstValue;
let secondValue;
let tempValue = "";
let currentOperator;

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

const addNumberClickers = () => {
    const numberButtons = document.querySelectorAll(".number-button");
    numberButtons.forEach((button) => {
        button.addEventListener("click", () => {
            // tempValue = Number(button.innerText);
            let buttonValue = button.getAttribute("id").toString();
            tempValue = tempValue.concat(buttonValue);
            // tempValue += buttonValue
            console.log(typeof tempValue)
            console.log(tempValue)
            trackValues(tempValue)
            if (currentOperator === undefined) {
                updateDisplayValue(firstValue);
            } else if (currentOperator !== undefined) {
                updateDisplayValue(secondValue);
            }
            // trackValues(tempValue)
            console.log(firstValue)
            console.log(secondValue)
        })
    })
}

const updateDisplayValue = (value) => {
    const displayValueContainer = document.querySelector(".display-container");
    displayValueContainer.innerText = value;
}

const addOperatorClickers = () => {
    const operatorButtons = document.querySelectorAll(".operator-button");
    operatorButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (firstValue !== undefined && secondValue !== undefined) {
                secondValue = Number(secondValue);
                checkZeroDivision();
                if (secondValue !== 0) {
                    totalValue = operate(currentOperator,firstValue,secondValue);
                    totalValue = Math.round(totalValue * 10000) / 10000;
                    updateDisplayValue(totalValue);
                }
                firstValue = totalValue;
                secondValue = undefined;
            }
            if (firstValue !== undefined) {
                currentOperator = button.getAttribute("id");
                convertToFunction();
                firstValue = Number(firstValue);
                tempValue = "";
            }
        })
    })
}

const convertToFunction = () => {
    switch (currentOperator) {
        case "add":
            currentOperator = add;
            break;
        case "subtract":
            currentOperator = subtract;
            break;
        case "multiply":
            currentOperator = multiply;
            break;
        case "divide":
            currentOperator = divide;
    }
}

const trackValues = (value) => {
    if (currentOperator === undefined) {
        // console.log(value)
        // firstValue.push(value);
        // firstValue.join("");
        firstValue = value
    } else if (currentOperator !== undefined) {
        secondValue = value;
    }
}

const addEqualsClicker = () => {
    const equalsButton = document.querySelector("#equals");
    equalsButton.addEventListener("click", () => {
        if (secondValue !== undefined) {
            secondValue = Number(secondValue);
            checkZeroDivision();
            if (secondValue !== 0) {
                totalValue = operate(currentOperator,firstValue,secondValue);
                totalValue = Math.round(totalValue * 10000) / 10000;
                console.log(totalValue)
                updateDisplayValue(totalValue);
            }
            resetValues();
        }
    })
}

const resetValues = () => {
    firstValue = undefined;
    secondValue = undefined;
    tempValue = "";
    currentOperator = undefined;
    totalValue = 0;
}

const addClearClicker = () => {
    const clearButton = document.querySelector("#clear");
    clearButton.addEventListener("click", () => {
        resetValues();
        updateDisplayValue(totalValue);
    })
}

const checkZeroDivision = () => {
    if (secondValue === 0 && currentOperator === divide) {
        rejectZeroDivision();
    }
}

const rejectZeroDivision = () => {
    const displayValueContainer = document.querySelector(".display-container");
    displayValueContainer.innerText = "What're you crazy!?!?!?!?!";
}

const addDeleteClicker = () => {
    const deleteButton = document.querySelector("#delete");
    deleteButton.addEventListener("click", () => {
        if (currentOperator === undefined) {
            console.log(tempValue)
            console.log(firstValue)
            console.log(typeof firstValue)
            // trackValues(tempValue)
            deleteLatestDigit();
            trackValues(tempValue)
            if (firstValue !== "") {
                updateDisplayValue(firstValue);
            } else {
                updateDisplayValue(totalValue);
            }
        } else if (currentOperator !== undefined) {
            deleteLatestDigit();
            trackValues(tempValue)
            if (secondValue !== "") {
                updateDisplayValue(secondValue);
            } else {
                updateDisplayValue(totalValue);
            }
        }
    })
}

const deleteLatestDigit = () => {
    let latestDigit = tempValue.length - 1;
    if (latestDigit === 0) {
        tempValue = "";
    } else if (latestDigit > 0) {
        tempValue = tempValue.slice(0,latestDigit);
    }
}

addNumberClickers();
addOperatorClickers();
addEqualsClicker();
addClearClicker();
addDeleteClicker();
updateDisplayValue(totalValue);