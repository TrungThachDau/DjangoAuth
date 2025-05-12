import React from 'react';



const VideoLayout = ({ imageUrl, altText = 'Video', caption }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 24 }}>
        <video controls style={{
            maxWidth: '90%',
            height: 'auto',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
             <source src={imageUrl} type="video/mp4"></source>
        </video>
        
    </div>
);

export default VideoLayout;