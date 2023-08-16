import React from "react";

export interface InputProps {
    text?: string;
    title?: string;
    error?: boolean;
    getValue?: (value: string) => void;
    onFocus?: () => void;
    bg?: string;
    type?: string;
    placeholder?: string;
    className?: string;
}
