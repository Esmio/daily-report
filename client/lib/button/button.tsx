import * as React from 'react';
import {ButtonHTMLAttributes} from 'react';
import classes from '../helpers/classes';
import './button.scss';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    level?: 'important' | 'danger' | 'normal'
}

const Button:React.FunctionComponent<Props> = (props) => {
    const {className, children, level, ...rest} = props;
    return (
        <button 
            className={classes('sui-button', `sui-button-${level}`, className)} 
        {...rest}>
            {props.children}
        </button>
    )
}

Button.defaultProps = {
    level: 'normal'
}

export default Button;