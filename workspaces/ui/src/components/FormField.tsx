type FormFieldProps = { id: string, label: string, requestState: RequestState, children: any, optional?: boolean };

const FormField = ({ id, label, requestState, optional, children }: FormFieldProps) => {
    return <label className={'field ' + (requestState.status == "error" && requestState.error.fields?.hasOwnProperty(id) ? 'field-has-error' : '')}>
        <div className='field-label'>{label}{optional ? <span style={{fontSize: "10px", paddingLeft: "6px"}}>(optional)</span> : null}</div>
        {children}
        {requestState.status == "error" && requestState.error.fields?.hasOwnProperty(id) && <div className="field-error">{requestState.error.fields[id]}</div>}
    </label>;
}

export default FormField;