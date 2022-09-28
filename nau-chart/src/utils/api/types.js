// @flow
export type UserData = {
	admin: boolean,
	licensed: boolean,
	login: string,
	roles: Array<string>,
	title: string,
	uuid: string
};

export type Context = {
	contentCode: string,
	currentUser: UserData,
	subjectUuid: string
};
