
import { Dropdown, Space } from 'antd';
import {Link} from "react-router-dom";
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
const items = [
  {
    key: '1',
    label: (
        <a href="/change-password" className="nav-link">
            Change password
        </a>
    ),
  },
    {
        key: '2',
        label: (
        <a href="/sign-out" className="nav-link">
            Sign out
        </a>
    ),
  }
];
const MyDrop = (props) => (
  <Dropdown menu={{ items }}>
    <a onClick={e => e.preventDefault()} style={{color:"white"}}>
      <Space>
          {props.status}
        <DownOutlined color="white"/>
      </Space>
    </a>
  </Dropdown>
);
export default MyDrop;
