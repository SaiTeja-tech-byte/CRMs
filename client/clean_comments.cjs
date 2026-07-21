const fs = require("fs");
const path = require("path");

function isSectionComment(text) {
    const trimmed = text.trim();
    if (trimmed.includes("===") || trimmed.includes("---")) return true;
    
    // Very short comments that start with a capital letter are usually section headers
    // e.g. "Main Content", "API Calls", "State Management"
    const words = trimmed.split(/\s+/);
    if (words.length <= 4 && /^[A-Z0-9]/.test(trimmed) && !trimmed.includes("?")) {
        return true;
    }
    
    return false;
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, "utf8");
    let lines = content.split("\n");
    let newLines = [];
    let changed = false;
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let trimmed = line.trim();
        
        // Handle whole-line JSX comments: {/* comment */}
        const jsxMatch = trimmed.match(/^\{\/\*([\s\S]*?)\*\/\}$/);
        if (jsxMatch) {
            if (!isSectionComment(jsxMatch[1])) {
                changed = true;
                continue;
            }
        }
        
        // Handle whole-line JS comments: // comment
        if (trimmed.startsWith("//")) {
            const commentText = trimmed.substring(2);
            if (!isSectionComment(commentText)) {
                changed = true;
                continue;
            }
        }
        
        // Handle end-of-line comments like `const x = 1; // comment`
        // Only if it doesn`t contain http:// or https:// to be safe
        let idx = line.indexOf("//");
        if (idx !== -1 && !line.includes("http://") && !line.includes("https://")) {
            // Verify it is not inside a string (rough heuristic: no quotes before it on the same line)
            let before = line.substring(0, idx);
            if (!before.includes("\"") && !before.includes("`") && !before.includes("'")) {
                let commentText = line.substring(idx + 2);
                if (!isSectionComment(commentText)) {
                    line = before.trimEnd();
                    changed = true;
                }
            }
        }

        // Handle end-of-line JSX comments like `</div> {/* comment */}`
        let jsxIdx = line.indexOf("{/*");
        let jsxEndIdx = line.indexOf("*/}");
        if (jsxIdx !== -1 && jsxEndIdx !== -1 && jsxIdx < jsxEndIdx) {
            let commentText = line.substring(jsxIdx + 3, jsxEndIdx);
            if (!isSectionComment(commentText)) {
                line = line.substring(0, jsxIdx).trimEnd() + line.substring(jsxEndIdx + 3);
                changed = true;
            }
        }
        
        newLines.push(line);
    }
    
    if (changed) {
        let newContent = newLines.join("\n");
        // Remove multiple consecutive blank lines created by deleted comments
        newContent = newContent.replace(/\n\s*\n\s*\n/g, "\n\n");
        fs.writeFileSync(filePath, newContent, "utf8");
        console.log("Cleaned: " + filePath);
    }
}

function walk(dir) {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            walk(filePath);
        } else if (filePath.endsWith(".js") || filePath.endsWith(".jsx")) {
            processFile(filePath);
        }
    });
}

walk(path.join(__dirname, "src"));

