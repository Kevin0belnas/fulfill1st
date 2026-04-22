import React, { useState, useEffect, useRef, useCallback } from 'react';

// Environment-aware configuration
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

const ChatBubble = React.forwardRef((props, ref) => {
  // State management
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSet, setEmailSet] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [requestEmail, setRequestEmail] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [waitingForAgent, setWaitingForAgent] = useState(false);
  const [showEmailRequest, setShowEmailRequest] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Refs for polling and tracking
  let pollIntervalRef = useRef(null);
  const processedMessages = useRef(new Set());
  const welcomeSentRef = useRef(false);
  const visitorIdRef = useRef(null);
  const currentConversationId = useRef(null);
  
  // Refs to prevent duplicates
  const isSendingRef = useRef(false);
  const topicSavedRef = useRef(false);
  const topicMessageIdRef = useRef(null);
  const isInitializedRef = useRef(false);
  const pendingTopicRef = useRef(null);

  // Add these refs near your other refs
const pendingMessagesRef = useRef(new Map()); // Track messages being sent
const lastProcessedTimestampRef = useRef(null);

// Add this helper function to check for duplicates more aggressively
const isDuplicateMessage = (existingMessages, newMessage, timeWindowSeconds = 3) => {
  return existingMessages.some(existing => {
    // Check by ID
    if (existing.id === newMessage.id) return true;
    
    // Check by content + sender within time window
    if (existing.text === newMessage.text && 
        existing.from === newMessage.from) {
      const existingTime = new Date(getMessageTimestamp(existing)).getTime();
      const newTime = new Date(getMessageTimestamp(newMessage)).getTime();
      const timeDiff = Math.abs(existingTime - newTime);
      
      // If same content within time window, it's a duplicate
      if (timeDiff < timeWindowSeconds * 1000) {
        console.log('🔍 Duplicate detected by content:', newMessage.text);
        return true;
      }
    }
    
    return false;
  });
};

  // Helper function to extract timestamp from message (handles multiple field names)
  const getMessageTimestamp = (msg) => {
    if (msg.timestamp) return msg.timestamp;
    if (msg.created_at) return msg.created_at;
    if (msg.createdAt) return msg.createdAt;
    return new Date().toISOString(); // fallback
  };

  // Helper function to sort messages by timestamp (oldest first)
  const sortMessagesByTime = (messagesList) => {
    if (!messagesList || !Array.isArray(messagesList)) return [];
    
    return [...messagesList].sort((a, b) => {
      const timeA = new Date(getMessageTimestamp(a)).getTime();
      const timeB = new Date(getMessageTimestamp(b)).getTime();
      
      // Handle invalid dates
      if (isNaN(timeA)) return 1;
      if (isNaN(timeB)) return -1;
      
      return timeA - timeB;
    });
  };

  // Expose methods to parent component
  React.useImperativeHandle(ref, () => ({
    openChat: () => setOpen(true),
    closeChat: () => setOpen(false),
    toggleChat: () => setOpen(prev => !prev)
  }));
  
  // Chat topics configuration
  const chatTopics = [
    {
      title: 'Product/Service Support',
      description: 'Get help with our products and services'
    },
    {
      title: 'Sales Inquiry',
      description: 'Learn about pricing and features'
    },
    {
      title: 'Order Fulfillment',
      description: 'Track orders and delivery status'
    },
    {
      title: 'General Questions',
      description: 'Other questions about our company'
    },
  ];

  const welcomeMessages = [
    "Hello! Welcome to Fulfill First support. 👋",
    "I'm here to help answer your questions and connect you with the right specialist.",
    "Please select a topic below to get started:"
  ];

  // API helper function
  const apiCall = async (endpoint, options = {}) => {
    const url = `${config.apiBaseUrl}${endpoint}`;
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    const response = await fetch(url, { ...defaultOptions, ...options });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }
    
    return data;
  };

  // Check if email is expired (2 hours)
  const isEmailExpired = (storedData) => {
    if (!storedData) return true;
    
    try {
      const data = JSON.parse(storedData);
      const storedTime = data.timestamp;
      const currentTime = new Date().getTime();
      const twoHours = 2 * 60 * 60 * 1000;
      
      return (currentTime - storedTime) > twoHours;
    } catch (error) {
      return true;
    }
  };

  // Store email and conversation with timestamp
  const storeChatData = (email, conversationId = null) => {
    const data = {
      email: email,
      timestamp: new Date().getTime(),
      conversationId: conversationId
    };
    localStorage.setItem('visitor_chat_data', JSON.stringify(data));
  };

  // Get stored chat data
  const getStoredChatData = () => {
    const storedData = localStorage.getItem('visitor_chat_data');
    
    if (!storedData || isEmailExpired(storedData)) {
      localStorage.removeItem('visitor_chat_data');
      return null;
    }
    
    try {
      return JSON.parse(storedData);
    } catch (error) {
      localStorage.removeItem('visitor_chat_data');
      return null;
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Format message text with proper line breaks and lists
  const formatMessageText = (text) => {
    if (!text) return '';
    
    return text.split('\n').map((line, index) => {
      const listMatch = line.match(/^(\d+\.)\s+(.*)$/);
      
      if (listMatch) {
        return (
          <div key={index} className="flex items-start gap-2">
            <span className="font-medium text-inherit flex-shrink-0">{listMatch[1]}</span>
            <span className="flex-1">{listMatch[2]}</span>
          </div>
        );
      }
      
      if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
        return (
          <div key={index} className="flex items-start gap-2">
            <span className="flex-shrink-0">•</span>
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

  // Fetch agent information by ID
  const fetchAgentInfo = async (agentId) => {
    try {
      const response = await apiCall(`/agents/${agentId}`);
      if (response.success) {
        setAgent(response.data);
        console.log('👤 Agent info loaded:', response.data.name);
      }
    } catch (error) {
      console.error('Error fetching agent info:', error);
    }
  };

  // Save message to backend with proper conversation ID
const saveMessage = async (messageText, isAgent = false, agentId = null, conversationId = null, clientTimestamp = null) => {
  if (!email && !isAgent) {
    console.error('❌ No email set, cannot save visitor message');
    return null;
  }
  
  const targetConversationId = conversationId || currentConversationId.current;
  
  if (!targetConversationId) {
    console.error('❌ No conversation ID available');
    return null;
  }
  
  try {
    const messageData = {
      visitor_email: email,
      message: messageText,
      is_agent: isAgent,
      conversation_id: targetConversationId,
      client_timestamp: clientTimestamp // Keep for reference but don't use for sorting
    };
    
    if (isAgent && agentId) {
      messageData.agent_id = agentId;
    }
    
    console.log('💾 Saving message:', messageData);
    
    const response = await apiCall('/visitor/messages', {
      method: 'POST',
      body: JSON.stringify(messageData)
    });
    
    if (response.success && response.data) {
      console.log('✅ Message saved with ID:', response.data.id);
      // Return the server-created message with SERVER timestamp
      return { 
        id: response.data.id,
        message: response.data.message,
        is_agent: response.data.is_agent,
        created_at: response.data.created_at, // Use server timestamp!
        timestamp: response.data.created_at
      };
    }
    return null;
  } catch (error) {
    console.error('Error saving message:', error);
    return null;
  }
};
  // Poll for new messages from the server - WITH AGGRESSIVE DUPLICATE DETECTION
const startPolling = useCallback((conversationId) => {
  if (pollIntervalRef.current) {
    clearInterval(pollIntervalRef.current);
  }
  
  pollIntervalRef.current = setInterval(async () => {
    if (!conversationId) return;
    
    try {
      const response = await apiCall(`/visitor/messages/${conversationId}`);
      if (response.success && response.data) {
        // Get current messages for duplicate checking
        let currentMessages = [];
        setMessages(prev => {
          currentMessages = prev;
          return prev;
        });
        
        // Filter out already processed messages
        const newMessages = response.data.filter(msg => {
          // Skip if already processed
          if (processedMessages.current.has(msg.id)) return false;
          
          // Skip if this message is currently being sent
          const isPending = Array.from(pendingMessagesRef.current.keys()).some(
            pendingText => pendingText === msg.message
          );
          if (isPending) {
            console.log('⏭️ Skipping pending message from polling:', msg.message);
            return false;
          }
          
          // Check if message already exists in current messages
          const existsInCurrent = currentMessages.some(existing => {
            if (existing.id === msg.id) return true;
            
            // Check by content and sender within 3 seconds
            if (existing.text === msg.message && existing.from === (msg.is_agent ? 'agent' : 'user')) {
              const existingTime = new Date(getMessageTimestamp(existing)).getTime();
              const msgTime = new Date(msg.created_at || msg.timestamp).getTime();
              if (Math.abs(existingTime - msgTime) < 3000) {
                console.log('🔍 Duplicate detected in polling:', msg.message);
                return true;
              }
            }
            return false;
          });
          
          if (existsInCurrent) return false;
          
          return true;
        });
        
        if (newMessages.length > 0) {
          console.log(`📨 Received ${newMessages.length} new messages`);
          
          newMessages.forEach(msg => {
            processedMessages.current.add(msg.id);
            
            const serverTimestamp = msg.created_at || msg.timestamp || msg.createdAt;
            
            const formattedMsg = {
              id: msg.id,
              from: msg.is_agent ? 'agent' : 'user',
              text: msg.message,
              agent_id: msg.agent_id,
              conversation_id: msg.conversation_id,
              timestamp: serverTimestamp,
              created_at: serverTimestamp
            };
            
            setMessages(prev => {
              // Final duplicate check before adding
              const alreadyExists = prev.some(existing => 
                existing.id === formattedMsg.id ||
                (existing.text === formattedMsg.text && 
                 existing.from === formattedMsg.from &&
                 Math.abs(new Date(existing.timestamp).getTime() - new Date(serverTimestamp).getTime()) < 2000)
              );
              
              if (alreadyExists) {
                console.log('⚠️ Message already exists, skipping:', formattedMsg.text);
                return prev;
              }
              
              // Remove any temporary version
              const withoutTemp = prev.filter(m => 
                !(m.isTemporary && m.text === formattedMsg.text)
              );
              
              const updatedMessages = [...withoutTemp, formattedMsg];
              const sortedMessages = sortMessagesByTime(updatedMessages);
              return sortedMessages;
            });
            
            if (msg.is_agent) {
              setWaitingForAgent(false);
              setIsTyping(false);
              if (msg.agent_id && !agent) {
                fetchAgentInfo(msg.agent_id);
              }
            }
          });
          
          scrollToBottom();
        }
      }
    } catch (error) {
      console.error('Error polling messages:', error);
    }
  }, 2000);
}, [agent]);

// Add this useEffect to clean up stale pending messages
useEffect(() => {
  // Clean up stale pending messages every 10 seconds
  const cleanupInterval = setInterval(() => {
    if (pendingMessagesRef.current.size > 0) {
      console.log('🧹 Cleaning up stale pending messages');
      pendingMessagesRef.current.clear();
    }
  }, 10000);
  
  return () => clearInterval(cleanupInterval);
}, []);

  // Fetch messages from backend for a specific conversation
const fetchMessages = useCallback(async (conversationId) => {
  try {
    console.log('🔄 Fetching messages for conversation:', conversationId);
    const response = await apiCall(`/visitor/messages/${conversationId}`);
    
    if (response.success && response.data) {
      const transformedMessages = response.data.map(msg => {
        // CRITICAL: Use server timestamp for ALL messages
        const serverTimestamp = msg.created_at || msg.timestamp || msg.createdAt;
        
        return {
          id: msg.id,
          from: msg.is_agent ? 'agent' : 'user',
          text: msg.message,
          agent_id: msg.agent_id,
          conversation_id: msg.conversation_id,
          timestamp: serverTimestamp, // Use server timestamp!
          created_at: serverTimestamp
        };
      });
      
      // Sort messages by server timestamp (oldest first)
      const sortedMessages = sortMessagesByTime(transformedMessages);
      setMessages(sortedMessages);
      processedMessages.current = new Set(response.data.map(msg => msg.id));
      
      const agentMessage = response.data.find(msg => msg.is_agent && msg.agent_id);
      if (agentMessage) {
        await fetchAgentInfo(agentMessage.agent_id);
        setWaitingForAgent(false);
        setIsTyping(false);
      }
      
      const hasAgentMessages = response.data.some(msg => msg.is_agent);
      setWaitingForAgent(!hasAgentMessages);
      
      scrollToBottom();
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
  }
}, []);

  const handleClose = () => {
    setOpen(false);
  };

  const generateConversationId = () => {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Assign agent to visitor
  const assignAgentToVisitor = async (visitorEmail, topic, conversationId) => {
    console.log('🔄 Starting agent assignment...');
    
    try {
      const response = await apiCall('/visitors/assign-agent', {
        method: 'POST',
        body: JSON.stringify({
          email: visitorEmail,
          topic: topic,
          conversation_id: conversationId
        })
      });
      
      if (response.success && response.data) {
        setAgent(response.data.agent);
        console.log('👤 Agent assigned to visitor:', response.data.agent.name);
        return response.data.agent;
      } else {
        throw new Error('No agents available');
      }
    } catch (error) {
      console.error('❌ Agent assignment failed:', error);
      setWaitingForAgent(false);
      return null;
    }
  };

  // Initialize chat when component mounts
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;
    
    const storedChatData = getStoredChatData();

    if (storedChatData && storedChatData.conversationId) {
      setLoading(true);
      
      const initializeChat = async () => {
        try {
          console.log('🔍 Initializing existing chat for:', storedChatData.email);
          
          setEmail(storedChatData.email);
          setEmailSet(true);
          currentConversationId.current = storedChatData.conversationId;
          
          await fetchMessages(storedChatData.conversationId);
          startPolling(storedChatData.conversationId);
          setShowInput(true);
          setShowWelcome(false);
          
        } catch (error) {
          console.error('Error initializing chat:', error);
        } finally {
          setLoading(false);
        }
      };

      initializeChat();
    }
  }, [fetchMessages, startPolling]);

  // Handle topic selection
  const handleTopicSelect = async (topic) => {
    if (isSendingRef.current || topicSavedRef.current) {
      console.log('🚫 Topic selection already in progress or saved');
      return;
    }
    
    console.log('🎯 Topic selected:', topic);
    
    isSendingRef.current = true;
    setSelectedTopic(topic);
    setShowWelcome(false);

    const storedChatData = getStoredChatData();
    const storedEmail = storedChatData ? storedChatData.email : null;

    // If no email is stored, request it first
    if (!storedEmail) {
      pendingTopicRef.current = topic;
      setRequestEmail(true);
      setShowEmailRequest(true);
      setWaitingForAgent(false);
      isSendingRef.current = false;
      return;
    }
    
    // Generate new conversation ID
    const newConversationId = generateConversationId();
    currentConversationId.current = newConversationId;
    setEmail(storedEmail);
    setEmailSet(true);
    setShowInput(true);
    setWaitingForAgent(true);
    
    // Add connecting message
    setMessages([{
      id: `temp-conn-${Date.now()}`,
      from: 'bot',
      text: "Thank you for your inquiry! Connecting you with a specialist...",
      isTemporary: true,
      timestamp: new Date().toISOString()
    }]);

    try {
      // Create visitor record
      await apiCall('/visitors', {
        method: 'POST',
        body: JSON.stringify({
          email: storedEmail,
          name: storedEmail.split('@')[0],
          topic: topic,
          conversation_id: newConversationId
        })
      });
      
      // Store chat data locally
      storeChatData(storedEmail, newConversationId);
      
      // Save the topic message
      const messageId = await saveMessage(topic, false, null, newConversationId);
      if (messageId) {
        topicSavedRef.current = true;
        topicMessageIdRef.current = messageId;
        processedMessages.current.add(messageId);
        
        // Replace connecting message with topic message
        setMessages([{
          id: messageId,
          from: 'user',
          text: topic,
          conversation_id: newConversationId,
          timestamp: new Date().toISOString()
        }]);
      }
      
      // Assign agent
      await assignAgentToVisitor(storedEmail, topic, newConversationId);
      startPolling(newConversationId);
      
    } catch (error) {
      console.error('Error in topic selection:', error);
      setMessages([{
        id: `temp-error-${Date.now()}`,
        from: 'bot',
        text: "Sorry, there was an error. Please try again later.",
        isTemporary: true,
        timestamp: new Date().toISOString()
      }]);
      setWaitingForAgent(false);
    } finally {
      isSendingRef.current = false;
    }
  };

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, message: 'Please enter a valid email address' };
    }
    
    const disposableDomains = [
      'tempmail.com', 'guerrillamail.com', 'mailinator.com', 
      '10minutemail.com', 'throwawaymail.com', 'fakeinbox.com',
      'yopmail.com', 'trashmail.com', 'temp-mail.org'
    ];
    
    const domain = email.split('@')[1].toLowerCase();
    if (disposableDomains.includes(domain)) {
      return { isValid: false, message: 'Please use a permanent email address.' };
    }
    
    return { isValid: true, message: '' };
  };

  // Handle email submission
  const handleEmailSubmit = async () => {
    if (isSendingRef.current) {
      console.log('🚫 Already sending, please wait');
      return;
    }
    
    if (!email.trim().includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }

    const validation = validateEmail(email);
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    isSendingRef.current = true;
    setLoading(true);
    
    // Get the pending topic
    const topic = pendingTopicRef.current || selectedTopic;
    if (!topic) {
      alert('Please select a topic first.');
      isSendingRef.current = false;
      setLoading(false);
      return;
    }
    
    // Generate conversation ID
    const newConversationId = generateConversationId();
    currentConversationId.current = newConversationId;
    
    setSelectedTopic(topic);
    setShowEmailRequest(false);
    setRequestEmail(false);
    setShowInput(true);
    setWaitingForAgent(true);
    
    // Add connecting message
    setMessages([{
      id: `temp-conn-${Date.now()}`,
      from: 'bot',
      text: "Thank you! Connecting you with a specialist...",
      isTemporary: true,
      timestamp: new Date().toISOString()
    }]);

    try {
      // Create visitor record
      await apiCall('/visitors', {
        method: 'POST',
        body: JSON.stringify({
          email: email,
          name: email.split('@')[0],
          topic: topic,
          conversation_id: newConversationId
        })
      });

      // Store chat data
      storeChatData(email, newConversationId);
      setEmailSet(true);
      
      // Save the topic message
      const messageId = await saveMessage(topic, false, null, newConversationId);
      if (messageId) {
        topicSavedRef.current = true;
        topicMessageIdRef.current = messageId;
        processedMessages.current.add(messageId);
        
        setMessages([{
          id: messageId,
          from: 'user',
          text: topic,
          conversation_id: newConversationId,
          timestamp: new Date().toISOString()
        }]);
      }
      
      // Assign agent
      await assignAgentToVisitor(email, topic, newConversationId);
      startPolling(newConversationId);
      
      pendingTopicRef.current = null;
      
    } catch (error) {
      console.error('Error in email submission:', error);
      alert('Error saving your information. Please try again.');
      setMessages([{
        id: `temp-error-${Date.now()}`,
        from: 'bot',
        text: "Sorry, there was an error. Please try again later.",
        isTemporary: true,
        timestamp: new Date().toISOString()
      }]);
      setWaitingForAgent(false);
    } finally {
      setLoading(false);
      isSendingRef.current = false;
    }
  };

// Handle sending messages - WITH DUPLICATE PREVENTION
const handleSend = async () => {
  if (input.trim() === '' || isSendingRef.current) return;
  
  isSendingRef.current = true;
  
  const messageText = input.trim();
  const messageHash = `${messageText}_${Date.now()}`;
  
  // Check if this exact message is already being sent
  if (pendingMessagesRef.current.has(messageText)) {
    console.log('⚠️ Message already being sent, skipping duplicate');
    isSendingRef.current = false;
    return;
  }
  
  // Mark as pending
  pendingMessagesRef.current.set(messageText, messageHash);
  
  const tempId = `temp-${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const localNow = new Date().toISOString();
  
  // Create temporary message
  const userMsg = { 
    id: tempId,
    from: 'user', 
    text: messageText,
    isTemporary: true,
    conversation_id: currentConversationId.current,
    timestamp: localNow,
    _sending: true
  };
  
  // Add to messages immediately
  setMessages(prev => {
    // Check if message with same text already exists
    const exists = prev.some(m => m.text === messageText && 
                                   m.from === 'user' && 
                                   !m.isTemporary &&
                                   new Date().getTime() - new Date(m.timestamp).getTime() < 5000);
    if (exists) {
      console.log('⚠️ Message already exists, not adding duplicate');
      return prev;
    }
    return [...prev, userMsg];
  });
  
  setInput('');
  scrollToBottom();

  if (!emailSet) {
    setRequestEmail(true);
    setShowEmailRequest(true);
    setMessages(prev => prev.filter(msg => msg.id !== tempId));
    pendingMessagesRef.current.delete(messageText);
    isSendingRef.current = false;
    return;
  }

  // Save to server
  const savedMessage = await saveMessage(messageText, false, null, currentConversationId.current, localNow);
  
  // Remove from pending after save completes
  setTimeout(() => {
    pendingMessagesRef.current.delete(messageText);
  }, 1000);
  
  if (savedMessage && savedMessage.id) {
    // Mark as processed immediately to prevent polling from adding it
    processedMessages.current.add(savedMessage.id);
    
    // Replace temporary message with permanent one
    setMessages(prev => {
      // Remove the temporary message
      const filteredMessages = prev.filter(msg => msg.id !== tempId);
      
      // Check if server message already exists in the list
      const alreadyExists = filteredMessages.some(msg => msg.id === savedMessage.id);
      if (alreadyExists) {
        console.log('⚠️ Server message already in list, skipping addition');
        return filteredMessages;
      }
      
      // Check for duplicate by content within last 2 seconds
      const duplicateByContent = filteredMessages.some(msg => 
        msg.text === messageText && 
        msg.from === 'user' &&
        !msg.isTemporary &&
        new Date().getTime() - new Date(msg.timestamp).getTime() < 2000
      );
      
      if (duplicateByContent) {
        console.log('⚠️ Duplicate by content detected, skipping');
        return filteredMessages;
      }
      
      // Add the server message
      const serverMessage = {
        id: savedMessage.id,
        from: 'user',
        text: savedMessage.message || messageText,
        conversation_id: currentConversationId.current,
        timestamp: savedMessage.created_at,
        created_at: savedMessage.created_at
      };
      
      const updatedMessages = [...filteredMessages, serverMessage];
      const sortedMessages = sortMessagesByTime(updatedMessages);
      return sortedMessages;
    });
  } else {
    // Remove temporary message on failure
    setMessages(prev => prev.filter(msg => msg.id !== tempId));
    alert('Failed to send message. Please try again.');
  }
  
  isSendingRef.current = false;
};

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    console.log('🔄 Resetting chat for new conversation...');
    
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    
    setSelectedTopic(null);
    setMessages([]);
    setInput('');
    setShowInput(false);
    setRequestEmail(false);
    setShowWelcome(true);
    setShowEmailRequest(false);
    setAgent(null);
    setWaitingForAgent(false);
    setIsTyping(false);
    welcomeSentRef.current = false;
    processedMessages.current.clear();
    topicSavedRef.current = false;
    topicMessageIdRef.current = null;
    pendingTopicRef.current = null;
    currentConversationId.current = null;
    
    console.log('✅ Chat reset for new conversation');
  };

  const headerText = agent 
    ? `Chat with ${agent.name}`
    : waitingForAgent
      ? 'Connecting you to an agent...'
      : 'Fulfill First Support';

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-50 font-['Inter','Segoe_UI',sans-serif]">
      {open && (
        <div className="w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-teal-500 text-white px-5 py-4 flex items-center justify-between shadow-md">
            <div className="flex items-center flex-1">
              <div className="relative mr-3">
                <img 
                  src={agent ? "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" : "https://cdn-icons-png.flaticon.com/512/4712/4712109.png"} 
                  alt="Support" 
                  className="w-10 h-10 rounded-full bg-white/20 p-1" 
                />
                <div className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-teal-500"></div>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-base mb-0.5">{headerText}</div>
                <div className="text-xs opacity-90">
                  {waitingForAgent ? 'Please wait...' : (isTyping ? 'Agent is typing...' : 'Online • Ready to help')}
                </div>
              </div>
            </div>
            <button 
              onClick={handleReset} 
              className="bg-white/20 text-white p-2 rounded-lg flex items-center justify-center transition-all hover:bg-white/30 mr-2"
              title="Start New Chat"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
              </svg>
            </button>
            <button 
              onClick={handleClose} 
              className="bg-red-500 text-white p-2 rounded-xl flex items-center justify-center transition-all hover:bg-red-600 shadow-lg shadow-teal-500/30"
              title="Close chat"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 p-0 overflow-y-auto flex flex-col bg-gradient-to-br from-gray-50 to-blue-50 scrollbar-hide">
            {showWelcome && !selectedTopic && (
              <div className="p-5">
                {welcomeMessages.map((msg, i) => (
                  <div key={i} className="bg-white text-gray-800 rounded-2xl rounded-bl-md px-4 py-3 text-sm leading-relaxed shadow-sm border border-gray-100 mb-2">
                    {msg}
                  </div>
                ))}
              </div>
            )}

            {!selectedTopic && !requestEmail && showWelcome ? (
              <div className="p-5">
                <div className="text-sm text-gray-500 mb-4 text-center font-medium">How can we help you today?</div>
                {chatTopics.map((topic, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleTopicSelect(topic.title)} 
                    className="w-full p-4 my-2 bg-white text-gray-800 border border-gray-200 rounded-xl cursor-pointer text-left text-sm transition-all hover:shadow-md hover:border-gray-300 shadow-sm"
                  >
                    <div className="font-semibold mb-1 text-sm">{topic.title}</div>
                    <div className="text-xs text-gray-500 opacity-80">{topic.description}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex-1 p-5 flex flex-col gap-3">
                {messages.map((msg, index) => (
                  <div
                    key={msg.id || index}
                    className={`flex flex-col max-w-[85%] ${
                      msg.from === 'user' ? 'self-end' : 'self-start'
                    }`}
                  >
                    {msg.from === 'agent' && agent && (
                      <div className="flex items-center mb-1 pl-2">
                        <img 
                          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
                          alt="Agent" 
                          className="w-5 h-5 rounded-full mr-2" 
                        />
                        <span className="font-semibold text-xs text-gray-600">{agent.name}</span>
                      </div>
                    )}
                    <div className={`
                      px-4 py-3 text-sm leading-relaxed shadow-sm whitespace-pre-wrap
                      ${msg.from === 'user' 
                        ? 'bg-teal-500 text-white rounded-2xl rounded-br-md shadow-teal-500/30' 
                        : 'bg-white text-gray-800 rounded-2xl rounded-bl-md border border-gray-100'
                      }
                      ${msg.isTemporary ? 'opacity-70' : ''}
                    `}>
                      <div className="flex flex-col gap-1">
                        {formatMessageText(msg.text)}
                      </div>
                    </div>
                    {msg.isTemporary && <div className="text-xs text-gray-400 mt-1 px-2">Sending...</div>}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center px-4 py-2 bg-white rounded-2xl rounded-bl-md shadow-sm border border-gray-100 self-start max-w-[140px]">
                    <div className="flex gap-1 mr-2">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                    </div>
                    <div className="text-xs text-gray-500">Agent is typing...</div>
                  </div>
                )}

                {showEmailRequest && (
                  <div className="flex flex-col gap-3">
                    <div className="bg-white text-gray-800 rounded-2xl rounded-bl-md px-4 py-3 text-sm leading-relaxed shadow-sm border border-gray-100">
                      Before we continue, please provide your email address so we can assist you better and save your chat history.
                      {pendingTopicRef.current && (
                        <div className="mt-2 text-teal-600 text-xs font-medium">
                          Topic: {pendingTopicRef.current}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 px-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="px-4 py-3 rounded-lg border border-gray-300 text-sm outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                        disabled={loading}
                        autoFocus
                      />
                      <button 
                        onClick={handleEmailSubmit}
                        disabled={loading || !email.includes('@')}
                        className={`
                          px-4 py-3 bg-teal-500 text-white border-none rounded-lg cursor-pointer text-sm font-medium transition-all flex items-center justify-center gap-2
                          ${(loading || !email.includes('@')) ? 'opacity-60 cursor-not-allowed' : 'hover:bg-teal-600'}
                        `}
                      >
                        {loading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : null}
                        {loading ? 'Connecting...' : 'Continue Chat'}
                      </button>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}

            {showInput && (
              <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex items-center bg-gray-50 rounded-3xl p-1 border border-gray-300">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message... (Shift + Enter for new line)"
                    className="flex-1 px-4 py-3 border-none outline-none text-sm bg-transparent rounded-3xl resize-none scrollbar-hide"
                    disabled={loading}
                    rows={1}
                    style={{ minHeight: '48px', maxHeight: '120px' }}
                  />
                  <button 
                    onClick={handleSend} 
                    className={`
                      w-10 h-10 rounded-full bg-teal-500 text-white border-none cursor-pointer flex items-center justify-center transition-all
                      ${(input.trim() === '' || isSendingRef.current) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-teal-600'}
                    `}
                    disabled={input.trim() === '' || isSendingRef.current || loading}
                  >
                    {isSendingRef.current ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chat Bubble Button */}
      <button 
        className={`
          w-15 h-15 rounded-full text-white border-none cursor-pointer text-2xl shadow-lg flex justify-center items-center transition-all duration-300 ml-auto mt-4
          ${open ? 'scale-90 bg-red-500 hover:bg-red-600' : 'bg-teal-500 hover:bg-teal-600 shadow-teal-500/30'}
        `}
        onClick={() => setOpen(!open)}
        title={open ? 'Close chat' : 'Open chat'}
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
          </svg>
        )}
      </button>
    </div>
  );
});

export default ChatBubble;