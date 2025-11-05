export interface Command<T, U> {
    execute(data: T): U;
}