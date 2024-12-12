import { BillboardChart, Spinner } from 'nr1';
import { useState, useEffect } from "react";
import axios from 'axios'

const Viz = () => {
    const [rate, setRate] = useState(null);
    const [currencies, setCurrencies] = useState(null);

    //run once on first load to gather currencies
    useEffect( async () => {
        const response = await axios.get('https://openexchangerates.org/api/latest.json?app_id=YOUR-APP-ID-HERE');
        setCurrencies(response.data.rates);
    }, []);

    //Set the rate using loaded currencies
    useEffect( async () => {
        if(currencies) {
            setRate(currencies["GBP"]);
        }
    }, [currencies])

    if (!rate) {
            return <div>Loading currency data <Spinner inline /></div>
    }
	return  <BillboardChart
    	accountId={YOUR-ACCOUNT-ID-HERE}
    	query={`select count(*)/1000 as 'USD', (count(*)/1000) * ${rate} as 'converted', ${rate} as 'rate'  from Public_APICall since 10 minutes ago`}
	/>
}

export default Viz;