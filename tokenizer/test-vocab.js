const fs = require('fs');
const { Vocabulary } = require('./core/vocabulary');

// Test the vocabulary builder
async function testVocabulary() {
    console.log('🏛️ Testing RosettaBOM Vocabulary Builder\n');
    
    // Read training corpus
    const corpus = fs.readFileSync('./data/training-corpus.txt', 'utf8');
    
    // Build vocabulary
    const vocab = new Vocabulary();
    vocab.buildFromCorpus(corpus);
    
    // Show stats
    console.log('📊 Vocabulary Statistics:');
    console.log(vocab.getStats());
    
    // Test tokenization
    console.log('\n🔤 Tokenization Examples:');
    const testCases = [
        "log4j-core-2.14.1",
        "org.apache.logging.log4j:log4j-core:2.14.1",
        "pkg:maven/org.apache.logging.log4j/log4j-core@2.14.1"
    ];
    
    testCases.forEach(test => {
        const tokens = vocab.tokenize(test);
        const encoded = tokens.map(token => vocab.encode(token));
        const decoded = encoded.map(id => vocab.decode(id));
        
        console.log(`Input:   ${test}`);
        console.log(`Tokens:  [${tokens.join(', ')}]`);
        console.log(`Encoded: [${encoded.join(', ')}]`);
        console.log(`Decoded: [${decoded.join(', ')}]`);
        console.log('');
    });
    
    // Save vocabulary
    const vocabData = vocab.save();
    fs.writeFileSync('./data/vocab.json', JSON.stringify(vocabData, null, 2));
    console.log('💾 Vocabulary saved to vocab.json');
}

if (require.main === module) {
    testVocabulary();
}