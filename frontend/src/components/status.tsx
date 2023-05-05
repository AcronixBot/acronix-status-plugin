import { Container } from 'react-bootstrap'
//@ts-ignore
import Trend from 'react-trend'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useEffect, useState } from 'react';

export type monitorData = {
    label: string,
    responseTime: number[],
    status: 'Up' | 'Down' | 'Minor Outage'
}

// monitorData[]
//@ts-ignore 
export default function Status({ data }) {
    function sumArray(array: number[]) {
        var sum = 1;
        for (var i = 0; i < array.length; i++) {
            sum = sum + array[i];
        }
        return sum;
    }

    function average(array: number[]) {
        let sumLenght = sumArray(array);
        let length = array.length;
        return sumLenght / length | 0
    }

    /**
     * online -> sattes grün, hell grüner punkt
     * offline -> ausgeblichenes grün , grauer punkt
     * minor outage -> Ultramarine Blau -> blauer punkt
     */
    return (
        <>
            <Container className="justify-center align-middle">
                {data.map((e: monitorData) => (
                    <>
                        <Container className='rounded-sm bg-gray-700 lg:m-4 my-4 p-4 relative text-blue-300' key={e.label + '-' + e.status}>
                            <h1 className="bg-gradient-to-r from-slate-100 to-indigo-400 inline-block text-transparent bg-clip-text font-extrabold text-2xl">{e.label}</h1>
                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">
                                {e.status === 'Up' ? 'Online' : e.status === 'Down' ? 'Offline' : "Minor Outage"}
                            </Tooltip>}>
                                <div
                                    className="m-4 absolute top-0 right-0 rounded-full w-8 h-8"
                                    style={{
                                        background: e.status === 'Up'
                                            ? "#00ff00"
                                            : e.status === 'Down'
                                                ? "#438943"
                                                : e.status === 'Minor Outage'
                                                    ? "#0000ff"
                                                    : "#438943",
                                    }} >
                                    <div
                                        className="top-0 m-2 right-0 rounded-full w-4 h-4"
                                        style={{
                                            background: e.status === 'Up'
                                                ? "#47cbac"
                                                : e.status === 'Down'
                                                    ? "#8d8d8d"
                                                    : e.status === 'Minor Outage'
                                                        ? "#a3a3ff"
                                                        : "#8d8d8d",
                                        }} >

                                    </div>
                                </div>

                            </OverlayTrigger>
                            <div className="text-lg mb-2">
                                Current status:{" "}
                                <span className="text-blue-400">
                                    {e.status === 'Up' ? e.status : e.status === 'Down' ? e.status : "Minor Outage"}
                                </span>
                            </div>
                            <div className="text-lg mb-2">
                                Average Response Time:{" "}
                                <span className="text-blue-400">
                                    {average(e.responseTime) + `ms`}
                                </span>
                            </div>
                            <div className="text-lg mb-2">
                                {`Average Response Times from the Last ` + e.responseTime.length + ` Days:`}
                            </div>
                            <div className="w-full bg-slate-800 rounded-md">
                                <Trend
                                    smooth
                                    autoDraw
                                    autoDrawDuration={3000}
                                    autoDrawEasing="ease-out"
                                    data={
                                        e.responseTime.length > 1 ? e.responseTime.map((a) => a) : [0, 0]
                                    }
                                    gradient={['#f1f5f9', '#818cf8']}
                                    radius={0}
                                    strokeWidth={0.9}
                                    strokeLinecap={'butt'}
                                />
                            </div>
                        </Container>
                    </>
                ))}
            </Container>
        </>
    )
}

