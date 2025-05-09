"use client";
import ViewBar from "@/components/view_bar.js";
import { Content } from "antd/es/layout/layout";
import {useParams} from "next/navigation";
import { useState, useEffect } from "react";
import axiosInstance from "@/axios.js";

const ViewPage = () => {
    const params = useParams();
    const { id } = params;
    const [file, setFile] = useState(null);
    useEffect(() =>  {
        if (!id) return;
        const fetchFile = async () => {
            try{
                const res = await axiosInstance.get(`object/${id}/`);
                
                setFile(res.data.data);

            }
            catch (error) {
                console.error("Error fetching video details:", error);
            }
        }
        fetchFile();
    }, [id]);
    return (
        <div>
            <ViewBar />
            <Content>
                {file.id}
                {/* if file is image */}
                {file && file.extension.startsWith("JPG") && (
                    <img
                        src={file.url}
                        alt="Image"
                        style={{ width: "100%", height: "100vh", objectFit: "cover" }}
                    />
                )}
                {/* if file is video */}
                {/* Video player */}
                <div style={{ width: "100%", height: "100vh", backgroundColor: "#000" }}>
                    <video
                        src={"http://172.18.20.15:9000/images/HIEUTHUHAI - Nước Mắt Cá Sấu (prod. by Kewtiie) l Official Music Video.mp4"} // Replace with your video source
                        controls
                        style={{ width: "100%", height: "100%" }}
                    />
                </div>
                <div>
                </div>
                <div>
                    {/* <h1>{file.name}</h1> */}
                    <p>Video description goes here.</p>
                </div>
            </Content>
        </div>
    );
    }
export default ViewPage;