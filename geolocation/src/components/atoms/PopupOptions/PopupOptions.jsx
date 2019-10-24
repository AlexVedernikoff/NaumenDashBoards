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
				{label && <span className={styles.popupOptionLeft}>{label}:</span>}
				{value && <span className={styles[styleName]}>{value}</span>}
			</div>
		);
	};

	scroll = () => {
		const headerShadow = this.optionsRef.current.scrollTop > 10;

		this.props.toggleShadow('headerShadow', headerShadow);
	}

	componentDidMount () {
		const optionsBlock = this.optionsRef.current;
		const actionsShadow = optionsBlock.scrollHeight !== optionsBlock.offsetHeight;

		this.props.toggleShadow('actionsShadow', actionsShadow);
	}

	render () {
		const {options} = this.props;

		return (
			<div
				className={styles.popupOptions}
				onScroll={this.scroll}
				ref={this.optionsRef}
			>
				{options.map(this.renderOption)}
			</div>
		);
	}
}
export default PopupOptions;
