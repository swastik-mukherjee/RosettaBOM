/**
 * RosettaBOM Website Demo
 * Interactive tokenizer demonstration
 */

// Simulated vocabulary and tokenizer for demo
// In real implementation, this would load from your tokenizer
const DEMO_VOCAB = {
    '[UNK]': 0, '[START]': 1, '[END]': 2, '[PAD]': 3,
    'log4j': 8, 'core': 12, 'spring': 15, 'boot': 18,
    'org': 20, 'apache': 22, 'logging': 25, 'junit': 28,
    'pkg': 30, 'maven': 32, 'npm': 35, 'pypi': 38,
    '2': 40, '14': 42, '1': 44, '5': 46, '0': 48,
    'react': 50, 'django': 52, 'com': 55, 'io': 58,
    'netty': 60, 'hibernate': 62, 'jackson': 65,
    'databind': 68, 'fasterxml': 70, 'springframework': 72,
    // ADD THESE NEW TOKENS:
    'angular': 75, 'nginx': 78, 'alpine': 80, 'rails': 82,
    'gem': 84, '21': 86, '3': 88, '7': 90
};

const ID_TO_TOKEN = Object.fromEntries(
    Object.entries(DEMO_VOCAB).map(([token, id]) => [id, token])
);

class DemoTokenizer {
    tokenize(text) {
        // Simple tokenization for demo
        return text.split(/[\s\-:\.@\/]+/).filter(token => token.length > 0);
    }
    
    encode(text) {
        const tokens = this.tokenize(text);
        const ids = tokens.map(token => DEMO_VOCAB[token] || DEMO_VOCAB['[UNK]']);
        
        return {
            input: text,
            tokens: tokens,
            ids: ids,
            length: ids.length
        };
    }
    
    decode(tokenIds) {
        const tokens = tokenIds.map(id => ID_TO_TOKEN[id] || '[UNK]');
        const text = this.reconstructText(tokens);
        
        return {
            ids: tokenIds,
            tokens: tokens,
            text: text
        };
    }
    
    reconstructText(tokens) {
        // Smart reconstruction based on patterns
        let result = '';
        
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            const nextToken = tokens[i + 1];
            
            result += token;
            
            if (nextToken) {
                if (this.needsSeparator(token, nextToken)) {
                    result += this.getSeparator(token, nextToken);
                }
            }
        }
        
        return result;
    }
    
    needsSeparator(currentToken, nextToken) {
        // Simple separator logic for demo
        return true;
    }
    
    getSeparator(currentToken, nextToken) {
        // Determine appropriate separator
        if (['org', 'com', 'io'].includes(currentToken)) {
            return '.';
        }
        if (['apache', 'springframework', 'fasterxml'].includes(currentToken)) {
            return ':';
        }
        if (['pkg'].includes(currentToken)) {
            return ':';
        }
        if (['maven', 'npm', 'pypi'].includes(currentToken)) {
            return '/';
        }
        if (['2', '14', '5'].includes(currentToken) && ['14', '1', '0'].includes(nextToken)) {
            return '.';
        }
        return '-';
    }
    
    testRoundTrip(text) {
        const encoded = this.encode(text);
        const decoded = this.decode(encoded.ids);
        
        return {
            original: text,
            encoded: encoded,
            decoded: decoded,
            success: this.calculateSimilarity(text, decoded.text) > 0.8,
            similarity: this.calculateSimilarity(text, decoded.text)
        };
    }
    
    calculateSimilarity(text1, text2) {
        if (text1 === text2) return 1.0;
        
        // Simple similarity calculation
        const maxLength = Math.max(text1.length, text2.length);
        const minLength = Math.min(text1.length, text2.length);
        
        let matches = 0;
        for (let i = 0; i < minLength; i++) {
            if (text1[i] === text2[i]) matches++;
        }
        
        return matches / maxLength;
    }
}

// Initialize demo
const tokenizer = new DemoTokenizer();

function updateDemo() {
    const input = document.getElementById('component-input').value;
    
    if (!input.trim()) return;
    
    // Tokenize the input
    const result = tokenizer.testRoundTrip(input);
    
    // Update display
    document.getElementById('original-text').textContent = result.original;
    document.getElementById('tokens-display').textContent = JSON.stringify(result.encoded.tokens);
    document.getElementById('token-ids').textContent = JSON.stringify(result.encoded.ids);
    document.getElementById('decoded-text').textContent = result.decoded.text;
    
    // Update round-trip result
    const roundTripElement = document.getElementById('round-trip');
    if (result.success) {
        roundTripElement.textContent = `✅ Perfect match (${(result.similarity * 100).toFixed(1)}%)`;
        roundTripElement.className = 'result-value success';
    } else {
        roundTripElement.textContent = `⚠️ Partial match (${(result.similarity * 100).toFixed(1)}%)`;
        roundTripElement.className = 'result-value';
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('component-input');
    const exampleButtons = document.querySelectorAll('.example-btn');
    
    // Update demo on input change
    input.addEventListener('input', updateDemo);
    
    // Example button handlers
    exampleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const example = this.getAttribute('data-example');
            input.value = example;
            updateDemo();
        });
    });
    
    // Initial demo update
    updateDemo();
    
    // Add some animation to stats
    animateStats();
});

function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const finalValue = stat.textContent;
        let currentValue = 0;
        const increment = parseFloat(finalValue) / 50;
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= parseFloat(finalValue)) {
                stat.textContent = finalValue;
                clearInterval(timer);
            } else {
                if (finalValue.includes('%')) {
                    stat.textContent = currentValue.toFixed(1) + '%';
                } else if (finalValue.includes('x')) {
                    stat.textContent = currentValue.toFixed(1) + 'x';
                } else {
                    stat.textContent = Math.floor(currentValue);
                }
            }
        }, 50);
    });
}

// Export for potential external use
window.DemoTokenizer = DemoTokenizer;