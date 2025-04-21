
import { Dropdown, Space } from 'antd';
import { DownOutlined,} from '@ant-design/icons';
const items = [
  {
    key: '1',
    label: (
        <a href="/auth/change-password" className="nav-link">
            Change password
        </a>
    ),
  },
    {
        key: '2',
        label: (
        <a href="/auth/sign-out" className="nav-link">
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
