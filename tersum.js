const Tersum = {
	Define: function(data) {
		// Ensure the 'tersus-variablehelper' is defined - this is used for initiating
		// and updating tersus variables, as the Define method has to be called before 
		// an element can be created, this is the best place to check for it. 
		if(!customElements.get('tersus-variablehelper')){
			window.customElements.define('tersus-variablehelper', class extends HTMLElement {
				constructor() {
					super(); 
				}
			});
		}
		// Ensure the defined template contains a refrence to it's defintion
		this.data = data;
		// Ensure an element name was provided for the custom element
		this.elementName = '';
		if(!data.element) {
			console.error('A custom element name must be defined');
			return false;
		} else {
			this.elementName = (data.element + '-template').toLowerCase();
		}
		// Define the custom element using the provided name
		window.customElements.define(this.elementName, class extends HTMLElement {
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
		// Provide a method for determening when an element has been updated
		this.UpdateListener = function(obj,prop, val) {
			// Find the necessary template variables element
			let search = obj.inner.querySelectorAll(`[_tersus-ref='${prop}']`);
			// Determie if a custom function is being used to handle the update
			if(val.using){
				// A custom function is being used
				if(!(val.value instanceof HTMLElement)){
					// If the provided value is not an HTMLELement object, create a Range() for it
					val.value = document.createRange().createContextualFragment(val.value);
				} 
				// Update the property inline with what is set
				obj[prop] = val.value;
				// Run the custom function
				search.forEach((elem) => {
					val.using(elem, obj[prop]);
				});
			} else {
				// A custom function is not being used
				if(!(val instanceof HTMLElement)){
					// If the provided value is not an HTMLELement object, create a Range() for it
					val = document.createRange().createContextualFragment(val);
				} 
				// Update the property inline with what is set
				obj[prop] = val;
				// Replace each instance of the element with the new value
				search.forEach((elem) => {
					elem.innerHTML = '';
					elem.appendChild(obj[prop]);
				});
			}
			// Dispatch the updated Event
			let updated = new CustomEvent('updated', {
				detail: {
					prop: prop,
					val: obj[prop],
				}
			});
			obj.outer.dispatchEvent(updated);
		};
		// Create empty registry for storing refrences to created elements
		this.registry = [];
	},
	Create: function(template, attr) {
		// Ensure the provided template contains a name
		if(!template.elementName) {
			console.error('The provided template did not contain a custom element name');
			return false;
		}
		// Create our custom object constructor 
		this.constructor = new (function() {
			// Get the defined element name from the provided template
			this.elementName = template.elementName;
			// Get the data from our provided template
			this.data = template.data;
			// Create an instance of our element from the custom elements register
			this.outer = document.createElement(this.elementName);
			// Generate a shadow DOM and attach it to our element
			this.inner = this.outer.attachShadow({mode: 'open'}); 
			// Append any global attributes inherited from our template to our element
			if(this.data.globalAttributes) {
				for (const [key, value] of Object.entries(this.data.globalAttributes)) {
					this.outer.setAttribute(`${key}`, `${value}`);
				}
			}
			// Create and connect any styles inherited from our template to our element 
			if(this.data.styles) {
				const style = document.createElement('style');
				style.textContent = this.data.styles;
				this.inner.appendChild(style);
			}
			// Retrive the template for our element 
			var templateBuffer = '';
			if(this.data.template) {
				templateBuffer = this.data.template;
			} 
			// Append any instance specific attributes to our element
			if(attr.attributes) {
				for (const [key, value] of Object.entries(attr.attributes)) {
					this.outer.setAttribute(`${key}`, `${value}`);
				}
			}
			// Replace any template variables with initialiser variables
			if(attr.variables) {
				let regex = new RegExp(/{-(.*?)-}/g),
					result,
					templateVariableSearcher = [];
				do {
					result = regex.exec(templateBuffer);
					if (result) {
						templateVariableSearcher.push(result[0]);
					}
				} while (result);
				for (const [key, value] of Object.entries(attr.variables)) {
					let cleanVariable = '{-' + key + '-}';
					if(!templateVariableSearcher.includes(cleanVariable)) {
						console.warn(`Supplied Variable '${key}' does not exist in element '${this.elementName}'`);
					}
				}
				for (const [key, value] of Object.entries(attr.variables)) {
					this[key] = value;
					let variableElement = document.createElement('tersus-variablehelper');
					variableElement.setAttribute(`_tersus-ref`, `${key}`);
					variableElement.innerHTML = value;
					let cleanVariable = '{-' + key + '-}';
					for(let ref in templateVariableSearcher) {
						if(cleanVariable === templateVariableSearcher[ref]) {
							templateBuffer = templateBuffer.replace(templateVariableSearcher[ref], variableElement.outerHTML);
						}
					}
				}
			}
			// Connect template to element shadow DOM
			this.inner.innerHTML += templateBuffer;
		})();
		// Create our custom object handler
		this.handler = {
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
		// Bind our constructor and handler in a proxy, to handle global getting and setting of template variables
		let elementProxy = new Proxy(this.constructor, this.handler);
		// Push a refrence to our element to the templates registry, and then return our element
		template.registry.push(elementProxy);
		return elementProxy;
	}
};

export { Tersum };
