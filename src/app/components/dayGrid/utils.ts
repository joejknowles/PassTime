export const isToday = (date: Date): boolean => {
    return date.toDateString() === new Date().toDateString();
};
