import React from 'react'
import {clsx} from "clsx";
import Image from "next/image";


interface StatCardProps {
    type: 'appointment' | 'pending' | 'cancelled',
    count: number,
    label: string,
    icon: string
}

const StatCard = ({type, count = 0, label, icon}: StatCardProps) => {

    return (
        <div className={clsx('stat-card', {
            'bg-appointments': type === 'appointment',
            "bg-pending": type === 'pending',
            'bg-cancelled': type === 'cancelled',
        })}>
            <div className="flex items-center gap-4">
                <Image src={icon} alt={label} height={32} width={32} className="size-8 w-fit h-5 md:h-fit"/>
                <div className="flex flex-row items-center gap-4">
                    <h2 className="text-xl lg:text-2xl leading-9 font-bold text-white ">{count}</h2>
                    <p className="text-sm md:text-lg text-white/80">{label}</p>
                </div>
            </div>
        </div>
    )
}
export default StatCard;
