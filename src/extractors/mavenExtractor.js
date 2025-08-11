/**
 * RosettaBOM - Maven Format Extractor
 * Extracts component and version from Maven coordinate format
 * Example: "org.apache.logging.log4j:log4j-core:2.14.1"
 */
function extractMavenFormat(input) {
    const arr = input.split(":");
    const len = arr.length;
    const component = arr[len - 2];
    const version = arr[len - 1];
    
    return {
        component: component,
        version: version,
        format: "maven",
        groupId: arr[0],
        originalInput: input
    };
}

module.exports = { extractMavenFormat };