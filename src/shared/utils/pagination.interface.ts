export interface PaginationResponse<T> {
    data: T[];
    skip: number;
    take: number;
    count: number;
}
