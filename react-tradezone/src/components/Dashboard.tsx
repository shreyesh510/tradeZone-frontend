import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../redux/hooks';
import { logout } from '../redux/slices/authSlice';
import LiveChart from './LiveChart';

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="h-screen bg-gray-900 flex">
      {/* Left side - Chart (75%) */}
      <div className="w-3/4 flex flex-col">
        <LiveChart />
      </div>

      {/* Right side - Chat (25%) */}
      <div className="w-1/4 bg-gray-800 border-l border-gray-700 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-white font-semibold text-lg">Start a discussion about the data</h3>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {/* User message */}
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                U
              </div>
              <div className="flex-1">
                <div className="bg-gray-700 rounded-lg p-3">
                  <p className="text-white text-sm">What are the fatest trends?</p>
                </div>
              </div>
            </div>

            {/* AI response */}
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                AI
              </div>
              <div className="flex-1">
                <div className="bg-blue-600 rounded-lg p-3">
                  <p className="text-white text-sm">The line chart is showing ast up ms Hiend over past. trentiiy.</p>
                </div>
              </div>
            </div>

            {/* User message */}
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                U
              </div>
              <div className="flex-1">
                <div className="bg-gray-700 rounded-lg p-3">
                  <p className="text-white text-sm">Can you provide forecasts for trexftopartier!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Message"
              className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


