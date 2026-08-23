import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User } from 'lucide-react';

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [isNameCollected, setIsNameCollected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const sessionId = useRef(Math.random().toString(36).substring(7));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && !isNameCollected) {
      setMessages([
        {
          id: 1,
          text: "Welcome to Quality Rentals! Before we begin, may I know your name?",
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, isNameCollected]);

  const getDeviceInfo = () => {
    const userAgent = navigator.userAgent;
    let deviceType = 'Desktop';
    let deviceOS = 'Unknown';
    let browser = 'Unknown';
    let browserVersion = 'Unknown';
    let screenResolution = `${window.screen.width}x${window.screen.height}`;
    let viewportSize = `${window.innerWidth}x${window.innerHeight}`;
    let language = navigator.language || 'Unknown';
    let platform = navigator.platform || 'Unknown';

    // Detect device type
    if (/Mobile|Android|iPhone|iPad|iPod/i.test(userAgent)) {
      deviceType = 'Mobile';
    } else if (/Tablet|iPad/i.test(userAgent)) {
      deviceType = 'Tablet';
    }

    // Detect OS
    if (/Windows/i.test(userAgent)) {
      deviceOS = 'Windows';
      const match = userAgent.match(/Windows NT (\d+\.\d+)/);
      if (match) deviceOS += ` ${match[1]}`;
    } else if (/Mac/i.test(userAgent)) {
      deviceOS = 'MacOS';
      if (/iPhone|iPad|iPod/i.test(userAgent)) deviceOS = 'iOS';
    } else if (/Linux/i.test(userAgent)) {
      deviceOS = 'Linux';
      if (/Android/i.test(userAgent)) {
        deviceOS = 'Android';
        const match = userAgent.match(/Android (\d+\.\d+)/);
        if (match) deviceOS += ` ${match[1]}`;
      }
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
      deviceOS = 'iOS';
    }

    // Detect browser and version
    if (/Chrome/i.test(userAgent) && !/Edge|OPR/i.test(userAgent)) {
      browser = 'Chrome';
      const match = userAgent.match(/Chrome\/(\d+\.\d+\.\d+\.\d+)/);
      if (match) browserVersion = match[1];
    } else if (/Firefox/i.test(userAgent)) {
      browser = 'Firefox';
      const match = userAgent.match(/Firefox\/(\d+\.\d+)/);
      if (match) browserVersion = match[1];
    } else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
      browser = 'Safari';
      const match = userAgent.match(/Version\/(\d+\.\d+)/);
      if (match) browserVersion = match[1];
    } else if (/Edge/i.test(userAgent)) {
      browser = 'Edge';
      const match = userAgent.match(/Edge\/(\d+\.\d+\.\d+\.\d+)/);
      if (match) browserVersion = match[1];
    } else if (/OPR/i.test(userAgent)) {
      browser = 'Opera';
      const match = userAgent.match(/OPR\/(\d+\.\d+\.\d+\.\d+)/);
      if (match) browserVersion = match[1];
    }

    return { 
      deviceType, 
      deviceOS, 
      browser, 
      browserVersion,
      screenResolution,
      viewportSize,
      language,
      platform
    };
  };

  const getLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) throw new Error('Location API failed');
      const data = await response.json();
      return {
        country: data.country_name || null,
        city: data.city || null
      };
    } catch (error) {
      console.warn('Location detection failed:', error);
      return { country: null, city: null };
    }
  };

  const logChatMessage = async (message, sender) => {
    const deviceInfo = getDeviceInfo();
    
    // Get location but don't block if it fails
    let location = { country: null, city: null };
    try {
      location = await getLocation();
    } catch (error) {
      console.warn('Location detection failed:', error);
    }

    try {
      const response = await fetch('http://localhost/qualityrentalservices/api/chat-logs.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_name: userName || null,
          message: message,
          sender: sender,
          device_type: deviceInfo.deviceType,
          device_os: deviceInfo.deviceOS,
          browser: deviceInfo.browser,
          browser_version: deviceInfo.browserVersion,
          screen_resolution: deviceInfo.screenResolution,
          viewport_size: deviceInfo.viewportSize,
          language: deviceInfo.language,
          platform: deviceInfo.platform,
          location_country: location.country,
          location_city: location.city,
          session_id: sessionId.current
        })
      });

      const data = await response.json();
      console.log('Chat log response:', data);
      
      if (!data.success) {
        console.error('Failed to log chat message:', data.error);
      }
    } catch (error) {
      console.error('Failed to log chat message:', error);
    }
  };

  const searchProducts = async (query) => {
    try {
      const response = await fetch(`http://localhost/qualityrentalservices/api/search-products.php?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (data.success && data.products.length > 0) {
        return data.products;
      }
      return null;
    } catch (error) {
      console.error('Product search failed:', error);
      return null;
    }
  };

  const generateResponse = async (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check if user is searching for products
    if (lowerMessage.includes('search') || lowerMessage.includes('find') || lowerMessage.includes('look for') || lowerMessage.includes('available')) {
      // Extract search terms
      const searchTerms = userMessage.replace(/search|find|look for|available/gi, '').trim();
      
      if (searchTerms) {
        const products = await searchProducts(searchTerms);
        
        if (products && products.length > 0) {
          let response = `I found ${products.length} product(s) matching "${searchTerms}":\n\n`;
          
          products.forEach((product, index) => {
            const availability = product.stock_quantity > 0 && product.is_available ? '✅ Available' : '❌ Unavailable';
            const currency = product.price_currency === 'LRD' ? 'LRD' : '$';
            response += `${index + 1}. **${product.name}**\n`;
            response += `   Price: ${currency}${product.price}\n`;
            response += `   Stock: ${product.stock_quantity}\n`;
            response += `   Status: ${availability}\n\n`;
          });
          
          response += "Would you like to add any of these to your quote request?";
          return response;
        } else {
          return `I couldn't find any products matching "${searchTerms}". Try searching for items like tents, chairs, tables, generators, or sound systems. You can also browse our full catalog in the rentals section.`;
        }
      } else {
        return "What would you like me to search for? Please tell me the product name or category you're looking for.";
      }
    }
    
    // Simple rule-based responses
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
      return "Our pricing varies based on the rental items and duration. You can browse our catalog and add items to your quote request, or contact us directly at +231776748152 for specific pricing information.";
    }
    if (lowerMessage.includes('tent') || lowerMessage.includes('canopy')) {
      return "We offer various tents and canopies including luxury wedding tents, party canopies, and garden tents. Would you like to see our full catalog of tent options?";
    }
    if (lowerMessage.includes('chair') || lowerMessage.includes('table')) {
      return "We have a wide selection of chairs and tables including banquet chairs, round tables, folding chairs, and cocktail tables. Check out our 'Tables & Chairs' category in the rentals section.";
    }
    if (lowerMessage.includes('water') || lowerMessage.includes('tank')) {
      return "We provide water tanks in various sizes including 500L and 1000L options, perfect for events requiring water supply.";
    }
    if (lowerMessage.includes('generator') || lowerMessage.includes('power') || lowerMessage.includes('electricity')) {
      return "We offer silent eco-diesel generators and event power backup solutions to ensure your event has reliable power.";
    }
    if (lowerMessage.includes('sound') || lowerMessage.includes('speaker') || lowerMessage.includes('audio')) {
      return "We provide outdoor sound systems, PA systems, and wireless microphone kits for clear audio at your events.";
    }
    if (lowerMessage.includes('wedding')) {
      return "Congratulations on your upcoming wedding! We have everything you need including elegant tents, gold phoenix chairs, banquet tables, and more. Would you like to schedule a consultation?";
    }
    if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('email')) {
      return "You can reach us at:\n📞 Phone: +231776748152\n📧 Email: paye.susanna@yahoo.com\n📍 Address: Paynesville City, Montserrado County - Liberia";
    }
    if (lowerMessage.includes('quote') || lowerMessage.includes('rental')) {
      return "You can easily get a quote by browsing our rentals, adding items to your quote request, and filling out the form. Just click 'Get a Quote' on any product!";
    }
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! Welcome to Quality Rental Business Services. How can I assist you with your event rental needs today? You can ask me to search for specific products or check availability.";
    }
    if (lowerMessage.includes('thank')) {
      return "You're welcome! Is there anything else I can help you with?";
    }
    
    return "I'd be happy to help you with that! You can ask me to search for specific products by name, or browse our catalog directly. What rental items are you interested in?";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // First interaction - collect name
    if (!isNameCollected) {
      const name = inputValue.trim();
      setUserName(name);
      setIsNameCollected(true);
      
      const userMessage = {
        id: Date.now(),
        text: name,
        sender: 'user',
        timestamp: new Date()
      };
      
      const botResponse = {
        id: Date.now() + 1,
        text: `Nice to meet you, ${name}! I'm your AI assistant for Quality Rental Business Services. How can I help you today?`,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage, botResponse]);
      setInputValue('');
      
      // Log messages
      await logChatMessage(name, 'user');
      await logChatMessage(botResponse.text, 'bot');
      return;
    }

    // Normal chat after name is collected
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Log user message
    await logChatMessage(inputValue, 'user');

    // Simulate AI response delay
    setTimeout(async () => {
      const botResponse = {
        id: Date.now() + 1,
        text: await generateResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
      
      // Log bot response
      await logChatMessage(botResponse.text, 'bot');
    }, 1000);
  };

  return (
    <>
      {/* Floating Avatar Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 z-50 bg-gradient-to-br from-gold to-yellow-600 p-1 rounded-full shadow-lg hover:scale-110 transition-all duration-300 group"
          aria-label="Open AI Chat"
        >
          <div className="relative bg-white p-2 rounded-full">
            <Bot className="w-8 h-8 text-navy" />
            <div className="absolute -top-1 -right-1 bg-green-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse border-2 border-white">
              <span className="text-[10px]">AI</span>
            </div>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300">
          {/* Header */}
          <div className="bg-navy text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative bg-gradient-to-br from-gold to-yellow-600 p-3 rounded-full shadow-lg">
                <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
                <Bot className="w-6 h-6 text-white relative z-10" />
              </div>
              <div>
                <h3 className="font-semibold">Quality Rentals</h3>
                <p className="text-xs text-gray-300 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                  AI Assistant • Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gold transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-[80%] ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    message.sender === 'user' 
                      ? 'bg-navy text-white' 
                      : 'bg-gold/20 text-gold'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-navy text-white rounded-br-sm'
                        : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <span className="text-xs opacity-60 mt-1 block">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2">
                  <div className="bg-gold/20 p-2 rounded-full">
                    <Bot className="w-4 h-4 text-gold" />
                  </div>
                  <div className="bg-white p-3 rounded-2xl rounded-bl-sm shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent text-sm"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="bg-gold text-white p-2 rounded-full hover:bg-navy transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AIChat;
