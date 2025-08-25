import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { logout } from '../../redux/slices/authSlice';
import LiveChart from '../../components/LiveChart';

export default function Dashboard() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'user',
      content: 'What are the fastest trends?',
      timestamp: new Date(Date.now() - 300000).toLocaleTimeString()
    },
    {
      id: 2,
      type: 'ai',
      content: 'The line chart is showing a strong upward trend over the past few hours. The moving average indicates positive momentum.',
      timestamp: new Date(Date.now() - 240000).toLocaleTimeString()
    },
    {
      id: 3,
      type: 'user',
      content: 'Can you provide forecasts for the next period?',
      timestamp: new Date(Date.now() - 180000).toLocaleTimeString()
    },
    {
      id: 4,
      type: 'ai',
      content: 'Based on the current patterns, I predict continued upward movement with potential resistance around the 0.220 level.',
      timestamp: new Date(Date.now() - 120000).toLocaleTimeString()
    }
  ]);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: any) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        type: 'user' as const,
        content: message,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages([...messages, newMessage]);
      setMessage('');

      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          type: 'ai' as const,
          content: `Thanks for your question about "${message}". I'm analyzing the current market data and will provide insights shortly.`,
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen bg-gray-900 flex">
      {/* Left side - Chart (75%) */}
      <div className="w-3/4 flex flex-col">
        <LiveChart />
      </div>

      {/* Right side - Discussion Panel (25%) */}
      <div className="w-1/4 bg-gray-800 border-l border-gray-700 flex flex-col">
        {/* Discussion Header with User Info */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-semibold text-lg">Data Discussion</h3>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
              AI
            </div>
          </div>
          
          {/* User Information */}
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-gray-400 text-xs truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Discussion Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start space-x-3 ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                msg.type === 'user' ? 'bg-gray-600' : 'bg-blue-500'
              }`}>
                {msg.type === 'user' ? 'U' : 'AI'}
              </div>
              <div className={`flex-1 max-w-[80%] ${msg.type === 'user' ? 'text-right' : ''}`}>
                <div className={`rounded-lg p-3 ${
                  msg.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-white'
                }`}>
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${
                    msg.type === 'user' ? 'text-blue-200' : 'text-gray-400'
                  }`}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Discussion Input */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about the data..."
              className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
            <button 
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
          
          {/* Quick Actions */}
          <div className="mt-3 flex flex-wrap gap-2">
            <button 
              onClick={() => setMessage('What are the current trends?')}
              className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded hover:bg-gray-600 transition-colors"
            >
              Trends
            </button>
            <button 
              onClick={() => setMessage('Show me the forecast')}
              className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded hover:bg-gray-600 transition-colors"
            >
              Forecast
            </button>
            <button 
              onClick={() => setMessage('Analyze the patterns')}
              className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded hover:bg-gray-600 transition-colors"
            >
              Analysis
            </button>
          </div>
        </div>

        {/* User Actions */}
        <div className="p-4 border-t border-gray-700 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Last login: {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Today'}</span>
            <span>Theme: {user?.preferences?.theme || 'dark'}</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
