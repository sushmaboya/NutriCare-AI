const { OpenAI } = require('openai');
const HealthProfile = require('../models/HealthProfile');
const FoodItem = require('../models/FoodItem');

// Smart simulated local AI response generator based on health profile and question keywords
const generateSmartMockResponse = (message, profile) => {
  const query = message.toLowerCase();
  
  // Specific mock queries requested by user
  if (query.includes('b12') || query.includes('cobalamin')) {
    return "Foods rich in Vitamin B12 include eggs, milk, fish, chicken, curd, and fortified cereals.";
  }

  if (query.includes('iron deficiency') || (query.includes('iron') && query.includes('defic'))) {
    return "Increase spinach, beetroot, dates, jaggery, and legumes.";
  }

  let userContextText = '';
  if (profile) {
    userContextText = `Based on your profile (${profile.age}yo, ${profile.gender}, BMI: ${profile.bmi}, Goal: ${profile.fitnessGoals}, Deficiencies: [${profile.deficiencies.join(', ')}], Diseases: [${profile.diseases.join(', ')}]), here is my expert suggestion:`;
  } else {
    userContextText = `As your health assistant, here is my suggestion:`;
  }

  // Question routing based on keywords
  if (query.includes('protein') || query.includes('muscle') || query.includes('gym')) {
    return `${userContextText}\n\nFor high protein intake in an Indian diet, I highly recommend including:\n- **Paneer (Cottage Cheese)**: 18g protein per 100g. Good for snacks or main courses.\n- **Yellow Moong Dal or Chickpeas**: Excellent plant-based protein sources, yielding 7-9g protein per 100g cooked.\n- **Boiled Eggs**: 12.6g protein per 100g (approx 6g per egg).\n- **Chicken Breast**: Lean and highly bioavailable with 31g protein per 100g.\n\n*Tip:* To build muscle, aim for about 1.6 to 2.0 grams of protein per kilogram of body weight. Stay hydrated and space protein intake evenly across 4 meals.`;
  }
  
  if (query.includes('sugar') || query.includes('diabetes') || query.includes('diabetic') || query.includes('insulin')) {
    return `${userContextText}\n\nManaging blood sugar requires focusing on complex, low-glycemic index carbohydrates and high dietary fiber:\n- **Foods to Prioritize**: Oats, broccoli, chickpeas, spinach, and quinoa. They slow down glucose release into the blood.\n- **Foods to Avoid**: Refined white sugar, white basmati rice, refined flour (maida), sugary juices, and highly processed deep-fried snacks.\n- **Spices that help**: Cinnamon and fenugreek seeds (methi) are known to support insulin sensitivity. Try drinking fenugreek-infused water in the morning.`;
  }

  if (query.includes('iron') || query.includes('blood') || query.includes('anaemia') || query.includes('anemia') || query.includes('fatigue')) {
    return `${userContextText}\n\nTo address iron deficiency and increase hemoglobin levels:\n- **Top Sources**: Spinach (Palak), lentils (Moong/Masoor dal), walnuts, almonds, and oats.\n- **Crucial Tip**: Iron from plant sources (non-heme iron) is much better absorbed when paired with Vitamin C. Squeeze a fresh lemon over your spinach or dal, or consume citrus fruits like oranges.\n- **Avoid**: Drinking tea or coffee with or immediately after meals, as tannins block iron absorption.`;
  }

  if (query.includes('calcium') || query.includes('bone') || query.includes('joints') || query.includes('vitamin d') || query.includes('d3')) {
    return `${userContextText}\n\nFor strong bones and structural health, calcium and Vitamin D must work together:\n- **Calcium Stars**: Milk, curd (dahi), paneer, almonds, and chia seeds.\n- **Vitamin D Sources**: Egg yolks, fortified milk, button mushrooms (exposed to sunlight), and fatty fish.\n- **Daily Action Plan**: Have a bowl of curd (150g) with lunch, 4 soaked almonds in the morning, and get 15 minutes of direct sunlight between 8:00 AM and 10:00 AM daily.`;
  }

  if (query.includes('lose weight') || query.includes('weight loss') || query.includes('fat loss') || query.includes('diet plan') || query.includes('slim')) {
    return `${userContextText}\n\nTo achieve sustained weight loss without feeling starved, follow this structured routine:\n1. **Maintain a 300-500 kcal deficit**: Eat slightly less than your maintenance calories (estimate: 1500-1800 kcal total daily).\n2. **Prioritize high satiety foods**: Swap white rice with whole wheat rotis or oats. Fiber and protein keep you full.\n3. **Include plenty of raw veggies**: Start lunch and dinner with a cucumber-carrot-tomato salad. It fills your stomach with low-calorie volume.\n4. **Evening Snack swap**: Stop eating biscuits or bhujia. Switch to 10-12 roasted almonds or a bowl of papaya.`;
  }

  if (query.includes('thyroid') || query.includes('hypothyroid') || query.includes('hyperthyroid')) {
    return `${userContextText}\n\nFor thyroid management (especially hypothyroidism):\n- **Prioritize Selenium and Zinc**: Eat chicken breast, walnuts, almonds, and whole grains.\n- **Goitrogens Precaution**: If you have hypothyroidism, avoid eating raw cruciferous vegetables like broccoli, cauliflower, or cabbage. Always cook them thoroughly to deactivate goitrogenic compounds.\n- **Iodine balance**: Use iodized salt in moderation and stay clear of heavy soy-based products (tofu/soya chunks) as they can interfere with thyroid hormone absorption.`;
  }

  if (query.includes('bp') || query.includes('blood pressure') || query.includes('hypertension') || query.includes('salt')) {
    return `${userContextText}\n\nFor blood pressure management, the primary goal is dietary sodium control and potassium enhancement (similar to the DASH diet):\n- **High Potassium Foods**: Spinach, curd, oranges, papaya, and mushrooms help relax blood vessels.\n- **Sodium Control**: Limit salt to under 1 teaspoon (5g) per day. Avoid pickles, papad, processed cheese, and packaged chips.\n- **Stress buster**: Incorporate chamomile tea, limit caffeine, and practice deep breathing for 10 minutes daily.`;
  }

  if (query.includes('kidney') || query.includes('renal') || query.includes('creatinine')) {
    return `${userContextText}\n\nFor kidney disease, a carefully monitored intake of protein, potassium, sodium, and phosphorus is vital:\n- **Foods to Limit**: Avoid high-potassium foods like spinach, oranges, bananas, and high-phosphorus foods like dairy (milk, paneer).\n- **Safe Alternatives**: Tofu (moderation), apples, cabbage, cauliflower, and carrots are generally safer. Always follow a renal dietitian's advice.`;
  }

  // Generic healthy response
  return `Hello! ${userContextText}\n\nI can help you with personalized nutrition advice, dietary changes, and meal suggestions.\n\nHere are some quick topics you can ask me about:\n1. **"How do I manage my Diabetes in an Indian diet?"**\n2. **"What should I eat to cure my Iron deficiency?"**\n3. **"Suggest a quick high-protein evening snack."**\n4. **"What foods should I avoid if I have High Blood Pressure?"**\n5. **"How do I structure my meals for Weight Loss?"**\n\nWhat health or dietary question can I answer for you today?`;
};

// @route   POST api/ai/chat
// @desc    Interact with the AI nutritionist (OpenAI with rule-based fallback)
// @access  Private
exports.chatWithAssistant = async (req, res) => {
  const { message, chatHistory } = req.body; // Expects message: string and chatHistory: array of messages

  // Console logging for incoming chatbot messages
  console.log('=================================================');
  console.log(`[AI Chat Assistant] Incoming chatbot message: "${message}"`);
  console.log(`[AI Chat Assistant] Chat History Length: ${chatHistory ? chatHistory.length : 0}`);

  if (!message || message.trim() === '') {
    console.warn('[AI Chat Assistant] Validation failed: message is empty');
    return res.status(400).json({ success: false, message: 'Please provide a message' });
  }

  try {
    const profile = await HealthProfile.findOne({ user: req.user.id });
    
    // Check if valid OpenAI API Key is present in environment
    const apiKey = process.env.OPENAI_API_KEY;
    const hasValidKey = apiKey && apiKey !== 'your_openai_api_key_here' && apiKey.trim() !== '';

    if (hasValidKey) {
      try {
        console.log('[AI Chat Assistant] Initiating OpenAI Chat Completion Request...');
        const openai = new OpenAI({ apiKey });
        
        let systemPrompt = `You are a certified professional clinical nutritionist and expert dietician specializing in Indian food, deficiencies, and chronic disease management. You provide warm, scientific, practical, and highly personalized advice.`;
        
        if (profile) {
          systemPrompt += `\n\nYou are consulting a user with the following profile:
          - Age: ${profile.age} years old
          - Gender: ${profile.gender}
          - Weight: ${profile.weight} kg
          - Height: ${profile.height} cm
          - Calculated BMI: ${profile.bmi}
          - Fitness Goal: ${profile.fitnessGoals}
          - Deficiencies: ${profile.deficiencies.length > 0 ? profile.deficiencies.join(', ') : 'None'}
          - Diseases/Chronic Conditions: ${profile.diseases.length > 0 ? profile.diseases.join(', ') : 'None'}
          
          You MUST structure your recommendations based on their health profile. 
          1. NEVER recommend foods they must avoid due to their chronic conditions (e.g. avoid high-glycemic foods for Diabetes, avoid high potassium/sodium for Kidney disease, avoid raw goitrogenic greens for Thyroid).
          2. Emphasize foods that target their deficiencies (e.g. iron-rich foods for Iron deficiency + Vitamin C pairing).
          3. Keep recommendations highly focused on Indian dietary options (e.g., Dal, Roti, Curd, Paneer, Spinach, Oats, Eggs, Almonds) unless they ask for others.
          4. Format your output using clear markdown bullet points, bold text, and numbered lists so it looks premium and highly readable.`;
        }

        // Map chat history to OpenAI message format
        const messages = [{ role: 'system', content: systemPrompt }];
        
        if (chatHistory && Array.isArray(chatHistory)) {
          // Append last 6 messages to keep context concise and avoid token bloat
          const recentHistory = chatHistory.slice(-6);
          recentHistory.forEach(msg => {
            messages.push({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text
            });
          });
        }
        
        messages.push({ role: 'user', content: message });

        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini', // Highly responsive and cost-effective
          messages: messages,
          max_tokens: 600,
          temperature: 0.7
        });

        const reply = response.choices[0].message.content;
        
        // Console logging for OpenAI API responses
        console.log('[AI Chat Assistant] OpenAI API response received successfully');
        console.log('[AI Chat Assistant] Response generated:', reply);
        console.log('=================================================');
        
        return res.json({ success: true, reply, source: 'OpenAI API' });

      } catch (openAiError) {
        console.warn('[AI Chat Assistant] OpenAI Call failed, falling back to local rule engine:', openAiError.message);
        const reply = generateSmartMockResponse(message, profile);
        
        console.log('[AI Chat Assistant] Response generated via Local Fallback:', reply);
        console.log('=================================================');
        
        return res.json({ success: true, reply, source: 'Local AI Fallback Engine (API Timeout/Limit)' });
      }
    } else {
      console.log('[AI Chat Assistant] No OpenAI API Key found, executing local intelligence engine...');
      const reply = generateSmartMockResponse(message, profile);
      
      console.log('[AI Chat Assistant] Response generated via Local Engine:', reply);
      console.log('=================================================');
      
      return res.json({ success: true, reply, source: 'Local Intelligent Recommendation Rule Engine' });
    }

  } catch (err) {
    // Console logging for backend route errors
    console.error('[AI Chat Assistant] Backend route error occurred:', err);
    console.log('=================================================');
    res.status(500).json({ success: false, message: 'Server error processing chat message' });
  }
};
