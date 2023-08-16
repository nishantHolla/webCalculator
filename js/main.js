
// DOM elements

const DOM_CALCULATOR_BODY = document.querySelector('.calculator-body')
const DOM_CALCULATOR_DISPLAY_EQUATION = document.querySelector('.calculator-display-equation')
const DOM_CALCULATOR_DISPLAY_TERM = document.querySelector('.calculator-display-term')
const DOM_CALCULATOR_INPUTS = document.querySelector('.calculator-inputs')

// calculator

const CALCULATOR_BUTTON_LAYOUT = [
	'7', '8', '9', '+', '-', 'sin', 'cos',
	'4', '5', '6', '*', '/', 'tan', 'rad',
	'1', '2', '3', '%', '^', '1/x', '+/-',
	'.', '0', '=', 'C', 'AC'
]

const CALCULATOR_BUTTONS = {}

const PRECISION = 8
let equation = ''
let equationTerm = '0'
let canAddDecimal = true
let isAngleUnitRad = true
const OPERATIONS = ['+', '-', '*', '/', '^', '%']

function refreshCalculatorDisplay() {
	DOM_CALCULATOR_DISPLAY_EQUATION.innerText = equation
	DOM_CALCULATOR_DISPLAY_TERM.innerText = equationTerm
	canAddDecimal = !equationTerm.includes('.')
}

function formatResult(_result) {
	return `${parseFloat(Number(_result).toFixed(PRECISION))}`
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
	let startIndex = 0
	let leftIsNegitive = false;

	if (_equation[0] === '-') {
		startIndex = 1
		leftIsNegitive = true
	}
	for (let i=startIndex; i<equation.length; i++) {
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
	leftTerm = leftIsNegitive ? leftTerm * (-1) : leftTerm;
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
	
	return formatResult(result)
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
			refreshCalculatorDisplay()
		}
	})
}

function makeClearButton(_DOM_ELEMENT, _text) {
	_DOM_ELEMENT.classList.add('calculator-clear-button', 'grid-col-span-2')
	_DOM_ELEMENT.addEventListener('click', () => {

		if (equationTerm.length === 1)
			equationTerm = '0'
		else
			equationTerm = equationTerm.slice(0, -1)

		refreshCalculatorDisplay()
	})
}

function makeAllClearButton(_DOM_ELEMENT, _text) {
	_DOM_ELEMENT.classList.add('calculator-all-clear-button', 'grid-col-span-2')
	_DOM_ELEMENT.addEventListener('click', () => {
		equationTerm = '0'
		equation = ''
		refreshCalculatorDisplay()
	})
}

function makeEqualsToButton(_DOM_ELEMENT, _text) {
	_DOM_ELEMENT.classList.add('calculator-equals-to-button')
	_DOM_ELEMENT.addEventListener('click', () => {
		if (equation.length === 0)
			return

		equationTerm = `${evaluate(equation+equationTerm)}`
		equation = ''
		refreshCalculatorDisplay()
	})
}

function makeOperationButton(_DOM_ELEMENT, _text) {
	_DOM_ELEMENT.classList.add('calculator-operation-button')
	_DOM_ELEMENT.addEventListener('click', () => {
		if (_text === '%') {
			if (equation.length === 0) {
				equationTerm = formatResult(Number(equationTerm) / 100)
			}
			else {
				let result = `${evaluate(equation+equationTerm)}`
				equationTerm = formatResult(result/100)
			}

			equation = ''
			refreshCalculatorDisplay()
			return
		}

		_text = ' ' + _text

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

function makeTrigButton(_DOM_ELEMENT, _text) {
	_DOM_ELEMENT.classList.add('calculator-trig-button')
	let trigFunction = undefined
	switch (_text) {
		case 'tan':
			trigFunction = Math.tan
			break
		case 'sin':
			trigFunction = Math.sin
			break
		case 'cos':
			trigFunction = Math.cos
			break
	}
	_DOM_ELEMENT.addEventListener('click', () => {
		if (equation !== '')
			equationTerm = `${evaluate(equation + equationTerm)}`

		equation = ''
		if (!isAngleUnitRad)
			equationTerm = `${Math.PI * Number(equationTerm)/180.0}`

		equationTerm = `${trigFunction(Number(equationTerm))}`
		equationTerm = formatResult(equationTerm)
		refreshCalculatorDisplay()
	})
}

function makeAngleButton(_DOM_ELEMENT, _text) {
	_DOM_ELEMENT.classList.add('calculator-angle-button', 'calculator-angle-rad-button')
	_DOM_ELEMENT.addEventListener('click', () => {
		isAngleUnitRad = !isAngleUnitRad

		if (isAngleUnitRad) {
			_DOM_ELEMENT.classList.remove('calculator-angle-degree-button')
			_DOM_ELEMENT.classList.add('calculator-angle-rad-button')
			_DOM_ELEMENT.innerText = 'rad'
		}
		else {
			_DOM_ELEMENT.classList.add('calculator-angle-degree-button')
			_DOM_ELEMENT.classList.remove('calculator-angle-rad-button')
			_DOM_ELEMENT.innerText = 'deg'
		}
	})
}

function makeInversionButton(_DOM_ELEMENT, _text) {
	_DOM_ELEMENT.classList.add('calculator-inversion-button')
	_DOM_ELEMENT.addEventListener('click', () => {
		if (equation.length !== 0) {
			equation += equationTerm
			equationTerm = `${evaluate(equation) * (-1)}`
			equation = ''
			refreshCalculatorDisplay()
			return
		}

		else if (equationTerm === '0') {
			return
		}
		
		equationTerm = `${Number(equationTerm) * (-1)}`
		refreshCalculatorDisplay()

	})
}

function makeOneOverButton(_DOM_ELEMENT, _text) {
	_DOM_ELEMENT.classList.add('calculator-one-over-button')
	_DOM_ELEMENT.addEventListener('click', () => {

		if (equation.length !== 0)
			equationTerm = `${evaluate(equation + equationTerm)}`

		equation = ''
		equationTerm = `${evaluate('1/' + equationTerm)}`
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
		makeEqualsToButton(DOM_CALCULATOR_BUTTON, BUTTON_TEXT)

	else if (OPERATIONS.includes(BUTTON_TEXT))
		makeOperationButton(DOM_CALCULATOR_BUTTON, BUTTON_TEXT)

	else if (BUTTON_TEXT === '+/-')
		makeInversionButton(DOM_CALCULATOR_BUTTON, BUTTON_TEXT)

	else if (BUTTON_TEXT === '1/x')
		makeOneOverButton(DOM_CALCULATOR_BUTTON, BUTTON_TEXT)

	else if (BUTTON_TEXT === 'rad')
		makeAngleButton(DOM_CALCULATOR_BUTTON, BUTTON_TEXT)

	else
		makeTrigButton(DOM_CALCULATOR_BUTTON, BUTTON_TEXT)

	// add dom button to calculator inputs
	DOM_CALCULATOR_INPUTS.appendChild(DOM_CALCULATOR_BUTTON)
	CALCULATOR_BUTTONS[BUTTON_TEXT] = DOM_CALCULATOR_BUTTON

} )

// fill calculator display
refreshCalculatorDisplay()
