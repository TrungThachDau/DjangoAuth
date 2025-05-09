import Link from "next/link";
import "./view_bar.css";
import { Space,Button, Layout } from "antd";
import { DownloadOutlined, InfoCircleOutlined, ShareAltOutlined } from "@ant-design/icons";
const { Header } = Layout;
const ViewBar = ({ view, setView }) => {
  

    return (
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="demo-logo" />
        <Space align="start">
          <Button
            type="outlined"
            icon={<DownloadOutlined />}
            style={{
              backgroundColor: "transparent",
              border: "1px solid white",
              color: "white"
            }}
           
          >
            Download
          </Button>
          <Button
            type="outlined"
            icon={<InfoCircleOutlined />}
            style={{
              backgroundColor: "transparent",
              border: "1px solid white",
              color: "white"
            }}
            
          >
            Information
          </Button>
        </Space>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <a style={{ color: 'white', fontWeight: 'bold' }}>Filename.jpg</a>
        </div>
        <Space align="end">
          <Button
            type="outlined"
            icon={<ShareAltOutlined />}
            style={{
              backgroundColor: "transparent",
              border: "1px solid white",
              color: "white"
            }}
           
          >
            Share
          </Button>
        </Space>
      </Header>
    );
}
export default ViewBar;