import { formatDate, formatNumber } from "../utils";

const Result = ({ requestState }: { requestState: RequestStateSuccess }) => {
    return <div className='result-section'>
        <div>You will realize max profit if you buy at <strong>{formatDate(requestState.data.buyTime)}</strong> and sell at <strong>{formatDate(requestState.data.sellTime)}</strong></div>
        {requestState.data.investAmount ?
            <div>If you invest <strong>{formatNumber(requestState.data.investAmount)}</strong> you can buy <strong>{formatNumber(requestState.data.stocksToBuy)} shares</strong> and will gain <strong>{formatNumber(requestState.data.profit)}</strong> </div> :
            <div>You will gain <strong>{formatNumber(requestState.data.profit)}</strong> for every share you bought</div>}
    </div>
};

export default Result;