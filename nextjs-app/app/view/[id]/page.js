"use client";
import ViewBar from "@/components/view_bar.js";
import { Content } from "antd/es/layout/layout";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Row, Spin, Alert } from "antd";
import ImageLayout from "./image_layout.js";
import axiosInstance from "@/axios.js";
import VideoLayout from "./video_layout.js";

const ViewPage = () => {
    const params = useParams();
    const { id } = params;
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        setError(null);
        const fetchFile = async () => {
            try {
                if (sessionStorage.getItem("accessToken") === null) {
                    const response = await axiosInstance.get(`object/${id}/`);
                    setFile(response.data.data);
                }
                else{
                    const response = await axiosInstance.get(`object/${id}/`,{
                        headers: { Authorization: "Bearer " + sessionStorage.getItem("accessToken") },
                    });
                    setFile(response.data.data);
                }
                
            } catch (error) {
                setError("Failed to fetch file data.");
                setFile(null);
            } finally {
                setLoading(false);
            }
        };
        fetchFile();
    }, [id]);

    return (
        <Content>
            <ViewBar file={file} />
            <Row align="middle" justify="center" style={{ minHeight: "90vh", padding: 24 }}>
                {(() => {
                    if (loading) {
                        return <Spin />;
                    } else if (error) {
                        return <Alert message={error} type="error" showIcon />;
                    } else if (file) {
                        if (file.extension === "PNG") {
                            return (
                                <ImageLayout imageUrl={file.url} />
                            );
                        }
                        else if (file.extension === "MP4") {
                            return (
                                <VideoLayout imageUrl={file.url}/>
                            ) ;
                        }
                        else {
                            return setError("Extension not supported.");
                        }
                    } else {
                        return "Failed to load file.";
                    }
                })()}
            </Row>
        </Content>
    );
};

export default ViewPage;