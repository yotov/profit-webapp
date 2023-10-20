import './App.css'
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import { ErrorBoundary } from 'react-error-boundary';
import Form from './components/Form';

function App() {
  return (
    <>
      <h1>Profit</h1>
      <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
        <Form />
      </ErrorBoundary>
    </>
  )
}

export default App
