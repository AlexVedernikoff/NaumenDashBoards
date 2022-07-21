// @flow
import Container from 'components/atoms/Container';
import type {OnSelectEvent} from 'components/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import Select from 'components/molecules/Select';
import styles from './styles.less';
import T from 'components/atoms/Translation';

export class SourcesAndFieldsExtended extends PureComponent<Props> {
	handleChangeDataSetIndex = ({value}: OnSelectEvent) => {
		const {dataSets, onChangeDataSet} = this.props;

		if (dataSets && onChangeDataSet) {
			const dataSetIndex = dataSets.indexOf(value);

			onChangeDataSet(dataSetIndex, value);
		}
	};

	render () {
		const {children, className, dataSetIndex, dataSets, value} = this.props;
		const dataSetValue = dataSets[dataSetIndex];

		return (
			<Container className={styles.container}>
				<div className={styles.title}>
					<T text="SourcesAndFieldsExtended::ParameterSelection" />
				</div>
				<div className={styles.field}>
					<div className={styles.label}>
						<T text="SourcesAndFieldsExtended::SourceParameter" />
					</div>
					<Select
						getOptionLabel={dataSet => dataSet.source?.value?.label ?? ''}
						getOptionValue={dataSet => dataSet.dataKey}
						onSelect={this.handleChangeDataSetIndex}
						options={dataSets}
						value={dataSetValue}
					/>
				</div>
				<div className={styles.field}>
					<div className={styles.label}>
						<T text="SourcesAndFieldsExtended::Parameter" />
					</div>
					<Select
						components={{
							MenuContainer: () => (
								<Container className={className}>
									{children}
								</Container>
							)
						}}
						getOptionLabel={attr => attr.title}
						value={value}
					/>
				</div>
			</Container>
		);
	}
}

export default SourcesAndFieldsExtended;
