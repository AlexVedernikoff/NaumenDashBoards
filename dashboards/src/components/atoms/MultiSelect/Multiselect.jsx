// @flow
import ChevronDown from 'icons/form/chevron-down.svg';
import type {Props} from './types';
import React, {Component, Fragment} from 'react';
import Select from 'react-select';
import styles from './styles.less';

export class MultiSelect extends Component<Props> {
    handleChange = (value) => {
        const {name, onChange} = this.props;
        onChange(value, name);
    };

    renderDropdownIndicator = () => <ChevronDown className={styles.icon} />;

    renderIndicatorSeparator = () => null;

    renderLabel = () => {
        const {label, value} = this.props;
        return label ? <label className={styles.label} htmlFor={value}>{label}</label> : null;
    };

    renderSelect = () => {
        const {
            getOptionLabel,
            getOptionValue,
            name,
            options,
            placeholder,
            value
        } = this.props;

        return (
            <Select
                classNamePrefix={styles.multiselect}
                components={{
                    DropdownIndicator: () => this.renderDropdownIndicator(),
                    IndicatorSeparator: () => this.renderIndicatorSeparator()
                }}
                getOptionLabel={getOptionLabel}
                getOptionValue={getOptionValue}
                onChange={this.handleChange}
                id={name}
                options={options}
                placeholder={placeholder}
                value={value}
            />
        );
    };

    render () {
        return (
            <Fragment>
                {this.renderLabel()}
                {this.renderSelect()}
            </Fragment>
        );
    }
}

export default MultiSelect;
