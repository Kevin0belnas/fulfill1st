// import React, { useState, useEffect, useRef } from 'react';
// import { supabase } from '../supabaseClient';

// const ChatBubble = React.forwardRef((props, ref) => {
//   const [open, setOpen] = useState(false);
//   const [email, setEmail] = useState('');
//   const [emailSet, setEmailSet] = useState(false);
//   const [input, setInput] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [requestEmail, setRequestEmail] = useState(false);
//   const [selectedTopic, setSelectedTopic] = useState(null);
//   const [showInput, setShowInput] = useState(false);
//   const [agent, setAgent] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [waitingForAgent, setWaitingForAgent] = useState(false);
//   const [showEmailRequest, setShowEmailRequest] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);
//   const messagesEndRef = useRef(null);
  
//   const subscriptionRef = useRef(null);
//   const processedMessages = useRef(new Set());
//   const welcomeSentRef = useRef(false);
//   const pendingMessages = useRef(new Set());
//   const visitorIdRef = useRef(null);
//   const agentAssignmentAttempts = useRef(0);
//   const hasSetUpSubscription = useRef(false);

//   React.useImperativeHandle(ref, () => ({
//     openChat: () => setOpen(true),
//     closeChat: () => setOpen(false),
//     toggleChat: () => setOpen(prev => !prev)
//   }));
  
//   const chatTopics = [
//     {
//       title: 'Product/Service Support',
//       description: 'Get help with our products and services'
//     },
//     {
//       title: 'Sales Inquiry',
//       description: 'Learn about pricing and features'
//     },
//     {
//       title: 'Order Fulfillment',
//       description: 'Track orders and delivery status'
//     },
//     {
//       title: 'General Questions',
//       description: 'Other questions about our company'
//     },
//   ];

//   const welcomeMessages = [
//     "Hello! Welcome to Fulfill First support. 👋",
//     "I'm here to help answer your questions and connect you with the right specialist.",
//     "Please select a topic below to get started:"
//   ];

//   const scrollToBottom = () => {
//     setTimeout(() => {
//       messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, 100);
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, isTyping]);

//   // Format message text to preserve line breaks and lists
//   const formatMessageText = (text) => {
//     if (!text) return '';
    
//     return text.split('\n').map((line, index) => {
//       // Check if line starts with a number pattern (like "1.", "2.", etc.)
//       const listMatch = line.match(/^(\d+\.)\s+(.*)$/);
      
//       if (listMatch) {
//         return (
//           <div key={index} className="flex items-start gap-2">
//             <span className="font-medium text-inherit flex-shrink-0">{listMatch[1]}</span>
//             <span className="flex-1">{listMatch[2]}</span>
//           </div>
//         );
//       }
      
//       // Check for bullet points
//       if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
//         return (
//           <div key={index} className="flex items-start gap-2">
//             <span className="flex-shrink-0">•</span>
//             <span className="flex-1">{line.replace(/^[-•]\s+/, '')}</span>
//           </div>
//         );
//       }
      
//       // Regular line with possible indentation
//       if (line.trim() === '') {
//         return <div key={index} className="h-3"></div>; // Empty line spacer
//       }
      
//       return (
//         <div key={index} className={line.startsWith('  ') || line.startsWith('\t') ? 'pl-4' : ''}>
//           {line}
//         </div>
//       );
//     });
//   };

//   // Real-time subscription setup
//   useEffect(() => {
//     if (!email) {
//       console.log('⏳ Waiting for email to setup subscription');
//       return;
//     }

//     if (hasSetUpSubscription.current) {
//       console.log('📡 Subscription already set up for:', email);
//       return;
//     }

//     if (subscriptionRef.current) {
//       subscriptionRef.current.unsubscribe();
//     }

//     console.log('🔔 Setting up real-time subscription for:', email);
    
//     const channelName = `visitor_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
//     console.log('📡 Channel name:', channelName);
    
//     subscriptionRef.current = supabase
//       .channel(channelName)
//       .on('postgres_changes', 
//         { 
//           event: 'INSERT', 
//           schema: 'public', 
//           table: 'visitor_messages',
//           filter: `visitor_email=eq.${email}`
//         }, 
//         (payload) => {
//           console.log('📨 REAL-TIME MESSAGE RECEIVED:', {
//             id: payload.new.id,
//             message: payload.new.message,
//             is_agent: payload.new.is_agent,
//             agent_id: payload.new.agent_id
//           });
          
//           const isPendingMessage = pendingMessages.current.has(payload.new.id);
//           const isAlreadyProcessed = processedMessages.current.has(payload.new.id);
          
//           if (!isAlreadyProcessed && !isPendingMessage) {
//             console.log('✅ Processing new message...');
            
//             const newMessage = {
//               id: payload.new.id,
//               from: payload.new.is_agent ? 'agent' : 'user',
//               text: payload.new.message,
//               timestamp: payload.new.created_at,
//               agent_id: payload.new.agent_id
//             };
            
//             setMessages(prev => {
//               const filteredPrev = prev.filter(msg => !msg.isTemporary);
              
//               const duplicate = filteredPrev.some(msg => 
//                 msg.text === newMessage.text && 
//                 msg.from === newMessage.from &&
//                 Math.abs(new Date(msg.timestamp) - new Date(newMessage.timestamp)) < 3000
//               );
              
//               if (duplicate) {
//                 console.log('🚫 Duplicate message detected, skipping');
//                 return filteredPrev;
//               }
              
//               const updatedMessages = [...filteredPrev, newMessage];
//               return updatedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
//             });
            
//             processedMessages.current.add(payload.new.id);
            
//             if (payload.new.is_agent) {
//               console.log('👤 Agent message received, stopping waiting state');
//               setWaitingForAgent(false);
//               setIsTyping(false);
              
//               if (payload.new.agent_id && !agent) {
//                 console.log('🔄 Fetching agent info for:', payload.new.agent_id);
//                 fetchAgentInfo(payload.new.agent_id);
//               }
//             }
//           } else {
//             console.log('⏭️ Message already processed or pending:', {
//               pending: isPendingMessage,
//               processed: isAlreadyProcessed
//             });
//           }
          
//           if (isPendingMessage) {
//             console.log('✅ Message confirmed, removing from pending');
//             pendingMessages.current.delete(payload.new.id);
//           }
//         }
//       )
//       .subscribe((status, error) => {
//         console.log('📡 Subscription status:', status);
//         if (status === 'SUBSCRIBED') {
//           hasSetUpSubscription.current = true;
//           console.log('✅ Successfully subscribed to real-time updates');
//         }
//         if (error) {
//           console.error('❌ Subscription error:', error);
//         }
//       });

//     return () => {
//       if (subscriptionRef.current) {
//         console.log('🧹 Cleaning up subscription');
//         subscriptionRef.current.unsubscribe();
//         hasSetUpSubscription.current = false;
//       }
//     };
//   }, [email]);

//   const handleClose = () => {
//     setOpen(false);
//   };

//   // Fetch messages from Supabase
//   const fetchMessages = async (visitorEmail) => {
//     try {
//       console.log('🔄 Fetching messages for:', visitorEmail);
//       const { data, error } = await supabase
//         .from('visitor_messages')
//         .select('*')
//         .eq('visitor_email', visitorEmail)
//         .order('created_at', { ascending: true });

//       if (error) throw error;

//       if (data && data.length > 0) {
//         console.log('📨 Found messages:', data.length);
//         const transformedMessages = data.map(msg => ({
//           id: msg.id,
//           from: msg.is_agent ? 'agent' : 'user',
//           text: msg.message,
//           timestamp: msg.created_at,
//           agent_id: msg.agent_id
//         }));

//         setMessages(transformedMessages);
//         processedMessages.current = new Set(data.map(msg => msg.id));

//         const agentMessage = data.find(msg => msg.is_agent && msg.agent_id);
//         if (agentMessage) {
//           console.log('👤 Found agent message, fetching agent info');
//           await fetchAgentInfo(agentMessage.agent_id);
//           setWaitingForAgent(false);
//           setIsTyping(false);
//         }

//         const hasAgentMessages = data.some(msg => msg.is_agent);
//         setWaitingForAgent(!hasAgentMessages);
        
//         if (hasAgentMessages) {
//           console.log('✅ Agent has already responded');
//         }
//       } else {
//         console.log('📭 No messages found for visitor');
//       }
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//     }
//   };

//   // Fetch agent information by ID
//   const fetchAgentInfo = async (agentId) => {
//     try {
//       console.log('🔄 Fetching agent info for:', agentId);
//       const { data: agentData, error } = await supabase
//         .from('profiles')
//         .select('*')
//         .eq('id', agentId)
//         .single();

//       if (error) throw error;

//       if (agentData) {
//         setAgent(agentData);
//         console.log('👤 Agent info loaded:', agentData.full_name);
//       }
//     } catch (error) {
//       console.error('Error fetching agent info:', error);
//     }
//   };

//   // Send agent introduction message
//   const sendAgentIntroduction = async (agentData, topic) => {
//     if (welcomeSentRef.current) {
//       console.log('🚫 Welcome already sent');
//       return;
//     }
    
//     console.log('👋 Sending agent introduction...');
//     const introMessage = `Hello! My name is ${agentData.full_name || agentData.name}. I'll be assisting you with "${topic}". How can I help you today?`;
    
//     setIsTyping(true);
//     welcomeSentRef.current = true;
    
//     setTimeout(async () => {
//       try {
//         console.log('📤 Actually sending intro message to database');
//         const messageId = await saveMessageToSupabase(introMessage, true, agentData.id);
        
//         if (messageId) {
//           pendingMessages.current.add(messageId);
//           console.log('✅ Intro message sent with ID:', messageId);
//         }

//         setIsTyping(false);
//         setWaitingForAgent(false);
        
//       } catch (error) {
//         console.error('Error sending agent introduction:', error);
//         setIsTyping(false);
//         setWaitingForAgent(false);
//       }
//     }, 2000);
//   };

//   // Save message to Supabase
//   const saveMessageToSupabase = async (messageText, isAgent = false, agentId = null) => {
//     if (!email) {
//       console.error('❌ No email set, cannot save message');
//       return null;
//     }
    
//     try {
//       const messageData = {
//         visitor_email: email,
//         message: messageText,
//         is_agent: isAgent,
//         created_at: new Date().toISOString()
//       };

//       if (isAgent && agentId) {
//         messageData.agent_id = agentId;
//       }

//       console.log('💾 Saving message to database:', { messageText, isAgent, agentId });
//       const { data, error } = await supabase
//         .from('visitor_messages')
//         .insert(messageData)
//         .select()
//         .single();

//       if (error) throw error;

//       console.log('✅ Message saved with ID:', data?.id);
//       return data?.id || null;
//     } catch (error) {
//       console.error('Error saving message:', error);
//       return null;
//     }
//   };

//   // Initialize chat when component mounts
//   useEffect(() => {
//     const storedEmail = localStorage.getItem('visitor_email');

//     if (storedEmail) {
//       setLoading(true);
      
//       const initializeChat = async () => {
//         try {
//           console.log('🔍 Initializing chat for:', storedEmail);
//           const { data: visitorData } = await supabase
//             .from('visitors')
//             .select('*')
//             .eq('email', storedEmail)
//             .single();

//           if (visitorData) {
//             setEmail(storedEmail);
//             setEmailSet(true);
//             setSelectedTopic(visitorData.topic || null);
//             setShowWelcome(false);
//             setShowInput(true);
//             visitorIdRef.current = visitorData.id;
            
//             await fetchMessages(storedEmail);
            
//             if (visitorData.agent_id) {
//               console.log('👤 Visitor already has agent assigned');
//               await fetchAgentInfo(visitorData.agent_id);
//               setWaitingForAgent(false);
//             } else if (visitorData.topic) {
//               console.log('⏳ Visitor has topic but no agent, waiting...');
//               setWaitingForAgent(true);
//             }
//           } else {
//             console.log('❌ Visitor not found, clearing storage');
//             localStorage.removeItem('visitor_email');
//           }
//         } catch (error) {
//           console.error('Error initializing chat:', error);
//           localStorage.removeItem('visitor_email');
//         } finally {
//           setLoading(false);
//         }
//       };

//       initializeChat();
//     }
//   }, []);

//   // Improved agent assignment
//   const assignAgentToVisitor = async (visitorEmail, topic) => {
//     console.log('🔄 Starting agent assignment...');
    
//     try {
//       const { data: agents, error } = await supabase
//         .from('profiles')
//         .select('*')
//         .eq('role', 'agent')
//         .order('last_assigned_at', { ascending: true, nullsFirst: true });

//       if (error) throw error;

//       if (agents && agents.length > 0) {
//         const agentAssignments = await Promise.all(
//           agents.map(async (agent) => {
//             const { count } = await supabase
//               .from('visitors')
//               .select('*', { count: 'exact', head: true })
//               .eq('agent_id', agent.id)
//               .is('completed_at', null);

//             return { 
//               agent, 
//               count: count || 0, 
//               lastAssigned: agent.last_assigned_at 
//             };
//           })
//         );

//         agentAssignments.sort((a, b) => {
//           if (a.count !== b.count) return a.count - b.count;
//           return new Date(a.lastAssigned || 0) - new Date(b.lastAssigned || 0);
//         });

//         const assignedAgent = agentAssignments[0].agent;
        
//         console.log('✅ Agent selected:', assignedAgent.full_name);

//         const { error: updateError } = await supabase
//           .from('visitors')
//           .update({ 
//             agent_id: assignedAgent.id,
//             topic: topic,
//             assigned_at: new Date().toISOString(),
//             updated_at: new Date().toISOString()
//           })
//           .eq('email', visitorEmail);

//         if (updateError) throw updateError;

//         await supabase
//           .from('profiles')
//           .update({ 
//             last_assigned_at: new Date().toISOString()
//           })
//           .eq('id', assignedAgent.id);

//         setAgent(assignedAgent);
//         console.log('👤 Agent assigned to visitor');
        
//         sendAgentIntroduction(assignedAgent, topic);
        
//         return assignedAgent;
//       } else {
//         throw new Error('No agents available');
//       }
//     } catch (error) {
//       console.error('❌ Agent assignment failed:', error);
//       setWaitingForAgent(false);
//       return null;
//     }
//   };

//   const handleTopicSelect = async (topic) => {
//     console.log('🎯 Topic selected:', topic);
//     setSelectedTopic(topic);
//     setShowWelcome(false);

//     const timestamp = new Date().toISOString();
//     const tempId = `temp-${Date.now()}`;
    
//     const topicMessage = {
//       id: tempId,
//       from: 'user',
//       text: topic,
//       timestamp,
//       isTemporary: true
//     };
    
//     setMessages(prev => [...prev, topicMessage]);

//     const storedEmail = localStorage.getItem('visitor_email');

//     try {
//       if (storedEmail) {
//         await supabase
//           .from('visitors')
//           .update({ 
//             topic: topic, 
//             updated_at: new Date().toISOString() 
//           })
//           .eq('email', storedEmail);

//         const messageId = await saveMessageToSupabase(topic, false);
        
//         if (messageId) {
//           pendingMessages.current.add(messageId);
//           setMessages(prev => prev.map(msg => 
//             msg.id === tempId ? { ...msg, id: messageId, isTemporary: false } : msg
//           ));
//         }

//         setShowInput(true);
//         setWaitingForAgent(true);
        
//         setTimeout(() => {
//           setMessages(prev => {
//             const hasConnectingMessage = prev.some(msg => 
//               msg.text && msg.text.includes("Connecting you with a specialist")
//             );
            
//             if (!hasConnectingMessage) {
//               return [...prev, {
//                 id: `temp-conn-${Date.now()}`,
//                 from: 'bot',
//                 text: "Thank you for your inquiry! Connecting you with a specialist...",
//                 timestamp: new Date().toISOString(),
//                 isTemporary: true
//               }];
//             }
//             return prev;
//           });
//         }, 500);

//         await assignAgentToVisitor(storedEmail, topic);
        
//       } else {
//         setRequestEmail(true);
//         setShowEmailRequest(true);
//       }

//     } catch (error) {
//       console.error('Error saving topic:', error);
//     }
//   };

//   const handleEmailSubmit = async () => {
//     if (!email.trim().includes('@')) {
//       alert('Please enter a valid email address.');
//       return;
//     }

//     setLoading(true);
//     try {
//       const { data, error } = await supabase
//         .from('visitors')
//         .upsert({
//           email: email,
//           topic: selectedTopic,
//           created_at: new Date().toISOString(),
//           updated_at: new Date().toISOString()
//         }, {
//           onConflict: 'email'
//         })
//         .select()
//         .single();

//       if (error) throw error;

//       localStorage.setItem('visitor_email', email);
//       setEmailSet(true);
//       setRequestEmail(false);
//       setShowEmailRequest(false);
//       visitorIdRef.current = data.id;

//       if (selectedTopic) {
//         await saveMessageToSupabase(selectedTopic, false);
//       }

//       setShowInput(true);
//       setWaitingForAgent(true);

//       setTimeout(() => {
//         setMessages(prev => {
//           const hasConnectingMessage = prev.some(msg => 
//             msg.text && msg.text.includes("Connecting you with a specialist")
//           );
          
//           if (!hasConnectingMessage) {
//             return [...prev, {
//               id: `temp-conn-${Date.now()}`,
//               from: 'bot',
//               text: "Thank you! Connecting you with a specialist...",
//               timestamp: new Date().toISOString(),
//               isTemporary: true
//             }];
//           }
//           return prev;
//         });
//       }, 500);

//       await assignAgentToVisitor(email, selectedTopic);
      
//     } catch (error) {
//       console.error('Error:', error);
//       alert('Error saving your information. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSend = async () => {
//     if (input.trim() === '') return;
    
//     const tempId = `temp-${Date.now()}`;
//     const userMsg = { 
//       id: tempId,
//       from: 'user', 
//       text: input, 
//       timestamp: new Date().toISOString(),
//       isTemporary: true
//     };
    
//     setMessages(prev => [...prev, userMsg]);
//     setInput('');

//     if (!emailSet) {
//       setRequestEmail(true);
//       setShowEmailRequest(true);
//       setMessages(prev => prev.filter(msg => msg.id !== tempId));
//       return;
//     }

//     const messageId = await saveMessageToSupabase(input, false);
    
//     if (messageId) {
//       setMessages(prev => prev.map(msg => 
//         msg.id === tempId ? { ...msg, id: messageId, isTemporary: false } : msg
//       ));
//       pendingMessages.current.add(messageId);
//     } else {
//       setMessages(prev => prev.filter(msg => msg.id !== tempId));
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//     // Shift + Enter allows for new lines
//   };

//   const handleReset = () => {
//     console.log('🔄 Resetting chat...');
//     setSelectedTopic(null);
//     setMessages([]);
//     setInput('');
//     setShowInput(false);
//     setRequestEmail(false);
//     setShowWelcome(true);
//     setShowEmailRequest(false);
//     setEmail('');
//     setEmailSet(false);
//     setAgent(null);
//     setWaitingForAgent(false);
//     setIsTyping(false);
//     welcomeSentRef.current = false;
//     visitorIdRef.current = null;
//     agentAssignmentAttempts.current = 0;
//     hasSetUpSubscription.current = false;
//     localStorage.removeItem('visitor_email');
//     processedMessages.current.clear();
//     pendingMessages.current.clear();
    
//     if (subscriptionRef.current) {
//       subscriptionRef.current.unsubscribe();
//     }
//   };

//   const formatTime = (timestamp) => {
//     return new Date(timestamp).toLocaleTimeString([], { 
//       hour: '2-digit', 
//       minute: '2-digit' 
//     });
//   };

//   const headerText = agent 
//     ? `Chat with ${agent.full_name || agent.name}`
//     : waitingForAgent
//       ? 'Connecting you to an agent...'
//       : 'Fulfill First Support';

//   return (
//     <div className="fixed bottom-5 right-5 z-50 font-['Inter','Segoe_UI',sans-serif]">
//       {open && (
//         <div className="w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
//           {/* Header */}
//           <div className="bg-teal-500 text-white px-5 py-4 flex items-center justify-between shadow-md">
//             <div className="flex items-center flex-1">
//               <div className="relative mr-3">
//                 <img 
//                   src={agent ? "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" : "https://cdn-icons-png.flaticon.com/512/4712/4712109.png"} 
//                   alt="Support" 
//                   className="w-10 h-10 rounded-full bg-white/20 p-1" 
//                 />
//                 <div className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-teal-500"></div>
//               </div>
//               <div className="flex-1">
//                 <div className="font-semibold text-base mb-0.5">{headerText}</div>
//                 <div className="text-xs opacity-90">
//                   {waitingForAgent ? 'Please wait...' : (isTyping ? 'Agent is typing...' : 'Online • Ready to help')}
//                 </div>
//               </div>
//             </div>
//             <button 
//               onClick={handleReset} 
//               className="bg-white/20 text-white p-2 rounded-lg flex items-center justify-center transition-all hover:bg-white/30 mr-2"
//               title="Start New Chat"
//             >
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//                 <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
//               </svg>
//             </button>
//             <button 
//               onClick={handleClose} 
//               className="bg-red-500 text-white p-2 rounded-xl flex items-center justify-center transition-all hover:bg-red-600 shadow-lg shadow-teal-500/30"
//               title="Close chat"
//             >
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//                 <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
//               </svg>
//             </button>
//           </div>

//           {/* Body */}
//           <div className="flex-1 p-0 overflow-y-auto flex flex-col bg-gradient-to-br from-gray-50 to-blue-50 scrollbar-hide">
//             {showWelcome && !selectedTopic && (
//               <div className="p-5">
//                 {welcomeMessages.map((msg, i) => (
//                   <div key={i} className="bg-white text-gray-800 rounded-2xl rounded-bl-md px-4 py-3 text-sm leading-relaxed shadow-sm border border-gray-100 mb-2">
//                     {msg}
//                   </div>
//                 ))}
//               </div>
//             )}

//             {!selectedTopic && !requestEmail ? (
//               <div className="p-5">
//                 <div className="text-sm text-gray-500 mb-4 text-center font-medium">How can we help you today?</div>
//                 {chatTopics.map((topic, i) => (
//                   <button 
//                     key={i} 
//                     onClick={() => handleTopicSelect(topic.title)} 
//                     className="w-full p-4 my-2 bg-white text-gray-800 border border-gray-200 rounded-xl cursor-pointer text-left text-sm transition-all hover:shadow-md hover:border-gray-300 shadow-sm"
//                   >
//                     <div className="font-semibold mb-1 text-sm">{topic.title}</div>
//                     <div className="text-xs text-gray-500 opacity-80">{topic.description}</div>
//                   </button>
//                 ))}
//               </div>
//             ) : (
//               <div className="flex-1 p-5 flex flex-col gap-3">
//                 {messages.map((msg, index) => (
//                   <div
//                     key={msg.id || index}
//                     className={`flex flex-col max-w-[85%] ${
//                       msg.from === 'user' ? 'self-end' : 'self-start'
//                     }`}
//                   >
//                     {msg.from === 'agent' && agent && (
//                       <div className="flex items-center mb-1 pl-2">
//                         <img 
//                           src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
//                           alt="Agent" 
//                           className="w-5 h-5 rounded-full mr-2" 
//                         />
//                         <span className="font-semibold text-xs text-gray-600">{agent.full_name || agent.name}</span>
//                       </div>
//                     )}
//                     <div className={`
//                       px-4 py-3 text-sm leading-relaxed shadow-sm whitespace-pre-wrap
//                       ${msg.from === 'user' 
//                         ? 'bg-teal-500 text-white rounded-2xl rounded-br-md shadow-teal-500/30' 
//                         : 'bg-white text-gray-800 rounded-2xl rounded-bl-md border border-gray-100'
//                       }
//                     `}>
//                       <div className="flex flex-col gap-1">
//                         {formatMessageText(msg.text)}
//                       </div>
//                     </div>
//                     <div className="text-xs text-gray-400 mt-1 px-2">
//                       {formatTime(msg.timestamp)}
//                     </div>
//                   </div>
//                 ))}

//                 {isTyping && (
//                   <div className="flex items-center px-4 py-2 bg-white rounded-2xl rounded-bl-md shadow-sm border border-gray-100 self-start max-w-[140px]">
//                     <div className="flex gap-1 mr-2">
//                       <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
//                       <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
//                       <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
//                     </div>
//                     <div className="text-xs text-gray-500">Agent is typing...</div>
//                   </div>
//                 )}

//                 {showEmailRequest && (
//                   <div className="flex flex-col gap-3">
//                     <div className="bg-white text-gray-800 rounded-2xl rounded-bl-md px-4 py-3 text-sm leading-relaxed shadow-sm border border-gray-100">
//                       Before we continue, please provide your email address so we can assist you better and save your chat history.
//                     </div>
//                     <div className="flex flex-col gap-2 px-2">
//                       <input
//                         type="email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         placeholder="your@email.com"
//                         className="px-4 py-3 rounded-lg border border-gray-300 text-sm outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
//                         disabled={loading}
//                       />
//                       <button 
//                         onClick={handleEmailSubmit}
//                         disabled={loading || !email.includes('@')}
//                         className={`
//                           px-4 py-3 bg-teal-500 text-white border-none rounded-lg cursor-pointer text-sm font-medium transition-all flex items-center justify-center gap-2
//                           ${(loading || !email.includes('@')) ? 'opacity-60' : 'hover:bg-teal-600'}
//                         `}
//                       >
//                         {loading ? (
//                           <div className="w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin"></div>
//                         ) : null}
//                         {loading ? 'Connecting...' : 'Continue Chat'}
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 <div ref={messagesEndRef} />
//               </div>
//             )}

//             {showInput && (
//               <div className="p-4 bg-white border-t border-gray-100">
//                 <div className="flex items-center bg-gray-50 rounded-3xl p-1 border border-gray-300">
//                   <textarea
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     onKeyDown={handleKeyDown}
//                     placeholder="Type your message... (Shift + Enter for new line)"
//                     className="flex-1 px-4 py-3 border-none outline-none text-sm bg-transparent rounded-3xl resize-none scrollbar-hide"
//                     disabled={loading}
//                     rows={1}
//                     style={{ minHeight: '48px', maxHeight: '120px' }}
//                   />
//                   <button 
//                     onClick={handleSend} 
//                     className={`
//                       w-10 h-10 rounded-full bg-teal-500 text-white border-none cursor-pointer flex items-center justify-center transition-all
//                       ${input.trim() === '' ? 'opacity-50' : 'hover:bg-teal-600'}
//                     `}
//                     disabled={input.trim() === '' || loading}
//                   >
//                     <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//                       <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Chat Bubble Button */}
//       <button 
//         className={`
//           w-15 h-15 rounded-full text-white border-none cursor-pointer text-2xl shadow-lg flex justify-center items-center transition-all duration-300 ml-auto mt-4
//           ${open ? 'scale-90 bg-red-500 hover:bg-red-600' : 'bg-teal-500 hover:bg-teal-600 shadow-teal-500/30'}
//         `}
//         onClick={() => setOpen(!open)}
//         title={open ? 'Close chat' : 'Open chat'}
//       >
//         {open ? (
//           <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
//             <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
//           </svg>
//         ) : (
//           <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
//             <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
//           </svg>
//         )}
//       </button>
//     </div>
//   );
// });

// export default ChatBubble;


import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';

const ChatBubble = React.forwardRef((props, ref) => {
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
  
  const subscriptionRef = useRef(null);
  const processedMessages = useRef(new Set());
  const welcomeSentRef = useRef(false);
  const pendingMessages = useRef(new Set());
  const visitorIdRef = useRef(null);
  const agentAssignmentAttempts = useRef(0);
  const hasSetUpSubscription = useRef(false);
  const currentConversationId = useRef(null);

  React.useImperativeHandle(ref, () => ({
    openChat: () => setOpen(true),
    closeChat: () => setOpen(false),
    toggleChat: () => setOpen(prev => !prev)
  }));
  
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

  // Check if email is expired (2 hours)
  const isEmailExpired = (storedData) => {
    if (!storedData) return true;
    
    try {
      const data = JSON.parse(storedData);
      const storedTime = data.timestamp;
      const currentTime = new Date().getTime();
      const twoHours = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
      
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

  // Get stored chat data (returns null if expired)
  const getStoredChatData = () => {
    const storedData = localStorage.getItem('visitor_chat_data');
    
    if (!storedData || isEmailExpired(storedData)) {
      // Clear expired data
      localStorage.removeItem('visitor_chat_data');
      return null;
    }
    
    try {
      const data = JSON.parse(storedData);
      return data;
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
  }, [messages, isTyping]);

  // Format message text to preserve line breaks and lists
  const formatMessageText = (text) => {
    if (!text) return '';
    
    return text.split('\n').map((line, index) => {
      // Check if line starts with a number pattern (like "1.", "2.", etc.)
      const listMatch = line.match(/^(\d+\.)\s+(.*)$/);
      
      if (listMatch) {
        return (
          <div key={index} className="flex items-start gap-2">
            <span className="font-medium text-inherit flex-shrink-0">{listMatch[1]}</span>
            <span className="flex-1">{listMatch[2]}</span>
          </div>
        );
      }
      
      // Check for bullet points
      if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
        return (
          <div key={index} className="flex items-start gap-2">
            <span className="flex-shrink-0">•</span>
            <span className="flex-1">{line.replace(/^[-•]\s+/, '')}</span>
          </div>
        );
      }
      
      // Regular line with possible indentation
      if (line.trim() === '') {
        return <div key={index} className="h-3"></div>; // Empty line spacer
      }
      
      return (
        <div key={index} className={line.startsWith('  ') || line.startsWith('\t') ? 'pl-4' : ''}>
          {line}
        </div>
      );
    });
  };

  // Enhanced real-time subscription setup
  useEffect(() => {
    if (!currentConversationId.current) {
      console.log('⏳ Waiting for conversation ID to setup subscription');
      return;
    }

    // Clean up previous subscription
    if (subscriptionRef.current) {
      console.log('🧹 Cleaning up previous subscription');
      subscriptionRef.current.unsubscribe();
      hasSetUpSubscription.current = false;
    }

    console.log('🔔 Setting up real-time subscription for conversation:', currentConversationId.current);
    
    const channelName = `visitor_${currentConversationId.current}`;
    
    subscriptionRef.current = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'visitor_messages',
          filter: `conversation_id=eq.${currentConversationId.current}`
        },
        (payload) => {
          console.log('📨 REAL-TIME MESSAGE RECEIVED:', {
            id: payload.new.id,
            message: payload.new.message,
            is_agent: payload.new.is_agent,
            agent_id: payload.new.agent_id,
            conversation_id: payload.new.conversation_id,
            visitor_email: payload.new.visitor_email
          });

          // Verify this message belongs to current conversation
          if (payload.new.conversation_id !== currentConversationId.current) {
            console.log('🚫 Message from different conversation, ignoring:', payload.new.conversation_id);
            return;
          }

          const isPendingMessage = pendingMessages.current.has(payload.new.id);
          const isAlreadyProcessed = processedMessages.current.has(payload.new.id);
          
          if (!isAlreadyProcessed && !isPendingMessage) {
            console.log('✅ Processing new message...');
            
            const newMessage = {
              id: payload.new.id,
              from: payload.new.is_agent ? 'agent' : 'user',
              text: payload.new.message,
              timestamp: payload.new.created_at,
              agent_id: payload.new.agent_id,
              conversation_id: payload.new.conversation_id
            };
            
            setMessages(prev => {
              const filteredPrev = prev.filter(msg => !msg.isTemporary);
              
              const duplicate = filteredPrev.some(msg => 
                msg.id === newMessage.id || 
                (msg.text === newMessage.text && 
                msg.from === newMessage.from &&
                Math.abs(new Date(msg.timestamp) - new Date(newMessage.timestamp)) < 3000)
              );
              
              if (duplicate) {
                console.log('🚫 Duplicate message detected, skipping');
                return filteredPrev;
              }
              
              const updatedMessages = [...filteredPrev, newMessage];
              return updatedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            });
            
            processedMessages.current.add(payload.new.id);
            
            if (payload.new.is_agent) {
              console.log('👤 Agent message received, stopping waiting state');
              setWaitingForAgent(false);
              setIsTyping(false);
              
              if (payload.new.agent_id && !agent) {
                console.log('🔄 Fetching agent info for:', payload.new.agent_id);
                fetchAgentInfo(payload.new.agent_id);
              }
            }
          } else {
            console.log('⏭️ Message already processed or pending:', {
              pending: isPendingMessage,
              processed: isAlreadyProcessed
            });
          }
          
          if (isPendingMessage) {
            console.log('✅ Message confirmed, removing from pending');
            pendingMessages.current.delete(payload.new.id);
          }
        }
      )
      .subscribe((status, error) => {
        console.log('📡 Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          hasSetUpSubscription.current = true;
          console.log('✅ Successfully subscribed to real-time updates for conversation:', currentConversationId.current);
        }
        if (error) {
          console.error('❌ Subscription error:', error);
        }
      });

    return () => {
      if (subscriptionRef.current) {
        console.log('🧹 Cleaning up subscription on unmount');
        subscriptionRef.current.unsubscribe();
        hasSetUpSubscription.current = false;
      }
    };
  }, [currentConversationId.current]);

  const handleClose = () => {
    setOpen(false);
  };

  // Generate unique conversation ID
  const generateConversationId = () => {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Fetch messages from Supabase for current conversation only
  const fetchMessages = async (conversationId) => {
    try {
      console.log('🔄 Fetching messages for conversation:', conversationId);
      const { data, error } = await supabase
        .from('visitor_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        console.log('📨 Found messages:', data.length);
        const transformedMessages = data.map(msg => ({
          id: msg.id,
          from: msg.is_agent ? 'agent' : 'user',
          text: msg.message,
          timestamp: msg.created_at,
          agent_id: msg.agent_id,
          conversation_id: msg.conversation_id
        }));

        setMessages(transformedMessages);
        processedMessages.current = new Set(data.map(msg => msg.id));

        const agentMessage = data.find(msg => msg.is_agent && msg.agent_id);
        if (agentMessage) {
          console.log('👤 Found agent message, fetching agent info');
          await fetchAgentInfo(agentMessage.agent_id);
          setWaitingForAgent(false);
          setIsTyping(false);
        }

        const hasAgentMessages = data.some(msg => msg.is_agent);
        setWaitingForAgent(!hasAgentMessages);
        
        if (hasAgentMessages) {
          console.log('✅ Agent has already responded');
        }
      } else {
        console.log('📭 No messages found for this conversation');
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Fetch agent information by ID
  const fetchAgentInfo = async (agentId) => {
    try {
      console.log('🔄 Fetching agent info for:', agentId);
      const { data: agentData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', agentId)
        .single();

      if (error) throw error;

      if (agentData) {
        setAgent(agentData);
        console.log('👤 Agent info loaded:', agentData.full_name);
      }
    } catch (error) {
      console.error('Error fetching agent info:', error);
    }
  };

  // Send agent introduction message
  // const sendAgentIntroduction = async (agentData, topic, conversationId) => {
  //   if (welcomeSentRef.current) {
  //     console.log('🚫 Welcome already sent');
  //     return;
  //   }
    
  //   console.log('👋 Sending agent introduction...');
  //   const introMessage = `Hello! My name is ${agentData.full_name || agentData.name}. I'll be assisting you with "${topic}". How can I help you today?`;
    
  //   setIsTyping(true);
  //   welcomeSentRef.current = true;
    
  //   setTimeout(async () => {
  //     try {
  //       console.log('📤 Actually sending intro message to database');
  //       const messageId = await saveMessageToSupabase(introMessage, true, agentData.id, conversationId);
        
  //       if (messageId) {
  //         pendingMessages.current.add(messageId);
  //         console.log('✅ Intro message sent with ID:', messageId);
  //       }

  //       setIsTyping(false);
  //       setWaitingForAgent(false);
        
  //     } catch (error) {
  //       console.error('Error sending agent introduction:', error);
  //       setIsTyping(false);
  //       setWaitingForAgent(false);
  //     }
  //   }, 2000);
  // };

  // Save message to Supabase with conversation ID
  // const saveMessageToSupabase = async (messageText, isAgent = false, agentId = null, conversationId = null) => {
  //   if (!email && !isAgent) {
  //     console.error('❌ No email set, cannot save visitor message');
  //     return null;
  //   }
    
  //   try {
  //     const messageData = {
  //       visitor_email: email,
  //       message: messageText,
  //       is_agent: isAgent,
  //       created_at: new Date().toISOString(),
  //       conversation_id: conversationId || currentConversationId.current
  //     };

  //     // Only include agent_id for agent messages
  //     if (isAgent && agentId) {
  //       messageData.agent_id = agentId;
  //     }

  //     console.log('💾 Saving message to database:', { 
  //       messageText, 
  //       isAgent, 
  //       agentId: isAgent ? agentId : 'null (visitor message)',
  //       conversationId: messageData.conversation_id,
  //       visitor_email: email
  //     });
      
  //     const { data, error } = await supabase
  //       .from('visitor_messages')
  //       .insert(messageData)
  //       .select()
  //       .single();

  //     if (error) throw error;

  //     console.log('✅ Message saved with ID:', data?.id);
  //     return data?.id || null;
  //   } catch (error) {
  //     console.error('Error saving message:', error);
  //     return null;
  //   }
  // };

  const saveMessageToSupabase = async (messageText, isAgent = false, agentId = null, conversationId = null) => {
  if (!email && !isAgent) {
    console.error('❌ No email set, cannot save visitor message');
    return null;
  }
  
  try {
    const messageData = {
      visitor_email: email,
      message: messageText,
      is_agent: isAgent,
      created_at: new Date().toISOString(),
      conversation_id: conversationId || currentConversationId.current
    };

    // Only include agent_id for agent messages
    if (isAgent && agentId) {
      messageData.agent_id = agentId;
    }

    console.log('💾 Saving message to database:', messageData);
    
    const { data, error } = await supabase
      .from('visitor_messages')
      .insert(messageData)
      .select()
      .single();

    if (error) {
      console.error('❌ Database error details:', error);
      throw error;
    }

    console.log('✅ Message saved with ID:', data?.id);
    return data?.id || null;
  } catch (error) {
    console.error('Error saving message:', error);
    return null;
  }
};

  // Initialize chat when component mounts
  useEffect(() => {
    const storedChatData = getStoredChatData();

    if (storedChatData) {
      setLoading(true);
      
      const initializeChat = async () => {
        try {
          console.log('🔍 Initializing existing chat for:', storedChatData.email);
          const { data: visitorData } = await supabase
            .from('visitors')
            .select('*')
            .eq('email', storedChatData.email)
            .single();

          if (visitorData) {
            setEmail(storedChatData.email);
            setEmailSet(true);
            visitorIdRef.current = visitorData.id;
            
            // Restore existing conversation if we have one
            if (storedChatData.conversationId) {
              console.log('🔄 Restoring existing conversation:', storedChatData.conversationId);
              currentConversationId.current = storedChatData.conversationId;
              
              // Fetch messages for this conversation
              await fetchMessages(storedChatData.conversationId);
              
              setSelectedTopic(visitorData.topic || null);
              setShowWelcome(false);
              setShowInput(true);
              
              if (visitorData.agent_id) {
                console.log('👤 Visitor already has agent assigned');
                await fetchAgentInfo(visitorData.agent_id);
                setWaitingForAgent(false);
              } else if (visitorData.topic) {
                console.log('⏳ Visitor has topic but no agent, waiting...');
                setWaitingForAgent(true);
              }
            } else {
              // No conversation ID, start fresh
              console.log('📭 No existing conversation, starting fresh');
              setShowWelcome(true);
            }
          } else {
            console.log('❌ Visitor not found, clearing storage');
            localStorage.removeItem('visitor_chat_data');
          }
        } catch (error) {
          console.error('Error initializing chat:', error);
          localStorage.removeItem('visitor_chat_data');
        } finally {
          setLoading(false);
        }
      };

      initializeChat();
    }
  }, []);

  // Improved agent assignment
  const assignAgentToVisitor = async (visitorEmail, topic, conversationId) => {
  console.log('🔄 Starting agent assignment...');
  
  try {
    const { data: agents, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'agent')
      .order('last_assigned_at', { ascending: true, nullsFirst: true });

    if (error) throw error;

    if (agents && agents.length > 0) {
      const agentAssignments = await Promise.all(
        agents.map(async (agent) => {
          const { count } = await supabase
            .from('visitors')
            .select('*', { count: 'exact', head: true })
            .eq('agent_id', agent.id)
            .is('completed_at', null);

          return { 
            agent, 
            count: count || 0, 
            lastAssigned: agent.last_assigned_at 
          };
        })
      );

      agentAssignments.sort((a, b) => {
        if (a.count !== b.count) return a.count - b.count;
        return new Date(a.lastAssigned || 0) - new Date(b.lastAssigned || 0);
      });

      const assignedAgent = agentAssignments[0].agent;
      
      console.log('✅ Agent selected:', assignedAgent.full_name);

      // ✅ Use upsert to update the existing visitor record
      const { error: updateError } = await supabase
        .from('visitors')
        .upsert({ 
          email: visitorEmail,
          agent_id: assignedAgent.id,
          topic: topic,
          conversation_id: conversationId,
          assigned_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'email'
        });

      if (updateError) throw updateError;

      await supabase
        .from('profiles')
        .update({ 
          last_assigned_at: new Date().toISOString()
        })
        .eq('id', assignedAgent.id);

      setAgent(assignedAgent);
      console.log('👤 Agent assigned to visitor');
      
      return assignedAgent;
    } else {
      throw new Error('No agents available');
    }
  } catch (error) {
    console.error('❌ Agent assignment failed:', error);
    setWaitingForAgent(false);
    return null;
  }
};

  const handleTopicSelect = async (topic) => {
  console.log('🎯 Topic selected:', topic);
  
  // Generate new conversation ID for this chat session
  const newConversationId = generateConversationId();
  currentConversationId.current = newConversationId;

  // Clear any previous subscription
  if (subscriptionRef.current) {
    subscriptionRef.current.unsubscribe();
    hasSetUpSubscription.current = false;
  }
  
  setSelectedTopic(topic);
  setShowWelcome(false);

  const timestamp = new Date().toISOString();
  const tempId = `temp-${Date.now()}`;
  
  const topicMessage = {
    id: tempId,
    from: 'user',
    text: topic,
    timestamp,
    isTemporary: false,
    conversation_id: newConversationId
  };
  
  setMessages([topicMessage]);

  const storedChatData = getStoredChatData();
  const storedEmail = storedChatData ? storedChatData.email : null;

  try {
    if (storedEmail) {
      // ✅ FIRST: Ensure visitor record exists
      console.log('🔍 Checking/creating visitor record for:', storedEmail);
      const { data: visitorData, error: visitorError } = await supabase
        .from('visitors')
        .upsert({
          email: storedEmail,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'email'
        })
        .select()
        .single();

      if (visitorError) {
        console.error('❌ Error ensuring visitor record:', visitorError);
        throw visitorError;
      }

      console.log('✅ Visitor record ready:', visitorData);

      // ✅ SECOND: Assign agent FIRST (this updates visitor record with agent_id)
      storeChatData(storedEmail, newConversationId);
      setShowInput(true);
      setWaitingForAgent(true);
      
      setTimeout(() => {
        setMessages(prev => {
          const hasConnectingMessage = prev.some(msg => 
            msg.text && msg.text.includes("Connecting you with a specialist")
          );
          
          if (!hasConnectingMessage) {
            return [...prev, {
              id: `temp-conn-${Date.now()}`,
              from: 'bot',
              text: "Thank you for your inquiry! Connecting you with a specialist...",
              timestamp: new Date().toISOString(),
              isTemporary: true,
              conversation_id: newConversationId
            }];
          }
          return prev;
        });
      }, 500);

      // Assign agent and wait for completion
      const assignedAgent = await assignAgentToVisitor(storedEmail, topic, newConversationId);
      
      if (assignedAgent) {
        // ✅ THIRD: Save the topic message ONLY AFTER agent is assigned
        console.log('✅ Agent assigned, now saving topic message');
        const messageId = await saveMessageToSupabase(topic, false, null, newConversationId);
        
        if (messageId) {
          pendingMessages.current.add(messageId);
          setMessages(prev => prev.map(msg => 
            msg.id === tempId ? { ...msg, id: messageId, isTemporary: false } : msg
          ));
        } else {
          console.error('❌ Failed to save topic message');
          setMessages(prev => prev.filter(msg => msg.id !== tempId));
        }
      } else {
        console.error('❌ Agent assignment failed');
        setMessages(prev => prev.filter(msg => msg.id !== tempId));
        setWaitingForAgent(false);
      }
      
    } else {
      setRequestEmail(true);
      setShowEmailRequest(true);
    }

  } catch (error) {
    console.error('Error in topic selection:', error);
    setMessages(prev => [...prev, {
      id: `temp-error-${Date.now()}`,
      from: 'bot',
      text: "Sorry, there was an error starting the chat. Please try again.",
      timestamp: new Date().toISOString(),
      isTemporary: true
    }]);
  }
};

  // Simple email validation function for ChatBubble
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Basic format validation
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  
  // Extended list of disposable email domains
  const disposableDomains = [
    'tempmail.com', 'guerrillamail.com', 'mailinator.com', 
    '10minutemail.com', 'throwawaymail.com', 'fakeinbox.com',
    'yopmail.com', 'trashmail.com', 'temp-mail.org',
    'sharklasers.com', 'guerrillamail.net', 'grr.la',
    'tmpmail.org', 'getairmail.com', 'dispostable.com',
    'maildrop.cc', 'spamgourmet.com', 'fake-mail.com',
    'jetable.org', 'mailnesia.com', 'tempinbox.com',
    'mailmetrash.com', 'trashmailer.com', 'dumpmail.com'
  ];
  
  const domain = email.split('@')[1].toLowerCase();
  
  // Check against disposable domains
  if (disposableDomains.includes(domain)) {
    return { 
      isValid: false, 
      message: 'Please use a permanent email address from a trusted provider like Gmail, Outlook, or Yahoo.' 
    };
  }
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /^test/, /^temp/, /^fake/, /^spam/, /^trash/,
    /123$/, /abc$/, /admin$/, /user$/
  ];
  
  const username = email.split('@')[0].toLowerCase();
  if (suspiciousPatterns.some(pattern => pattern.test(username))) {
    return { 
      isValid: false, 
      message: 'This email appears to be temporary. Please use your real email address.' 
    };
  }
  
  return { isValid: true, message: '' };
};

// Update your handleEmailSubmit function
const handleEmailSubmit = async () => {
  if (!email.trim().includes('@')) {
    alert('Please enter a valid email address.');
    return;
  }

  // Add email validation
  const validation = validateEmail(email);
  if (!validation.isValid) {
    alert(validation.message);
    return;
  }

  setLoading(true);
  try {
    // ✅ FIRST: Create visitor record
    console.log('🔍 Creating visitor record for:', email);
    const { data: visitorData, error: visitorError } = await supabase
      .from('visitors')
      .upsert({
        email: email,
        topic: selectedTopic,
        conversation_id: currentConversationId.current,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'email'
      })
      .select()
      .single();

    if (visitorError) {
      console.error('❌ Error creating visitor record:', visitorError);
      throw visitorError;
    }

    console.log('✅ Visitor record created:', visitorData);
    visitorIdRef.current = visitorData.id;

    // ✅ SECOND: Store email and conversation ID
    storeChatData(email, currentConversationId.current);
    setEmailSet(true);
    setRequestEmail(false);
    setShowEmailRequest(false);

    setShowInput(true);
    setWaitingForAgent(true);

    setTimeout(() => {
      setMessages(prev => {
        const hasConnectingMessage = prev.some(msg => 
          msg.text && msg.text.includes("Connecting you with a specialist")
        );
        
        if (!hasConnectingMessage) {
          return [...prev, {
            id: `temp-conn-${Date.now()}`,
            from: 'bot',
            text: "Thank you! Connecting you with a specialist...",
            timestamp: new Date().toISOString(),
            isTemporary: true,
            conversation_id: currentConversationId.current
          }];
        }
        return prev;
      });
    }, 500);

    // ✅ THIRD: Assign agent FIRST
    const assignedAgent = await assignAgentToVisitor(email, selectedTopic, currentConversationId.current);
    
    if (assignedAgent) {
      // ✅ FOURTH: Save topic message ONLY AFTER agent is assigned
      if (selectedTopic) {
        const messageId = await saveMessageToSupabase(selectedTopic, false, null, currentConversationId.current);
        if (messageId) {
          pendingMessages.current.add(messageId);
        }
      }
    } else {
      console.error('❌ Agent assignment failed');
      setWaitingForAgent(false);
    }
    
  } catch (error) {
    console.error('Error:', error);
    alert('Error saving your information. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const handleSend = async () => {
    if (input.trim() === '') return;
    
    const tempId = `temp-${Date.now()}`;
    const userMsg = { 
      id: tempId,
      from: 'user', 
      text: input, 
      timestamp: new Date().toISOString(),
      isTemporary: true,
      conversation_id: currentConversationId.current
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    if (!emailSet) {
      setRequestEmail(true);
      setShowEmailRequest(true);
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
      return;
    }

    const messageId = await saveMessageToSupabase(input, false, null, currentConversationId.current);
    
    if (messageId) {
      setMessages(prev => prev.map(msg => 
        msg.id === tempId ? { ...msg, id: messageId, isTemporary: false } : msg
      ));
      pendingMessages.current.add(messageId);
    } else {
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    console.log('🔄 Resetting chat for new conversation...');
    
    // Generate new conversation ID
    const newConversationId = generateConversationId();
    currentConversationId.current = newConversationId;
    
    // Store the new conversation ID
    if (email) {
      storeChatData(email, newConversationId);
    }
    
    // Reset chat state but keep email
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
    agentAssignmentAttempts.current = 0;
    hasSetUpSubscription.current = false;
    processedMessages.current.clear();
    pendingMessages.current.clear();
    
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }
    
    console.log('✅ Chat reset for new conversation:', newConversationId);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const headerText = agent 
    ? `Chat with ${agent.full_name || agent.name}`
    : waitingForAgent
      ? 'Connecting you to an agent...'
      : 'Fulfill First Support';

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

            {!selectedTopic && !requestEmail ? (
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
                        <span className="font-semibold text-xs text-gray-600">{agent.full_name || agent.name}</span>
                      </div>
                    )}
                    <div className={`
                      px-4 py-3 text-sm leading-relaxed shadow-sm whitespace-pre-wrap
                      ${msg.from === 'user' 
                        ? 'bg-teal-500 text-white rounded-2xl rounded-br-md shadow-teal-500/30' 
                        : 'bg-white text-gray-800 rounded-2xl rounded-bl-md border border-gray-100'
                      }
                    `}>
                      <div className="flex flex-col gap-1">
                        {formatMessageText(msg.text)}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1 px-2">
                      {formatTime(msg.timestamp)}
                    </div>
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
                    </div>
                    <div className="flex flex-col gap-2 px-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="px-4 py-3 rounded-lg border border-gray-300 text-sm outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                        disabled={loading}
                      />
                      <button 
                        onClick={handleEmailSubmit}
                        disabled={loading || !email.includes('@')}
                        className={`
                          px-4 py-3 bg-teal-500 text-white border-none rounded-lg cursor-pointer text-sm font-medium transition-all flex items-center justify-center gap-2
                          ${(loading || !email.includes('@')) ? 'opacity-60' : 'hover:bg-teal-600'}
                        `}
                      >
                        {loading ? (
                          <div className="w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin"></div>
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
                      ${input.trim() === '' ? 'opacity-50' : 'hover:bg-teal-600'}
                    `}
                    disabled={input.trim() === '' || loading}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
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