export interface PaginationProps {
    path?: string;
    value: number;
    onChange: (value: number) => void;
    range: number;
    className?: string;
}