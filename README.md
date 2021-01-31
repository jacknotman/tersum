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

You have now defined your first Tersum.js **Template**, _awsome!_ As you can see there are two parameters that must be passed when creating a Tersum.js **Template**, these are `element` and `template` (Don't worry, there's a _lot_ more we can get into down the line). 

_**But what are**_ `element` _**and**_ `template` _**doing?**_

`element` is a `DOMString` representing the name of your Tersum.js Template, as Tersum.js is built upon the Custom Elements Web Component, all Tersum.js elements will be created as Custom Elements, you do not however have to worry about case, or using a dash, as Tersum.js takes care of this for you. Using our example from above you will be generating a template like so: 

```html
<helloworld-tersum>
	...
</helloworld-tersum>
```

`template` is a 
