
// DOM elements

const DOM_CALCULATOR_BODY = document.querySelector('.calculator-body')
const DOM_CALCULATOR_DISPLAY_EQUATION = document.querySelector('.calculator-display-equation')
const DOM_CALCULATOR_DISPLAY_TERM = document.querySelector('.calculator-display-term')
const DOM_CALCULATOR_INPUTS = document.querySelector('.calculator-inputs')

// calculator

const CALCULATOR_BUTTON_LAYOUT = [
	'7', '8', '9', '+', '-',
	'4', '5', '6', '*', '/',
	'1', '2', '3', '%', '^',
	'.', '0', '=', 'C', 'AC'
]

const CALCULATOR_BUTTONS = {}

let equation = ''
let equationTerm = '0'
let canAddDecimal = true
const OPERATIONS = ['+', '-', '*', '/', '^']

function refreshCalculatorDisplay() {
	DOM_CALCULATOR_DISPLAY_EQUATION.innerText = equation
	DOM_CALCULATOR_DISPLAY_TERM.innerText = equationTerm
}

// types of calculator buttons

function evaluate(_equation) {
	let equation = ''
	for (let i=0; i<_equation.length; i++) {
		if (_equation[i] !== ' ')
			equation += _equation[i]
	}

	let leftTerm = ''
	let operation = ''
	let rightTerm = ''

	let foundLeft = false;
	for (let i=0; i<equation.length; i++) {
		if (OPERATIONS.includes(equation[i])) {
			foundLeft = true
			operation = equation[i]
			continue
		}

		if (foundLeft)
			rightTerm += equation[i]
		else
			leftTerm += equation[i]
	}

	leftTerm = Number(leftTerm)
	rightTerm = Number(rightTerm)
	result = 0
	switch (operation) {
		case '+':
			result = leftTerm + rightTerm
			break
		case '-':
			result = leftTerm - rightTerm
			break
		case '*':
			result = leftTerm * rightTerm
			break
		case '/':
			result = leftTerm / rightTerm
			break
		case '^':
			result = leftTerm ** rightTerm
	}
	
	return result.toFixed(2)
}

function makeNumberButton(_DOM_ELEMENT, _text) {
	_DOM_ELEMENT.classList.add('calculator-number-button')
	_DOM_ELEMENT.addEventListener('click', () => {

		if (equationTerm === '0')
			equationTerm = _text
		else
			equationTerm += _text

		refreshCalculatorDisplay()
	})

}

function makeDecimalButton(_DOM_ELEMENT, _text) {
	_DOM_ELEMENT.classList.add('calculator-decimal-button')
	_DOM_ELEMENT.addEventListener('click', () => {

		if (canAddDecimal) {
			equationTerm += _text
			canAddDecimal = false
			refreshCalculatorDisplay()
		}
	})
}

function makeClearButton(_DOM_ELEMENT, _text) {
	_DOM_ELEMENT.classList.add('calculator-clear-button')
	_DOM_ELEMENT.addEventListener('click', () => {
		if (equationTerm[equationTerm.length-1] === '.')
			canAddDecimal = true

		if (equationTerm.length === 1)
			equationTerm = '0'
		else
			equationTerm = equationTerm.slice(0, -1)

		refreshCalculatorDisplay()
	})
}

function makeAllClearButton(_DOM_ELEMENT, _text) {
	_DOM_ELEMENT.classList.add('calculator-all-clear-button')
	_DOM_ELEMENT.addEventListener('click', () => {
		equationTerm = '0'
		equation = ''
		canAddDecimal = true
		refreshCalculatorDisplay()
	})
}

function makeOperationButton(_DOM_ELEMENT, _text) {
	_DOM_ELEMENT.classList.add('calculator-operation-button')
	_DOM_ELEMENT.addEventListener('click', () => {
		if (_text === '%') {
			if (equation.length === 0) {
				equationTerm = (Number(equationTerm) / 100).toFixed(2);
			}
			else {
				let result = `${evaluate(equation+equationTerm)}`
				equationTerm = (result/100).toFixed(2);
			}

			refreshCalculatorDisplay()
			return
		}

		_text = ' ' + _text
		canAddDecimal = true

		if (equation.length === 0) {
			equation = equationTerm + _text
			equationTerm = '0'
		}

		else {
			equation = `${evaluate(equation+equationTerm)}${_text}`
			equationTerm = '0'
		}
			
		refreshCalculatorDisplay()
	})

}

// fill calculator inputs

CALCULATOR_BUTTON_LAYOUT.forEach( (BUTTON_TEXT) => {

	// create dom button

	const DOM_CALCULATOR_BUTTON = document.createElement('button')
	DOM_CALCULATOR_BUTTON.classList.add('calculator-button')
	DOM_CALCULATOR_BUTTON.innerText = BUTTON_TEXT

	// make button function
	if ( !isNaN(Number(BUTTON_TEXT)) )
		makeNumberButton(DOM_CALCULATOR_BUTTON, BUTTON_TEXT)

	else if (BUTTON_TEXT === '.')
		makeDecimalButton(DOM_CALCULATOR_BUTTON, BUTTON_TEXT)

	else if (BUTTON_TEXT === 'C')
		makeClearButton(DOM_CALCULATOR_BUTTON, BUTTON_TEXT)

	else if (BUTTON_TEXT === 'AC')
		makeAllClearButton(DOM_CALCULATOR_BUTTON, BUTTON_TEXT)

	else if (BUTTON_TEXT === '=')
	{}

	else
		makeOperationButton(DOM_CALCULATOR_BUTTON, BUTTON_TEXT)

	// add dom button to calculator inputs
	DOM_CALCULATOR_INPUTS.appendChild(DOM_CALCULATOR_BUTTON)
	CALCULATOR_BUTTONS[BUTTON_TEXT] = DOM_CALCULATOR_BUTTON

} )

// fill calculator display
refreshCalculatorDisplay()
