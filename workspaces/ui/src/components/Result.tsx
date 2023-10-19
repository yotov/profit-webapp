import { format } from 'date-fns';

const formatNumber = (value: number) => new Intl.NumberFormat().format(value);

const Result = ({ requestState }: { requestState: RequestStateSuccess }) => {
    return <div className='result-section'>
        <div>You will realize max profit if you buy at <strong>{format(new Date(requestState.data.buyTime), 'yyyy-MM-dd HH:mm:ss')}</strong> and sell at <strong>{format(new Date(requestState.data.sellTime), 'yyyy-MM-dd HH:mm:ss')}</strong></div>
        {requestState.data.investAmount ?
            <div>If you invest <strong>{formatNumber(requestState.data.investAmount)}</strong> you can buy <strong>{formatNumber(requestState.data.stocksToBuy)} shares</strong> and will gain <strong>{formatNumber(requestState.data.profit)}</strong> </div> : 
            <div>You will gain <strong>{formatNumber(requestState.data.profit)}</strong> for every share you bought</div>}
    </div>
};

export default Result;