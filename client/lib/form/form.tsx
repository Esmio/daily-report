import * as React from 'react';
import Input from '../input/input';
import classes from '../helpers/classes';
import './form.scss';

export interface FormValue {
    [K: string]: any
}

interface Props {
    value: FormValue;
    fields: Array<{ name: string; label: string; input: { type: string } }>;
    buttons: React.ReactFragment;
    onSubmit: React.FormEventHandler<HTMLFormElement>;
    onChange: (value: FormValue) => void;
    errors: { [K: string]: string[] };
    errorsDisplayMode?: 'first' | 'all';
    transformError?: (message: string) => string;
}

const Form: React.FunctionComponent<Props> = (props) => {
    const formData = props.value;
    const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        props.onSubmit(e);
    }
    const onInputChange = (name: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const newFormValue = { ...formData, [name]: e.target.value }
        props.onChange(newFormValue)
    }
    const transformError = (message: string) => {
        const map: any = {
            required: '必填',
            minLength: '太短',
            maxLength: '太长',
        };
        return props.transformError && props.transformError(message) || map[message] || '未知错误';
    }
    return (
        <form onSubmit={onSubmit}>
            <table className="sui-form-table">
                <tbody>
                {props.fields.map(f =>
                    <tr className={classes('sui-form-tr')} key={f.name}>
                        <td className="sui-form-td">
                            <span className="sui-form-label">{f.label}</span>
                        </td>
                        <td className="sui-form-td">
                            <Input 
                                className="sui-form-input"
                                type={f.input.type} 
                                value={formData[f.name]}
                                onChange={onInputChange.bind(null, f.name)}
                            />
                            <div className="sui-form-error">
                                {
                                    props.errors[f.name] ?
                                    (props.errorsDisplayMode === 'first' ?
                                    transformError!(props.errors[f.name][0]) :
                                    props.errors[f.name].map(transformError!).join('，')) :
                                    <span>&nbsp;</span>

                                }
                            </div>
                        </td>
                    </tr>
                )}
                <tr className="sui-form-tr">
                    <td className="sui-form-td"/>
                    <td className="sui-form-td">
                        {props.buttons}
                    </td>
                </tr>
                </tbody>
            </table>
        </form>
    )
}

Form.defaultProps = {
    errorsDisplayMode: 'first',
    transformError: (message: string) => {
        const map: any = {
            required: '必填',
            minLength: '太短',
            maxLength: '太长',
        };
        return map[message] || '未知错误';
    }
}

export default Form;
