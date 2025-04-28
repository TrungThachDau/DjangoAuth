import { signOut } from '@/services/authentication';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import { useRouter } from 'next/router';

const onSignOut = async (router) => {
  const refreshToken = sessionStorage.getItem('refreshToken');
  if (!refreshToken) {
    console.error('No refresh token found');
    router.push('/auth/sign-in');
    return;
  }

  try {
    const response = await signOut(refreshToken);
    console.log(response);
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
