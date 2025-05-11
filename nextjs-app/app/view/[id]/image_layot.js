import React from 'react';



const ImageLayout = ({ imageUrl, altText = 'Image', caption }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 24 }}>
        <img
            src={imageUrl}
            alt={altText}
            style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
        />
        {caption && (
            <div style={{ marginTop: 12, color: '#555', fontSize: 16, textAlign: 'center' }}>
                {caption}
            </div>
        )}
    </div>
);

export default ImageLayout;