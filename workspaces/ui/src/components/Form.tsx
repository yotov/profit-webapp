import { useState } from 'react'
import DateTimePicker from 'react-datetime-picker';
import Loader from '../components/Loader';
import FormField from './FormField';

function clean(obj: any) {
    for (const propName in obj) {
        if (obj[propName] === null || obj[propName] === undefined) {
            delete obj[propName];
        }
    }
    return obj
}

const Form = () => {
    const [requestState, setRequestState] = useState<RequestState>({ status: 'idle' });
    const [formState, setFormState] = useState<FormState>({ startTime: new Date(2023, 9, 19, 10, 58, 3).toISOString(), endTime: new Date(2023, 9, 19, 10, 58, 4).toISOString() });

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        if (requestState.status === "loading") {
            return;
        }
        setRequestState({ status: 'loading' });

        try {
            const params = new URLSearchParams(clean(formState));
            const response = await fetch(`/api/profit?${params}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            });
            // Simulate slow request to prevent blink of loader 
            await new Promise(resolve => setTimeout(resolve, 350));

            const result = await response.json();
            if (response.ok) {
                setRequestState({ status: 'success', data: result });
            } else {
                setRequestState({ status: 'error', error: result });
            }

        } catch (err) {
            setRequestState({ status: 'error', error: { message: "Please try again later." } });
        }
    };

    return <form className={"form " + (requestState.status === "loading" ? "form-loading" : "") + (requestState.status == "error" && !requestState.error.fields ? "form-has-error" : '')} onSubmit={handleSubmit}>
        {requestState.status == "error" && !requestState.error.fields && <div className="form-error">{requestState.error.message}</div>}
        <FormField id="startTime" label="Start date" requestState={requestState}>
            <DateTimePicker autoFocus onChange={newValue => setFormState({ ...formState, startTime: newValue?.toISOString() })} format="y-MM-dd HH:mm:ss" value={formState.startTime} />
        </FormField>
        <FormField id="endTime" label="End date" requestState={requestState}>
            <DateTimePicker onChange={newValue => setFormState({ ...formState, endTime: newValue?.toISOString() })} format="y-MM-dd HH:mm:ss" value={formState.endTime} />
        </FormField>
        <FormField id="investAmount" label="Invest amount" requestState={requestState} optional>
            <input className="field-input" type="number" onChange={e => setFormState({ ...formState, investAmount: parseFloat(e.target.value) })} value={formState.investAmount} />
        </FormField>
        <div>
            <button type="submit">
                Find max profit
                {requestState.status === "loading" && <Loader />}
            </button>
        </div>
        {requestState.status == "success" && <div>You will realize max profit if you buy at {requestState.data.buyTime} and sell at {requestState.data.sellTime}. The profit will be {requestState.data.profit}</div>}
    </form>
}

export default Form;