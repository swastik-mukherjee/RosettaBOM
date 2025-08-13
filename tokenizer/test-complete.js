const fs = require('fs');
const { RosettaTokenizer } = require('./utils/tokenizer');

async function testCompleteTokenizer() {
    console.log('🏛️ Testing Complete RosettaBOM Tokenizer\n');
    
    // Initialize tokenizer
    const tokenizer = new RosettaTokenizer();
    
    // Load training data
    const corpus = fs.readFileSync('./data/training-corpus.txt', 'utf8');
    
    // Train tokenizer
    tokenizer.train(corpus);
    
    // Test cases covering different formats
    const testCases = [
        // Basic format
        "log4j-core-2.14.1",
        "spring-boot-2.5.0",
        "junit-4.13.2",
        
        // Maven format  
        "org.apache.logging.log4j:log4j-core:2.14.1",
        "org.springframework.boot:spring-boot:2.5.0",
        "junit:junit:4.13.2",
        
        // PURL format
        "pkg:maven/org.apache.logging.log4j/log4j-core@2.14.1",
        "pkg:npm/react@17.0.2",
        "pkg:pypi/django@3.2.5"
    ];
    
    console.log('🔤 Encoding/Decoding Tests:');
    console.log('='.repeat(80));
    
    let successCount = 0;
    let totalSimilarity = 0;
    
    testCases.forEach((testCase, index) => {
        console.log(`\nTest ${index + 1}: ${testCase}`);
        
        const encoded = tokenizer.encode(testCase);
        console.log(`Tokens:  [${encoded.tokens.join(', ')}]`);
        console.log(`IDs:     [${encoded.ids.join(', ')}]`);
        
        const decoded = tokenizer.decode(encoded.ids);
        console.log(`Decoded: "${decoded.text}"`);
        
        const roundTrip = tokenizer.testRoundTrip(testCase);
        console.log(`Match:   ${roundTrip.success ? '✅' : '❌'} (${(roundTrip.similarity * 100).toFixed(1)}% similar)`);
        
        if (roundTrip.success) successCount++;
        totalSimilarity += roundTrip.similarity;
    });
    
    // Summary statistics
    console.log('\n📊 Test Results Summary:');
    console.log('='.repeat(50));
    console.log(`Total tests: ${testCases.length}`);
    console.log(`Perfect matches: ${successCount}/${testCases.length} (${(successCount/testCases.length*100).toFixed(1)}%)`);
    console.log(`Average similarity: ${(totalSimilarity/testCases.length*100).toFixed(1)}%`);
    
    // Tokenizer statistics
    console.log('\n🏛️ Tokenizer Statistics:');
    console.log('='.repeat(50));
    const stats = tokenizer.getStats();
    console.log(`Vocabulary size: ${stats.totalTokens}`);
    console.log(`Most frequent tokens:`, stats.mostFrequent.slice(0, 5));
    
    // Batch processing test
    console.log('\n⚡ Batch Processing Test:');
    console.log('='.repeat(40));
    const batchResults = tokenizer.encodeBatch(testCases.slice(0, 3));
    console.log(`Processed ${batchResults.length} components in batch`);
    batchResults.forEach((result, i) => {
        console.log(`  ${i+1}. ${result.length} tokens for "${result.input}"`);
    });
    
    // Save tokenizer
    const tokenizerData = tokenizer.save();
    fs.writeFileSync('./data/tokenizer.json', JSON.stringify(tokenizerData, null, 2));
    console.log('\n💾 Tokenizer saved to tokenizer.json');
    
    console.log('\n🎉 Complete tokenizer test finished!');
}

if (require.main === module) {
    testCompleteTokenizer().catch(console.error);
}