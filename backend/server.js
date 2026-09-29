const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// Predefined commercial knowledge base
const knowledgeBase = [
    {
        keywords: ["hello", "hi", "hey", "good morning", "good evening"],
        response:
            "Hello! 👋 Welcome to CodeAlpha Support. How can I help you today?"
    },
    {
        keywords: ["price", "pricing", "cost", "fee"],
        response:
            "Our services are available at affordable prices. Please tell me which service you are interested in, and I can provide the relevant pricing information."
    },
    {
        keywords: ["service", "services", "offer", "offers"],
        response:
            "We provide cloud computing, web development, software development, database, and technical support services."
    },
    {
        keywords: ["cloud", "cloud computing"],
        response:
            "Our cloud services help businesses deploy applications, store data securely, and scale systems according to demand."
    },
    {
        keywords: ["support", "help", "customer support"],
        response:
            "Our support team can help with technical questions, account issues, services, and general enquiries."
    },
    {
        keywords: ["contact", "email", "phone"],
        response:
            "You can contact our support team through the contact information provided on the website."
    },
    {
        keywords: ["hours", "working hours", "open", "timing"],
        response:
            "Our support service is available Monday to Saturday during normal business hours."
    },
    {
        keywords: ["refund", "money back"],
        response:
            "Refund requests are reviewed according to the applicable service terms. Please contact support with your order details."
    },
    {
        keywords: ["booking", "book", "appointment"],
        response:
            "I can help you with general booking information. Please provide the service or appointment you are interested in."
    },
    {
        keywords: ["thank", "thanks"],
        response:
            "You're welcome! 😊 I'm happy to help."
    },
    {
        keywords: ["bye", "goodbye"],
        response:
            "Goodbye! 👋 Have a great day."
    }
];

// Clean and normalize user input
function normalizeText(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

// Find the best predefined response
function findResponse(message) {
    const normalizedMessage = normalizeText(message);

    let bestMatch = null;
    let bestScore = 0;

    for (const item of knowledgeBase) {
        let score = 0;

        for (const keyword of item.keywords) {
            const normalizedKeyword = normalizeText(keyword);

            if (normalizedMessage.includes(normalizedKeyword)) {
                score++;
            }
        }

        if (score > bestScore) {
            bestScore = score;
            bestMatch = item;
        }
    }

    if (bestMatch) {
        return {
            response: bestMatch.response,
            matched: true
        };
    }

    return {
        response:
            "I'm sorry, I didn't fully understand that. You can ask me about our services, pricing, cloud computing, support, bookings, refunds, or contact information.",
        matched: false
    };
}

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        service: "CodeAlpha AI Chatbot",
        chatbot: "Retrieval-based commercial chatbot"
    });
});

// Chat API
app.post("/api/chat", (req, res) => {
    const { message } = req.body;

    // Validate message
    if (
        typeof message !== "string" ||
        message.trim().length === 0
    ) {
        return res.status(400).json({
            success: false,
            message: "Please enter a message."
        });
    }

    // Limit message size
    if (message.length > 500) {
        return res.status(400).json({
            success: false,
            message:
                "Message is too long. Please keep it under 500 characters."
        });
    }

    const result = findResponse(message);

    res.json({
        success: true,
        userMessage: message,
        response: result.response,
        matched: result.matched,
        timestamp: new Date().toISOString()
    });
});

// API information
app.get("/api", (req, res) => {
    res.json({
        message: "CodeAlpha AI Chatbot API is running",
        endpoints: {
            health: "GET /api/health",
            chat: "POST /api/chat"
        }
    });
});

// Handle unknown API routes
app.use("/api", (req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found."
    });
});

// Start server
app.listen(PORT, () => {
    console.log(
        `CodeAlpha Chatbot running at http://localhost:${PORT}`
    );

    console.log(
        "Chat endpoint: POST /api/chat"
    );

    console.log(
        "Health endpoint: GET /api/health"
    );
});