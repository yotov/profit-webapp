import { useState } from 'react'
import './App.css'
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import Loader from './components/Loader';

type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success', data: any }
  | { status: 'error', error: any };

type FormState = {
  startTime: Date,
  endTime: Date
}

function clean(obj: any) {
  for (const propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName];
    }
  }
  return obj
}

function App() {
  const [requestState, setRequestState] = useState<RequestState>({ status: 'idle' });
  const [formState, setFormState] = useState<FormState>({ startTime: new Date(), endTime: new Date() });

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
      setRequestState({ status: 'error', error: "Please try again later." });
    }
  };

  return (
    <>
      <h1>Profit</h1>
      <form className={"form " + (requestState.status === "loading" ? "form-loading" : "")} onSubmit={handleSubmit}>
        <label className={'field ' + (requestState.status == "error" && requestState.error.fields.startTime ? 'field-has-error' : '')}>
          <div className='field-label'>Start time:</div>
          <DateTimePicker autoFocus onChange={newValue => setFormState({ startTime: newValue, endTime: formState.endTime })} format="y-MM-dd HH:mm:ss" value={formState.startTime} />
          {requestState.status == "error" && requestState.error.fields.startTime && <div className="field-error">{requestState.error.fields.startTime}</div>}
        </label>
        <label className={'field ' + (requestState.status == "error" && requestState.error.fields.endTime ? 'field-has-error' : '')}>
          <div className='field-label'>End time:</div>
          <DateTimePicker onChange={newValue => setFormState({ startTime: formState.startTime, endTime: newValue })} format="y-MM-dd HH:mm:ss" value={formState.endTime} />
          {requestState.status == "error" && requestState.error.fields.endTime && <div className="field-error">{requestState.error.fields.endTime}</div>}
        </label>
        <div>
          <button type="submit">
            Find max profit
            {requestState.status === "loading" && <Loader />}
          </button>
        </div>
        {requestState.status == "success" && <div>You will realize max profit if you buy at {requestState.data.buyTime} and sell at {requestState.data.sellTime}. The profit will be {requestState.data.profit}</div>}
        {requestState.status == "error" && !requestState.error.fields && <div className="form-error">{requestState.error.message}</div>}
      </form>
    </>
  )
}

export default App
