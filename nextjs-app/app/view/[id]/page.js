"use client";
import ViewBar from "@/components/view_bar.js";
import { Content } from "antd/es/layout/layout";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Row, Spin, Alert } from "antd";
import ImageLayout from "./image_layot.js";
import axiosInstance from "@/axios.js";

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
                const response = await axiosInstance.get(`object/${id}/`);
                setFile(response.data.data);
            } catch (error) {
                setError("Không thể tải dữ liệu file.");
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
            <Row>
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
                        } else {
                            return <a>Định dạng không hỗ trợ</a>;
                        }
                    } else {
                        return "Không có dữ liệu";
                    }
                })()}
            </Row>
        </Content>
    );
};

export default ViewPage;