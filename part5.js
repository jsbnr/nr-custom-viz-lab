import { BillboardChart, Spinner } from 'nr1';
import { useState } from "react";

const Viz = () => {
    const [rate, setRate] = useState(null);
    if (!rate) {
            return <div>Loading currency data <Spinner inline /></div>
    }
	return  <BillboardChart
    	accountId={YOUR-ACCOUNT-ID-HERE}
    	query={`select count(*)/1000 as 'USD', (count(*)/1000) * ${rate} as 'converted', ${rate} as 'rate'  from Public_APICall since 10 minutes ago`}
	/>
}

export default Viz;