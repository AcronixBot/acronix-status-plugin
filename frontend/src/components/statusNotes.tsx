import { Container } from 'react-bootstrap'
import Alert from 'react-bootstrap/Alert';

export type noteData = {
    type: 'Info' | 'Warn' | 'Note'
    title: string,
    description: string,
    date: Date | string | number
}

//@ts-ignore
export default function StatusNote(data: noteData) {

    /**
     * info -> blue
     * warn -> red
     * note -> yellow
     */
    return (
        <>
            {/* variant={data.type === 'Info' ? 'info' : data.type === 'Warn' ? 'warning' : data.type === 'Note' ? 'primary' : 'dark'} */}
            <Alert className='text-white border-0 bg-gray-700 my-4 lg:ml-7' key={data.title + '-' + data.type}>
                <Alert.Heading>
                    <span
                        className='font-extrabold'
                        style={{
                            color: data.type === 'Info' ? '#00ff00' : data.type === 'Warn' ? '#eeff00' : data.type === 'Note' ? '#05c9ff' : '#05c9ff'
                        }}
                    >{data.type === 'Info' ? 'Info' : data.type === 'Warn' ? 'Warn' : data.type === 'Note' ? 'Note' : 'Info'}</span>
                    <span>{` : ` + data.title}</span>
                </Alert.Heading>
                <p>
                    {data.description}
                </p>
                <hr />
                <p className='text-sm'>
                    {data.date.toString()}
                </p>
            </Alert>
        </>
    )
}

