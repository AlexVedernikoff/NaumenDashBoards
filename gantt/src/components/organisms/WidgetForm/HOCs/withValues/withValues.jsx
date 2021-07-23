// @flow
import type {InjectedProps, ValuesContext} from './types';
import memoize from 'memoize-one';
import React from 'react';
import type {Values} from 'components/organisms/WidgetForm/types';
import {VALUES_CONTEXT} from './constants';

export const withValues = (...fields: Array<string>) =>
	<Props: {} & InjectedProps<Values>>(Component: React$ComponentType<Props>): React$ComponentType<Props> => {
		return class WithValues extends React.Component<Props> {
			isEqualValues = (newArgs: [Values], lastArgs: [Values]) => {
				return fields.every(field => newArgs[0][field] === lastArgs[0][field]);
			};

			getPartialValues = memoize(values => {
				return fields.reduce((props, field) => ({...props, [field]: values[field]}), {});
			}, this.isEqualValues);

			renderComponent = (context: ValuesContext) => {
				const {setFieldValue, values: allValues} = context;
				const values = fields.length > 0 ? this.getPartialValues(allValues) : allValues;

				return <Component {...this.props} setFieldValue={setFieldValue} values={values} />;
			};

			render () {
				return (
					<VALUES_CONTEXT.Consumer>
						{context => this.renderComponent(context)}
					</VALUES_CONTEXT.Consumer>
				);
			}
		};
	};

export default withValues;
