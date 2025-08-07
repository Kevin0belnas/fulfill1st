const express = require('express');
const router = express.Router();
const db = require('../db');

// Get a random agent
router.get('/get-random-agent', async (req, res) => {
  try {
    const [results] = await db.query(
      'SELECT id, name, email FROM users WHERE role = "agent" AND is_available = 1 ORDER BY RAND() LIMIT 1'
    );
    if (!results.length) return res.status(404).json({ error: 'No agents available' });
    res.json({ agent: results[0] });
  } catch (err) {
    console.error('Error fetching random agent:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get agent assigned to a visitor
router.get('/get-visitor-agent', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const [results] = await db.query(`
      SELECT u.id, u.name, u.email 
      FROM visitors v
      JOIN users u ON v.assigned_agent_id = u.id
      WHERE v.email = ?
    `, [email]);

    if (!results.length) {
      return res.status(404).json({ error: 'No agent assigned' });
    }

    res.json({ agent: results[0] });
  } catch (err) {
    console.error('Error fetching visitor agent:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Save visitor with agent assignment
router.post('/save-visitor', async (req, res) => {
  const { email, topic } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const [existingVisitor] = await db.query(
      'SELECT assigned_agent_id FROM visitors WHERE email = ?',
      [email]
    );

    // If visitor already has assigned agent, return them
    if (existingVisitor.length && existingVisitor[0].assigned_agent_id) {
      const [agent] = await db.query(
        'SELECT id, name, email FROM users WHERE id = ?',
        [existingVisitor[0].assigned_agent_id]
      );
      return res.json({ agent: agent[0] });
    }

    // Get all available agents sorted by number of visitors assigned (least first)
    const [agents] = await db.query(`
      SELECT u.id, u.name, u.email, COUNT(v.id) AS visitor_count
      FROM users u
      LEFT JOIN visitors v ON v.assigned_agent_id = u.id
      WHERE u.role = 'agent'
      GROUP BY u.id
      ORDER BY visitor_count ASC, u.id ASC
      LIMIT 1
    `);

    if (!agents.length) return res.status(404).json({ error: 'No agents available' });

    const agent = agents[0];
    const agentId = agent.id;

    // Save or update visitor with assigned agent
    await db.query(`
      INSERT INTO visitors (email, assigned_agent_id, topic)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE assigned_agent_id = ?
    `, [email, agentId, topic, agentId]);

    res.json({ message: 'Visitor saved and agent assigned', agent });
  } catch (err) {
    console.error('Error saving visitor:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// router.post('/save-visitor', async (req, res) => {
//   const { email, topic } = req.body;
//   if (!email) return res.status(400).json({ error: 'Email is required' });

//   try {
//     const [existingVisitor] = await db.query(
//       'SELECT assigned_agent_id FROM visitors WHERE email = ?',
//       [email]
//     );

//     if (existingVisitor.length && existingVisitor[0].assigned_agent_id) {
//       const [agent] = await db.query(
//         'SELECT id, name, email FROM users WHERE id = ?',
//         [existingVisitor[0].assigned_agent_id]
//       );
//       return res.json({ agent: agent[0] });
//     }

//     const [agent] = await db.query(
//       'SELECT id, name, email FROM users WHERE role = "agent" ORDER BY RAND() LIMIT 1'
//     );

//     if (!agent.length) return res.status(404).json({ error: 'No agents available' });

//     const agentId = agent[0].id;

//     await db.query(`
//       INSERT INTO visitors (email, assigned_agent_id, topic)
//       VALUES (?, ?, ?)
//       ON DUPLICATE KEY UPDATE assigned_agent_id = ?
//     `, [email, agentId,topic, agentId]);

//     res.json({ message: 'Visitor saved and agent assigned', agent: agent[0] });
//   } catch (err) {
//     console.error('Error saving visitor:', err);
//     res.status(500).json({ error: 'Database error' });
//   }
// });

// Save chat message
router.post('/save-message', async (req, res) => {
  const { email, message, timestamp, isAgent } = req.body;

  console.log('Received message:', { email, message, timestamp, isAgent });
  if (!email || !message || !timestamp) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [visitor] = await db.query(
      'SELECT assigned_agent_id FROM visitors WHERE email = ?',
      [email]
    );

    const agentId = isAgent ? null : visitor[0]?.assigned_agent_id || null;

    await db.query(
      'INSERT INTO visitor_messages (email, message, timestamp, agent_id, is_agent_message) VALUES (?, ?, NOW(), ?, ?)',
      [email, message, agentId, isAgent]
    );

    res.json({ message: 'Message saved' });
  } catch (err) {
    console.error('Error saving message:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get messages for a visitor
router.get('/get-messages', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const [messages] = await db.query(
      'SELECT message, timestamp, is_agent_message AS isAgent FROM visitor_messages WHERE email = ? ORDER BY timestamp ASC',
      [email]
    );

    const formatted = messages.map(m => ({
      from: m.isAgent ? 'bot' : 'user',
      text: m.message,
      timestamp: m.timestamp
    }));

    res.json({ messages: formatted });
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Check if visitor email exists
// routes/user.js
router.get('/check-visitor', async (req, res) => {
  const email = req.query.email;

  try {
    const [rows] = await db.query('SELECT * FROM visitors WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.json({ exists: true, topic: rows[0].topic }); // Include topic
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking visitor:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// User login
router.post('/login', async (req, res) => {
  console.log('\n=== NEW LOGIN ATTEMPT ===');
  console.log('Request received at:', new Date().toISOString());
  console.log('Email:', req.body.email);

  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      console.log('Validation failed - missing credentials');
      return res.status(400).json({ 
        error: 'Email and password are required',
        timestamp: new Date().toISOString()
      });
    }

    // Check if email is valid format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    console.log('Querying database...');
    const [users] = await db.execute(
      'SELECT id, email, password, role FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      console.log('User not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Compare plain password
    if (user.password !== password) {
      console.log('Wrong password');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Set session data
    req.session.userId = user.id;
    req.session.role = user.role;
    req.session.email = user.email;
    req.session.lastActivity = new Date();

    // Save session and update last_login
    req.session.save(async (err) => {
  if (err) {
    console.error('❌ Session save error:', err);
    return res.status(500).json({ error: 'Session error' });
  }

  console.log('✅ Session saved successfully:', req.session);

  try {
    await db.execute('UPDATE users SET last_login = ? WHERE id = ?', [new Date(), user.id]);
  } catch (updateErr) {
    console.error('❌ Error updating last_login:', updateErr);
  }

  res.json({
    message: 'Login successful',
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  });
});


  } catch (err) {
    console.error('SERVER ERROR:', {
      message: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ 
      error: 'Server error during login',
      timestamp: new Date().toISOString()
    });
  }
});

router.get('/current-agents', async (req, res) => {

  try {
    const agentId = req.session.userId; // Get the current user's ID from the session
    console.log('Agent ID:', agentId);

    if (!agentId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Fetch the agent's user data based on their ID
    const [results] = await db.execute(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [agentId]
    );

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(results[0]); // return only the first matched user
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

router.get('/session-check', (req, res) => {
  if (!req.session.userId) {
    console.log('Session check failed - no userId found');
    return res.status(401).json({ error: 'No session' });
  }
  res.json({ 
    userId: req.session.userId,
    sessionId: req.sessionID 
  });
});

router.get('/agent/chats', async (req, res) => {
  try {
    const agentId = req.session.userId;

    // ✅ Step 1: Get list of unique visitor emails with their latest message timestamp
    const [chats] = await db.query(`
      SELECT email, MAX(created_at) AS last_message_at
      FROM visitor_messages
      WHERE agent_id = ?
      GROUP BY email
      ORDER BY last_message_at DESC
    `, [agentId]);

    // ✅ Step 2: For each chat/email, fetch unread count and last message details
    const chatDetails = [];
    for (const chat of chats) {
      const email = chat.email;

      // ✅ Count unread messages from visitor
      const [unread] = await db.query(`
        SELECT COUNT(*) AS unread_count
        FROM visitor_messages
        WHERE email = ?
          AND agent_id = ?
          AND is_agent_message = 0
          AND read_at IS NULL
      `, [email, agentId]);

      // ✅ Get last message details
      const [lastMessage] = await db.query(`
        SELECT 
          message,
          created_at AS timestamp,
          is_agent_message AS isAgent
        FROM visitor_messages
        WHERE email = ? AND agent_id = ?
        ORDER BY created_at DESC
        LIMIT 1
      `, [email, agentId]);

      chatDetails.push({
        email,
        unread_count: unread[0]?.unread_count || 0,
        lastMessage: lastMessage[0] || null,
        last_message_at: chat.last_message_at
      });
    }

    // ✅ Already ordered by last_message_at DESC in SQL — no need to sort again
    res.json({ chats: chatDetails });
  } catch (error) {
    console.error('Error fetching agent chats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/chat/send', async (req, res) => {

  try {
    const { email, message, isAgent } = req.body;
    const agentId = req.session.userId;
    
    // Verify this agent is assigned to this chat
    const [visitor] = await db.query(
      'SELECT assigned_agent_id FROM visitors WHERE email = ?',
      [email]
    );
    
    if (!visitor.length || visitor[0].assigned_agent_id !== agentId) {
      return res.status(403).json({ error: 'Not authorized to send to this chat' });
    }

    // Save message
    await db.query(`
      INSERT INTO visitor_messages 
      (email, message, timestamp, agent_id, is_agent_message)
      VALUES (?, ?, NOW(), ?, ?)
    `, [email, message, agentId, isAgent]);

    // Update last message time
    await db.query(`
      UPDATE visitors 
      SET last_message_at = NOW() 
      WHERE email = ?
    `, [email]);

    res.json({ success: true });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/chat/messages', async (req, res) => {

  try {
    const { email } = req.query;
    const agentId = req.session.userId;
    
    // Verify this agent is assigned to this chat
    const [visitor] = await db.query(
      'SELECT assigned_agent_id FROM visitors WHERE email = ?',
      [email]
    );
    
    if (!visitor.length || visitor[0].assigned_agent_id !== agentId) {
      return res.status(403).json({ error: 'Not authorized to access this chat' });
    }

    // Mark messages as read
    await db.query(`
      UPDATE visitor_messages 
      SET read_at = NOW() 
      WHERE email = ? AND is_agent_message = 0 AND read_at IS NULL
    `, [email]);

    // Get all messages
    const [messages] = await db.query(`
      SELECT message, timestamp, is_agent_message as isAgent
      FROM visitor_messages
      WHERE email = ?
      ORDER BY timestamp ASC
    `, [email]);

    res.json({ messages });
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;