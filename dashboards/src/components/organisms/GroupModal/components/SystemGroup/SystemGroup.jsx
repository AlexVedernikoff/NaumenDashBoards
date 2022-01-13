// @flow
import FormField from 'GroupModal/components/FormField';
import type {OnSelectEvent} from 'src/components/types';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import Select from 'components/molecules/Select';
import styles from './styles.less';
import t from 'localization';

export class SystemGroup extends PureComponent<Props, State> {
	state = {
		value: this.getValue(this.props)
	};

	componentDidUpdate (prevProps: Props) {
		if (prevProps.value !== this.props.value) {
			this.setState({value: this.getValue(this.props)});
		}
	}

	getValue (props: Props) {
		const {options, value} = props;
		return options.find(o => o.value === value) || options[0];
	}

	handleSelect = ({value}: OnSelectEvent) => {
		const {onChange} = this.props;

		onChange(value.value);
	};

	render () {
		const {options} = this.props;
		const {value} = this.state;

		return (
			<FormField className={styles.field} label={t('SystemGroup::Format')}>
				<Select
					onSelect={this.handleSelect}
					options={options}
					placeholder={t('SystemGroup::Format')}
					value={value}
				/>
			</FormField>
		);
	}
}

export default SystemGroup;
