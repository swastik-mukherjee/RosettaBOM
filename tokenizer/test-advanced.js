const fs = require('fs');
const { RosettaTokenizer } = require('./utils/tokenizer');

async function testAdvancedCases() {
    console.log('🏛️ RosettaBOM Advanced Testing Suite\n');
    
    // Load expanded training data
    const corpus = fs.readFileSync('./data/training-corpus.txt', 'utf8');
    
    // Train tokenizer with expanded vocab
    const tokenizer = new RosettaTokenizer();
    tokenizer.train(corpus);
    
    console.log(`📊 Vocabulary Statistics:`);
    const stats = tokenizer.getStats();
    console.log(`- Total tokens: ${stats.totalTokens}`);
    console.log(`- Most frequent: ${stats.mostFrequent.slice(0, 5).map(([token, freq]) => `${token}(${freq})`).join(', ')}`);
    console.log('');
    
    // Advanced test cases
    const testCategories = [
        {
            name: "🐳 Container Images",
            cases: [
                "nginx-1.21.0-alpine",
                "postgres-13.3",
                "ubuntu-20.04"
            ]
        },
        {
            name: "📦 NPM Scoped Packages", 
            cases: [
                "@angular/core-14.2.0",
                "@types/node-16.11.7",
                "@tensorflow/tfjs-3.9.0"
            ]
        },
        {
            name: "🐍 Python Packages",
            cases: [
                "Django-4.1.0",
                "scikit-learn-1.0.2",
                "tensorflow-2.6.0"
            ]
        },
        {
            name: "🔒 Vulnerable Components",
            cases: [
                "log4j-core-2.14.1",
                "jackson-databind-2.9.10.7",
                "apache-commons-collections-3.2.1"
            ]
        },
        {
            name: "🏢 Enterprise Components",
            cases: [
                "oracle-jdbc-19.3.0",
                "microsoft-sqlserver-jdbc-9.4.0",
                "sap-jco-3.1.0"
            ]
        },
        {
            name: "☁️ Cloud Native",
            cases: [
                "kubernetes-client-12.0.1",
                "terraform-provider-aws-3.74.0",
                "docker-java-3.2.12"
            ]
        },
        {
            name: "🔗 Complex PURLs",
            cases: [
                "pkg:npm/@types/react@17.0.34",
                "pkg:gem/rails@7.0.0", 
                "pkg:cargo/serde@1.0.130"
            ]
        }
    ];
    
    let overallSuccess = 0;
    let overallTotal = 0;
    let categoryResults = [];
    
    testCategories.forEach(category => {
        console.log(`${category.name}`);
        console.log('='.repeat(50));
        
        let categorySuccess = 0;
        let categoryTotal = category.cases.length;
        
        category.cases.forEach((testCase, index) => {
            const result = tokenizer.testRoundTrip(testCase);
            
            console.log(`${index + 1}. ${testCase}`);
            console.log(`   Tokens: [${result.encoded.tokens.join(', ')}]`);
            console.log(`   IDs: [${result.encoded.ids.join(', ')}]`);
            console.log(`   Decoded: "${result.decoded.text}"`);
            console.log(`   Result: ${result.success ? '✅' : '⚠️'} (${(result.similarity * 100).toFixed(1)}%)`);
            console.log('');
            
            if (result.success) categorySuccess++;
        });
        
        const categoryAccuracy = (categorySuccess / categoryTotal * 100).toFixed(1);
        console.log(`📊 Category Accuracy: ${categorySuccess}/${categoryTotal} (${categoryAccuracy}%)\n`);
        
        categoryResults.push({
            name: category.name,
            accuracy: categoryAccuracy,
            success: categorySuccess,
            total: categoryTotal
        });
        
        overallSuccess += categorySuccess;
        overallTotal += categoryTotal;
    });
    
    // Overall results
    console.log('🏆 OVERALL RESULTS');
    console.log('='.repeat(50));
    console.log(`Total tests: ${overallTotal}`);
    console.log(`Perfect matches: ${overallSuccess}/${overallTotal} (${(overallSuccess/overallTotal*100).toFixed(1)}%)`);
    console.log('');
    
    // Category breakdown
    console.log('📊 Category Breakdown:');
    categoryResults.forEach(cat => {
        console.log(`${cat.name}: ${cat.accuracy}%`);
    });
    
    // Performance test
    console.log('\n⚡ Performance Test:');
    console.log('='.repeat(30));
    const performanceTests = testCategories.flatMap(cat => cat.cases);
    
    const startTime = Date.now();
    const batchResults = tokenizer.encodeBatch(performanceTests);
    const endTime = Date.now();
    
    console.log(`Processed ${performanceTests.length} components in ${endTime - startTime}ms`);
    console.log(`Average: ${((endTime - startTime) / performanceTests.length).toFixed(2)}ms per component`);
    
    // Vocabulary coverage analysis
    console.log('\n🔍 Vocabulary Coverage:');
    console.log('='.repeat(35));
    
    let totalTokens = 0;
    let unknownTokens = 0;
    
    batchResults.forEach(result => {
        totalTokens += result.tokens.length;
        unknownTokens += result.tokens.filter(token => !tokenizer.vocab.tokenToId.has(token)).length;
    });
    
    console.log(`Total tokens processed: ${totalTokens}`);
    console.log(`Unknown tokens: ${unknownTokens} (${(unknownTokens/totalTokens*100).toFixed(1)}%)`);
    console.log(`Vocabulary coverage: ${((totalTokens-unknownTokens)/totalTokens*100).toFixed(1)}%`);
    
    // Save updated tokenizer
    const tokenizerData = tokenizer.save();
    fs.writeFileSync('./data/tokenizer-advanced.json', JSON.stringify(tokenizerData, null, 2));
    console.log('\n💾 Advanced tokenizer saved to tokenizer-advanced.json');
}

if (require.main === module) {
    testAdvancedCases().catch(console.error);
}