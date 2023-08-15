
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

function refreshCalculatorDisplay() {
	DOM_CALCULATOR_DISPLAY_EQUATION.innerText = equation
	DOM_CALCULATOR_DISPLAY_TERM.innerText = equationTerm
}

// types of calculator buttons

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

// fill calculator inputs

CALCULATOR_BUTTON_LAYOUT.forEach( (BUTTON_TEXT) => {

	// create dom button

	const DOM_CALCULATOR_BUTTON = document.createElement('button')
	DOM_CALCULATOR_BUTTON.classList.add('calculator-button')
	DOM_CALCULATOR_BUTTON.innerText = BUTTON_TEXT

	// make button function
	if ( !isNaN(Number(BUTTON_TEXT)) )
		makeNumberButton(DOM_CALCULATOR_BUTTON, BUTTON_TEXT)

	// add dom button to calculator inputs
	DOM_CALCULATOR_INPUTS.appendChild(DOM_CALCULATOR_BUTTON)
	CALCULATOR_BUTTONS[BUTTON_TEXT] = DOM_CALCULATOR_BUTTON

} )

// fill calculator display
refreshCalculatorDisplay()
