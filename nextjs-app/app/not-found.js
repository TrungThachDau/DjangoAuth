
const  useRouter = require("next/navigation")
const NotFound = () => {
    const router = useRouter();
    useEffect(() => {
        router.push("/");
    }, []);
    return (
        <div>
        <h1>404 - Page Not Found</h1>
        
        </div>
    );
}
export default NotFound;