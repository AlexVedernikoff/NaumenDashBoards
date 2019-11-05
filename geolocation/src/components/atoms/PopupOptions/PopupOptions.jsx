// @flow
import type {Option} from 'types/option';
import type {Props, State} from './types';
import React, {Component} from 'react';
import styles from './PopupOptions.less';

export class PopupOptions extends Component<Props, State> {
	optionsRef: {current: any};

	constructor (props: Props) {
		super(props);
		this.optionsRef = React.createRef();
	}

	renderOption = (option: Option, id: number) => {
		const {label, value} = option;
		const key = `option_${id}`;
		const styleName = label ? 'popupOptionRight' : 'popupOptionLine';

		return (
			<div key={key} className={styles.popupOption}>
				{label && <div className={styles.popupOptionLeft}>{label}:</div>}
				{value && <div className={styles[styleName]}>{value}</div>}
			</div>
		);
	};

	componentDidMount () {
		const optionsBlock = this.optionsRef.current;
		const shadow = optionsBlock.scrollHeight !== optionsBlock.offsetHeight;

		this.props.toggleShadow('actionsShadow', shadow);
		this.props.toggleShadow('headerShadow', shadow);
	}

	render () {
		const {options} = this.props;

		return (
			<div
				className={styles.popupOptions}
				ref={this.optionsRef}
			>
				{options.map(this.renderOption)}
			</div>
		);
	}
}
export default PopupOptions;
