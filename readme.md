# New Relic Custom Vizualisation Hands On Lab
This lab guides you through creating and deploying a custom visualisation from scratch. When it comes to visualisation theres a huge oportunity for what you may build, you're only limited by your imagination!

For this lab you will create a very simple custom visualisation from scratch. You will learn how to create the viz, how to use the SDK to render data, how to configure it through options and how to deploy it to your account.

## The Currency Viz
The custom viz you will build is very simple:  It will use real-time currency exchange rate data from an external API to convert some telemetry data into the users chosen currency and display on the dashboard. Custom visualisations are often used to help surface business data, and currency conversions, price lookups etc are a good example of an enrichment you might want to build to better serve your business observability needs.

## Pre-requsites

You will need:

- A New Relic account (with Admin / Nerdpack manager rights to deploy)
- [Nodejs](https://nodejs.org/en/download/package-manager) installed locally
- An openexchangerates.org appID (see below)
- Suitable terminal and code editor

This example uses data from https://openexchangerates.org 
Sign up for a free account and grab yourself an appId. Once you have one check that when you visit this link you get some exchaange rate data:

[https://openexchangerates.org/api/latest.json?app_id=YOUR-APP-ID-HERE](https://openexchangerates.org/api/latest.json?app_id=YOUR-APP-ID-HERE)


## Lab

### Part 1 - "Lights on the board"
In this part we install al lthe necessary bits and pieces and make sure things are working correctly.

Step 1:

In New Relic navigate to Apps in the main menu, click on "Custom visualizations" and then "Build your own visualization" to view the quick start page.

Step 2:

Follow the guide **steps 1 to 3 ONLY** to download and install the NR1 CLI tool, generate an API key and add it to your profile.

Step 3:

At this point you should be able to run `nr1 profiles:whoami` and get a sensible output!

Step 4:

You now need to use the NR1 tool to create a custom visualisation project. Run the following:

```
nr1 create
```

Choose "Visualization" from the list of options. It will ask you to first provide a name for the nerdpack (which is the overall package containing your viz). Use `my-custom-viz-pack`. It will then ask for the name of your custom visualization, use: `currency-converter`

Step 5: 

You should see the tool create a folder called `my-custom-viz-pack`. Switch to this folder and serve the visualisation using nr1 as follows:

```
cd my-custom-viz-pack
nr1 nerdpack:serve
```

The tool will build the project, and at the end provide a link to your custom visualization. Open this link in your web browser.

![Viz link](./screenshots/firstserve.png)

You should see the custom visualization load up and look a bit like the following. If so then well done, you got lights on the board! 

> If its not working you need to troubleshoot to get this working before continuing with the rest of the lab.

![Viz serve](./screenshots/firstservebrowser.png)


### Part 2 - Resetting the boilerplate
The nr1 create command built an example visualisation with some boilerplate code. You will tidy this up before getting creative.

Step 1:

Review the folder structure. You will see that there is a folder called `vizualisations` - its in here that your visualization lives in a sub folder called `currency-converter`. You can add many vustom visualizations into this package, each in a seperate folder here.

Within the `currency-converter` folfer are three files:

- index.js - this is where your code goes
- styles.scss - this is where you can add css styling
- nr1.json - this is where you configure the visualization.


Step 2:

Lets start with cleaning up the `nr1.json` file. Make sure you are editing the one in the `visualizations/currency-converter` folder.

- Change the `displayName` to "Currency Converter"
- Delete everything in the `configuration` array, it should simply read: 
```"configuration": []```


Step 3:

Now edit the `index.js` file and delete everything. Yes really! Delete it all.

Step 4:

Add the folloiwing code to `index.js`:

```
const Viz = () => {
	return  <div>Hello World!</div>
}

export default Viz;

```

Step 4:

If its still running stop the nr1 serve (CTRL+C) then restart it:

```
nr1 nerdpack:serve
```

> Some changes, like those in `nr1.json` require you to restart the local server. But most changes you make should hot reload!

Step 5:

Reload your browser, you should see "Hello World" and the config options should all have gone, like this:

![Hello world](./screenshots/hello-world.png)

### Part 3 - Adding a Billboard component

THe New Relic SDK comes with a number of ready built components we can use in our custom visualizations. In this case we will use the `<BillboardChart />` component.

Step 1:

All the SDK components are documented. Review the documentation for the BillboardChart component to understand a little of how it works: [`<BillboardChart />` Docs](https://docs.newrelic.com/docs/new-relic-solutions/build-nr-ui/sdk-component/charts/BillboardChart/)

Step 2:

We need to import the component from the nr1 library. The nr1 tool bundles this already, so add to the very top of `index.js` the following:

```
import { BillboardChart } from 'nr1';
```

Step 3:

Update the return statement to return the BillboardChart instead of our hello world message. You need to supply your account ID and a query that returns some data. It doesnt matter what that data is right now, in this case we use the `Public_APICall` event type available in all US accounts to give us a number that acts as our source value in US dollars

```
const Viz = () => {
	return  <BillboardChart
    	accountId={YOUR-ACCOUNT-ID-HERE}
    	query={`select count(*)/1000 as 'USD' from Public_APICall since 10 minutes ago`}
	/>
}
```

Step 4:

Review the changes in the browser, you should now see a billboard chart showing a value of some kind:

![Billboard Cart](./screenshots/billboard.png)

[Full index.js code from Part 3](!part3.js)

### Part 4 - Setting and using the 'rate'

We have our source value in USD and we want to convert that by multiplying by a  rate. Lets start off by hard coding that rate for now.

Step 1:

We will use Reatc [useState hook](https://react.dev/reference/react/useState) to manage our rate value. Add another import statement to the top of the file, just after the existing one to import the useState hook:

```
import { useState } from "react";
```

Step 2:

Add the following code before the BillboardChart to setup `rate` as a state variable, setting the default value to `1.5`

```
const Viz = () => {
	const [rate, setRate] = useState(1.5);

	return  <BillboardChart...
}
```

Step 3:

Update the `query` in the BillboardChart to use this `rate` variable to calculate the converted rate:

```
query={`select count(*)/1000 as 'USD', (count(*)/1000) * ${rate} as 'converted', ${rate} as 'rate'  from Public_APICall since 10 minutes ago`}
```

Step 4:

View the changes in the browser, you should see the USD value and another value 1.5 larger. Try changing the rate in the code to see it change.

![Part 4](./screenshots/part4.png)

[Full index.js code from Part 4](!part4.js)


### Part 5 - Loading spinner

We need to load the exchange rate data, which may take some time, so whilst its loading it would be good to show a [loading spinner](!https://docs.newrelic.com/docs/new-relic-solutions/build-nr-ui/sdk-component/feedback/Spinner/) to the user. 

Step 1:

Update the import statement to import the Spinner component from the nr1 library:

```
import { BillboardChart, Spinner } from 'nr1'; 
```


Step 2:

Change the default rate to `null` instead of `1.5` and immediately after add the following spinner code, before the BillboardChart:

```
const Viz = () => {
    const [rate, setRate] = useState(null);
    if (!rate) {
            return <div>Loading currency data <Spinner inline /></div>
    }

    return  <BillboardChart ...
    ...
    />
```

> This tests if `rate` is set, if not it returns the Spinner and the BillboardChart is never shown.


Step 3:

View the changes in the browser, you should see a spinner spining indefinitely!

![Spinner](./screenshots/spinner.png)

[Full index.js code from Part 5](!part5.js)

### Part 6 - Loading the currency data from API

You need to load the data from the API and use it to set the `rate`. We'll do this using [axios](!https://axios-http.com/docs/intro) an http request library. 

> We dont actaulyl need axios, we could do it natively in nodejs but this is a good escuse to see how we can use npm modules!

Step 1:

Stop the server (CTRL+C) and install axios then restart the server:

```
npm install -s axios
nr1 nerdpack:serve
```

Step 2:

Add another import statement to the top of the file, just under the others:

```
import axios from 'axios'
```


Step 3: 

In order to react to changes and to load the data we need to use Reacts [useEffect hook](https://react.dev/reference/react/useEffect). Update the existing import from React to include useEffect:

```
import { useState, useEffect } from "react";
```

Step 4:

We need another state variable to hold the loaded currencies, add another useState after the `rate` one called `currencies`:
```
...
const Viz = () => {
    const [rate, setRate] = useState(null);
    const [currencies, setCurrencies] = useState(null);
...
```

Step 5:

Next, just after the currencies hook add a useEffect hook to load the API data, replacing the AppId with your own:

```
const Viz = () => {
    const [rate, setRate] = useState(null);
    const [currencies, setCurrencies] = useState(null);

    //run once on first load to gather currencies
    useEffect( async () => {
        const response = await axios.get('https://openexchangerates.org/api/latest.json?app_id=YOUR-APP-ID');
        setCurrencies(response.data.rates);
    }, []);

...
```

> This 'effect' will run once when the viz loads. It gathers the data from the API and sets the result in the `currencies` state variable. You could of course load this data more frequently if you needed to, but once is enough for this lab.


Step 6:

Add another useEffect hook to set the rate once the currencies are loaded. Add it just after the previous. In this case we hard code the chosen currency to "GBP".

```
    //Set the rate using loaded currencies
    useEffect( async () => {
        if(currencies) {
            setRate(currencies["GBP"]);
        }
    }, [currencies])
```

> This effect is run whenever the `currencies` value chanages.


Step 7:

View the changes in the browser, you should see the exchange rates updated with the live GBP rate.

> Not working? Ensure you set your AppId correctly and that you get JSON data back from https://openexchangerates.org/api/latest.json?app_id=YOUR-APP-ID

![Part 6](./screenshots/part6.png)

[Full index.js code from Part 6](!part6.js)












