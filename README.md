# tersus
A lightweight MVC Framework built to compliment Vanilla JS

```javascript
let myTemplate = new Tersum.Define({
	element: 'helloWorld',
	styles: `
		p {
			font-weight:800;
			font-size:2em;
			margin:0;
			display: inline-block;
		}
	`,
	template :	`
		<p>{-message-}</p>
	`,
});
```
