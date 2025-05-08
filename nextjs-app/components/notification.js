


const Notification = ({ message, type }) => {
    const [api, contextHolder] = message.useMessage();
    useEffect(() => {
        api[type]({
        content: message,
        });
    }, [message, type, api]);
    
    return contextHolder;
    }
