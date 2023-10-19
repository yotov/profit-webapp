type FormFieldProps = { id: string, label: string, requestState: RequestState, children: any };

const FormField = ({ id, label, requestState, children }: FormFieldProps) => {
    return <label className={'field ' + (requestState.status == "error" && requestState.error.fields?.hasOwnProperty(id) ? 'field-has-error' : '')}>
        <div className='field-label'>{label}</div>
        {children}
        {requestState.status == "error" && requestState.error.fields?.hasOwnProperty(id) && <div className="field-error">{requestState.error.fields[id]}</div>}
    </label>;
}

export default FormField;