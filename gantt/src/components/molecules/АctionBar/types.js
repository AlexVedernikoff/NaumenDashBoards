export type UserItem = {
    code: string,
    ganttMaster: boolean,
    name: string
}

export type User = {
    department: string,
    showUsers: boolean,
    users: UserItem[]
};
