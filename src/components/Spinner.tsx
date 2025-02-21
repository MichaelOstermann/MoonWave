import type { ReactNode } from 'react'

interface SpinnerProps {
    size: number
    primary: string
    secondary: string
    strokeWidth: number
}

// https://github.com/n3r4zzurr0/svg-spinners?tab=readme-ov-file
export function Spinner({
    size,
    primary,
    secondary,
    strokeWidth,
}: SpinnerProps): ReactNode {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: size, height: size }}
        >
            <style>{'.spinner{animation:spinner_zKoa 2s linear infinite}.spinner circle{animation:spinner_YpZS 1.5s ease-in-out infinite}@keyframes spinner_zKoa{100%{transform:rotate(360deg)}}@keyframes spinner_YpZS{0%{stroke-dasharray:0 150;stroke-dashoffset:0}47.5%{stroke-dasharray:42 150;stroke-dashoffset:-16}95%,100%{stroke-dasharray:42 150;stroke-dashoffset:-59}}'}</style>
            <g>
                <circle
                    cx="12"
                    cy="12"
                    r="9.5"
                    fill="none"
                    strokeWidth={strokeWidth}
                    style={{ stroke: secondary }}
                >
                </circle>
            </g>
            <g className="spinner">
                <circle
                    cx="12"
                    cy="12"
                    r="9.5"
                    fill="none"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    className="origin-center"
                    style={{ stroke: primary }}
                >
                </circle>
            </g>
        </svg>
    )
}
