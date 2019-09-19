// @flow
import CrossIcon from 'components/atoms/cross.svg';
import type {Props} from './types';
import React, {Component} from 'React';
import styles from './style.less';

class TextArea extends Component<Props> {
    renderIcon () {
        const {handleClick, value} = this.props;

        return value ? <CrossIcon className={styles.icon} onClick={handleClick}/> : null;
    }

    renderLabel () {
        const {label, name} = this.props;

        return label ? <label htmlFor={name}>{label}</label> : null;
    }

    renderTextArea () {
        const {
            name,
            onBlur,
            onChange,
            placeholder,
            value
        } = this.props;

        return (
            <div className={styles.inputField}>
                <textarea
                    className={styles.input}
                    id={name}
                    name={name}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder={placeholder}
                    value={value}
                />
                {this.renderIcon()}
            </div>
        );
    }

    render () {
        return (
            <div>
                {this.renderLabel()}
                {this.renderTextArea()}
            </div>
        )
    }
}

export default TextArea;
