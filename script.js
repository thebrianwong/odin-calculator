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
            applyButtonColors(numberButtons, "numbers");
            button.classList.add("number-clicked");
            // numberButtons.forEach((button) => {
            //     button.classList.remove("number-clicked");
            // })
            // button.classList.add("number-clicked");
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
            // operatorButtons.forEach((button) => {
            //     button.classList.toggle("operator-clicked")
            // })
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
                applyButtonColors(operatorButtons, "operators");
                button.classList.add("operator-clicked")
                // operatorButtons.forEach((button) => {
                //     button.classList.remove("operator-clicked")
                // })
                // button.classList.add("operator-clicked")
                currentOperator = button.getAttribute("id");
                convertToFunction();
                firstValue = Number(firstValue);
                tempValue = "";
            }
        })
    })
    document.addEventListener("keydown", (event) => {
        if (event.key === "+" || event.key === "-" || event.key === "*" || event.key === "/") {
            chainOperators();
            applyButtonColors(operatorButtons, "operators");
            button.classList.add("operator-clicked")
            currentOperator = event.key;
            convertToFunction();
            firstValue = Number(firstValue);
            tempValue = "";
        }
    })
}

const chainOperators = () => {
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
}

// const trackOperator = () => {
//     if (firstValue !== undefined) {
//         applyButtonColors(operatorButtons, button, "operators");
//         currentOperator = button.getAttribute("id");
//         convertToFunction();
//         firstValue = Number(firstValue);
//         tempValue = "";
//     }
// }

const convertToFunction = () => {
    switch (currentOperator) {
        case "add":
        case "+":
            currentOperator = add;
            break;
        case "subtract":
        case "-":
            currentOperator = subtract;
            break;
        case "multiply":
        case "*":
            currentOperator = multiply;
            break;
        case "divide":
        case "/":
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
        // if (secondValue !== undefined) {
        //     resetButtonColors();
        //     secondValue = Number(secondValue);
        //     checkZeroDivision();
        //     if (secondValue !== 0) {
        //         totalValue = operate(currentOperator,firstValue,secondValue);
        //         totalValue = Math.round(totalValue * 10000) / 10000;
        //         console.log(totalValue)
        //         updateDisplayValue(totalValue);
        //     }
        //     resetValues();
        // }
        evaluateOperation();
    })
    document.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            removeButtonFocus();
            evaluateOperation();
        }
    })
}

const removeButtonFocus = () => {
    const allButtons = document.querySelectorAll("button");
    allButtons.forEach((button) => {
        button.blur();
    })
}

const evaluateOperation = () => {
    if (secondValue !== undefined) {
        resetButtonColors();
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
        resetButtonColors();
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

const addDecimalClicker = () => {
    const decimalButton = document.querySelector("#decimal");
    decimalButton.addEventListener("click", () => {
        // if (!tempValue.includes(".")) {
        //     if (tempValue === "") {
        //         tempValue = "0.";
        //     } else {
        //         tempValue = tempValue.concat(".");
        //     }
        //     trackValues(tempValue)
        //     if (currentOperator === undefined) {
        //         updateDisplayValue(firstValue);
        //     } else if (currentOperator !== undefined) {
        //         updateDisplayValue(secondValue);
        //     }
        // }   
        inputDecimalPoint();
    })
    document.addEventListener("keydown", (event) => {
        if (event.key === ".") {
            inputDecimalPoint();
        }
    })
}

const inputDecimalPoint = () => {
    if (!tempValue.includes(".")) {
        if (tempValue === "") {
            tempValue = "0.";
        } else {
            tempValue = tempValue.concat(".");
        }
        trackValues(tempValue)
        if (currentOperator === undefined) {
            updateDisplayValue(firstValue);
        } else if (currentOperator !== undefined) {
            updateDisplayValue(secondValue);
        }
    }   
}

const applyButtonColors = (allButtons, buttonType) => {
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

const resetButtonColors = () => {
    const numberButtons = document.querySelectorAll(".number-button");
    const operatorButtons = document.querySelectorAll(".operator-button");
    numberButtons.forEach((button) => {
        button.classList.remove("number-clicked");
    })
    operatorButtons.forEach((button) => {
        button.classList.remove("operator-clicked");
    })
}

let foo;
let bar;
const test = () => {
    document.addEventListener("keydown", (event) => {
        console.log(event.key)
        bar = KeyboardEvent.code
        if (event.key.charCodeAt() >= 48 && event.key.charCodeAt() <= 57) {
            foo = event.key
            console.log(foo)
        } else if (event.key === "+") {
            console.log("HE ID PLSU")
        }
        // foo = event.key
        // console.log(event.key)
    })
}

addNumberClickers();
addOperatorClickers();
addEqualsClicker();
addClearClicker();
addDeleteClicker();
addDecimalClicker();
updateDisplayValue(totalValue);

test();