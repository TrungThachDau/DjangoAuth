"use client";
import ViewBar from "@/components/view_bar.js";
import {useParams} from "next/navigation";

const ViewPage = () => {
    const params = useParams();
    const { id } = params;
    return (
        <div>
            <ViewBar />
            <h1>View Page</h1>
            <p>This is the view page.</p>
        </div>
    );
    }
export default ViewPage;