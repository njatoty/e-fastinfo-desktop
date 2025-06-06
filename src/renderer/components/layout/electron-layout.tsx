import { Outlet } from 'react-router-dom';
import { ElectronTopBar } from '../electron-top-bar';

const ElectronLayout = () => {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <ElectronTopBar />
      <div className="min-h-electron-content flex flex-col flex-grow">
        <Outlet />
      </div>
    </div>
  );
};

export default ElectronLayout;
