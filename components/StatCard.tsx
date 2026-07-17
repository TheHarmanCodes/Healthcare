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
                <h2 className="text-2xl lg:text-3xl leading-9 font-bold text-white ">{count}</h2>
            </div>
        </div>
    )
}
export default StatCard;
