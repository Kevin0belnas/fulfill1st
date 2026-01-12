import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaUserCircle, FaEnvelope, FaPaperPlane, FaSignOutAlt, FaEllipsisV, FaRobot, FaBell, FaRegSmile, FaPaperclip, FaCog, FaHistory, FaUsers } from 'react-icons/fa';
import { IoMdSend, IoMdClose } from 'react-icons/io';
import { HiOutlineEmojiHappy } from 'react-icons/hi';
import { supabase } from '../supabaseClient';

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
  const messagesEndRef = useRef(null);
  
  const hasSentWelcomeMessage = useRef({});
  const processedMessages = useRef(new Set());
  const subscriptionRef = useRef(null);
  const isSendingRef = useRef(false);
  const lastReadTimes = useRef({});

  // Add this ref near your other useRef declarations
const scrollContainerRef = useRef(null);
const shouldAutoScrollRef = useRef(true);


  // Format message text to preserve line breaks and lists
  const formatMessageText = (text) => {
    if (!text) return '';
    
    return text.split('\n').map((line, index) => {
      const listMatch = line.match(/^(\d+\.)\s+(.*)$/);
      
      if (listMatch) {
        return (
          <div key={index} className="flex items-start gap-2">
            <span className="font-semibold text-inherit flex-shrink-0">{listMatch[1]}</span>
            <span className="flex-1">{listMatch[2]}</span>
          </div>
        );
      }
      
      if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
        return (
          <div key={index} className="flex items-start gap-2">
            <span className="flex-shrink-0 text-lg">•</span>
            <span className="flex-1">{line.replace(/^[-•]\s+/, '')}</span>
          </div>
        );
      }
      
      if (line.trim() === '') {
        return <div key={index} className="h-3"></div>;
      }
      
      return (
        <div key={index} className={line.startsWith('  ') || line.startsWith('\t') ? 'pl-4' : ''}>
          {line}
        </div>
      );
    });
  };

  // Format timestamp function
  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (e) {
      return '';
    }
  };

  const formatDate = (timestamp) => {
    try {
      const date = new Date(timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (date.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      } else {
        return date.toLocaleDateString('en-US', { 
          weekday: 'long',
          month: 'short', 
          day: 'numeric' 
        });
      }
    } catch (e) {
      return '';
    }
  };

  // Show notification
  const showNotification = (email, message) => {
    setNotification({
      email,
      message: message.length > 50 ? message.substring(0, 50) + '...' : message
    });
    
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  useEffect(() => {
    document.title = `Fulfill First - Agent Chat (${Object.values(unreadCounts).reduce((a, b) => a + b, 0)} unread)`;
  }, [unreadCounts]);

  // Fetch current agent info from Supabase
  useEffect(() => {
    const fetchCurrentAgent = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();
          
          setUser({
            ...authUser,
            ...profile,
            name: profile?.full_name || authUser.email.split('@')[0]
          });
        }
      } catch (error) {
        console.error('Error fetching current agent:', error);
      }
    };

    fetchCurrentAgent();
  }, []);

  // Calculate unread messages for a chat
  const calculateUnreadCount = (chat, currentTime) => {
  // Check if chat.messages exists and is an array
  if (!chat.messages || !Array.isArray(chat.messages)) {
    return 0;
  }
  
  if (!lastReadTimes.current[chat.chatKey]) {
    return chat.messages.filter(msg => !msg.isAgent).length;
  }
  
  return chat.messages.filter(msg => 
    !msg.isAgent && new Date(msg.timestamp) > new Date(lastReadTimes.current[chat.chatKey])
  ).length;
};

  // Mark messages as read when chat is selected
  const markAsRead = (chatKey) => {
    lastReadTimes.current[chatKey] = new Date().toISOString();
    setUnreadCounts(prev => ({
      ...prev,
      [chatKey]: 0
    }));
  };

  // Fetch ALL conversations for visitors assigned to this agent (including previous conversations)
  useEffect(() => {
    if (!user) return;

    const fetchActiveChats = async () => {
      try {
        console.log('🔄 Fetching ALL conversations for agent:', user.id);
        
        // Get all visitors currently assigned to this agent
        const { data: assignedVisitors, error: visitorsError } = await supabase
          .from('visitors')
          .select('email')
          .eq('agent_id', user.id)
          .order('updated_at', { ascending: false });

        if (visitorsError) {
          console.error('Error fetching assigned visitors:', visitorsError);
          return;
        }

        if (!assignedVisitors || assignedVisitors.length === 0) {
          console.log('📭 No assigned visitors for this agent');
          setActiveChats([]);
          return;
        }

        // Get all emails of visitors assigned to this agent
        const visitorEmails = assignedVisitors.map(v => v.email);

        // Get ALL messages for these visitors (including previous conversations with other agents)
        const { data: allMessages, error: messagesError } = await supabase
          .from('visitor_messages')
          .select('*')
          .in('visitor_email', visitorEmails)
          .order('created_at', { ascending: true });

        if (messagesError) {
          console.error('Error fetching messages:', messagesError);
          return;
        }

        // Get agent information for all agent messages
        const agentIds = [...new Set(allMessages
          .filter(msg => msg.is_agent && msg.agent_id)
          .map(msg => msg.agent_id)
        )];

        const { data: agentsData } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', agentIds);

        const agentsMap = new Map();
        agentsData?.forEach(agent => {
          agentsMap.set(agent.id, agent);
        });

        processMessages(allMessages, assignedVisitors, agentsMap);

      } catch (error) {
        console.error('❌ Error fetching active chats:', error);
      }
    };

//     const processMessages = (messages, assignedVisitors, agentsMap) => {
//   if (!messages) return;
  
//   processedMessages.current.clear();
//   const chatsMap = new Map();
//   const newUnreadCounts = {};
  
//   // Group messages by visitor email (not by conversation_id)
//   messages.forEach(msg => {
//     const visitorEmail = msg.visitor_email;
//     if (!visitorEmail) {
//       console.log('⚠️ Message without visitor_email:', msg.id);
//       return;
//     }
    
//     // Check if this visitor is assigned to current agent
//     const isAssigned = assignedVisitors.some(v => v.email === visitorEmail);
//     if (!isAssigned) {
//       return;
//     }
    
//     const chatKey = visitorEmail; // Use email as chat key to group all conversations
    
//     if (!chatsMap.has(chatKey)) {
//       chatsMap.set(chatKey, {
//         email: visitorEmail,
//         messages: [], // Initialize empty messages array
//         last_message_at: msg.created_at,
//         needsWelcome: false,
//         is_active: true,
//         chatKey: chatKey,
//         currentAgent: user.id
//       });
//     }
    
//     const chat = chatsMap.get(chatKey);
    
//     // Ensure messages array exists
//     if (!chat.messages) {
//       chat.messages = [];
//     }
    
//     // Store message in messages array
//     if (!chat.messages.some(m => m.id === msg.id)) {
//       const messageWithAgent = {
//         id: msg.id,
//         message: msg.message,
//         isAgent: msg.is_agent,
//         timestamp: msg.created_at,
//         agent_id: msg.agent_id,
//         conversation_id: msg.conversation_id,
//         agent_name: msg.is_agent && msg.agent_id ? 
//           (agentsMap.get(msg.agent_id)?.full_name || 'Agent') : null
//       };
      
//       chat.messages.push(messageWithAgent);
//     }
    
//     if (new Date(msg.created_at) > new Date(chat.last_message_at)) {
//       chat.last_message_at = msg.created_at;
//     }
//   });

//   // Calculate needsWelcome and unread counts - FIXED with null checks
//   chatsMap.forEach((chat, chatKey) => {
//     // Ensure messages array exists and sort by timestamp
//     if (!chat.messages) {
//       chat.messages = [];
//     }
//     chat.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
//     // Check if this agent has responded to the latest conversation
//     const latestMessages = chat.messages.filter(msg => 
//       msg.conversation_id === chat.messages[chat.messages.length - 1]?.conversation_id
//     );
    
//     const hasAgentMessages = latestMessages.some(msg => 
//       msg.isAgent && msg.agent_id === user?.id
//     );
//     const hasClientMessages = latestMessages.some(msg => !msg.isAgent);
    
//     chat.needsWelcome = hasClientMessages && !hasAgentMessages && !hasSentWelcomeMessage.current[chatKey];
    
//     if (!lastReadTimes.current[chatKey]) {
//       lastReadTimes.current[chatKey] = chat.last_message_at;
//     }
    
//     newUnreadCounts[chatKey] = calculateUnreadCount(chat, new Date().toISOString());
//   });

//   const chats = Array.from(chatsMap.values());
//   chats.sort((a, b) => new Date(b.last_message_at) - new Date(a.last_message_at));
  
//   setActiveChats(chats);
//   setUnreadCounts(newUnreadCounts);

//   console.log('📊 Processed visitor conversations for agent:', user.id, chats.map(c => ({
//     email: c.email,
//     totalMessages: c.messages?.length || 0,
//     conversations: [...new Set(c.messages?.map(m => m.conversation_id) || [])],
//     chatKey: c.chatKey
//   })));
// };

  // Add this near your other useRef declarations
const hasSentWelcomeMessage = useRef({});

// Update the processMessages function to fix the welcome logic
const processMessages = (messages, assignedVisitors, agentsMap) => {
  if (!messages) return;
  
  processedMessages.current.clear();
  const chatsMap = new Map();
  const newUnreadCounts = {};
  
  // Group messages by visitor email
  messages.forEach(msg => {
    const visitorEmail = msg.visitor_email;
    if (!visitorEmail) return;
    
    const isAssigned = assignedVisitors.some(v => v.email === visitorEmail);
    if (!isAssigned) return;
    
    const chatKey = visitorEmail;
    
    if (!chatsMap.has(chatKey)) {
      chatsMap.set(chatKey, {
        email: visitorEmail,
        messages: [],
        last_message_at: msg.created_at,
        needsWelcome: false, // Start as false
        is_active: true,
        chatKey: chatKey,
        currentAgent: user.id
      });
    }
    
    const chat = chatsMap.get(chatKey);
    if (!chat.messages) chat.messages = [];
    
    if (!chat.messages.some(m => m.id === msg.id)) {
      const messageWithAgent = {
        id: msg.id,
        message: msg.message,
        isAgent: msg.is_agent,
        timestamp: msg.created_at,
        agent_id: msg.agent_id,
        conversation_id: msg.conversation_id,
        agent_name: msg.is_agent && msg.agent_id ? 
          (agentsMap.get(msg.agent_id)?.full_name || 'Agent') : null
      };
      
      chat.messages.push(messageWithAgent);
    }
    
    if (new Date(msg.created_at) > new Date(chat.last_message_at)) {
      chat.last_message_at = msg.created_at;
    }
  });

  // Calculate needsWelcome - FIXED LOGIC
  chatsMap.forEach((chat, chatKey) => {
    if (!chat.messages) chat.messages = [];
    chat.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    // Check if current agent has sent ANY message in ANY conversation with this visitor
    const hasAgentSentAnyMessage = chat.messages.some(msg => 
      msg.isAgent && msg.agent_id === user?.id
    );
    
    // Check if there are client messages
    const hasClientMessages = chat.messages.some(msg => !msg.isAgent);
    
    // Only needs welcome if:
    // 1. There are client messages
    // 2. Current agent has NEVER sent any message to this visitor
    // 3. We haven't already sent a welcome message during this session
    chat.needsWelcome = hasClientMessages && 
                       !hasAgentSentAnyMessage && 
                       !hasSentWelcomeMessage.current[chatKey];
    
    if (!lastReadTimes.current[chatKey]) {
      lastReadTimes.current[chatKey] = chat.last_message_at;
    }
    
    newUnreadCounts[chatKey] = calculateUnreadCount(chat, new Date().toISOString());
  });

  const chats = Array.from(chatsMap.values());
  chats.sort((a, b) => new Date(b.last_message_at) - new Date(a.last_message_at));
  
  setActiveChats(chats);
  setUnreadCounts(newUnreadCounts);
};
    fetchActiveChats();

    // Set up real-time subscription for ALL messages from assigned visitors
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    console.log('🔔 Setting up real-time subscription for agent:', user.id);

    // In the real-time subscription part of useEffect, update the visitor check:

subscriptionRef.current = supabase
  .channel(`agent_${user.id}_visitor_messages`)
  .on('postgres_changes', 
    { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'visitor_messages'
    }, 
    async (payload) => {
      console.log('📨 Real-time message received:', payload.new);
      
      if (processedMessages.current.has(payload.new.id)) {
        return;
      }

      // Skip our own messages that are being sent
      if (payload.new.is_agent && payload.new.agent_id === user.id && isSendingRef.current) {
        return;
      }

      try {
        // Check if this visitor is assigned to current agent - WITH RETRY LOGIC
        let visitor = null;
        let retryCount = 0;
        const maxRetries = 5;
        
        while (retryCount < maxRetries && (!visitor || visitor.agent_id !== user.id)) {
          const { data: visitorData, error: visitorError } = await supabase
            .from('visitors')
            .select('agent_id, email')
            .eq('email', payload.new.visitor_email)
            .single();

          if (visitorError) {
            console.log('🚫 Visitor not found:', payload.new.visitor_email, visitorError);
            break;
          }

          visitor = visitorData;
          
          if (!visitor) {
            console.log('🚫 Visitor not found:', payload.new.visitor_email);
            break;
          }

          // If agent_id is null, wait and retry (this handles the timing issue)
          if (visitor.agent_id === null) {
            console.log('⏳ Visitor agent_id is null, retrying...', retryCount + 1);
            retryCount++;
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms
            continue;
          }

          // If assigned to different agent, stop retrying
          if (visitor.agent_id !== user.id) {
            console.log('🚫 Visitor assigned to different agent, ignoring. Current:', user.id, 'Visitor agent:', visitor.agent_id);
            return;
          }

          break; // Visitor is assigned to current agent
        }

        // After retries, if still not assigned to current agent, return
        if (!visitor || visitor.agent_id !== user.id) {
          console.log('🚫 Visitor not assigned to current agent after retries');
          return;
        }

        processedMessages.current.add(payload.new.id);

        // Get agent name for the message
        let agentName = null;
        if (payload.new.is_agent && payload.new.agent_id) {
          const { data: agentData } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', payload.new.agent_id)
            .single();
          agentName = agentData?.full_name || 'Agent';
        }

        setActiveChats(prevChats => {
          // Ensure prevChats is an array
          if (!Array.isArray(prevChats)) {
            prevChats = [];
          }

          const visitorEmail = payload.new.visitor_email;
          const chatKey = visitorEmail;
          
          const chatIndex = prevChats.findIndex(chat => 
            chat && chat.email === visitorEmail
          );
          
          const isNewMessageFromClient = !payload.new.is_agent;
          const isCurrentlySelected = selectedChat === chatKey;
          
          if (isNewMessageFromClient && !isCurrentlySelected) {
            showNotification(visitorEmail, payload.new.message);
          }

          if (chatIndex === -1) {
            // New visitor assigned to this agent
            const newChat = {
              email: visitorEmail,
              messages: [{
                id: payload.new.id,
                message: payload.new.message,
                isAgent: payload.new.is_agent,
                timestamp: payload.new.created_at,
                agent_id: payload.new.agent_id,
                conversation_id: payload.new.conversation_id,
                agent_name: agentName
              }],
              last_message_at: payload.new.created_at,
              needsWelcome: !payload.new.is_agent,
              is_active: true,
              chatKey: chatKey,
              currentAgent: user.id
            };
            
            const updatedChats = [newChat, ...prevChats];
            
            if (!payload.new.is_agent) {
              setUnreadCounts(prev => ({
                ...prev,
                [chatKey]: (prev[chatKey] || 0) + 1
              }));
            }
            
            return updatedChats;
          }

          // Update existing visitor chat
          const updatedChats = [...prevChats];
          const updatedChat = { ...updatedChats[chatIndex] };
          
          // Ensure messages array exists
          if (!updatedChat.messages) {
            updatedChat.messages = [];
          }
          
          // Check if message already exists
          const existingMessage = updatedChat.messages.find(
            msg => msg.id === payload.new.id
          );
          
          if (!existingMessage) {
            updatedChat.messages = [
              ...updatedChat.messages,
              {
                id: payload.new.id,
                message: payload.new.message,
                isAgent: payload.new.is_agent,
                timestamp: payload.new.created_at,
                agent_id: payload.new.agent_id,
                conversation_id: payload.new.conversation_id,
                agent_name: agentName
              }
            ];
            
            // Sort messages by timestamp
            updatedChat.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            
            updatedChat.last_message_at = payload.new.created_at;
            
            // Update needsWelcome for the latest conversation
            const latestMessages = updatedChat.messages.filter(msg => 
              msg.conversation_id === updatedChat.messages[updatedChat.messages.length - 1]?.conversation_id
            );
            
            const hasAgentMessages = latestMessages.some(msg => 
              msg.isAgent && msg.agent_id === user.id
            );
            const hasClientMessages = latestMessages.some(msg => !msg.isAgent);
            updatedChat.needsWelcome = hasClientMessages && !hasAgentMessages && !hasSentWelcomeMessage.current[chatKey];
          }
          
          updatedChats[chatIndex] = updatedChat;
          
          updatedChats.sort((a, b) => 
            new Date(b.last_message_at) - new Date(a.last_message_at)
          );
          
          if (!payload.new.is_agent && selectedChat !== chatKey) {
            setUnreadCounts(prev => ({
              ...prev,
              [chatKey]: (prev[chatKey] || 0) + 1
            }));
          }
          
          return updatedChats;
        });
      } catch (error) {
        console.error('❌ Error processing real-time message:', error);
      }
    }
  )
  .subscribe((status) => {
    console.log('📡 Agent subscription status:', status);
    if (status === 'SUBSCRIBED') {
      console.log('✅ Successfully subscribed to visitor messages for agent:', user.id);
    }
  });

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        console.log('🧹 Cleaned up agent subscription');
      }
    };
  }, [user, selectedChat]);

  // Mark messages as read when selecting a chat
  useEffect(() => {
    if (selectedChat) {
      markAsRead(selectedChat);
    }
  }, [selectedChat]);

  // Send welcome message manually
  // Send welcome message manually - FIXED
// const sendWelcomeMessage = async (chatKey) => {
//   if (hasSentWelcomeMessage.current[chatKey] || !user) {
//     return;
//   }
  
//   try {
//     const chat = activeChats.find(c => c.chatKey === chatKey);
    
//     if (!chat) {
//       console.error('❌ Chat not found:', chatKey);
//       return;
//     }
    
//     // Get the latest conversation ID for this visitor - FIXED with null checks
//     const latestMessage = chat.messages && chat.messages.length > 0 
//       ? chat.messages[chat.messages.length - 1] 
//       : null;
    
//     const latestConversationId = latestMessage?.conversation_id;
    
//     if (!latestConversationId) {
//       console.error('❌ No conversation found for visitor:', chat.email);
//       return;
//     }
    
//     console.log('📤 Sending welcome message:', {
//       email: chat.email,
//       conversationId: latestConversationId,
//       agent_id: user.id
//     });
    
//     const agentName = user?.name || 'Agent';
//     const welcomeMessage = `Hello! My name is ${agentName}. I'll be assisting you with your inquiry. How can I help you today?`;
    
//     const { error } = await supabase
//       .from('visitor_messages')
//       .insert({
//         visitor_email: chat.email,
//         message: welcomeMessage,
//         is_agent: true,
//         agent_id: user.id,
//         created_at: new Date().toISOString(),
//         conversation_id: latestConversationId
//       });

//     if (error) throw error;

//     hasSentWelcomeMessage.current[chatKey] = true;
    
//     setActiveChats(prevChats => 
//       prevChats.map(chat => 
//         chat.chatKey === chatKey
//           ? { ...chat, needsWelcome: false }
//           : chat
//       )
//     );
    
//   } catch (error) {
//     console.error('❌ Error sending welcome message:', error);
//     alert('Failed to send welcome message. Please try again.');
//   }
// };

const sendWelcomeMessage = async (chatKey) => {
  if (hasSentWelcomeMessage.current[chatKey] || !user) {
    return;
  }
  
  try {
    const chat = activeChats.find(c => c.chatKey === chatKey);
    if (!chat) return;

    const latestMessage = chat.messages && chat.messages.length > 0 
      ? chat.messages[chat.messages.length - 1] 
      : null;
    
    const latestConversationId = latestMessage?.conversation_id;
    if (!latestConversationId) return;
    
    const agentName = user?.name || 'Agent';
    const welcomeMessage = `Hello! My name is ${agentName}. I'll be assisting you with your inquiry. How can I help you today?`;
    
    const { error } = await supabase
      .from('visitor_messages')
      .insert({
        visitor_email: chat.email,
        message: welcomeMessage,
        is_agent: true,
        agent_id: user.id,
        created_at: new Date().toISOString(),
        conversation_id: latestConversationId
      });

    if (error) throw error;

    // IMPORTANT: Mark this chat as having sent welcome message
    hasSentWelcomeMessage.current[chatKey] = true;
    
    setActiveChats(prevChats => 
      prevChats.map(chat => 
        chat.chatKey === chatKey
          ? { ...chat, needsWelcome: false }
          : chat
      )
    );
    
  } catch (error) {
    console.error('❌ Error sending welcome message:', error);
    alert('Failed to send welcome message. Please try again.');
  }
};
  // Send message function
  // Update the handleSendMessage function with proper null checks:

// Send message function - FIXED
const handleSendMessage = async () => {
  if (!message.trim() || !selectedChat || !user) return;
  
  try {
    setLoading(true);
    isSendingRef.current = true;
    
    const chat = activeChats.find(c => c.chatKey === selectedChat);
    
    if (!chat) {
      console.error('❌ Chat not found:', selectedChat);
      return;
    }
    
    // Get the latest conversation ID for this visitor - FIXED with null checks
    const latestMessage = chat.messages && chat.messages.length > 0 
      ? chat.messages[chat.messages.length - 1] 
      : null;
    
    const latestConversationId = latestMessage?.conversation_id;
    
    if (!latestConversationId) {
      console.error('❌ No conversation found for visitor:', chat.email);
      return;
    }
    
    console.log('📤 Sending message with:', {
      email: chat.email,
      conversationId: latestConversationId,
      agent_id: user.id
    });
    
    const tempMessageId = `temp-${Date.now()}`;
    const optimisticMessage = {
      id: tempMessageId,
      message: message.trim(),
      isAgent: true,
      timestamp: new Date().toISOString(),
      agent_id: user.id,
      conversation_id: latestConversationId,
      agent_name: user?.name || 'Agent'
    };
    
    setActiveChats(prevChats => {
      const updatedChats = prevChats.map(chat => {
        if (chat.chatKey === selectedChat) {
          // Ensure messages array exists
          const currentMessages = chat.messages || [];
          const updatedMessages = [...currentMessages, optimisticMessage];
          updatedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
          
          return {
            ...chat,
            messages: updatedMessages,
            last_message_at: new Date().toISOString(),
            needsWelcome: false
          };
        }
        return chat;
      });
      
      return updatedChats.sort((a, b) => 
        new Date(b.last_message_at) - new Date(a.last_message_at)
      );
    });
    
    setMessage('');
    
    const { data, error } = await supabase
      .from('visitor_messages')
      .insert({
        visitor_email: chat.email,
        message: message.trim(),
        is_agent: true,
        agent_id: user.id,
        created_at: new Date().toISOString(),
        conversation_id: latestConversationId
      })
      .select()
      .single();

    if (error) throw error;

    setActiveChats(prevChats => {
      const updatedChats = prevChats.map(chat => {
        if (chat.chatKey === selectedChat) {
          // Ensure messages array exists
          const currentMessages = chat.messages || [];
          const updatedMessages = currentMessages.map(msg => 
            msg.id === tempMessageId 
              ? { 
                  ...msg, 
                  id: data.id,
                  timestamp: data.created_at 
                }
              : msg
          );
          
          return {
            ...chat,
            messages: updatedMessages
          };
        }
        return chat;
      });
      
      return updatedChats;
    });
    
    processedMessages.current.add(data.id);
    
  } catch (error) {
    console.error('❌ Error sending message:', error);
    
    setActiveChats(prevChats => {
      const updatedChats = prevChats.map(chat => {
        if (chat.chatKey === selectedChat) {
          // Ensure messages array exists before filtering
          const currentMessages = chat.messages || [];
          const filteredMessages = currentMessages.filter(msg => 
            !msg.id.startsWith('temp-')
          );
          
          return {
            ...chat,
            messages: filteredMessages
          };
        }
        return chat;
      });
      
      return updatedChats;
    });
    
    alert('Failed to send message. Please try again.');
  } finally {
    setLoading(false);
    isSendingRef.current = false;
  }
};

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/login';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Update the filteredChats display to handle missing messages:
const filteredChats = activeChats.filter(chat => 
  chat.email && chat.email.toLowerCase().includes(searchTerm.toLowerCase())
);

// Update the currentChat find to handle edge cases:
const currentChat = activeChats.find(chat => 
  chat.chatKey === selectedChat && chat.messages
);

  const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);

  // Group messages by conversation and date
  const organizeMessagesForDisplay = (messages) => {
  if (!messages || !Array.isArray(messages)) return [];
  
  // Group by conversation
  const conversations = {};
  messages.forEach(msg => {
    const convId = msg.conversation_id;
    if (!conversations[convId]) {
      conversations[convId] = [];
    }
    conversations[convId].push(msg);
  });
  
  // Flatten and add conversation separators
  const organized = [];
  Object.entries(conversations).forEach(([convId, convMessages], index) => {
    if (index > 0) {
      organized.push({
        id: `separator-${convId}`,
        type: 'conversation_separator',
        conversation_id: convId,
        timestamp: convMessages[0]?.timestamp
      });
    }
    
    organized.push(...convMessages);
  });
  
  return organized;
};

  const displayMessages = currentChat && currentChat.messages ? organizeMessagesForDisplay(currentChat.messages) : [];

  // Group messages by date for rendering
  const groupMessagesByDate = (messages) => {
  if (!messages || !Array.isArray(messages)) return {};
  
  const groups = {};
  messages.forEach(message => {
    if (message.type === 'conversation_separator') {
      // Place separators in their own group
      const date = new Date(message.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    } else {
      const date = new Date(message.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    }
  });
  return groups;
};

  const groupedMessages = groupMessagesByDate(displayMessages);

  // Get unique conversation count for a visitor - FIXED
const getConversationCount = (chat) => {
  if (!chat || !chat.messages || !Array.isArray(chat.messages)) return 0;
  const conversations = new Set(chat.messages.map(msg => msg.conversation_id).filter(Boolean));
  return conversations.size;
};

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && currentChat?.allMessages) {
      setTimeout(() => {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [currentChat?.allMessages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      hasSentWelcomeMessage.current = {};
      processedMessages.current.clear();
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, []);

  // Auto-scroll to bottom when messages change - FIXED
useEffect(() => {
  if (!messagesEndRef.current || !currentChat?.messages) return;

  const scrollToBottom = () => {
    if (shouldAutoScrollRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end'
        });
      }, 100);
    }
  };

  scrollToBottom();
}, [currentChat?.messages]);

// Also add scroll event listener to track user scroll behavior
useEffect(() => {
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100; // 100px threshold
    
    shouldAutoScrollRef.current = isAtBottom;
  };

  const container = scrollContainerRef.current;
  if (container) {
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }
}, []);

// Reset auto-scroll when selecting a new chat
useEffect(() => {
  shouldAutoScrollRef.current = true;
}, [selectedChat]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans overflow-hidden relative">
      {/* Notification */}
      {notification && (
        <div className="fixed top-6 right-6 bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 z-50 min-w-80 border border-slate-200 animate-slide-in">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <div className="flex-1">
            <div className="font-semibold text-slate-800 text-sm">
              New message from {notification.email}
            </div>
            <div className="text-slate-600 text-xs mt-0.5">{notification.message}</div>
          </div>
          <button 
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
            onClick={() => setNotification(null)}
          >
            <IoMdClose className="text-lg" />
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-96 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 flex flex-col shadow-xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-200/60">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-lg">
                FF
              </div>
              <div>
                <div className="font-bold text-slate-800">Fulfill First</div>
                <div className="text-xs text-slate-500">Agent Dashboard</div>
              </div>
            </div>
            {totalUnread > 0 && (
              <div className="bg-red-500 text-white rounded-full px-2.5 py-1 text-xs font-bold shadow-lg">
                {totalUnread}
              </div>
            )}
          </div>
          
          {/* User Info */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-2xl border border-slate-200/60">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl flex items-center justify-center font-semibold text-lg shadow-lg">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div>
                <div className="font-semibold text-slate-800">{user?.name || 'Agent'}</div>
                <div className="text-xs text-slate-500">{user?.email}</div>
              </div>
            </div>
            <div className="relative">
              <button 
                className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all shadow-sm"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <FaEllipsisV className="text-sm" />
              </button>
              {showUserMenu && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl py-2 z-50 min-w-40">
                  <button 
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="text-slate-400 text-xs" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-200/60">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all placeholder-slate-400" 
            />
          </div>
        </div>

        {/* Chat List Header */}
        <div className="flex justify-between items-center px-6 py-4">
          <span className="font-semibold text-slate-500 text-xs uppercase tracking-wider">
            Visitor Conversations
          </span>
          <span className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full text-xs font-semibold">
            {filteredChats.length}
          </span>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => {
              const unreadCount = unreadCounts[chat.chatKey] || 0;
              const isSelected = selectedChat === chat.chatKey;
              const lastMessage = chat.allMessages?.[chat.allMessages.length - 1];
              const conversationCount = getConversationCount(chat);
              
              return (
                <div 
                  key={chat.chatKey} 
                  className={`
                    flex p-4 mx-3 my-2 rounded-2xl cursor-pointer items-center transition-all relative border
                    ${isSelected 
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100/50 border-blue-200 shadow-md' 
                      : 'bg-white/50 border-slate-200/60 hover:bg-white hover:border-slate-300 hover:shadow-sm'
                    }
                    ${chat.needsWelcome ? 'border-l-4 border-l-amber-400' : ''}
                  `} 
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
                    {chat.needsWelcome && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-white shadow-lg"></div>
                    )}
                    {conversationCount > 1 && (
                      <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-blue-500 text-white rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                        <FaHistory className="text-xs" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden min-w-0">
                    <div className="flex justify-between items-start mb-1.5">
                      <div className="font-semibold text-slate-800 text-sm truncate flex-1">
                        {chat.email}
                      </div>
                      <div className="text-xs text-slate-400 ml-2">
                        {formatTimestamp(chat.last_message_at)}
                      </div>
                    </div>
                    <div className={`
                      text-sm truncate mb-1
                      ${unreadCount > 0 && !isSelected ? 'font-medium text-slate-800' : 'text-slate-500'}
                    `}>
                      {lastMessage?.message || 'No messages yet'}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{chat.allMessages?.filter(m => !m.isAgent).length || 0} visitor messages</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <FaUsers className="text-xs" />
                        {conversationCount} conversation{conversationCount !== 1 ? 's' : ''}
                      </span>
                      {chat.needsWelcome && (
                        <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Needs response</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-slate-400">
              <FaEnvelope className="text-4xl mb-4 opacity-40" />
              <div className="text-sm font-medium text-center">
                {user ? 'No conversations assigned yet' : 'Loading...'}
              </div>
              <div className="text-xs text-center mt-2 max-w-xs">
                New conversations will appear here automatically
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white/60 backdrop-blur-sm">
        {selectedChat && currentChat ? (
          <>
            {/* Chat Header */}
            <div className="p-6 border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl flex items-center justify-center font-semibold text-lg shadow-lg">
                      {currentChat.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-lg"></div>
                    {getConversationCount(currentChat) > 1 && (
                      <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-blue-500 text-white rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                        <FaHistory className="text-xs" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-lg">{currentChat.email}</div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        Online
                      </span>
                      <span>•</span>
                      <span>{currentChat.allMessages?.length || 0} total messages</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <FaHistory className="text-xs" />
                        {getConversationCount(currentChat)} conversations
                      </span>
                      {(unreadCounts[selectedChat] || 0) > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-blue-500 font-semibold">{unreadCounts[selectedChat]} unread</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
               
                {currentChat.needsWelcome && (
                  <button 
                    className="flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:scale-105 active:scale-95"
                    onClick={() => sendWelcomeMessage(selectedChat)}
                    disabled={loading}
                  >
                    <FaRobot className="text-sm" />
                    Send Welcome
                  </button>
                )}
              </div>
            </div>

            {/* Messages Container */}
            {/* <div className="flex-1 p-6 overflow-y-auto scrollbar-hide bg-gradient-to-b from-slate-50/50 to-blue-50/30">
              {currentChat.allMessages && currentChat.allMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center">
                  <div className="w-24 h-24 bg-white rounded-3xl shadow-lg flex items-center justify-center mb-6">
                    <FaEnvelope className="text-3xl opacity-40" />
                  </div>
                  <div className="text-lg font-semibold text-slate-500 mb-2">No messages yet</div>
                  <div className="text-sm text-slate-400 max-w-xs">
                    {currentChat.needsWelcome ? 
                      'Click "Send Welcome" to start the conversation' : 
                      'Send a message to start the conversation'
                    }
                  </div>
                </div>
              ) : (
                Object.entries(groupedMessages).map(([date, messages]) => (
                  <div key={date}>
                    <div className="flex items-center justify-center my-8">
                      <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                        <span className="text-xs font-medium text-slate-500">
                          {formatDate(messages[0].timestamp)}
                        </span>
                      </div>
                    </div>
                    {messages.map((msg) => {
                      if (msg.type === 'conversation_separator') {
                        return (
                          <div key={msg.id} className="flex items-center justify-center my-6">
                            <div className="bg-amber-50 border border-amber-200 rounded-full px-4 py-2">
                              <span className="text-xs font-medium text-amber-700 flex items-center gap-2">
                                <FaHistory className="text-xs" />
                                New Conversation Started
                              </span>
                            </div>
                          </div>
                        );
                      }
                      
                      return (
                        <div 
                          key={msg.id}
                          className={`
                            flex mb-4 animate-fade-in
                            ${msg.isAgent ? 'justify-end' : 'justify-start'}
                          `}
                        >
                          <div className={`
                            max-w-[70%] px-5 py-3 rounded-3xl shadow-sm backdrop-blur-sm whitespace-pre-wrap
                            ${msg.isAgent 
                              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md' 
                              : 'bg-white/90 text-slate-800 rounded-bl-md border border-slate-200/60'
                            }
                            ${msg.id && msg.id.startsWith('temp-') ? 'opacity-70' : ''}
                            ${unreadCounts[selectedChat] > 0 && !msg.isAgent && new Date(msg.timestamp) > new Date(lastReadTimes.current[selectedChat]) ? 'ring-2 ring-blue-200' : ''}
                          `}>
                            <div className="flex flex-col gap-1.5">
                              {msg.isAgent && msg.agent_name && msg.agent_id !== user?.id && (
                                <div className="text-xs opacity-80 mb-1 flex items-center gap-1">
                                  <span>{msg.agent_name}</span>
                                  {msg.agent_id !== user?.id && (
                                    <span className="text-xs opacity-60">(Previous Agent)</span>
                                  )}
                                </div>
                              )}
                              {formatMessageText(msg.message)}
                            </div>
                            <div className="flex items-center justify-end gap-2 mt-2">
                              {msg.id && msg.id.startsWith('temp-') && (
                                <span className="text-xs opacity-80 italic">Sending...</span>
                              )}
                              <span className={`
                                text-xs opacity-80
                                ${msg.isAgent ? 'text-blue-100' : 'text-slate-400'}
                              `}>
                                {formatTimestamp(msg.timestamp)}
                              </span>
                              {msg.isAgent && !msg.id.startsWith('temp-') && (
                                <span className="text-xs text-blue-200">✓✓</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div> */}

            {/* Messages Container */}
<div 
  ref={scrollContainerRef}
  className="flex-1 p-6 overflow-y-auto scrollbar-hide bg-gradient-to-b from-slate-50/50 to-blue-50/30"
>
  {currentChat.messages && currentChat.messages.length === 0 ? (
    <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center">
      <div className="w-24 h-24 bg-white rounded-3xl shadow-lg flex items-center justify-center mb-6">
        <FaEnvelope className="text-3xl opacity-40" />
      </div>
      <div className="text-lg font-semibold text-slate-500 mb-2">No messages yet</div>
      <div className="text-sm text-slate-400 max-w-xs">
        {currentChat.needsWelcome ? 
          'Click "Send Welcome" to start the conversation' : 
          'Send a message to start the conversation'
        }
      </div>
    </div>
  ) : (
    Object.entries(groupedMessages).map(([date, messages]) => (
      <div key={date}>
        <div className="flex items-center justify-center my-8">
          <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 shadow-sm">
            <span className="text-xs font-medium text-slate-500">
              {formatDate(messages[0].timestamp)}
            </span>
          </div>
        </div>
        {messages.map((msg) => {
          if (msg.type === 'conversation_separator') {
            return (
              <div key={msg.id} className="flex items-center justify-center my-6">
                <div className="bg-amber-50 border border-amber-200 rounded-full px-4 py-2">
                  <span className="text-xs font-medium text-amber-700 flex items-center gap-2">
                    <FaHistory className="text-xs" />
                    New Conversation Started
                  </span>
                </div>
              </div>
            );
          }
          
          return (
            <div 
              key={msg.id}
              className={`
                flex mb-4 animate-fade-in
                ${msg.isAgent ? 'justify-end' : 'justify-start'}
              `}
            >
              <div className={`
                max-w-[70%] px-5 py-3 rounded-3xl shadow-sm backdrop-blur-sm whitespace-pre-wrap
                ${msg.isAgent 
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md' 
                  : 'bg-white/90 text-slate-800 rounded-bl-md border border-slate-200/60'
                }
                ${msg.id && msg.id.startsWith('temp-') ? 'opacity-70' : ''}
                ${unreadCounts[selectedChat] > 0 && !msg.isAgent && new Date(msg.timestamp) > new Date(lastReadTimes.current[selectedChat]) ? 'ring-2 ring-blue-200' : ''}
              `}>
                <div className="flex flex-col gap-1.5">
                  {msg.isAgent && msg.agent_name && msg.agent_id !== user?.id && (
                    <div className="text-xs opacity-80 mb-1 flex items-center gap-1">
                      <span>{msg.agent_name}</span>
                      {msg.agent_id !== user?.id && (
                        <span className="text-xs opacity-60">(Previous Agent)</span>
                      )}
                    </div>
                  )}
                  {formatMessageText(msg.message)}
                </div>
                <div className="flex items-center justify-end gap-2 mt-2">
                  {msg.id && msg.id.startsWith('temp-') && (
                    <span className="text-xs opacity-80 italic">Sending...</span>
                  )}
                  <span className={`
                    text-xs opacity-80
                    ${msg.isAgent ? 'text-blue-100' : 'text-slate-400'}
                  `}>
                    {formatTimestamp(msg.timestamp)}
                  </span>
                  {msg.isAgent && !msg.id.startsWith('temp-') && (
                    <span className="text-xs text-blue-200">✓✓</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    ))
  )}
  <div ref={messagesEndRef} />
</div>

            {/* Message Input */}
            <div className="p-6 border-t border-slate-200/60 bg-white/80 backdrop-blur-sm">
              <div className="flex items-end bg-white rounded-2xl p-1.5 border border-slate-300/60 shadow-sm transition-all focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
                <div className="flex items-center gap-1 px-3">
                  <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-lg transition-colors">
                    <FaPaperclip className="text-sm" />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-lg transition-colors">
                    <HiOutlineEmojiHappy className="text-lg" />
                  </button>
                </div>
                <textarea 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  onKeyDown={handleKeyDown} 
                  placeholder="Type your message... (Shift + Enter for new line)" 
                  className="flex-1 px-2 py-3 border-none outline-none text-sm bg-transparent resize-none scrollbar-hide placeholder-slate-400" 
                  disabled={loading} 
                  rows={1}
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                />
                <button 
                  onClick={handleSendMessage} 
                  className={`
                    w-12 h-12 rounded-2xl text-white flex items-center justify-center transition-all m-1 shadow-lg
                    ${loading || !message.trim() 
                      ? 'bg-slate-300 cursor-not-allowed' 
                      : 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl active:scale-95'
                    }
                  `} 
                  disabled={loading || !message.trim()}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-transparent border-t-current rounded-full animate-spin"></div>
                  ) : (
                    <IoMdSend className="text-lg" />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center p-12">
            <div className="relative mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-white to-slate-100 rounded-3xl shadow-2xl flex items-center justify-center">
                <FaEnvelope className="text-5xl opacity-30" />
              </div>
              {totalUnread > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-3 py-1.5 text-sm font-bold shadow-lg">
                  {totalUnread}
                </div>
              )}
            </div>
            <div className="text-2xl font-bold text-slate-500 mb-3">
              {activeChats.length === 0 ? 'No conversations yet' : 'Select a conversation'}
            </div>
            <div className="text-slate-400 max-w-md mb-6">
              {activeChats.length === 0 
                ? 'When visitors start conversations, they will be automatically assigned to you' 
                : 'Choose a conversation from the sidebar to start messaging'
              }
            </div>
            {totalUnread > 0 && (
              <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-semibold text-sm">
                You have {totalUnread} unread message{totalUnread !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Close dropdown when clicking outside */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  );
};

export default AgentChat;
