"use client";
import Masonry from "react-masonry-css";
import "./mansory_layout.css"
export default function MasoryLayout({ data }) {
  const breakpointColumnsObj = {
    default: 5,
    1100: 4,
    700: 3,
    500: 2
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {data.map((item, idx) => (
        <div key={idx} className="my-masonry-item">
          <img
            src={item.url}
            alt={item.name || `image-${idx}`}
            style={{ width: "100%", borderRadius: 8 }}
          />
          <div className="my-masonry-item-name">{item.name}</div>
        </div>
      ))}
    </Masonry>
  );
}