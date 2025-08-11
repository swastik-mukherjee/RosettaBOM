/**
 * RosettaBOM - Format Detection
 */
function detectFormat(input) {
    if (input.startsWith("pkg") && input.includes("@")) {
        return "PURL";
    } else if (input.includes(":")) {
        return "maven";
    } else {
        return "basic";
    }
}

module.exports = { detectFormat };