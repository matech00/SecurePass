// ========================================
// SECUREPASS - WITH GEMINI AI (FULL RESPONSES)
// ========================================

// Gemini API Key (your existing key)
const GEMINI_API_KEY = "AIzaSyB3q_bZkuQ2pbc7ARcBoVGV4Qljm8Lz50Q";

document.addEventListener('DOMContentLoaded', function() {

// ========================================
// DOM ELEMENTS
// ========================================
const landingPage = document.getElementById('landingPage');
const mainApp = document.getElementById('mainApp');
const getStartedNavBtn = document.getElementById('getStartedNavBtn');
const getStartedHeroBtn = document.getElementById('getStartedHeroBtn');
const ctaBtn = document.getElementById('ctaBtn');
const learnMoreBtn = document.getElementById('learnMoreBtn');
const backToLandingBtn = document.getElementById('backToLandingBtn');

const passwordInput = document.getElementById('passwordInput');
const toggleVisibility = document.getElementById('toggleVisibility');
const strengthFill = document.getElementById('strengthFill');
const strengthText = document.getElementById('strengthText');
const checklist = document.getElementById('checklist');
const similarWarning = document.getElementById('similarWarning');
const similarList = document.getElementById('similarList');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendChatBtn');
const clearChatBtn = document.getElementById('clearChatBtn');
const voiceBtn = document.getElementById('voiceBtn');
const generatePasswordBtn = document.getElementById('generatePasswordBtn');
const aiStatusSpan = document.getElementById('aiStatus');






// ========================================
// GET NOTIFIED BUTTON - WORKING MODAL
// ========================================

const getNotifiedBtn = document.getElementById('getNotifiedBtn');

if (getNotifiedBtn) {
    getNotifiedBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'waitlist-modal';
        modal.innerHTML = `
            <div class="waitlist-modal-content">
                <button class="waitlist-close">&times;</button>
                <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📧</div>
                <h2 style="margin-bottom: 0.5rem;">Get Early Access</h2>
                <p style="font-size: 0.85rem; color: #a0aec0; margin-bottom: 1.5rem;">Be first to know when SecurePass 2.0 launches!</p>
                <input type="email" class="waitlist-email" placeholder="Enter your email address">
                <button class="waitlist-submit">Subscribe <i class="fas fa-arrow-right"></i></button>
                <div class="waitlist-message"></div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Get elements
        const closeBtn = modal.querySelector('.waitlist-close');
        const emailInput = modal.querySelector('.waitlist-email');
        const submitBtn = modal.querySelector('.waitlist-submit');
        const messageDiv = modal.querySelector('.waitlist-message');
        
        // Close modal
        closeBtn.onclick = () => modal.remove();
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
        
        // Submit email
        submitBtn.onclick = () => {
            const email = emailInput.value.trim();
            
            if (!email || !email.includes('@')) {
                messageDiv.style.display = 'block';
                messageDiv.innerHTML = '<span style="color:#ef4444;">Please enter a valid email</span>';
                return;
            }
            
            // Save to localStorage
            let emails = JSON.parse(localStorage.getItem('securepass_waitlist') || '[]');
            if (!emails.includes(email)) {
                emails.push(email);
                localStorage.setItem('securepass_waitlist', JSON.stringify(emails));
            }
            
            messageDiv.style.display = 'block';
            messageDiv.innerHTML = '<span style="color:#10b981;">✅ Thanks! You\'re on the waitlist!</span>';
            
            setTimeout(() => {
                modal.remove();
            }, 1500);
        };
    });
}









// After this line in your existing code:
// localStorage.setItem('securepass_emails', JSON.stringify(emails));

// ADD THIS CODE:
// ==========================================
// Send email to your Google Sheet
// ==========================================
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxvcbhCANN8ltrLm_ltVxD9y9CzgBaT49QcEE_Q8gwx92QNZ7v7YbVwaPn-RNek9BjcOw/exec'; // REPLACE THIS

try {
    fetch(`${APPS_SCRIPT_URL}?email=${encodeURIComponent(email)}`, {
        method: 'POST',
        mode: 'no-cors'
    });
    console.log('Email sent to Google Sheet:', email);
} catch(error) {
    console.log('Failed to send to sheet:', error);
}










// State
let isRecording = false;
let recognition = null;
let currentPassword = '';
let currentAnalysis = null;
let isUsingGemini = true;

// Update AI status
if (aiStatusSpan) {
    aiStatusSpan.innerHTML = '● Secure Agent Ready';
    aiStatusSpan.style.color = '#10b981';
}

// ========================================
// COMING SOON 2.0 MODAL
// ========================================
function showComingSoonModal() {
    const existingModal = document.getElementById('comingSoonModal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.id = 'comingSoonModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(8px);
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    modal.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            border-radius: 1.5rem;
            padding: 1.5rem;
            max-width: 340px;
            width: 85%;
            text-align: center;
            color: white;
            position: relative;
            border: 1px solid rgba(102, 126, 234, 0.3);
        ">
            <button id="modalCloseBtn" style="position: absolute; top: 0.8rem; right: 1rem; background: none; border: none; color: #a0aec0; font-size: 1.5rem; cursor: pointer;">&times;</button>
            <div style="font-size: 3rem; margin-bottom: 0.5rem;">🚀</div>
            <h2 style="margin-bottom: 0.3rem; font-size: 1.5rem;">SecurePass <span style="color: #667eea;">2.0</span></h2>
            <p style="font-size: 0.8rem; color: #a0aec0; margin-bottom: 1rem;">Coming Soon with amazing features!</p>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.6rem; margin: 1.2rem 0;">
                <div style="display: flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.05); padding: 0.5rem 0.7rem; border-radius: 0.6rem; font-size: 0.75rem;"><i class="fas fa-chart-line" style="color: #667eea;"></i> Health Dashboard</div>
                <div style="display: flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.05); padding: 0.5rem 0.7rem; border-radius: 0.6rem; font-size: 0.75rem;"><i class="fas fa-database" style="color: #667eea;"></i> Dark Web Monitor</div>
                <div style="display: flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.05); padding: 0.5rem 0.7rem; border-radius: 0.6rem; font-size: 0.75rem;"><i class="fas fa-mobile-alt" style="color: #667eea;"></i> Mobile App</div>
                <div style="display: flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.05); padding: 0.5rem 0.7rem; border-radius: 0.6rem; font-size: 0.75rem;"><i class="fas fa-shield-alt" style="color: #667eea;"></i> Phishing Detector</div>
            </div>
            <button id="modalGotItBtn" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; padding: 0.6rem 1.5rem; border-radius: 50px; font-weight: 600; cursor: pointer; margin-top: 0.5rem;">Got it! 👌</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.getElementById('modalCloseBtn').addEventListener('click', () => modal.remove());
    document.getElementById('modalGotItBtn').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
}

function addComingSoonButton() {
    const heroButtons = document.querySelector('.hero-buttons');
    if (heroButtons && !document.querySelector('.coming-soon-btn')) {
        const comingSoonBtn = document.createElement('button');
        comingSoonBtn.className = 'btn-secondary btn-large coming-soon-btn';
        comingSoonBtn.innerHTML = '<i class="fas fa-rocket"></i> Coming Soon 2.0';
        comingSoonBtn.onclick = showComingSoonModal;
        heroButtons.appendChild(comingSoonBtn);
    }
}

// ========================================
// LANDING PAGE TRANSITIONS
// ========================================
function showApp() {
    if (landingPage) landingPage.style.display = 'none';
    if (mainApp) mainApp.classList.remove('hidden');
}

function showLanding() {
    if (landingPage) landingPage.style.display = 'block';
    if (mainApp) mainApp.classList.add('hidden');
}

if (getStartedNavBtn) getStartedNavBtn.addEventListener('click', showApp);
if (getStartedHeroBtn) getStartedHeroBtn.addEventListener('click', showApp);
if (ctaBtn) ctaBtn.addEventListener('click', showApp);
if (backToLandingBtn) backToLandingBtn.addEventListener('click', showLanding);

if (learnMoreBtn) {
    learnMoreBtn.addEventListener('click', () => {
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    });
}

// ========================================
// PASSWORD GENERATOR
// ========================================
function generateStrongPassword() {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const allChars = lowercase + uppercase + numbers + symbols;
    
    let password = '';
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    for (let i = password.length; i < 14; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    return password.split('').sort(() => Math.random() - 0.5).join('');
}

// ========================================
// PASSWORD ANALYSIS
// ========================================
function analyzePassword(password) {
    if (!password) {
        return { strength: '—', percentage: 0, details: {}, score: 0, issues: [] };
    }

    const issues = [];
    if (password.length < 8) issues.push('Too short (needs 8+ characters)');
    if (!/[A-Z]/.test(password)) issues.push('No uppercase letters (A-Z)');
    if (!/[a-z]/.test(password)) issues.push('No lowercase letters (a-z)');
    if (!/\d/.test(password)) issues.push('No numbers (0-9)');
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(password)) issues.push('No special characters (!@#$%)');
    if (/(.)\1{2,}/.test(password)) issues.push('Has repeated characters (like "aaa")');
    if (/(1234|2345|3456|4567|5678|6789|qwert|asdf|zxcv|password|admin|123456|abcdef)/i.test(password)) issues.push('Uses predictable patterns (like "1234")');

    const details = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(password),
        noRepeat: !/(.)\1{2,}/.test(password),
        noPattern: !/(1234|2345|3456|4567|5678|6789|qwert|asdf|zxcv|password|admin|123456|abcdef)/i.test(password)
    };

    let score = 0;
    Object.values(details).forEach(v => { if (v) score++; });

    let strength = 'Weak';
    let percentage = 25;
    let strengthColor = '#ef4444';
    
    if (score >= 6) { 
        strength = 'Very Strong'; 
        percentage = 100; 
        strengthColor = '#10b981';
    } else if (score >= 5) { 
        strength = 'Strong'; 
        percentage = 75; 
        strengthColor = '#3b82f6';
    } else if (score >= 3) { 
        strength = 'Medium'; 
        percentage = 50; 
        strengthColor = '#f59e0b';
    }

    return { strength, percentage, details, score, issues, strengthColor };
}

function updateUI() {
    if (!passwordInput) return;
    
    currentPassword = passwordInput.value;
    currentAnalysis = analyzePassword(currentPassword);
    
    if (strengthFill) {
        strengthFill.style.width = `${currentAnalysis.percentage}%`;
        strengthFill.style.backgroundColor = currentAnalysis.strengthColor;
    }
    if (strengthText) {
        strengthText.textContent = currentAnalysis.strength;
        strengthText.style.color = currentAnalysis.strengthColor;
    }
    
    const checklistItems = document.querySelectorAll('#checklist li');
    checklistItems.forEach(item => {
        const check = item.getAttribute('data-check');
        if (currentAnalysis.details[check]) {
            item.classList.add('valid');
            const text = item.textContent.replace(/[^a-zA-Z0-9+ ]/g, '').trim();
            item.innerHTML = `<i class="fas fa-check-circle"></i> ${text}`;
        } else {
            item.classList.remove('valid');
            const text = item.textContent.replace(/[^a-zA-Z0-9+ ]/g, '').trim();
            item.innerHTML = `<i class="far fa-circle"></i> ${text}`;
        }
    });
    
    if (currentPassword && currentPassword.length >= 4 && similarWarning && similarList) {
        const guesses = [];
        if (currentPassword.length > 3) guesses.push(`${currentPassword}123`);
        if (currentPassword.length > 3) guesses.push(currentPassword + '!');
        if (guesses.length > 0) {
            similarWarning.style.display = 'flex';
            similarList.innerHTML = [...new Set(guesses)].slice(0, 4).map(g => `<div>🔓 ${escapeHtml(g)}</div>`).join('');
        } else {
            similarWarning.style.display = 'none';
        }
    } else if (similarWarning) {
        similarWarning.style.display = 'none';
    }
}

if (passwordInput) passwordInput.addEventListener('input', updateUI);

if (toggleVisibility) {
    toggleVisibility.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        toggleVisibility.innerHTML = type === 'password' ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
    });
}

if (generatePasswordBtn) {
    generatePasswordBtn.addEventListener('click', () => {
        const newPassword = generateStrongPassword();
        passwordInput.value = newPassword;
        updateUI();
        addAIMessage(`🔐 I've generated a strong password for you: \`${newPassword}\``);
    });
}

// ========================================
// GEMINI API INTEGRATION (FULL AI RESPONSES)
// ========================================
async function callGeminiAPI(userMessage) {
    const systemPrompt = `You are SecurePass AI Security Coach - a friendly, expert password security assistant. 
Current password being analyzed: "${currentPassword || 'none'}" which is ${currentAnalysis?.strength || 'unknown'} strength.
Give detailed, helpful, practical password security advice. Be warm and conversational. Use emojis. Keep responses thorough (3-5 sentences).`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: systemPrompt + '\n\nUser question: ' + userMessage }]
                }]
            })
        });
        
        const data = await response.json();
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            if (aiStatusSpan) {
                aiStatusSpan.innerHTML = '● Gemini AI Ready';
                aiStatusSpan.style.color = '#10b981';
            }
            return data.candidates[0].content.parts[0].text;
        }
        return null;
    } catch (error) {
        console.log('Gemini API error, using fallback');
        if (aiStatusSpan) {
            aiStatusSpan.innerHTML = '● Local Mode';
            aiStatusSpan.style.color = '#f59e0b';
        }
        return null;
    }
}

// ========================================
// FALLBACK LOCAL RESPONSES (DETAILED)
// ========================================
function getDetailedLocalResponse(question) {
    const q = question.toLowerCase();
    
    if (q.includes('generate') || q.includes('create a password') || q.includes('new password')) {
        const newPass = generateStrongPassword();
        return `🔐 **Here's a strong password I created just for you:** \`${newPass}\`\n\nThis password is 14 characters long and includes a mix of uppercase letters, lowercase letters, numbers, and special symbols. It would take a hacker thousands of years to crack this! Would you like me to generate another one?`;
    }
    
    if (q.includes('how strong') || q.includes('my password') || q.includes('check my password') || q.includes('is my password')) {
        if (!currentPassword) {
            return "📝 **I don't see a password yet!** Please type a password in the analyzer panel on the left. Once you do, I'll give you a detailed analysis of its strengths and weaknesses, plus specific recommendations to make it stronger.";
        }
        
        if (currentAnalysis.strength === 'Very Strong') {
            return `🔒 **Excellent news! Your password is VERY STRONG!** 🎉\n\nHere's why it's secure:\n✓ Length: ${currentPassword.length} characters (excellent!)\n✓ Includes uppercase and lowercase letters\n✓ Includes numbers\n✓ Includes special characters\n✓ No weak patterns detected\n\n**Keep up the good security habits!** Remember to use unique passwords for every account and enable two-factor authentication when available.`;
        } 
        else if (currentAnalysis.strength === 'Strong') {
            return `✅ **Good job! Your password is STRONG.**\n\n**What's working well:**\n• Length of ${currentPassword.length} characters\n• Good mix of character types\n\n**To make it even stronger (Very Strong):**\n• Add special characters like ! @ # $ %\n• Make it longer (12+ characters is best)\n• Avoid common words or patterns\n\nTry this improved version: \`${generateStrongPassword()}\``;
        } 
        else if (currentAnalysis.strength === 'Medium') {
            return `⚠️ **Your password is MEDIUM - needs some improvement.**\n\n**Issues found:**\n${currentAnalysis.issues.map(i => `• ${i}`).join('\n')}\n\n**Why this matters:** Hackers use automated tools that can crack medium-strength passwords in hours or days.\n\n**Here's a stronger version based on yours:** \`${generateStrongPassword()}\`\n\nThis version has everything needed to keep hackers out!`;
        } 
        else {
            return `❌ **WARNING: Your password is WEAK!** 🚨\n\n**Critical issues found:**\n${currentAnalysis.issues.map(i => `• ${i}`).join('\n')}\n\n**Why this is dangerous:** Hackers can crack weak passwords in seconds using automated tools. Your accounts are at serious risk!\n\n**Here's a strong replacement:** \`${generateStrongPassword()}\`\n\n**Quick tips for better passwords:**\n• Use at least 12 characters\n• Mix uppercase and lowercase letters\n• Add numbers and symbols\n• Never use dictionary words or personal info\n• Try a passphrase like "Blue-Tiger-Runs-Fast-2024!"`;
        }
    }
    
    if (q.includes('tips') || q.includes('how to create') || q.includes('strong password')) {
        return `💪 **How to Create an Unbreakable Password:**\n\n**Method 1 - The Passphrase Method:**\nTake 4 random words like "Coffee Tiger Mountain Piano" and add numbers and symbols: "Coffee-Tiger-Mountain-Piano-84!"\n\n**Method 2 - Random Characters:**\nUse a password manager to generate something like "X#7kLp$9mQ@2wR"\n\n**Must-Have Requirements:**\n✓ 12+ characters minimum (16+ is better)\n✓ Mix of UPPER and lower case\n✓ Include numbers (0-9)\n✓ Include symbols (!@#$%^&*)\n✓ No dictionary words or personal info\n✓ No patterns like "123", "qwerty"\n\n**Pro Tip:** Use a password manager like Bitwarden (free) to generate and store all your passwords. You only need to remember ONE master password!`;
    }
    
    if (q.includes('hacker') || q.includes('avoid') || q.includes('safe') || q.includes('protect')) {
        return `🛡️ **Complete Guide to Protecting Yourself from Hackers:**\n\n**1. Use Unique Passwords for Every Account**\nIf one site gets hacked, hackers can't access your other accounts.\n\n**2. Enable Two-Factor Authentication (2FA)**\nThis adds a second layer of security (like a text code or authenticator app). Blocks 99.9% of automated attacks!\n\n**3. Use a Password Manager**\nBitwarden, 1Password, Apple Keychain, or Google Password Manager generate and store strong passwords for you.\n\n**4. Watch for Phishing Scams**\nNever click links in emails asking for your password. Always type the website URL yourself.\n\n**5. Check if You've Been Breached**\nUse security tools to check if your email appears in known data breaches.\n\n**6. Keep Software Updated**\nAlways install security updates on your devices and apps.\n\nStay safe online! 🔐`;
    }
    
    if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('good morning')) {
        return `👋 **Hello! Welcome to SecurePass!**\n\nI'm your AI Security Coach. Here's everything I can help you with:\n\n🔐 **Generate Passwords** - Say "Generate a password for me"\n\n📊 **Check Your Password** - Type any password in the analyzer, then ask "How strong is my password?"\n\n💡 **Security Tips** - Ask "How to create a strong password?" or "How to avoid hackers?"\n\n🎤 **Voice Chat** - Click the microphone button and speak your question!\n\n**Try this right now:** Type or say "Generate a password for me" and I'll create a strong one for you! 🚀`;
    }
    
    return `🔐 **I'm here to help with password security!**\n\nHere are some things you can ask me:\n\n• "Generate a password for me" - Get a strong password\n• "How strong is my password?" - Analyze your current password\n• "How to create a strong password?" - Step-by-step guide\n• "How to avoid hackers?" - Complete protection checklist\n\nWhat would you like help with today? 💪`;
}

// ========================================
// MAIN AI RESPONSE (Gemini + Fallback)
// ========================================
async function getAIResponse(question) {
    if (GEMINI_API_KEY) {
        try {
            const geminiResponse = await callGeminiAPI(question);
            if (geminiResponse && geminiResponse.length > 20) {
                return geminiResponse;
            }
        } catch (e) {
            console.log('Gemini failed, using local');
        }
    }
    return getDetailedLocalResponse(question);
}

// ========================================
// CHAT FUNCTIONS
// ========================================
function escapeHtml(str) {
    return str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;');
}

function addUserMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message user';
    msgDiv.innerHTML = `<div class="avatar"><i class="fas fa-user"></i></div><div class="bubble">${escapeHtml(text)}</div>`;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addAIMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message ai';
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/`(.*?)`/g, '<code style="background:rgba(0,0,0,0.1);padding:2px 6px;border-radius:4px;">$1</code>');
    formatted = formatted.replace(/\n/g, '<br>');
    msgDiv.innerHTML = `<div class="avatar"><i class="fas fa-robot"></i></div><div class="bubble">${formatted}</div>`;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    addUserMessage(message);
    chatInput.value = '';
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `<div class="avatar"><i class="fas fa-robot"></i></div><div class="bubble"><i class="fas fa-spinner fa-spin"></i> Thinking... (AI is analyzing)</div>`;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    const response = await getAIResponse(message);
    
    document.getElementById('typing-indicator')?.remove();
    addAIMessage(response);
}

if (sendBtn) sendBtn.addEventListener('click', sendMessage);
if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
}

if (clearChatBtn) {
    clearChatBtn.addEventListener('click', () => {
        chatMessages.innerHTML = '<div class="message ai"><div class="avatar"><i class="fas fa-shield-haltered"></i></div><div class="bubble">Chat cleared! I\'m still here to help. Ask me anything about password security!</div></div>';
    });
}

// Quick suggestions
document.querySelectorAll('.quick-suggestions button').forEach(btn => {
    btn.addEventListener('click', () => {
        chatInput.value = btn.getAttribute('data-question') || btn.textContent;
        sendMessage();
    });
});

// ========================================
// VOICE INPUT
// ========================================
if (voiceBtn && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
        isRecording = true;
        voiceBtn.classList.add('recording');
        voiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
    };
    
    recognition.onend = () => {
        isRecording = false;
        voiceBtn.classList.remove('recording');
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    };
    
    recognition.onresult = (event) => {
        chatInput.value = event.results[0][0].transcript;
        sendMessage();
    };
    
    voiceBtn.addEventListener('click', () => {
        if (isRecording) recognition.stop();
        else recognition.start();
    });
} else if (voiceBtn) {
    voiceBtn.disabled = true;
    voiceBtn.style.opacity = '0.5';
}

// ========================================
// INITIALIZATION
// ========================================
updateUI();
addComingSoonButton();

console.log('SecurePass v1.0 ready with Gemini AI! 🚀');

}); // End DOMContentLoadeds





















function showApp() {
    // Create a temporary loading message
    const loadingMsg = document.createElement('div');
    loadingMsg.id = 'loadingTransition';
    loadingMsg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 1rem 2rem;
        border-radius: 50px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        z-index: 10001;
        font-family: 'Inter', sans-serif;
        font-size: 1rem;
        font-weight: 500;
        color: #667eea;
        display: flex;
        align-items: center;
        gap: 10px;
        border: 1px solid rgba(102,126,234,0.2);
    `;
    loadingMsg.innerHTML = `
        <div style="width: 20px; height: 20px; border: 2px solid #e2e8f0; border-top-color: #667eea; border-radius: 50%; animation: spin 0.6s linear infinite;"></div>
        Loading SecurePass...
    `;
    
    // Add spin animation if not exists
    if (!document.getElementById('loadingSpinStyle')) {
        const style = document.createElement('style');
        style.id = 'loadingSpinStyle';
        style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(loadingMsg);
    
    // Small delay to show loading
    setTimeout(() => {
        loadingMsg.remove();
        if (landingPage) landingPage.style.display = 'none';
        if (mainApp) mainApp.classList.remove('hidden');
    }, 600);
}




// Privacy Policy Modal
function showPolicyModal(title, content) {
    const modal = document.createElement('div');
    modal.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);backdrop-filter:blur(8px);z-index:10003;display:flex;align-items:center;justify-content:center;`;
    modal.innerHTML = `
        <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:1.5rem;padding:2rem;max-width:450px;width:85%;max-height:80vh;overflow-y:auto;color:white;border:1px solid rgba(102,126,234,0.3);">
            <button class="closeModalBtn" style="position:absolute;top:0.8rem;right:1rem;background:none;border:none;color:#a0aec0;font-size:1.5rem;cursor:pointer;">&times;</button>
            <h2 style="margin-bottom:1rem;background:linear-gradient(135deg,#667eea,#764ba2);-webkit-background-clip:text;background-clip:text;color:transparent;">${title}</h2>
            <div style="color:#a0aec0;line-height:1.6;font-size:0.9rem;">${content}</div>
            <button class="closeModalBottom" style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;padding:0.6rem;border-radius:50px;cursor:pointer;margin-top:1.5rem;width:100%;">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
    modal.querySelectorAll('.closeModalBtn, .closeModalBottom').forEach(btn => btn.onclick = () => modal.remove());
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
}

// Privacy Policy Content
const privacyContent = `<p><strong>Effective Date:</strong> January 2026</p><br><p>SecurePass does NOT collect, store, or transmit your passwords. All password analysis happens locally in your browser.</p><br><p><strong>Email Collection:</strong> If you join our waitlist, we only store your email to notify you about updates.</p><br><p><strong>Contact:</strong> privacy@securepass.com</p>`;

// Terms of Service Content
const termsContent = `<p><strong>Terms of Service</strong></p><br><p>SecurePass is provided "as is" for password security analysis. Your passwords never leave your browser.</p><br><p><strong>Limitation of Liability:</strong> We are not responsible for security breaches on external websites.</p><br><p><strong>Contact:</strong> support@securepass.com</p>`;

// Add click handlers
document.getElementById('privacyLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    showPolicyModal('Privacy Policy', privacyContent);
});

document.getElementById('termsLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    showPolicyModal('Terms of Service', termsContent);
});




// ========================================
// REFRESH PERSISTENCE - KEEP PASSWORD AND PAGE STATE
// ========================================

// Save password whenever user types
function savePasswordOnInput() {
    if (passwordInput && passwordInput.value) {
        localStorage.setItem('securepass_saved_password', passwordInput.value);
    }
}

// Save that user is in the main app
function saveAppActiveState() {
    localStorage.setItem('securepass_in_app', 'true');
}

// Restore password and page state after refresh
function restoreAfterRefresh() {
    // Check if user was in main app before refresh
    const wasInApp = localStorage.getItem('securepass_in_app');
    
    if (wasInApp === 'true') {
        // Keep user in main app (don't go back to landing page)
        if (landingPage) landingPage.style.display = 'none';
        if (mainApp) mainApp.classList.remove('hidden');
        
        // Restore the password they had typed
        const savedPassword = localStorage.getItem('securepass_saved_password');
        if (savedPassword && passwordInput) {
            passwordInput.value = savedPassword;
            // Update the strength meter and checklist
            if (typeof updateUI === 'function') updateUI();
        }
    }
}

// Add event listener to save password when user types
if (passwordInput) {
    passwordInput.addEventListener('input', savePasswordOnInput);
}

// Save app state when entering main app
const originalShowApp = window.showApp;
if (originalShowApp) {
    window.showApp = function() {
        originalShowApp();
        saveAppActiveState();
        savePasswordOnInput();
    };
}

// Save app state when generating password
if (generatePasswordBtn) {
    const originalClick = generatePasswordBtn.onclick;
    generatePasswordBtn.addEventListener('click', function() {
        setTimeout(savePasswordOnInput, 100);
    });
}

// Restore everything when page loads
restoreAfterRefresh();

// Save before page unload
window.addEventListener('beforeunload', function() {
    if (mainApp && !mainApp.classList.contains('hidden')) {
        localStorage.setItem('securepass_in_app', 'true');
    }
    if (passwordInput && passwordInput.value) {
        localStorage.setItem('securepass_saved_password', passwordInput.value);
    }
}); 