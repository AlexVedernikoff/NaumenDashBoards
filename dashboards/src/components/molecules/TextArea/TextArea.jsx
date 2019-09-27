// @flow
import classnames from 'classnames';
import CrossIcon from 'components/atoms/cross.svg';
import Label from 'components/atoms/Label';
import type {Props} from './types';
import React, {Component, Fragment} from 'React';
import styles from './style.less';

class TextArea extends Component<Props> {
    static defaultProps = {
        label: 'default',
        name: 'default',
        onBlur: () => {},
        onChang: () => {},
        placeholder: 'default',
        value: 'default'
    };

    renderIcon () {
        const {handleClick, value} = this.props;

        return value ? <CrossIcon className={styles.icon} onClick={handleClick}/> : null;
    }

    renderLabel () {
        const {label, name} = this.props;

        return label ? <Label className={styles.label} htmlFor={name}>{label}</Label> : null;
    }

    renderTextArea () {
        const {
            className,
            name,
            onBlur,
            onChange,
            placeholder,
            value
        } = this.props;

        const classProps: string = classnames(
            className,
            styles.textarea
        );

        return (
            <div className={styles.inputField}>
                <textarea
                    className={classProps}
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
            <Fragment>
                {this.renderLabel()}
                {this.renderTextArea()}
            </Fragment>
        )
    }
}

export default TextArea;
