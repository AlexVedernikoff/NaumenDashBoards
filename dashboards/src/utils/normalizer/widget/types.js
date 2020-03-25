// @flow
export type Fields = {
	[string]: string
};

export type CreateFunction = (widget: Object, fields: Fields) => Object;

export type LegacyWidget = Object;
