// @flow
import CheckIcon from 'components/atoms/checked.svg';
import type {Props} from './types';
import React, {Component} from 'React';
import styles from './style.less';

class CheckBox extends Component<Props> {
    handleClick = () => {
        const {handleClick, field} = this.props;

        handleClick && handleClick(field.name, field.value);
    }

    renderIcon () {
        const {field} = this.props;

        return (
            <div className={styles.icon}>
                {field.value && <CheckIcon />}
            </div>
        );
    }

    renderInput () {
        const {field} = this.props;


        return (
            <input
              {...field}
              className={styles.input}
              id={field.name}
              onClick={this.handleClick}
              type="checkbox"
            />
        );
    }

    renderLabel () {
        const {field, label} = this.props;

        return (
            <label htmlFor={field.name} className={styles.label}>
                {this.renderIcon()}
                {label}
            </label>
        );
    }

    render () {
        return (
            <div>
                {this.renderLabel()}
                {this.renderInput()}
            </div>
        );
    }
}

export default CheckBox;
