import { useState, useEffect } from 'react'
import DateTimePicker from 'react-datetime-picker';
import Loader from '../components/Loader';
import FormField from './FormField';
import Result from './Result';

function clean(obj: any) {
    for (const propName in obj) {
        if (obj[propName] === null || obj[propName] === undefined) {
            delete obj[propName];
        }
    }
    return obj
}

function parseNumber(value: string): number | undefined
{
    const num = parseFloat(value);
    return isNaN(num) ? undefined : num;
}

const Form = () => {
    const [range, setRange] = useState<TimeRange>({from: undefined, to: undefined});
    const [requestState, setRequestState] = useState<RequestState>({ status: 'idle' });
    const [formState, setFormState] = useState<FormState>({ startTime: undefined, endTime: undefined });

    useEffect(() => {
        const requestTimeRange = async () => {
            const response = await fetch('/api/range');
            const result = await response.json();
            setRange({
                from: new Date(result.from),
                to: new Date(result.to),
            });
        };
        requestTimeRange();
    }, []);

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        if (requestState.status === "loading") {
            return;
        }
        setRequestState({ status: 'loading' });

        try {
            const params = new URLSearchParams(clean(formState));
            const [response] = await Promise.all([fetch(`/api/profit?${params}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            }), new Promise(resolve => setTimeout(resolve, 350))]);// Simulate slow request to prevent blink of loader  

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
            <DateTimePicker autoFocus onChange={newValue => setFormState({ ...formState, startTime: newValue?.toISOString() })} format="y-MM-dd HH:mm:ss" value={formState.startTime} minDate={range.from} maxDate={range.to} />
        </FormField>
        <FormField id="endTime" label="End date" requestState={requestState}>
            <DateTimePicker onChange={newValue => setFormState({ ...formState, endTime: newValue?.toISOString() })} format="y-MM-dd HH:mm:ss" value={formState.endTime} minDate={range.from} maxDate={range.to} />
        </FormField>
        <FormField id="investAmount" label="Invest amount" requestState={requestState} optional>
            <input className="field-input" type="number" onChange={e => setFormState({ ...formState, investAmount: parseNumber(e.target.value) })} value={formState.investAmount ?? undefined} />
        </FormField>
        <div>
            <button type="submit">
                Find max profit
                {requestState.status === "loading" && <Loader />}
            </button>
        </div>
        {requestState.status == "success" && <Result requestState={requestState} />}
    </form>
}

export default Form;