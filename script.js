let displayValue = 0;

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
            updateDisplayValue();
        })
    })
}

const updateDisplayValue = () => {
    const displayValueContainer = document.querySelector(".display-container");
    displayValueContainer.innerText = displayValue;
}

addNumberClickers();