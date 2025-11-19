// DOM Elements
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const generatePassword = document.getElementById('generatePassword');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');
const timeToCrack = document.getElementById('timeToCrack');
const scoreCircle = document.getElementById('scoreCircle');
const scoreValue = document.getElementById('scoreValue');
const scoreDescription = document.getElementById('scoreDescription');

// Criteria elements
const criteria = {
    length: document.getElementById('length'),
    uppercase: document.getElementById('uppercase'),
    lowercase: document.getElementById('lowercase'),
    number: document.getElementById('number'),
    special: document.getElementById('special'),
    noCommon: document.getElementById('noCommon'),
    noSequence: document.getElementById('noSequence'),
    noRepeat: document.getElementById('noRepeat')
};

// Detail elements
const details = {
    length: document.getElementById('lengthDetail'),
    uppercase: document.getElementById('uppercaseDetail'),
    lowercase: document.getElementById('lowercaseDetail'),
    number: document.getElementById('numberDetail'),
    special: document.getElementById('specialDetail'),
    common: document.getElementById('commonDetail'),
    sequence: document.getElementById('sequenceDetail'),
    repeat: document.getElementById('repeatDetail')
};

// Stats elements
const stats = {
    charCount: document.getElementById('charCount'),
    entropy: document.getElementById('entropy'),
    uniqueChars: document.getElementById('uniqueChars'),
    complexity: document.getElementById('complexity')
};

// Common passwords database (expanded)
const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
    'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'iloveyou',
    'princess', 'rockyou', '12345678', 'qwerty123', 'football', 'baseball',
    'dragon', 'master', 'trustno1', 'superman', 'batman', 'shadow',
    'michael', 'jennifer', 'jordan', 'hunter', 'fuckyou', 'soccer',
    'charlie', 'andrew', 'michelle', 'daniel', 'jessica', 'hello',
    'freedom', 'whatever', 'nicole', 'thomas', 'joshua', 'amanda',
    'orange', 'starwars', 'computer', 'michelle', 'maggie', 'jessica'
];

// Sequential patterns
const sequences = [
    'abcdefghijklmnopqrstuvwxyz',
    '0123456789',
    'qwertyuiopasdfghjklzxcvbnm',
    '!@#$%^&*()'
];

// Strength levels (updated for 8 criteria)
const strengthLevels = [
    { min: 0, max: 2, text: 'Very Weak', class: 'very-weak', width: 12.5, description: 'Extremely vulnerable to attacks' },
    { min: 3, max: 3, text: 'Weak', class: 'weak', width: 25, description: 'Easily crackable by basic attacks' },
    { min: 4, max: 4, text: 'Fair', class: 'fair', width: 40, description: 'Moderate security, needs improvement' },
    { min: 5, max: 5, text: 'Good', class: 'good', width: 60, description: 'Good security for most purposes' },
    { min: 6, max: 6, text: 'Strong', class: 'strong', width: 80, description: 'Strong protection against attacks' },
    { min: 7, max: 7, text: 'Very Strong', class: 'very-strong', width: 90, description: 'Excellent security level' },
    { min: 8, max: 8, text: 'Exceptional', class: 'very-strong', width: 100, description: 'Maximum security achieved' }
];

// Password generation characters
const charSets = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

// Calculate password entropy
function calculateEntropy(password) {
    let charsetSize = 0;
    
    if (/[a-z]/.test(password)) charsetSize += 26;
    if (/[A-Z]/.test(password)) charsetSize += 26;
    if (/\d/.test(password)) charsetSize += 10;
    if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32;
    
    return Math.log2(Math.pow(charsetSize, password.length));
}

// Calculate time to crack
function calculateTimeToCrack(entropy) {
    const attemptsPerSecond = 1e9; // 1 billion attempts per second
    const secondsToCrack = Math.pow(2, entropy - 1) / attemptsPerSecond;
    
    if (secondsToCrack < 1) return 'Instantly';
    if (secondsToCrack < 60) return `${Math.round(secondsToCrack)} seconds`;
    if (secondsToCrack < 3600) return `${Math.round(secondsToCrack / 60)} minutes`;
    if (secondsToCrack < 86400) return `${Math.round(secondsToCrack / 3600)} hours`;
    if (secondsToCrack < 31536000) return `${Math.round(secondsToCrack / 86400)} days`;
    if (secondsToCrack < 31536000000) return `${Math.round(secondsToCrack / 31536000)} years`;
    return 'Centuries';
}

// Check for sequential patterns
function hasSequentialPattern(password) {
    const lower = password.toLowerCase();
    
    for (let seq of sequences) {
        for (let i = 0; i <= seq.length - 3; i++) {
            const pattern = seq.substring(i, i + 3);
            const reversePattern = pattern.split('').reverse().join('');
            
            if (lower.includes(pattern) || lower.includes(reversePattern)) {
                return true;
            }
        }
    }
    
    // Check for numeric sequences
    for (let i = 0; i < password.length - 2; i++) {
        const char1 = password.charCodeAt(i);
        const char2 = password.charCodeAt(i + 1);
        const char3 = password.charCodeAt(i + 2);
        
        if ((char2 === char1 + 1 && char3 === char2 + 1) || 
            (char2 === char1 - 1 && char3 === char2 - 1)) {
            return true;
        }
    }
    
    return false;
}

// Check for repeated characters
function hasRepeatedChars(password) {
    const maxRepeats = Math.floor(password.length * 0.3); // Allow up to 30% repetition
    const charCount = {};
    
    for (let char of password) {
        charCount[char] = (charCount[char] || 0) + 1;
        if (charCount[char] > maxRepeats && password.length > 3) {
            return true;
        }
    }
    
    // Check for consecutive repeated characters
    for (let i = 0; i < password.length - 2; i++) {
        if (password[i] === password[i + 1] && password[i + 1] === password[i + 2]) {
            return true;
        }
    }
    
    return false;
}

// Count character types
function countCharTypes(password) {
    return {
        uppercase: (password.match(/[A-Z]/g) || []).length,
        lowercase: (password.match(/[a-z]/g) || []).length,
        numbers: (password.match(/\d/g) || []).length,
        special: (password.match(/[^a-zA-Z0-9]/g) || []).length,
        unique: new Set(password).size
    };
}

// Check all criteria
function checkCriteria(password) {
    const counts = countCharTypes(password);
    const entropy = calculateEntropy(password);
    
    const checks = {
        length: password.length >= 8,
        uppercase: counts.uppercase > 0,
        lowercase: counts.lowercase > 0,
        number: counts.numbers > 0,
        special: counts.special > 0,
        noCommon: !commonPasswords.includes(password.toLowerCase()),
        noSequence: !hasSequentialPattern(password),
        noRepeat: !hasRepeatedChars(password)
    };

    // Update details
    details.length.textContent = `${password.length} chars`;
    details.uppercase.textContent = `${counts.uppercase} found`;
    details.lowercase.textContent = `${counts.lowercase} found`;
    details.number.textContent = `${counts.numbers} found`;
    details.special.textContent = `${counts.special} found`;
    details.common.textContent = checks.noCommon ? 'Unique' : 'Common';
    details.sequence.textContent = checks.noSequence ? 'None found' : 'Found';
    details.repeat.textContent = checks.noRepeat ? 'Acceptable' : 'Too many';

    // Update stats
    stats.charCount.textContent = password.length;
    stats.entropy.textContent = Math.round(entropy);
    stats.uniqueChars.textContent = counts.unique;
    stats.complexity.textContent = Math.round((Object.values(checks).filter(Boolean).length / 8) * 100) + '%';

    let score = 0;
    
    Object.keys(checks).forEach(key => {
        const criterion = criteria[key];
        const icon = criterion.querySelector('.icon i');
        
        if (checks[key]) {
            criterion.classList.add('met');
            icon.className = 'fas fa-check';
            score++;
        } else {
            criterion.classList.remove('met');
            icon.className = 'fas fa-times';
        }
    });

    return { score, entropy, counts };
}

// Update strength meter and score
function updateStrengthMeter(score, entropy) {
    const level = strengthLevels.find(l => score >= l.min && score <= l.max);
    
    strengthBar.className = 'strength-bar ' + level.class;
    strengthBar.style.width = level.width + '%';
    strengthText.textContent = level.text;
    strengthText.className = 'strength-text ' + level.class;
    
    // Update circular progress
    const percentage = (score / 8) * 100;
    const degrees = (percentage / 100) * 360;
    scoreCircle.style.background = `conic-gradient(#667eea ${degrees}deg, #e2e8f0 ${degrees}deg)`;
    
    scoreValue.textContent = score;
    scoreDescription.textContent = level.description;
    
    // Update time to crack
    const timeText = calculateTimeToCrack(entropy);
    timeToCrack.innerHTML = `<i class="fas fa-clock"></i><span>Time to crack: <strong>${timeText}</strong></span>`;
}

// Generate secure password
function generateSecurePassword() {
    const length = 16;
    let password = '';
    const allChars = Object.values(charSets).join('');
    
    // Ensure at least one character from each set
    password += getRandomChar(charSets.lowercase);
    password += getRandomChar(charSets.uppercase);
    password += getRandomChar(charSets.numbers);
    password += getRandomChar(charSets.symbols);
    
    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
        password += getRandomChar(allChars);
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
}

function getRandomChar(charset) {
    return charset.charAt(Math.floor(Math.random() * charset.length));
}

// Event listeners
passwordInput.addEventListener('input', function() {
    const password = this.value;
    
    if (password === '') {
        // Reset everything
        Object.values(criteria).forEach(criterion => {
            criterion.classList.remove('met');
            criterion.querySelector('.icon i').className = 'fas fa-times';
        });
        
        Object.values(details).forEach(detail => {
            detail.textContent = '0 found';
        });
        details.common.textContent = 'Checking...';
        details.sequence.textContent = 'Checking...';
        details.repeat.textContent = 'Checking...';
        
        strengthBar.style.width = '0%';
        strengthBar.className = 'strength-bar';
        strengthText.textContent = 'Enter a password to analyze';
        strengthText.className = 'strength-text';
        
        scoreCircle.style.background = 'conic-gradient(#667eea 0deg, #e2e8f0 0deg)';
        scoreValue.textContent = '0';
        scoreDescription.textContent = 'Enter a password to get started';
        
        stats.charCount.textContent = '0';
        stats.entropy.textContent = '0';
        stats.uniqueChars.textContent = '0';
        stats.complexity.textContent = '0%';
        
        timeToCrack.innerHTML = '<i class="fas fa-clock"></i><span>Time to crack: <strong>Unknown</strong></span>';
        return;
    }
    
    const result = checkCriteria(password);
    updateStrengthMeter(result.score, result.entropy);
});

togglePassword.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    const icon = this.querySelector('i');
    icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
});

generatePassword.addEventListener('click', function() {
    const newPassword = generateSecurePassword();
    passwordInput.value = newPassword;
    passwordInput.dispatchEvent(new Event('input'));
    
    // Add animation effect
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = 'scale(1)';
    }, 150);
});

// Initialize
passwordInput.dispatchEvent(new Event('input'));

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Animate criteria on load
    const criteriaElements = document.querySelectorAll('.criterion');
    criteriaElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        setTimeout(() => {
            el.style.transition = 'all 0.5s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });
});