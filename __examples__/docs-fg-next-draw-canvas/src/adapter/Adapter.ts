export interface Adapter<T, U> {

    to(data: T): U;
}