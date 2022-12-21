#!/usr/bin/env node
import React from "react";
import { render } from "ink";
import App from "./ui";

// const cli = meow(`
// 	Usage
// 	  $ invoice-generator
//
// 	Options
// 		--name  Your name
//
// 	Examples
// 	  $ invoice-generator --name=Jane
// 	  Hello, Jane
// `, {
//
// });

render(
	<App
	// name={cli.flags.name}
	/>
);
