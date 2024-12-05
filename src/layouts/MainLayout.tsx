import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Sidebar } from '@/components/Sidebar';
import { DynamicIsland } from '@/components/DynamicIsland';
import { Notch } from '@/components/Notch';
import { getUserName } from '@/helpers/auth';

const Dash = () => {
  const displayedUserName = getUserName();

  return (
    <div className="min-h-screen flex">
      {/* ^ Esta wea era importante xD */}
      <DynamicIsland userName={displayedUserName} userImage='https://www.infobae.com/resizer/v2/H4KDNLXATBGW5NPXJUJS5I3OQY.jpg?auth=8f0c5021ea29f08d2b3b8873142e5046fd5929929b5c40cdca99c297b2cb9698&smart=true&width=350&height=467&quality=85' />
      <Notch userName={displayedUserName} userImage='https://www.infobae.com/resizer/v2/H4KDNLXATBGW5NPXJUJS5I3OQY.jpg?auth=8f0c5021ea29f08d2b3b8873142e5046fd5929929b5c40cdca99c297b2cb9698&smart=true&width=350&height=467&quality=85' />
      <Sidebar />
      {/* <OldSidebar /> */}
      <div className="flex-1">
        <Outlet />
        <Toaster />
      </div>
    </div>
  );
};

export default Dash;
