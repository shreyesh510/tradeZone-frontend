import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import type { RootState } from '../redux/store';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  receiverId?: string;
  roomId?: string;
  createdAt: string;
  updatedAt: string;
}

interface OnlineUser {
  userId: string;
  socketId: string;
  userName: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { user, testToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user || !testToken) return;

    // Initialize Socket.IO connection
    const newSocket = io('http://localhost:3000', {
      auth: {
        user: {
          userId: user.id,
          userName: user.name,
        },
      },
    });

    setSocket(newSocket);

    // Socket event listeners
    newSocket.on('connect', () => {
      console.log('🔌 Connected to chat server');
      newSocket.emit('getOnlineUsers');
    });

    newSocket.on('newMessage', (message: Message) => {
      console.log('💬 New message received:', message);
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('messageSent', (message: Message) => {
      console.log('✅ Message sent:', message);
    });

    newSocket.on('onlineUsers', (users: OnlineUser[]) => {
      console.log('👥 Online users:', users);
      setOnlineUsers(users.filter(u => u.userId !== user.id));
    });

    newSocket.on('userOnline', (user: OnlineUser) => {
      console.log('🟢 User online:', user);
      setOnlineUsers(prev => [...prev.filter(u => u.userId !== user.userId), user]);
    });

    newSocket.on('userOffline', (user: OnlineUser) => {
      console.log('🔴 User offline:', user);
      setOnlineUsers(prev => prev.filter(u => u.userId !== user.userId));
    });

    // Load existing messages
    loadMessages();

    return () => {
      newSocket.disconnect();
    };
  }, [user, testToken]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const response = await fetch('http://localhost:3000/chat/messages', {
        headers: {
          'Authorization': `Bearer ${testToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !socket) return;

    const messageData = {
      content: newMessage,
      receiverId: selectedUser,
    };

    socket.emit('sendMessage', messageData);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendDirectMessage = (receiverId: string, receiverName: string) => {
    setSelectedUser(receiverId);
    // You can also create a direct message thread here
  };

  const filteredMessages = selectedUser 
    ? messages.filter(msg => 
        (msg.senderId === user?.id && msg.receiverId === selectedUser) ||
        (msg.senderId === selectedUser && msg.receiverId === user?.id)
      )
    : messages;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar - Online Users */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Online Users</h2>
          <p className="text-sm text-gray-600">({onlineUsers.length} online)</p>
        </div>
        
        <div className="p-4">
          {onlineUsers.map((onlineUser) => (
            <div
              key={onlineUser.userId}
              onClick={() => sendDirectMessage(onlineUser.userId, onlineUser.userName)}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                selectedUser === onlineUser.userId 
                  ? 'bg-blue-100 border-blue-300' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-gray-800">{onlineUser.userName}</p>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>
          ))}
          
          {onlineUsers.length === 0 && (
            <p className="text-gray-500 text-center py-4">No other users online</p>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white shadow-sm border-b p-4">
          <h1 className="text-xl font-semibold text-gray-800">
            {selectedUser ? 'Direct Message' : 'Global Chat'}
          </h1>
          {selectedUser && (
            <button
              onClick={() => setSelectedUser(null)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              ← Back to Global Chat
            </button>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.senderId === user?.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-800 shadow-sm'
                }`}
              >
                <div className="flex items-center mb-1">
                  <span className="text-xs font-medium">
                    {message.senderName}
                  </span>
                  <span className="text-xs opacity-75 ml-2">
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white border-t p-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={selectedUser ? "Type a direct message..." : "Type a message..."}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
