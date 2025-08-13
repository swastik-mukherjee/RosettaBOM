const fs = require('fs');
const { RosettaTokenizer } = require('./utils/tokenizer');

function testEdgeCases() {
    console.log('🧪 RosettaBOM Edge Case Testing\n');
    
    // Load tokenizer
    const corpus = fs.readFileSync('./data/training-corpus.txt', 'utf8');
    const tokenizer = new RosettaTokenizer();
    tokenizer.train(corpus);
    
    const edgeCases = [
        // Very long component names
        "org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationProcessingFilter",
        
        // Numbers in weird places
        "log4j2-core-2.14.1",
        "junit5-jupiter-engine-5.8.0",
        
        // Special characters
        "commons-io-2.8.0-SNAPSHOT",
        "spring-boot-2.5.0.RELEASE",
        "hibernate-core-5.4.32.Final",
        
        // Very short names
        "io-1.0",
        "rx-2.1",
        "os-3.2",
        
        // Mixed case and underscores
        "Jackson_Core-2.13.0",
        "Apache_Commons_IO-2.8.0",
        
        // Complex version numbers
        "spring-boot-2.5.0-M3",
        "jackson-databind-2.12.3.1",
        "netty-all-4.1.65.Final-SNAPSHOT",
        
        // Malformed but common patterns
        "log4j--core--2.14.1",
        "spring...boot...2.5.0",
        "junit:::4.13.2"
    ];
    
    console.log('🎯 Testing Edge Cases:');
    console.log('='.repeat(60));
    
    edgeCases.forEach((testCase, index) => {
        console.log(`\n${index + 1}. Testing: "${testCase}"`);
        
        const result = tokenizer.testRoundTrip(testCase);
        
        console.log(`   Original:  "${result.original}"`);
        console.log(`   Tokens:    [${result.encoded.tokens.join(', ')}]`);
        console.log(`   Decoded:   "${result.decoded.text}"`);
        console.log(`   Success:   ${result.success ? '✅' : '❌'} (${(result.similarity * 100).toFixed(1)}% similar)`);
        
        if (!result.success) {
            console.log(`   🔍 Analysis: Reconstruction differs from original`);
            console.log(`              This is expected for malformed inputs`);
        }
    });
}

if (require.main === module) {
    testEdgeCases();
}