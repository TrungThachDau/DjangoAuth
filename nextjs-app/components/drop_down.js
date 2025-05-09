import { signOut } from '@/services/authentication';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import { useRouter } from 'next/navigation';
import '@ant-design/v5-patch-for-react-19';
const onSignOut = async (router) => {
  try {
    await signOut(); 
    sessionStorage.clear();
    router.push('/auth/sign-in');
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

const MyDrop = (props) => {
  const router = useRouter(); 

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
        <a
          onClick={() => onSignOut(router)}
          className="nav-link"
        >
          Sign out
        </a>
      ),
    },
  ];

  return (
    <Dropdown menu={{ items }}>
      <a onClick={(e) => e.preventDefault()} style={{ color: 'white' }}>
        <Space>
          {props.status}
          <DownOutlined color="white" />
        </Space>
      </a>
    </Dropdown>
  );
};

export default MyDrop;
