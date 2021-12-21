// @flow

export type GetDescriptorCases = (classFqn: string) => Array<string>;

export type AttrSetConditions = {
	cases: ?string[],
	groupCode: ?string
};

export type Context = Object;
