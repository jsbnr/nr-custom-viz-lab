import { BillboardChart, Spinner } from 'nr1';
import { useState, useEffect } from "react";
import axios from 'axios'

const Viz = ({currency}) => {
	const chosenCurrency = currency ?? 'GBP';
    const [rate, setRate] = useState(null);
    const [currencies, setCurrencies] = useState(null);
    const [query, setQuery] = useState(null);

    //run once on first load to gather currencies
    useEffect( async () => {
        const response = await axios.get('https://openexchangerates.org/api/latest.json?app_id=YOUR-APP-ID-HERE');
        await setCurrencies(response.data.rates);
    }, []);

    //Set the rate using loaded currencies
    useEffect( async () => {
        if(currencies) {
            setRate(currencies[chosenCurrency]);
        }
    }, [currencies,chosenCurrency]);

    //Set query when rate changes
    useEffect( async () => {
        setQuery(`select count(*)/1000 as 'USD', (count(*)/1000) * ${rate} as '${chosenCurrency}', ${rate} as 'rate'  from Public_APICall since 10 minutes ago`)
    }, [rate]);

    if (!rate) {
            return <div>Loading currency data <Spinner inline /></div>
    }
	return  <BillboardChart 
        fullWidth
        fullHeight
    	accountId={YOUR-ACCOUNT-ID-HERE}
    	query={query}
	/>
}

export default Viz;