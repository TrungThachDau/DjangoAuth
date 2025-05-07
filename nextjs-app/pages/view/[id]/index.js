import ViewBar from "@/components/view_bar";
import { useRouter } from "next/router";




const ViewPage = () => {
    const { id } = useRouter().query;
    return (
        <div>
            <ViewBar />
            <h1>View Page</h1>
            <p>This is the view page.</p>
        </div>
    );
    }
export default ViewPage;