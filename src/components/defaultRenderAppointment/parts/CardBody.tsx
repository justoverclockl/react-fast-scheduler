import React, {FC} from 'react';
import {CardBodyProps} from "@components/defaultRenderAppointment/parts/types";

const CardBody: FC<CardBodyProps> = (props) => {
    const { isDropInvalid, description, title } = props

    return (
        <>
            {isDropInvalid && (
                <div className="rfs:absolute rfs:right-1 rfs:top-1 rfs:flex rfs:h-4 rfs:w-4 rfs:items-center rfs:justify-center rfs:rounded-full rfs:bg-red-600 rfs:text-[10px] rfs:font-bold rfs:text-white">
                    X
                </div>
            )}
            <div className="rfs:text-xs rfs:font-semibold">{title}</div>
            {description && (
                <div className="rfs:mt-1 rfs:text-[10px] rfs:font-medium">
                    {description}
                </div>
            )}
        </>
    );
};

export default CardBody;