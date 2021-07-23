// @flow
export type SetFieldValue = (name: string, value: any, callback?: Function) => void;

export type Values = Object;

export type ValidateOptions = {
	abortEarly?: boolean,
	context?: Object,
	path?: string,
	recursive?: boolean,
	[string]: any
};

export type Schema = {
	validate(value: any, options?: ValidateOptions): Promise<void>;
};

export type ErrorsMap = {
	[key: string]: string
};

export type State = {
	errors: ErrorsMap,
	submitted: boolean,
	values: Values
};

export type RenderProps<Values> = {
	errors: ErrorsMap,
	handleCancel: () => void,
	handleSubmit: () => void | Promise<void>,
	setFieldValue: SetFieldValue,
	submitting: boolean,
	values: Values
};

export type Props = {
	initialValues: Values,
	onCancel: () => any,
	onChange: (values: Values) => any,
	onSubmit: (values: Values) => void,
	render: (props: RenderProps<Values>) => React$Node,
	submitting: boolean,
	validate: (values: Values) => Promise<?ErrorsMap>
};
