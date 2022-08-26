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
            currentOperator = button.getAttribute("id");
            convertToFunction();
            firstValue = Number(firstValue);
            tempValue = "";
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
        secondValue = Number(secondValue);
        totalValue = operate(currentOperator,firstValue,secondValue);
        updateDisplayValue(totalValue);
        resetValues();
    })
}

const resetValues = () => {
    firstValue = undefined;
    secondValue = undefined;
    tempValue = "";
    currentOperator = undefined;
    totalValue = 0;
}

addNumberClickers();
addOperatorClickers();
addEqualsClicker();
updateDisplayValue(totalValue);