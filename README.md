# tersum.js

## About

tersum.js is a lightweight MVC Framework built to compliment Vanilla JS. 

## Getting Started

Getting started with tersum.js is easy, firstly let's start off with a basic Hello World example, and expand things from there.

To get started we first have to import tersum.js, you can do that like so:

```javascript
import { Tersum } from './your-awsome-path/tersum.min.js';
```

Once you have imported tersum.js, you will first have to define a Tersum.js **Template**. Tersum.js **Template's** act as the building blocks of your application, and with them you can do many great things, but first let's start out with something simple, like the code below. 

```javascript
let myFirstTemplate = new Tersum.Define({
	element: 'helloWorld',
	template: `<p>{-message-}</p>`,
});
```

You have now defined your first Tersum.js **Template**, _awsome!_ As you can see we pass an object to the `Tersum.Define` constructor containing two parameters that must be passed when creating any Tersum.js **Template**, these are `element` and `template` (Don't worry, there's a _lot_ more you can do with tersum.js **Templates**, but we can get into down the line). 

_**But what are**_ `element` _**and**_ `template` _**doing?**_

* `element` is a `DOMString` representing the name of your Tersum.js Template, as Tersum.js is built upon the Custom Elements Web Component all Tersum.js elements will be created as Custom Elements, you do not however have to worry about case, or using a dash, as Tersum.js takes care of this for you. Using our example from above you will be generating a template like so: 

```html
<helloworld-tersum>
	...
</helloworld-tersum>
```

* `template` is a `Template Literal` representing the content of our Tersum.js **Template**, Tersum.js **Template's** contain HTML Markup, and make use of Tersum.js **Template Variables**, denoted like so `{-aVariable-}` to allow for the initialisation, retrieval, and updating of DOM data - but more on that later. 

Now that you have defined you first Tersum.js **Template** it is time to create your first Tersum.js **Element**. Tersum.js **Element's** function much like regular DOM Objects, however with a few key exceptions which we will explore in more detail later in this tutorial. To create a simple Tersum.js **Element** you can use the following code.

```javascript
let myFirstElement = new Tersum.Create(myFirstTemplate, {
	variables: {
		message: `Hello World!`,
	},
});
```

As you can see the `Tersum.create` constructor takes two arguments, firstly a refrence to the tersum.js **Template** we created previously and an object containing a further object, `variables`. As with the the `tersus.Define` constructor, there is a lot more we can do with these elements, however we will keep things simple for now. 

_**But what does**_ `variables` _**do?**_

* `variables` is an object, representing a series of key and value pairs, correspoding to the Tersum.js **Template Variables** we created in our tersum.js **Template**, in the above example this is `{-message-}` when a tersus.js **Element** is created we replace these variables using the corresponding key : value pair defined in our `variables` object, so using the above example `{-message-}` will be replaced with `Hello World!`.




