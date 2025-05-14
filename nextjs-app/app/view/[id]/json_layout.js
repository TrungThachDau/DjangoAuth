import React from 'react';


const JsonLayout = ({ data }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 24 }}>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    )
}
