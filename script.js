let displayValue = 0;

let firstValue;
let secondValue;
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
            displayValue = Number(button.innerText);
            if (firstValue === undefined || secondValue === undefined){
                updateDisplayValue();
            }
            trackValues(displayValue)
            console.log(firstValue)
            console.log(secondValue)
        })
    })
}

const updateDisplayValue = () => {
    const displayValueContainer = document.querySelector(".display-container");
    displayValueContainer.innerText = displayValue;
}

const addOperatorClickers = () => {
    const operatorButtons = document.querySelectorAll(".operator-button");
    operatorButtons.forEach((button) => {
        button.addEventListener("click", () => {
            currentOperator = button.getAttribute("id");
            console.log(currentOperator)
        })
    })
}

const trackValues = (value) => {
    if (firstValue === undefined) {
        firstValue = value;
    } else if (secondValue === undefined) {
        secondValue = value;
    }
}

addNumberClickers();
addOperatorClickers();