//
// Update Listener
//

// Massive thanks to Intervalia on StackOverflow for this shadow clone function
// https://stackoverflow.com/questions/27170043/how-can-i-clone-a-shadowroot
let _tersum_cloneShadow = function(shadow) {
	const frag = document.createDocumentFragment();
  	var nodes = [...shadow.childNodes];
  	nodes.forEach(
    	node => {
      		node.remove();
      		frag.appendChild(node.cloneNode(true));
      		shadow.appendChild(node);
    	}
  	);
  	return frag;
}

const _tersum_updateListner = function(obj,prop, val){
	// Find the necessary template variables element
	let search = obj.inner.querySelectorAll(`[_tersus-ref='${prop}']`);
	// Determie if a custom function is being used to handle the update
	if(val.using){
		// A custom function is being used
		// Update the property inline with what is set
		// Run the custom function
		search.forEach((elem) => {
			val.using(elem, val.value, {obj: obj, prop: prop});
		});
	} else {
		// A custom function is not being used
		// Update the property inline with what is set
		// Replace each instance of the element with the new value
		search.forEach((elem) => {
			_tersum_update(elem, val, {obj: obj, prop: prop});
		});
	}
	// Dispatch the updated Event
	let updated = new CustomEvent('updated', {
		detail: {
			obj: obj,
			prop: prop,
			val: obj[prop],
		}
	});
	obj.outer.dispatchEvent(updated);
}

//
// define
//

const _tersum_defineVariableHelper = function() {
	if(!customElements.get('tersum-variablehelper')){
		window.customElements.define('tersum-variablehelper', class extends HTMLElement {
			constructor() {
				super(); 
			}
		});
	}
}

const _tersum_defineTemplate = function(elementName) {
	window.customElements.define(elementName, class extends HTMLElement {
		constructor() {
			super(); 
		}
		// Register a connectedCallback inorder to invoke the 'connected' event listener
		connectedCallback() {
			var connected = new Event('connected');
			this.dispatchEvent(connected);
		}
		// Register a connectedCallback inorder to invoke the 'disconnected' event listener
		disconnectedCallback() {
			var disconnected = new Event('disconnected');
			this.dispatchEvent(disconnected);
		}
	});
}

const _tersum_define = function(data) {
	// Ensure the 'tersus-variablehelper' is defined - this is used for initiating
	// and updating tersus variables, as the Define method has to be called before 
	// an element can be created, this is the best place to check for it. 
	_tersum_defineVariableHelper();
	// Ensure the defined template contains a refrence to it's defintion
	this.data = data;
	// Ensure an element name and template was provided for the custom element
	if(!this.data.elementName) {
		console.error('A custom element name must be defined');
	} else {
		this.data.elementName = this.data.elementName.toLowerCase() + '-tersum';
	}
	if(!this.data.template) {
		console.error('Tersus', 'A template must be defined');
	}
	// Define the custom element using the provided name
	_tersum_defineTemplate(this.data.elementName);
	
	// Provide a method for determening when an element has been updated
	this.UpdateListener = _tersum_updateListner;
	// Create empty registry for storing refrences to created elements
	this.registry = [];
}

//
// create
//

const _tersum_constructor = function(template, attr) {
	// Get the defined element name from the provided template
	this.elementName = template.data.elementName;
	// Get the data from our provided template
	this.template = template.data.template;
	// Create an instance of our element from the custom elements register
	this.outer = document.createElement(this.elementName);
	// Generate a shadow DOM and attach it to our element
	this.inner = this.outer.attachShadow({mode: 'open'}); 
	// Append any global attributes inherited from our template to our element
	if(template.data.globalAttributes) {
		for (const [key, value] of Object.entries(template.data.globalAttributes)) {
			this.outer.setAttribute(`${key}`, `${value}`);
		}
	}
	// Create and connect any styles inherited from our template to our element 
	if(template.data.styles) {
		const style = document.createElement('style');
		style.textContent = template.data.styles;
		this.inner.appendChild(style);
	}
	// Append any instance specific attributes to our element
	if(attr.attributes) {
		for (const [key, value] of Object.entries(attr.attributes)) {
			this.outer.setAttribute(`${key}`, `${value}`);
		}
	}
	// Replace any template variables with variable helpers
	let regex = new RegExp(/{-(.*?)-}/g),
		result,
		templateVariableSearcher = [];
	do {
		result = regex.exec(this.template);
		if (result) {
			templateVariableSearcher.push(result[0]);
					
			let templateVariable = result[0];
			let key = templateVariable.replace(/^{-|\-}$/gm, '');
				
			let variableElement = document.createElement('tersum-variablehelper');
			variableElement.setAttribute(`_tersus-ref`, `${key}`);
			this.template = this.template.replace(templateVariable, variableElement.outerHTML);
				
			this[key] = null;
		}
	} while (result);
	// Connect template to element shadow DOM
	this.inner.innerHTML += this.template;
	// Append any variables to the relevant variable helpers
	if(attr.variables) {
		for (const [key, value] of Object.entries(attr.variables)) {
			if(!(key in this)) {
				console.error(`Supplied variable '${key}' does not exist in element '${this.elementName}'`);
			} else {
				template.UpdateListener(this, key, value); 
			}
		}
	}
}

const _tersum_handler = function(template){
	return {
		get: (obj, prop, val) => {
			if (prop in obj) {
				return obj[prop];
			} else {
				return undefined;
			}
		},
		set: (obj, prop, val) => {
			// If the variable the user is trying to update doesn't exist, throw an error and do not
			// move on to the updateListener
			if(!(prop in obj)) {
				console.error(`Supplied variable '${prop}' does not exist in element '${obj.elementName}'`);
				return true;
			}
			template.UpdateListener(obj, prop, val); 
			return true;
		}
	};
}

const _tersum_create = function(template, attr) {
	// Create our custom object constructor 
	this.constructor = new _tersum_constructor(template, attr);
	// Create our custom object handler
	this.handler = _tersum_handler(template);
	// Bind our constructor and handler in a proxy, to handle global getting and setting of template variables
	let elementProxy = new Proxy(this.constructor, this.handler);
	// Push a refrence to our element to the templates registry, and then return our element
	template.registry.push(elementProxy);
	return elementProxy;
}

//
// update
//

const _tersum_update = function(elem, val, ref) {
	return new Promise((resolve, reject) => {
		let obj = ref.obj,
			prop = ref.prop;
		if(val instanceof _tersum_constructor){
			// If the provided value is _tersum_constructor, create a Range() for it
			let valClone = val.outer.cloneNode(false);
			valClone.attachShadow({mode:'open'}).appendChild(_tersum_cloneShadow(val.inner));			
			obj[prop] = valClone;
			elem.textContent = '';
			elem.appendChild(obj[prop]);
			resolve(true);
		} else if(val instanceof HTMLElement) {
			let valClone = val.cloneNode(true);
			obj[prop] = valClone;
			elem.textContent = '';
			elem.appendChild(obj[prop]);
			resolve(true);
		} else {
			obj[prop] = val;
			elem.innerHTML = obj[prop];
			resolve(true);
		}
		resolve(false);
	});
}

//
// Tersum
//

const Tersum = {
	Define: _tersum_define,
	Create: _tersum_create,
	Update: _tersum_update,
};
