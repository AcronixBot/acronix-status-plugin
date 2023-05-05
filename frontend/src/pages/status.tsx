import { Container } from 'react-bootstrap'
import { useEffect, useState } from 'react';
import StatusElement, { monitorData } from '../components/status'
import StatusNote, { noteData } from '@/components/statusNotes';

export type resObjekt = {
    status: monitorData[],
    notes: noteData[] | null
}


//@ts-ignore
export default function Status() {
    let dataObjekt: resObjekt = {
        status: [], notes: [
            {
                date: 'Now',
                description: 'Loading Data...',
                title: 'Loading',
                type: 'Info'
            }
        ]
    };
    const [data, setData] = useState(dataObjekt)
    useEffect(() => {
        fetch('/api/status')
            .then((res) => res.json())
            .then((data) => {
                setData(data)
            })


        setInterval(() => {
            fetch('/api/status')
                .then((res) => res.json())
                .then((data) => {
                    setData(data)
                })
        }, 10000)
    }, [])

    if (!data) return (
        <>
            <Container>
                <StatusNote date={'Now'} description='Loading Status Data for Api, Bot and other Services...' title='Loading...' type='Note' />
            </Container>
        </>
    )
    /**
     * Data i get from the api:
     * {
     * status: monitorData[]
     * notes: noteData[] | null
     * }
     */
    return (
        <>
            {/* <StatusElement data={data} /> */}
            <main className="block transition-all duration-200 z-10 absolute inset-0 px-5 max-w-full w-full mx-auto" key={`status-main`}>
                <Container className='pt-20 mx-auto pb-20' key={`status-main-container`}>
                    {/* compare notes with null 
                        if null return nothing 
                        else return a <StatusNote data={data.notes}> */}
                    {
                        data.notes === null ? null : (
                            <>
                                {/* return a map of StatusNote with parameter "e"*/}
                                {data.notes.map((e:noteData) => (
                                    <>
                                        <StatusNote date={e.date} description={e.description} title={e.title} type={e.type}  />
                                    </>
                                ))}
                            </>
                        )
                    }

                    {
                        data.status.length === 0 ? null : (
                            <>
                                <StatusElement data={data.status} />
                            </>
                        )
                    }


                </Container>
            </main>
        </>
    )
}

