const express = require('express');
const router = express.Router();

// Common responses for course-related queries
const courseResponses = {
    'course': {
        keywords: ['course', 'courses', 'class', 'program'],
        response: 'You can find our courses in the Courses section. We offer various programs in different categories. Would you like me to help you find a specific course?'
    },
    'where': {
        keywords: ['where', 'location', 'place', 'center'],
        response: 'Our learning centers are located globally. You can check our Global Presence page for detailed information about our locations.'
    },
    'price': {
        keywords: ['price', 'cost', 'fee', 'fees', 'pricing'],
        response: 'Course fees vary depending on the program and duration. Please select a specific course to view its pricing details.'
    },
    'duration': {
        keywords: ['duration', 'long', 'time', 'hours', 'weeks', 'months'],
        response: 'Course durations vary by program. Most courses range from 4 weeks to 6 months. Which course are you interested in?'
    },
    'registration': {
        keywords: ['register', 'join', 'enroll', 'sign up', 'registration'],
        response: 'You can register for courses through our website. First, create an account if you haven\'t already, then select your desired course and click on "Enroll Now".'
    },
    'hello': {
        keywords: ['hello', 'hi', 'hey', 'greetings', 'hii', 'hiii', 'hiiii', 'helo', 'helloo', 'hellooo', 'good morning', 'good afternoon', 'good evening', 'namaste'],
        response: 'Hello! Welcome to BRFLE! How can I assist you today?'
    }
};

// Function to find the best matching response
function findBestResponse(message) {
    const messageLower = message.toLowerCase().trim();
    
    // First check for exact matches
    for (const [key, data] of Object.entries(courseResponses)) {
        if (data.keywords.includes(messageLower)) {
            return data.response;
        }
    }

    // Then check for partial matches
    let bestMatch = null;
    let maxMatches = 0;

    for (const [key, data] of Object.entries(courseResponses)) {
        const matches = data.keywords.filter(keyword => messageLower.includes(keyword)).length;
        if (matches > maxMatches) {
            maxMatches = matches;
            bestMatch = data.response;
        }
    }

    return bestMatch || "I apologize, but I'm not sure about that. Would you like to speak with our support team?";
}

router.post('/message', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Get appropriate response based on the message
        const response = findBestResponse(message);

        res.json({
            success: true,
            response: response
        });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;