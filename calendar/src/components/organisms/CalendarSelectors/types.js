// @flow
type SelectorRecord = {
    id: string,
    value: string
};

type Location = SelectorRecord;

type Calendar = SelectorRecord;

export type LocationList = Array<Location>;

export type CalendarList = Array<Calendar>;
