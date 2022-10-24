// @flow
import {FONT_SIZE_AUTO_OPTION, FONT_SIZE_OPTIONS} from 'store/widgets/data/constants';
import type {OnChangeEvent} from 'components/types';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import Select from 'components/molecules/Select';
import styles from './styles.less';

export class FontSizeSelect extends PureComponent<Props, State> {
	static defaultProps = {
		...Select.defaultProps,
		className: styles.select,
		editable: true,
		options: FONT_SIZE_OPTIONS,
		usesAuto: false
	};

	state = {
		options: []
	};

	componentDidMount () {
		this.setState({options: this.getOptions(this.props)});
	}

	componentDidUpdate (prevProps: Props) {
		if (prevProps.usesAuto !== this.props.usesAuto) {
			this.setState({options: this.getOptions(this.props)});
		}
	}

	getOptions (props: Props) {
		const {options, usesAuto} = props;
		return usesAuto ? [FONT_SIZE_AUTO_OPTION, ...options] : options;
	}

	handleChangeSize = ({value}: OnChangeEvent<string>) => {
		const {name, onSelect} = this.props;

		onSelect({
			name,
			value
		});
	};

	render () {
		const {className, editable, name, onSelect, value} = this.props;
		const {options} = this.state;

		return (
			<Select
				className={className}
				editable={editable}
				name={name}
				onChangeLabel={this.handleChangeSize}
				onSelect={onSelect}
				options={options}
				value={value}
			/>
		);
	}
}

export default FontSizeSelect;
