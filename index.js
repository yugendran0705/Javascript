const display = document.getElementById('display');
const resultDisplay = document.getElementById('result');
let currentInput = '';

function append(element) {
    if (isValidInput(element)) {
        currentInput += element;
        updateDisplay();
        calculateRealTime();
    }
}

function calculateRealTime() {
    try {
        const expression = sanitizeInput(currentInput);
        const result = evaluateExpression(expression);
        resultDisplay.textContent = isFinite(result) ? `= ${result}` : '';
    } catch (e) {
        resultDisplay.textContent = '';
    }
}

function finalizeCalculation() {
    try {
        const expression = sanitizeInput(currentInput);
        const result = evaluateExpression(expression);
        if (isFinite(result)) {
            currentInput = result.toString();
            resultDisplay.textContent = '';
        }
    } catch (e) {
        currentInput = 'Error';
    }
    updateDisplay();
}

function clearDisplay() {
    currentInput = '';
    updateDisplay();
    resultDisplay.textContent = '';
}

function updateDisplay() {
    display.value = currentInput || '0'
    ;
}

function isValidInput(input) {
    // Allow digits, operators, and parentheses
    return /^[0-9+\-*/().×]$/.test(input);
}

function sanitizeInput(input) {
    // Replace '×' with '*'
    return input.replace(/×/g, '*');
}

function evaluateExpression(expression) {
    // Use Function constructor as a safer alternative to eval
    return new Function(`return (${expression})`)();
}

updateDisplay();

document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9' || ['.', '(', ')', '+', '-', '*', '/', '×'].includes(e.key)) append(e.key);
    if (e.key === 'Enter' || e.key === '=') finalizeCalculation();
    if (e.key === 'Escape') clearDisplay();
});