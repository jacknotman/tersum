# tersum.js

## About

tersum.js is a lightweight Template Controller Framework built to compliment Vanilla JS, focused on making it easier to create lightweight, resuable, and adaptive components for use in your Web Application. 

In the **Getting Started Guide** we will walk through how the tersum.js framework can be used to create adaptive, fast, developer friendly web applications, with the power and versatility of vastly more complex frameworks. Alternatively, scroll to the end of this document for a few more simple examples.  

## Getting Started Guide

Getting started with tersum.js is easy, firstly let's start off with a basic Hello World example, and expand things from there.

The complete js code for this example is as follows, and we will break down what each component does in more detail throughout this guide. Alternatively, some more simple examples can be found at the bottom of this document.  

```javascript
const myFirstTemplate = new Tersum.Define({
	element: 'helloWorld',
	template: `<p>{-message-}</p>`,
});

const myFirstElement = new Tersum.Create(myFirstTemplate, {
	variables: {
		message: `Hello World!`,
	},
});

document.body.appendChild(myFirstElement.outer);
```

To get started we first have to create an html file, with script tag pointing to `tersum.min.js` and your main js file like so:

```HTML
<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>My First tersum.js App</title>
        <meta name="description" content="My Awesome App">
    </head>
    <body>
	<script type="text/javascript" src="tersum.min.js"></script>
        <script type="text/javascript" src="main.js"></script>
    </body>
</html>
```

Once you have created your HTML file, you will first have to define a Tersum.js **Template** within you main js file. Tersum.js **Template's** act as the building blocks of your application, and with them you can do many great things, but first let's start out with something simple, like the code below:

```javascript
const myFirstTemplate = new Tersum.Define({
	element: 'helloWorld',
	template: `<p>{-message-}</p>`,
});
```

You have now defined your first Tersum.js **Template**, _awesome!_ As you can see we pass an object to the `Tersum.Define` constructor containing two parameters that must be passed when creating any Tersum.js **Template**, these are `element` and `template` (Don't worry, there's a _lot_ more you can do with tersum.js **Templates**, but we can get into down the line). 

_**But what are**_ `element` _**and**_ `template` _**doing?**_

* `element` is a `DOMString` representing the name of your Tersum.js Template, as Tersum.js is built upon the Custom Elements Web Component all Tersum.js elements will be created as Custom Elements, you do not however have to worry about case, or using a dash, as Tersum.js takes care of this for you. Using our example from above you will be generating a template like so: 

```html
<helloworld-tersum>
	...
</helloworld-tersum>
```

* `template` is a `Template Literal` representing the content of our Tersum.js **Template**, Tersum.js **Template's** contain HTML Markup, and make use of Tersum.js **Template Variables**, denoted like so `{-aVariable-}` to allow for the initialisation, retrieval, and updating of DOM data - but more on that later. 

Now that you have defined you first Tersum.js **Template** it is time to create your first Tersum.js **Element**. Tersum.js **Element's** function much like regular DOM Objects, however with a few key exceptions which we will explore in more detail later in this tutorial. To create a simple Tersum.js **Element** you can use the following code:

```javascript
const myFirstElement = new Tersum.Create(myFirstTemplate, {
	variables: {
		message: `Hello World!`,
	},
});
```

As you can see the `Tersum.create` constructor takes two arguments, firstly a refrence to the tersum.js **Template** we created previously and an object containing a further object, `variables`. As with the the `tersum.Define` constructor, there is a lot more we can do with these elements, however we will keep things simple for now. 

_**But what does**_ `variables` _**do?**_

* `variables` is an object, representing a series of key and value pairs, correspoding to the Tersum.js **Template Variables** we created in our tersum.js **Template**, in the above example this is `{-message-}` when a tersum.js **Element** is created we replace these variables using the corresponding key : value pair defined in our `variables` object, so using the above example `{-message-}` will be replaced with `Hello World!`.

Now that we have created our Tersum.js **Element** we can display it within to our application, this is where the key differences between Tersum.js **Element's** and regular `DOM Objects` become most apparent. Our Tersum.js **Element** has a number of properties available, the two most important of which being `outer` and `inner`. 

_**But what are**_ `outer` _**and**_ `inner` _**?**_

* `outer` refers to the Custom Element defined previously, and will most commonly be used for appending our tersum.js **Element's** to the dom, or when handeling Lifecycle callbacks through Event Handlers. 

* `inner` refers to the `Shadow DOM` contained within our `outer` container, this is where the contents of our `template` from the tersum.js **Template** we created will be placed. 

Now that you have some understanding of how the `outer` and `inner` properties of our Tersum.js **Element** function, we can move on to appending our Tersum.js **Element** to the DOM, we will place our Tersum.js **Element** message into the document body like so:

```javascript
document.body.appendChild(myFirstElement.outer);
```

Your complete javascript code should now look something like the following:

```javascript
const myFirstTemplate = new Tersum.Define({
	element: 'helloWorld',
	template: `<p>{-message-}</p>`,
});

const myFirstElement = new Tersum.Create(myFirstTemplate, {
	variables: {
		message: `Hello World!`,
	},
});

document.body.appendChild(myFirstElement.outer);
```

And you should see the message `Hello World!` outputed when you visit your .htm file in the browser. 

If you inspect this element, you should see HTML Markup similar to the following: 

```html 
<body>
	<helloworld-template>
		#shadow-root (open)
			<p> Hello World! </p>
	</helloworld-template>
</body>
```

## Some Simple Examples

**This example will print 'Hello World!' to the DOM, and then automatically update it to read 'Goodbye Friend!' after 3 seconds.**
```Javascript
const myFirstTemplate = new Tersum.Define({
	element: 'helloFriend',
	template: `<p>{-message_part_1-} Friend!</p>`,
});

const myFirstElement = new Tersum.Create(myFirstTemplate, {
	variables: {
		message_part_1: `Hello`,
	},
});

document.body.appendChild(myFirstElement.outer); // A Custom Element is appended with a <p> element containing the text 'Hello World!'

setTimeout(() => {
	myFirstElement.message_part_1 = 'Goodbye'; 
}, 3000); // After three seconds we update the DOM to read 'Goodbye Friend!'
```

**This example will print 'Hello World!' to the DOM, and then automatically update it to read 'Hello Friend!', using** `element.animate()`, **after 3 seconds.**
```Javascript
const myFirstTemplate = new Tersum.Define({
	element: 'helloWorld',
	template: `<p>{-message_part_1-} {-message_part_2-}</p>`,
});

const myFirstElement = new Tersum.Create(myFirstTemplate, {
	variables: {
		message_part_1: `Hello`,
		message_part_2: `World!`,
	},
});

document.body.appendChild(myFirstElement.outer); // A Custom Element is appended with a <p> element containing the text 'Hello World!'

setTimeout(() => { 
	myFirstElement.message_part_2 = {
		value: `<i>Friend!</i>`,
		using: (elem, val, ref) => {
			let duration = 1000;
			let fadeOut = elem.animate([
				// keyframes
				{ opacity: 1 },
				{ opacity: 0 }
			], {
				// timing options
				duration: duration / 2,
				easing: 'ease-in',
				iterations: 1,
				fill: 'forwards'
			});
			fadeOut.onfinish = async () => {
				await Tersum.Update(elem, val, ref).then(() => {
					elem.animate([
						// keyframes
						{ opacity: 0 },
						{ opacity: 1 }
					], {
						// timing options
						duration: duration / 2,
						easing: 'ease-in',
						iterations: 1,
						fill: 'forwards'
					});
				});
			};
		}
	};
}, 3000); // After three seconds we update the DOM to read 'hello Friend!' however this time we're using a custom transition
```

**This example demonstartes how** `Event Handlers` **Can be used to control lifecycle callbacks**
```Javascript
const myFirstTemplate = new Tersum.Define({
	element: 'helloFriend',
	template: `<p>{-message_part_1-} Friend!</p>`,
});

const myFirstElement = new Tersum.Create(myFirstTemplate, {
	variables: {
		message_part_1: `Hello`,
	},
});

myFirstElement.outer.addEventListener('connected', (e) => { 
	console.log(`The element was connected!`);  
}, false);

myFirstElement.outer.addEventListener('updated', (e) => { 
	console.log(`The element was updated!`);  
}, false);

document.body.appendChild(myFirstElement.outer); // console > The element was connected!

setTimeout(() => {
	myFirstElement.message_part_1 = 'Goodbye'; // console > The element was updated!
}, 3000); 
```

