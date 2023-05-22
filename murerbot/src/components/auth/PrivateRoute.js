import { useLocation, Navigate } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const location = useLocation();
  const isAuthenticated = () => {
    // 세션 상태를 확인하여 인증 여부를 반환합니다.

    const session = sessionStorage.getItem('auth');
    return session!==null; // 세션 값이 존재하면 인증된 것으로 간주합니다.
  };
  
  if (!isAuthenticated()) {
    // 인증된 사용자가 아닌 경우 리다이렉트를 수행합니다.
    return <Navigate to="/" state={{from:location}} replace/>; // 리다이렉트 중이므로 컴포넌트를 렌더링하지 않습니다.
  }

  return <Component {...rest} />;
};
export default PrivateRoute;
