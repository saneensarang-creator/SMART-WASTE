// AI Waste Helpdesk Knowledge Base and Chat Logic

// Comprehensive waste knowledge base
const wasteKnowledgeBase = {
    wasteTypes: {
        organic: {
            name: "Organic Waste",
            icon: "🍃",
            description: "Biodegradable materials from plants and animals",
            examples: "Food scraps, leaves, wood, paper, cardboard",
            decompositionTime: "2-6 months",
            disposal: "Composting, biogas generation, landfill",
            techniques: "Aerobic composting, anaerobic digestion"
        },
        recyclable: {
            name: "Recyclable Materials",
            icon: "♻️",
            description: "Materials that can be processed and reused",
            examples: "Plastic bottles, aluminum cans, glass, paper, steel",
            decompositionTime: "Variable (glass: 1 million years, plastic: 450-1000 years, aluminum: 80-200 years)",
            disposal: "Recycling centers, material recovery facilities",
            techniques: "Mechanical recycling, chemical recycling, upcycling"
        },
        eWaste: {
            name: "Electronic Waste (E-waste)",
            icon: "📱",
            description: "Discarded electrical and electronic equipment",
            examples: "Computers, phones, televisions, printers, batteries",
            decompositionTime: "Not biodegradable - contains toxic materials",
            disposal: "Specialized e-waste recycling facilities",
            techniques: "Component separation, precious metal extraction, dangerous material removal"
        },
        hazardous: {
            name: "Hazardous Waste",
            icon: "☠️",
            description: "Materials that pose risk to human health or environment",
            examples: "Chemicals, pesticides, batteries, oil, asbestos, paint",
            decompositionTime: "Can persist indefinitely",
            disposal: "Specialized treatment facilities, incineration, secure landfills",
            techniques: "Chemical neutralization, thermal treatment, immobilization"
        },
        construction: {
            name: "Construction & Demolition Waste",
            icon: "🏗️",
            description: "Materials from building and demolition activities",
            examples: "Concrete, bricks, wood, metal, drywall, tiles",
            decompositionTime: "Concrete: 10-30 years, wood: 3-6 years",
            disposal: "Recycling, landfill, material recovery",
            techniques: "Crushing, sorting, reuse in construction"
        },
        inert: {
            name: "Inert Waste",
            icon: "🪨",
            description: "Non-reactive, non-hazardous waste materials",
            examples: "Soil, sand, gravel, rocks, ceramics",
            decompositionTime: "Does not decompose",
            disposal: "Landfill, construction use",
            techniques: "Sorting, crushing, reuse"
        }
    },

    decompositionTimes: {
        "paper": "2-6 weeks",
        "cardboard": "2-3 months",
        "food": "1-6 months",
        "leaves": "1-6 months",
        "wood": "3-6 years",
        "rope/twine": "3-14 months",
        "cloth/cotton": "1-5 months",
        "plywood": "3-15 years",
        "plastic bottle": "450-1000 years",
        "plastic bag": "20-30 years",
        "glass": "1 million years",
        "aluminum can": "80-200 years",
        "steel can": "50-80 years",
        "leather": "25-40 years",
        "cigarette butt": "10-12 years",
        "battery": "Not biodegradable - varies by type",
        "rubber": "50-80 years"
    },

    advancedTechniques: {
        composting: {
            name: "Composting",
            type: "Aerobic Decomposition",
            description: "Organic waste is decomposed by microorganisms in presence of oxygen",
            process: "Material is layered, turned regularly, and maintained at optimal moisture and temperature",
            timeframe: "3-6 months for finished compost",
            output: "Nutrient-rich soil amendment"
        },
        anaerobic: {
            name: "Anaerobic Digestion",
            type: "Biogas Generation",
            description: "Organic waste decomposed in oxygen-free environment",
            process: "Materials are sealed in chambers where microbes break them down",
            timeframe: "20-30 days",
            output: "Biogas (methane + CO2) and digestate (fertilizer)"
        },
        incineration: {
            name: "Incineration",
            type: "Thermal Treatment",
            description: "Waste is burned at high temperatures (800-1200°C)",
            process: "Controlled combustion in specially designed furnaces with emission controls",
            timeframe: "Real-time",
            output: "Ash, energy/heat, minimal volume waste"
        },
        landfill: {
            name: "Engineered Landfill",
            type: "Containment",
            description: "Waste is compacted and covered in soil/liners to prevent environmental contamination",
            process: "Waste compressed, layered with soil, lined with impermeable materials",
            timeframe: "Permanent storage",
            output: "Landfill gas, leachate management"
        },
        recycling: {
            name: "Material Recycling",
            type: "Reprocessing",
            description: "Waste materials are collected, sorted, processed, and made into new products",
            process: "Collection → Sorting → Cleaning → Processing → Manufacturing",
            timeframe: "Varies by material type",
            output: "New products from recycled materials"
        },
        pyrolysis: {
            name: "Pyrolysis",
            type: "Thermal Breakdown",
            description: "Organic waste heated without oxygen to break down into simpler compounds",
            process: "High temperature heating (500-900°C) in absence of oxygen",
            timeframe: "1-2 hours",
            output: "Bio-oil, biochar, syngas"
        }
    },

    hazardousWasteIdentification: {
        chemical: "Hazardous wastes from chemical cleaning products, solvents, paint thinners",
        pesticide: "Agricultural chemicals, insecticides, herbicides",
        battery: "Contain mercury, lead, lithium - require special handling",
        oil: "Used motor oil, hydraulic oil - persistent in environment",
        asbestos: "Friable asbestos from old insulation, tiles, roofing",
        medical: "Sharps, contaminated materials, radioactive substances",
        fluorescent: "Contain mercury - require special recycling",
        properties: "Check for: corrosivity, flammability, reactivity, toxicity"
    }
};

// Chat message history
let chatHistory = [];

// Send user message and get AI response
function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addMessageToChat(message, 'user');
    input.value = '';
    
    // Scroll to bottom
    scrollChatToBottom();
    
    // Show typing indicator
    showTypingIndicator();
    
    // Get AI response after a short delay (simulating processing)
    setTimeout(() => {
        removeTypingIndicator();
        const response = generateAIResponse(message);
        addMessageToChat(response, 'ai');
        scrollChatToBottom();
    }, 800 + Math.random() * 400);
}

// Quick message helper
function sendQuickMessage(topic) {
    const input = document.getElementById('userInput');
    input.value = topic;
    sendMessage();
}

// Generate contextual AI response based on user input
function generateAIResponse(userMessage) {
    const query = userMessage.toLowerCase();
    
    // Check for waste type identification
    if (query.includes('type') || query.includes('waste') || query.includes('material') || query.includes('material') || query.includes('what is')) {
        if (query.includes('organic') || query.includes('food') || query.includes('plant') || query.includes('leaf')) {
            return formatWasteResponse(wasteKnowledgeBase.wasteTypes.organic);
        } else if (query.includes('recycle') || query.includes('plastic') || query.includes('glass') || query.includes('metal')) {
            return formatWasteResponse(wasteKnowledgeBase.wasteTypes.recyclable);
        } else if (query.includes('e-waste') || query.includes('electronic') || query.includes('phone') || query.includes('computer')) {
            return formatWasteResponse(wasteKnowledgeBase.wasteTypes.eWaste);
        } else if (query.includes('hazard') || query.includes('chemical') || query.includes('toxic') || query.includes('dangerous')) {
            return formatWasteResponse(wasteKnowledgeBase.wasteTypes.hazardous);
        } else if (query.includes('construct') || query.includes('demolition') || query.includes('concrete') || query.includes('brick')) {
            return formatWasteResponse(wasteKnowledgeBase.wasteTypes.construction);
        } else if (query.includes('inert') || query.includes('soil') || query.includes('rock')) {
            return formatWasteResponse(wasteKnowledgeBase.wasteTypes.inert);
        } else {
            return "I see you're asking about waste types. We have:\n\n" +
                "🍃 Organic Waste\n" +
                "♻️ Recyclable Materials\n" +
                "📱 E-waste\n" +
                "☠️ Hazardous Waste\n" +
                "🏗️ Construction Waste\n" +
                "🪨 Inert Waste\n\n" +
                "Which one would you like to know more about?";
        }
    }
    
    // Check for decomposition queries
    if (query.includes('decompos') || query.includes('how long') || query.includes('time') || query.includes('break down')) {
        for (const [item, time] of Object.entries(wasteKnowledgeBase.decompositionTimes)) {
            if (query.includes(item)) {
                return `⏱️ <strong>${item.charAt(0).toUpperCase() + item.slice(1)}</strong> decomposes in approximately <strong>${time}</strong>.\n\nThis timeline depends on environmental conditions like temperature, moisture, and oxygen availability.`;
            }
        }
        return "📊 Common Decomposition Times:\n\n" +
            "Paper: 2-6 weeks\n" +
            "Organic waste: 1-6 months\n" +
            "Wood: 3-6 years\n" +
            "Plastic bottle: 450-1000 years\n" +
            "Glass: 1 million years\n\n" +
            "Ask me about a specific material!";
    }
    
    // Check for advanced techniques
    if (query.includes('technique') || query.includes('method') || query.includes('process') || query.includes('how to') || query.includes('treatment')) {
        if (query.includes('compost')) {
            return formatTechniqueResponse(wasteKnowledgeBase.advancedTechniques.composting);
        } else if (query.includes('anaerobic') || query.includes('biogas') || query.includes('digestion')) {
            return formatTechniqueResponse(wasteKnowledgeBase.advancedTechniques.anaerobic);
        } else if (query.includes('inciner') || query.includes('burn')) {
            return formatTechniqueResponse(wasteKnowledgeBase.advancedTechniques.incineration);
        } else if (query.includes('landfill')) {
            return formatTechniqueResponse(wasteKnowledgeBase.advancedTechniques.landfill);
        } else if (query.includes('recycl')) {
            return formatTechniqueResponse(wasteKnowledgeBase.advancedTechniques.recycling);
        } else if (query.includes('pyrol')) {
            return formatTechniqueResponse(wasteKnowledgeBase.advancedTechniques.pyrolysis);
        } else {
            return "🔧 Advanced Waste Treatment Techniques:\n\n" +
                "♻️ Composting - Aerobic decomposition\n" +
                "💨 Anaerobic Digestion - Biogas generation\n" +
                "🔥 Incineration - Thermal treatment\n" +
                "🏭 Engineered Landfill - Containment\n" +
                "🔄 Material Recycling - Reprocessing\n" +
                "⚗️ Pyrolysis - Thermal breakdown\n\n" +
                "Ask me about any of these techniques!";
        }
    }
    
    // Check for hazardous waste identification
    if (query.includes('hazard') || query.includes('identify') || query.includes('dangerous') || query.includes('toxic')) {
        return "⚠️ <strong>Hazardous Waste Identification:</strong>\n\n" +
            "🧪 Chemical Waste - Cleaners, solvents, paint\n" +
            "🌾 Pesticides - Agricultural chemicals\n" +
            "🔋 Batteries - Contain mercury, lead, lithium\n" +
            "🛢️ Used Oil - Persistent in environment\n" +
            "🏭 Asbestos - Old insulation, roofing\n" +
            "💉 Medical Waste - Sharps, contaminated materials\n" +
            "💡 Fluorescent Bulbs - Contain mercury\n\n" +
            "⚠️ Check for: Corrosivity, Flammability, Reactivity, Toxicity\n\n" +
            "When in doubt, treat it as hazardous!";
    }
    
    // Default response
    return "I'm here to help with waste management questions! Ask me about:\n\n" +
        "• Different waste types and how to identify them\n" +
        "• How long materials take to decompose\n" +
        "• Advanced disposal and treatment techniques\n" +
        "• How to identify hazardous waste\n" +
        "• Environmental impact of different materials\n\n" +
        "What would you like to know?";
}

// Format waste type response
function formatWasteResponse(wasteType) {
    return `${wasteType.icon} <strong>${wasteType.name}</strong>\n\n` +
        `<strong>Description:</strong> ${wasteType.description}\n\n` +
        `<strong>Examples:</strong> ${wasteType.examples}\n\n` +
        `<strong>Decomposition Time:</strong> ${wasteType.decompositionTime}\n\n` +
        `<strong>Disposal Methods:</strong> ${wasteType.disposal}\n\n` +
        `<strong>Advanced Techniques:</strong> ${wasteType.techniques}`;
}

// Format technique response
function formatTechniqueResponse(technique) {
    return `⚙️ <strong>${technique.name}</strong> (${technique.type})\n\n` +
        `<strong>Description:</strong> ${technique.description}\n\n` +
        `<strong>Process:</strong> ${technique.process}\n\n` +
        `<strong>Timeframe:</strong> ${technique.timeframe}\n\n` +
        `<strong>Output/Benefits:</strong> ${technique.output}`;
}

// Add message to chat display
function addMessageToChat(text, sender) {
    const messagesDiv = document.getElementById('chatMessages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const avatar = document.createElement('div');
    avatar.className = `message-avatar ${sender}-avatar`;
    avatar.textContent = sender === 'user' ? '👤' : '🤖';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    // Parse and format HTML content
    content.innerHTML = text.replace(/\n/g, '<br>');
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    messagesDiv.appendChild(messageDiv);
}

// Show typing indicator
function showTypingIndicator() {
    const messagesDiv = document.getElementById('chatMessages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ai';
    messageDiv.id = 'typingIndicator';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar ai-avatar';
    avatar.textContent = '🤖';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerHTML = '<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    messagesDiv.appendChild(messageDiv);
    scrollChatToBottom();
}

// Remove typing indicator
function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

// Scroll chat to bottom
function scrollChatToBottom() {
    const messagesDiv = document.getElementById('chatMessages');
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Update navbar based on login state
    if (typeof updateNavbar === 'function') {
        updateNavbar();
    }
});
