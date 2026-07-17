import React from 'react'
import {Status} from "@/types";
import {StatusIcon} from "@/constants";
import Image from "next/image";
import {clsx} from "clsx";


const StatusBadge = ({status}: { status: Status }) => {
    return (
        <div className={clsx("status-badge", {
            'bg-green-600': status === "scheduled",
            'bg-blue-600': status === "pending",
            "bg-[#991B1B]": status === "cancelled"
        })}>
            <Image
                src={StatusIcon[status]}
                alt={status}
                width={24}
                height={24}
                className="h-fit w-3 ring-1"
            />
            <p className={clsx("text-12-semibold capitalize", {
                "text-green-500": status === "scheduled",
                'text-blue-500': status === "pending",
                'text-[#FEE2E2]': status === "cancelled"
            })}>{status}</p>
        </div>
    )
}
export default StatusBadge;
