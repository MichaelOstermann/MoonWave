import type { ComponentProps } from 'react'
import { twJoin } from 'tailwind-merge'
import './AudioWaveIcon.css'

export function AudioWaveIcon({ className, ...props }: Omit<ComponentProps<'div'>, 'children'>) {
    return (
        <div
            {...props}
            className={twJoin('flex items-end justify-center', className)}
        >
            <div className="bars relative *:bg-current">
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </div>
        </div>
    )
}
