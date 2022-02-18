// @flow

export type GetDescriptorCases = (classFqn: string) => Array<string>;

export type AttrSetConditions = {
	attrGroupCode: ?string,
	cases: ?string[]
};

export type Context = Object;
