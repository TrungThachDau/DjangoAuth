"use client"
import Masonry from 'react-layout-masonry';

const MasoryLayout = ({ data }) => {
   
        return (
            <Masonry
                columns={3}
                gap={16}
                >
                {data.map((url) => {
                    return <img src={url} alt="image" />;
                })}
            </Masonry>
    )
    
}

export default MasoryLayout;
    

