import axios from 'axios';
import OpenAI from 'openai';

// System prompt for the AI assistant
const SYSTEM_PROMPT = `You are an AI assistant for L'Afiray.ma, an auto parts marketplace in Morocco. Your role is to help customers with:

1. **Auto Parts Information**: Help customers find specific auto parts, provide compatibility information, and suggest alternatives
2. **Order Support**: Help with order status, tracking, and order-related questions
3. **Technical Support**: Provide installation guidance, maintenance tips, and technical advice
4. **Platform Information**: Explain how L'Afiray.ma works, partner opportunities, and platform features
5. **Customer Service**: Handle general inquiries, returns, warranties, and payment questions

Key information about L'Afiray.ma:
- Online auto parts marketplace serving Morocco
- Connects customers with trusted partners across the country
- Offers various payment methods including credit cards, bank transfers, and cash on delivery
- 30-day return policy for unused parts in original packaging
- Partners can register to sell auto parts on the platform
- All orders are delivered to customer locations

Always be helpful, professional, and provide accurate information. If you don't know something specific, suggest contacting customer support or checking the website. Keep responses concise but informative.`;

// Initialize OpenAI client only if API key is available
let openai = null;
try {
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== '' && process.env.OPENAI_API_KEY !== 'AIzaSyCfWPZC4Hc8fhwf-aA9ksQljPTENMJ6Xwg') {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log('OpenAI client initialized successfully');
  } else {
    console.log('OpenAI API key not configured, using fallback responses');
  }
} catch (error) {
  console.log('Failed to initialize OpenAI client, using fallback responses:', error.message);
}

const chatController = {
  // Handle chat messages
  async handleMessage(req, res) {
    try {
      const { message, userId, context } = req.body;
      
      if (!message || !message.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Message is required'
        });
      }

      console.log('Chat request received:', { message, userId, context });

      // Check if OpenAI is available and configured
      if (openai && process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== '' && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here') {
        try {
          // Generate AI response using OpenAI
          const response = await generateOpenAIResponse(message, context);
          
          // Log the interaction (you can store this in database later)
          console.log('Chat interaction (OpenAI):', {
            userId,
            message,
            response,
            context,
            timestamp: new Date()
          });
          
          res.json({
            success: true,
            response,
            timestamp: new Date()
          });
          return;
        } catch (openaiError) {
          console.error('OpenAI API error, falling back to simple responses:', openaiError.message);
          // Fall through to fallback response
        }
      }

      // Fallback to simple responses
      const fallbackResponse = generateFallbackResponse(message);
      
      // Log the interaction
      console.log('Chat interaction (Fallback):', {
        userId,
        message,
        response: fallbackResponse,
        context,
        timestamp: new Date()
      });
      
      res.json({
        success: true,
        response: fallbackResponse,
        timestamp: new Date()
      });
      
    } catch (error) {
      console.error('Chat controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },
  
  // Get chat history (for future implementation)
  async getChatHistory(req, res) {
    try {
      const { userId } = req.params;
      
      // For now, return empty array (you can implement database storage later)
      res.json({
        success: true,
        messages: []
      });
      
    } catch (error) {
      console.error('Get chat history error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
};

// Generate response using OpenAI API
async function generateOpenAIResponse(message, context) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

// Fallback response system (improved simple AI responses)
function generateFallbackResponse(message) {
  const lowerMessage = message.toLowerCase();

  // Recognize car make/model/year patterns
  const carMakes = [
    'bmw','mercedes','audi','volkswagen','vw','toyota','honda','ford','chevrolet','nissan','hyundai','kia','mazda','subaru','lexus','infiniti','acura','volvo','saab','peugeot','renault','citroen','fiat','alfa romeo','jaguar','land rover','range rover','porsche','ferrari','lamborghini','maserati','bentley','rolls royce','aston martin','mclaren','mini','smart','dacia','skoda','seat','opel','vauxhall','lancia','bugatti','pagani','koenigsegg','noble','ariel','caterham','morgan','ginetta','radical','donkervoort','spyker'
  ];
  const carPattern = new RegExp(`\\b(${carMakes.join('|')})\\b`, 'i');
  const yearPattern = /\b(19[8-9][0-9]|20[0-4][0-9]|2050)\b/;

  if (carPattern.test(lowerMessage) && (yearPattern.test(lowerMessage) || /\b\d{4}\b/.test(lowerMessage))) {
    // Looks like a car make/model/year
    return "Thank you for providing your vehicle information! What part or service do you need for your " + message + "? (e.g. brake pads, oil filter, battery, etc.)";
  }
  
  // Product search queries
  if (lowerMessage.includes('brake') || lowerMessage.includes('brakes')) {
    return "I can help you find brake parts! We have brake pads, rotors, calipers, and brake fluid. What's your car model and year? I can show you compatible options.";
  }
  
  if (lowerMessage.includes('filter') || lowerMessage.includes('air filter') || lowerMessage.includes('oil filter')) {
    return "We have a wide selection of air filters and oil filters. To find the right one for your vehicle, I'll need to know your car's make, model, and year. Can you provide those details?";
  }
  
  if (lowerMessage.includes('battery') || lowerMessage.includes('car battery')) {
    return "Looking for a car battery? We carry batteries for all major brands. I can help you find the right size and specifications. What's your vehicle information?";
  }
  
  if (lowerMessage.includes('tire') || lowerMessage.includes('tyre')) {
    return "We offer tires from top brands. To recommend the best options, I need your vehicle details and preferred tire type (all-season, summer, winter, etc.).";
  }
  
  if (lowerMessage.includes('engine') || lowerMessage.includes('motor')) {
    return "We have engine parts including filters, belts, hoses, and more. What specific engine part are you looking for? Please provide your vehicle make, model, and year.";
  }
  
  if (lowerMessage.includes('transmission') || lowerMessage.includes('gear')) {
    return "We carry transmission parts and fluids. To help you find the right parts, I need your vehicle details and transmission type (automatic or manual).";
  }
  
  // Order status queries
  if (lowerMessage.includes('order') && (lowerMessage.includes('status') || lowerMessage.includes('track'))) {
    return "I can help you check your order status! Please provide your order number, and I'll look it up for you. You can also check your order status in your dashboard.";
  }
  
  // Technical support
  if (lowerMessage.includes('install') || lowerMessage.includes('installation') || lowerMessage.includes('how to')) {
    return "I can provide installation guides for many auto parts! What specific part are you looking to install? I can share step-by-step instructions and safety tips.";
  }
  
  if (lowerMessage.includes('maintenance') || lowerMessage.includes('service')) {
    return "I can help with maintenance tips and service schedules! What type of maintenance are you looking for? Regular service, specific part maintenance, or troubleshooting?";
  }
  
  // Partner inquiries
  if (lowerMessage.includes('partner') || lowerMessage.includes('sell') || lowerMessage.includes('business')) {
    return "Interested in becoming a partner? We'd love to have you join our network! You can register as a partner through our website. Partners can list their auto parts and reach customers across Morocco.";
  }
  
  // General greetings
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return "Hello! Welcome to L'Afiray.ma! I'm here to help you find auto parts, check orders, get technical support, or answer any questions about our platform. How can I assist you today?";
  }
  
  // Help requests
  if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
    return "I'm here to help! I can assist you with:\n• Finding auto parts for your vehicle\n• Checking order status\n• Installation guides and technical support\n• Partner registration\n• General platform questions\n\nWhat would you like help with?";
  }
  
  // Price inquiries
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
    return "I can help you find pricing information! To give you accurate prices, I'll need to know what specific part you're looking for and your vehicle details. What part are you interested in?";
  }
  
  // Location/store queries
  if (lowerMessage.includes('where') || lowerMessage.includes('location') || lowerMessage.includes('store')) {
    return "L'Afiray.ma is an online auto parts marketplace serving Morocco. We connect customers with trusted partners across the country. All orders are delivered to your location. Is there a specific area you're looking for parts in?";
  }
  
  // Payment queries
  if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('card')) {
    return "We accept various payment methods including credit cards, bank transfers, and cash on delivery. All payments are secure and processed through our trusted payment partners. Do you have questions about a specific payment method?";
  }
  
  // Return policy
  if (lowerMessage.includes('return') || lowerMessage.includes('refund') || lowerMessage.includes('warranty')) {
    return "We have a customer-friendly return policy. Most parts can be returned within 30 days if they're unused and in original packaging. Many parts also come with manufacturer warranties. What specific part are you asking about?";
  }
  
  // Delivery queries
  if (lowerMessage.includes('delivery') || lowerMessage.includes('shipping') || lowerMessage.includes('when')) {
    return "We offer delivery across Morocco. Delivery times vary by location but typically take 2-5 business days. Express delivery options are available for urgent orders. Where are you located?";
  }
  
  // Default response
  return "Thank you for your message! I'm here to help you with auto parts, orders, technical support, and any questions about L'Afiray.ma. Could you please provide more details about what you're looking for? For example:\n• What type of auto part do you need?\n• What's your vehicle make and model?\n• Are you looking for installation help?\n• Do you need to check an order status?";
}

export default chatController; 