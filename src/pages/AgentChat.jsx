import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaUserCircle, FaEnvelope, FaPaperPlane, FaSignOutAlt, FaEllipsisV, FaRobot, FaBell, FaRegSmile, FaPaperclip, FaCog, FaHistory, FaUsers, FaCheck, FaCheckDouble } from 'react-icons/fa';
import { IoMdSend, IoMdClose } from 'react-icons/io';
import { HiOutlineEmojiHappy } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';


const ENV_CONFIG = {
  development: {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  },
  production: {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.fulfill1st.com/api',
  }
};


const currentEnv = import.meta.env.MODE || 'development';
const config = ENV_CONFIG[currentEnv];

const AgentChat = () => {
  const [activeChats, setActiveChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [notification, setNotification] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const shouldAutoScrollRef = useRef(true);
  const hasSentWelcomeMessage = useRef({});
  const isWelcomeSendingRef = useRef({});
  const processingFetchRef = useRef(false);
  let pollIntervalRef = useRef(null);

  const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('auth_token');
  const url = `${config.apiBaseUrl}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
  };
  
  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    const data = await response.json();
    
    if (response.status === 401) {
      // Token expired or invalid - logout automatically
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }
    
    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
};

  const navigate = useNavigate();

  const showNotification = (email, messageText) => {
    setNotification({ 
      email, 
      message: messageText?.length > 50 ? messageText.substring(0, 50) + '...' : messageText 
    });
    setTimeout(() => setNotification(null), 4000);
  };

  // Helper function to sort messages by timestamp (oldest first)
  const sortMessagesByTime = (messages) => {
    if (!messages || !Array.isArray(messages)) return [];
    return [...messages].sort((a, b) => {
      const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return timeA - timeB;
    });
  };

  // Fetch current agent info
  useEffect(() => {
    const fetchCurrentAgent = async () => {
      try {
        const response = await apiCall('/auth/me');
        if (response.success) {
          setUser(response.data);
        }
      } catch (error) {
        console.error('Error fetching current agent:', error);
        if (error.message?.includes('401')) {
          window.location.href = '/login';
        }
      }
    };

    fetchCurrentAgent();
  }, []);

  // Fetch conversations - FIXED to properly sort messages
  const fetchConversations = async () => {
    if (!user) return;
    
    if (processingFetchRef.current) {
      return;
    }
    
    processingFetchRef.current = true;
    
    try {
      const response = await apiCall('/agent/conversations');
      if (response.success) {
        const conversations = response.data.map(conv => ({
          ...conv,
          messages: sortMessagesByTime(conv.messages || [])
        }));
        
        setActiveChats(prevChats => {
          if (prevChats.length === 0) return conversations;
          
          const mergedChats = conversations.map(newConv => {
            const existingConv = prevChats.find(c => c.chatKey === newConv.chatKey);
            if (existingConv) {
              const existingMessageIds = new Set(existingConv.messages.map(m => m.id));
              const newMessages = newConv.messages.filter(m => !existingMessageIds.has(m.id));
              
              // Show notification for new visitor messages (only if not current chat)
              newMessages.forEach(msg => {
                if (!msg.isAgent && existingConv.chatKey !== selectedChat) {
                  showNotification(newConv.email, msg.message);
                }
              });
              
              // Merge and sort messages properly
              const allMessages = sortMessagesByTime([...existingConv.messages, ...newMessages]);
              
              return {
                ...newConv,
                messages: allMessages
              };
            }
            return newConv;
          });
          
          // Also keep any chats that are no longer in the response? No, replace
          return mergedChats;
        });
        
        // Update unread counts
        const unreads = {};
        conversations.forEach(conv => {
          if (conv.unread_count > 0) {
            unreads[conv.chatKey] = conv.unread_count;
          }
        });
        setUnreadCounts(unreads);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      processingFetchRef.current = false;
    }
  };

  useEffect(() => {
    fetchConversations();
    
    // Poll more frequently for real-time updates
    pollIntervalRef.current = setInterval(fetchConversations, 2000);
    
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [user, selectedChat]);

  // Mark as read when selecting chat
  const markAsRead = async (chatKey) => {
    try {
      await apiCall(`/agent/conversations/${chatKey}/read`, { method: 'POST' });
      setUnreadCounts(prev => ({ ...prev, [chatKey]: 0 }));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  useEffect(() => {
    if (selectedChat) {
      markAsRead(selectedChat);
    }
  }, [selectedChat]);

  // Send welcome message
  const sendWelcomeMessage = async (chatKey) => {
    if (hasSentWelcomeMessage.current[chatKey] || isWelcomeSendingRef.current[chatKey]) {
      return;
    }
    
    if (!user) return;
    
    isWelcomeSendingRef.current[chatKey] = true;
    
    try {
      const chat = activeChats.find(c => c.chatKey === chatKey);
      if (!chat || !chat.conversation_id) {
        console.error('No conversation ID found');
        return;
      }
      
      if (hasSentWelcomeMessage.current[chatKey]) {
        return;
      }
      
      const agentName = user?.name || 'Agent';
      const welcomeMessage = `Hello! My name is ${agentName}. I'll be assisting you with your inquiry. How can I help you today?`;
      
      const response = await apiCall('/agent/messages', {
        method: 'POST',
        body: JSON.stringify({
          visitor_email: chat.email,
          message: welcomeMessage,
          conversation_id: chat.conversation_id
        })
      });

      if (response.success) {
        hasSentWelcomeMessage.current[chatKey] = true;
        
        const newMessage = {
          ...response.data,
          isAgent: true,
          agent_name: user.name,
          timestamp: response.data.created_at || new Date().toISOString()
        };
        
        setActiveChats(prevChats => 
          prevChats.map(chat => {
            if (chat.chatKey === chatKey) {
              const updatedMessages = sortMessagesByTime([...chat.messages, newMessage]);
              return { ...chat, needsWelcome: false, messages: updatedMessages };
            }
            return chat;
          })
        );
        
        if (!selectedChat) {
          setSelectedChat(chatKey);
        }
        
        console.log('✅ Welcome message sent successfully for:', chatKey);
      }
    } catch (error) {
      console.error('Error sending welcome message:', error);
    } finally {
      isWelcomeSendingRef.current[chatKey] = false;
    }
  };

  // Send message - FIXED to maintain correct order
  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat || !user) return;
    
    setLoading(true);
    
    const chat = activeChats.find(c => c.chatKey === selectedChat);
    if (!chat || !chat.conversation_id) {
      console.error('Chat or conversation ID not found');
      setLoading(false);
      return;
    }
    
    const messageToSend = message.trim();
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const now = new Date().toISOString();
    
    const optimisticMessage = {
      id: tempId,
      message: messageToSend,
      text: messageToSend,
      isAgent: true,
      agent_id: user.id,
      conversation_id: chat.conversation_id,
      agent_name: user.name,
      timestamp: now,
      isOptimistic: true
    };
    
    // Optimistic update with proper sorting
    setActiveChats(prevChats => 
      prevChats.map(chatItem => {
        if (chatItem.chatKey === selectedChat) {
          const updatedMessages = sortMessagesByTime([...chatItem.messages, optimisticMessage]);
          return { ...chatItem, messages: updatedMessages };
        }
        return chatItem;
      })
    );
    
    setMessage('');
    scrollToBottom();
    
    try {
      const response = await apiCall('/agent/messages', {
        method: 'POST',
        body: JSON.stringify({
          visitor_email: chat.email,
          message: messageToSend,
          conversation_id: chat.conversation_id
        })
      });

      if (response.success) {
        // Replace optimistic message with real one, maintaining order
        setActiveChats(prevChats => 
          prevChats.map(chatItem => {
            if (chatItem.chatKey === selectedChat) {
              // Remove optimistic message
              const filteredMessages = chatItem.messages.filter(msg => msg.id !== tempId);
              // Add real message
              const realMessage = { 
                ...response.data, 
                isAgent: true, 
                agent_name: user.name,
                timestamp: response.data.created_at || now
              };
              // Sort all messages
              const updatedMessages = sortMessagesByTime([...filteredMessages, realMessage]);
              return { ...chatItem, messages: updatedMessages };
            }
            return chatItem;
          })
        );
        
        console.log('✅ Message sent successfully');
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remove the failed optimistic message
      setActiveChats(prevChats => 
        prevChats.map(chatItem => {
          if (chatItem.chatKey === selectedChat) {
            const filteredMessages = chatItem.messages.filter(msg => msg.id !== tempId);
            return { ...chatItem, messages: filteredMessages };
          }
          return chatItem;
        })
      );
      
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
  console.log('Logging out...');
  
  // Clear all localStorage
  localStorage.clear();
  sessionStorage.clear();
  
  // Stop polling
  if (pollIntervalRef.current) {
    clearInterval(pollIntervalRef.current);
    pollIntervalRef.current = null;
  }
  
  // Navigate to login
  window.location.href = '/login';
};

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 100);
  };

  const formatMessageText = (text) => {
    if (!text) return '';
    const messageText = String(text);
    return messageText.split('\n').map((line, index) => {
      const listMatch = line.match(/^(\d+\.)\s+(.*)$/);
      if (listMatch) {
        return <div key={index} className="flex items-start gap-2"><span className="font-semibold flex-shrink-0">{listMatch[1]}</span><span>{listMatch[2]}</span></div>;
      }
      if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
        return <div key={index} className="flex items-start gap-2"><span className="flex-shrink-0 text-lg">•</span><span>{line.replace(/^[-•]\s+/, '')}</span></div>;
      }
      if (line.trim() === '') return <div key={index} className="h-3"></div>;
      return <div key={index} className={line.startsWith('  ') || line.startsWith('\t') ? 'pl-4' : ''}>{line}</div>;
    });
  };

  const formatDate = (timestamp) => {
    try {
      const date = new Date(timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      if (date.toDateString() === today.toDateString()) return 'Today';
      if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
      return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    } catch { return ''; }
  };

  const filteredChats = activeChats.filter(chat => chat.email?.toLowerCase().includes(searchTerm.toLowerCase()));
  const currentChat = activeChats.find(chat => chat.chatKey === selectedChat);
  const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);

  // Group messages by date - ensure proper order
  const groupMessagesByDate = (messages) => {
    if (!messages || !Array.isArray(messages)) return {};
    const groups = {};
    
    // Make sure messages are sorted before grouping
    const sortedMessages = sortMessagesByTime(messages);
    
    sortedMessages.forEach(message => {
      if (message && message.timestamp) {
        const date = new Date(message.timestamp).toDateString();
        if (!groups[date]) groups[date] = [];
        groups[date].push(message);
      }
    });
    return groups;
  };

  const groupedMessages = groupMessagesByDate(currentChat?.messages || []);

  // Auto-scroll when messages change
  useEffect(() => {
    if (shouldAutoScrollRef.current) {
      scrollToBottom();
    }
  }, [currentChat?.messages]);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      shouldAutoScrollRef.current = scrollHeight - scrollTop - clientHeight < 100;
    };
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    shouldAutoScrollRef.current = true;
  }, [selectedChat]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-slate-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans overflow-hidden relative">
      {/* Notification */}
      {notification && (
        <div className="fixed top-6 right-6 bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 z-50 min-w-80 border border-slate-200 animate-slide-in">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <div className="flex-1">
            <div className="font-semibold text-slate-800 text-sm">New message from {notification.email}</div>
            <div className="text-slate-600 text-xs mt-0.5">{notification.message}</div>
          </div>
          <button className="text-slate-400 hover:text-slate-600 p-1 rounded-lg" onClick={() => setNotification(null)}>
            <IoMdClose className="text-lg" />
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-96 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 flex flex-col shadow-xl">
        <div className="p-6 border-b border-slate-200/60">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-lg">FF</div>
              <div><div className="font-bold text-slate-800">Fulfill First</div><div className="text-xs text-slate-500">Agent Dashboard</div></div>
            </div>
            {totalUnread > 0 && <div className="bg-red-500 text-white rounded-full px-2.5 py-1 text-xs font-bold shadow-lg">{totalUnread}</div>}
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-2xl border border-slate-200/60">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl flex items-center justify-center font-semibold text-lg shadow-lg">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div><div className="font-semibold text-slate-800">{user?.name || 'Agent'}</div><div className="text-xs text-slate-500">{user?.email}</div></div>
            </div>
            <div className="relative">
              <button className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all shadow-sm" onClick={() => setShowUserMenu(!showUserMenu)}>
                <FaEllipsisV className="text-sm" />
              </button>
              {showUserMenu && (
  <div className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl py-2 z-50 min-w-40">
    <button 
      onClick={() => {
        console.log('🔴 LOGOUT BUTTON CLICKED!'); // Add this first
        setShowUserMenu(false);
        handleLogout();
      }} 
      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
    >
      <FaSignOutAlt className="text-slate-400 text-xs" /> 
      Logout
    </button>
  </div>
)}
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-slate-200/60">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all" 
            />
          </div>
        </div>

        <div className="flex justify-between items-center px-6 py-4">
          <span className="font-semibold text-slate-500 text-xs uppercase tracking-wider">Visitor Conversations</span>
          <span className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full text-xs font-semibold">{filteredChats.length}</span>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => {
              const unreadCount = unreadCounts[chat.chatKey] || 0;
              const isSelected = selectedChat === chat.chatKey;
              const lastMessage = chat.messages?.[chat.messages.length - 1];
              const lastMessageText = lastMessage?.message || lastMessage?.text || 'No messages yet';
              
              return (
                <div 
                  key={chat.chatKey} 
                  className={`flex p-4 mx-3 my-2 rounded-2xl cursor-pointer items-center transition-all relative border ${
                    isSelected 
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100/50 border-blue-200 shadow-md' 
                      : 'bg-white/50 border-slate-200/60 hover:bg-white hover:border-slate-300 hover:shadow-sm'
                  } ${chat.needsWelcome ? 'border-l-4 border-l-amber-400' : ''}`} 
                  onClick={() => setSelectedChat(chat.chatKey)}
                >
                  <div className="relative mr-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl flex items-center justify-center font-semibold text-base shadow-lg">
                      {chat.email.charAt(0).toUpperCase()}
                    </div>
                    {unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-1.5 text-xs font-bold min-w-5 h-5 flex items-center justify-center shadow-lg">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden min-w-0">
                    <div className="flex justify-between items-start mb-1.5">
                      <div className="font-semibold text-slate-800 text-sm truncate flex-1">{chat.email}</div>
                    </div>
                    <div className={`text-sm truncate mb-1 ${unreadCount > 0 && !isSelected ? 'font-medium text-slate-800' : 'text-slate-500'}`}>
                      {lastMessageText}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{chat.messages?.filter(m => !m.isAgent).length || 0} visitor messages</span>
                      {chat.topic && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-[120px]">Topic: {chat.topic}</span>
                        </>
                      )}
                      {chat.needsWelcome && (
                        <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium text-xs">Needs response</span>
                      )}
                    </div>
                  </div>
                  {chat.needsWelcome && !hasSentWelcomeMessage.current[chat.chatKey] && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); sendWelcomeMessage(chat.chatKey); }}
                      className="ml-2 p-2 bg-amber-500 text-white rounded-lg text-xs hover:bg-amber-600 transition-all"
                    >
                      <FaRobot className="text-xs" />
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-slate-400">
              <FaEnvelope className="text-4xl mb-4 opacity-40" />
              <div className="text-sm font-medium text-center">{user ? 'No conversations assigned yet' : 'Loading...'}</div>
              <div className="text-xs text-center mt-2 max-w-xs">New conversations will appear here automatically</div>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area - Messenger Style */}
      <div className="flex-1 flex flex-col bg-white/60 backdrop-blur-sm">
        {selectedChat && currentChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center font-semibold text-lg shadow-lg">
                    {currentChat.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-800 text-lg">{currentChat.email}</div>
                  <div className="text-xs text-slate-500">
                    {currentChat.messages?.filter(m => !m.isAgent).length || 0} messages • 
                    {currentChat.topic ? ` Topic: ${currentChat.topic}` : ' No topic selected'}
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-slate-50/50 to-blue-50/30">
              {currentChat.messages?.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center">
                  <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mb-4">
                    <FaEnvelope className="text-3xl opacity-40" />
                  </div>
                  <div className="text-lg font-semibold text-slate-500 mb-2">No messages yet</div>
                  <div className="text-sm text-slate-400 max-w-xs">
                    {currentChat.needsWelcome ? 
                      'Click "Send Welcome" to start the conversation' : 
                      'Send a message to start the conversation'
                    }
                  </div>
                  {currentChat.needsWelcome && (
                    <button 
                      className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-full text-sm font-semibold hover:bg-amber-600 transition-all"
                      onClick={() => sendWelcomeMessage(selectedChat)}
                    >
                      Send Welcome Message
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {Object.entries(groupedMessages).map(([date, messages]) => (
                    <div key={date}>
                      <div className="flex justify-center my-4">
                        <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-slate-200 shadow-sm text-xs text-slate-500">
                          {formatDate(date)}
                        </div>
                      </div>
                      {messages.map((msg) => {
                        const isAgent = msg.isAgent;
                        const messageText = msg.message || msg.text || '';
                        const isOptimistic = msg.isOptimistic;
                        
                        return (
                          <div key={msg.id} className={`flex mb-3 ${isAgent ? 'justify-end' : 'justify-start'}`}>
                            {!isAgent && (
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white text-sm font-semibold mr-2 flex-shrink-0">
                                {currentChat.email.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className={`max-w-[70%] ${isAgent ? 'order-1' : 'order-2'}`}>
                              {msg.agent_name && isAgent && (
                                <div className={`text-xs text-slate-500 mb-1 ${isAgent ? 'text-right' : 'text-left'}`}>
                                  {msg.agent_name}
                                </div>
                              )}
                              <div className={`px-4 py-2 rounded-2xl whitespace-pre-wrap ${
                                isAgent 
                                  ? 'bg-blue-500 text-white rounded-br-sm' 
                                  : 'bg-white text-slate-800 rounded-bl-sm border border-slate-200'
                              } ${isOptimistic ? 'opacity-70' : ''}`}>
                                {formatMessageText(messageText)}
                              </div>
                              {isOptimistic && (
                                <div className={`text-xs text-slate-400 mt-1 ${isAgent ? 'text-right' : 'text-left'}`}>
                                  Sending...
                                </div>
                              )}
                            </div>
                            {isAgent && (
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-semibold ml-2 flex-shrink-0">
                                {user?.name?.charAt(0).toUpperCase() || 'A'}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-200/60 bg-white/80 backdrop-blur-sm">
              <div className="flex items-end gap-2 bg-white rounded-2xl p-2 border border-slate-200 shadow-sm">
                <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all">
                  <FaPaperclip className="text-sm" />
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all">
                  <HiOutlineEmojiHappy className="text-lg" />
                </button>
                <textarea 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  onKeyDown={handleKeyDown} 
                  placeholder="Type a message..." 
                  className="flex-1 px-2 py-2 border-none outline-none text-sm bg-transparent resize-none max-h-32 min-h-[40px]"
                  disabled={loading} 
                  rows={1}
                />
                <button 
                  onClick={handleSendMessage} 
                  className={`p-2 rounded-full transition-all ${
                    loading || !message.trim() 
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                  disabled={loading || !message.trim()}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <IoMdSend className="text-lg" />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center p-12">
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center">
                <FaEnvelope className="text-4xl opacity-30" />
              </div>
              {totalUnread > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg">
                  {totalUnread}
                </div>
              )}
            </div>
            <div className="text-xl font-semibold text-slate-500 mb-2">
              {activeChats.length === 0 ? 'No conversations yet' : 'Select a conversation'}
            </div>
            <div className="text-sm text-slate-400 max-w-md">
              {activeChats.length === 0 
                ? 'When visitors start conversations, they will be automatically assigned to you' 
                : 'Choose a conversation from the sidebar to start messaging'
              }
            </div>
          </div>
        )}
      </div>

      {showUserMenu && <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />}

      <style>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default AgentChat;