import { BillboardChart } from 'nr1';
import { useState } from "react";

const Viz = () => {
    const [rate, setRate] = useState(1.5);
	return  <BillboardChart
    	accountId={YOUR-ACCOUNT-ID-HERE}
    	query={`select count(*)/1000 as 'USD', (count(*)/1000) * ${rate} as 'converted', ${rate} as 'rate'  from Public_APICall since 10 minutes ago`}
	/>
}

export default Viz;