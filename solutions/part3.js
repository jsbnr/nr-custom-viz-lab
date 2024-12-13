import { BillboardChart } from 'nr1';

const Viz = () => {
	return  <BillboardChart
    	accountId={YOUR-ACCOUNT-ID-HERE}
    	query={`select count(*)/1000 as 'USD' from Public_APICall since 10 minutes ago`}
	/>
}

export default Viz;