/**
 * ================================================================
 * GAPCHECKER PRO - ULTIMATE JAVASCRIPT
 * Motivation Premier X Support Link Box © 2026
 * ================================================================
 */

// ===== CONFIGURATION =====
const CONFIG = {
    appName: 'GapChecker Pro',
    version: '2.0.0',
    copyright: 'Motivation Premier X Support Link Box',
    maxHistory: 25,
    toastDuration: 3500,
    debounceDelay: 400,
    animationDelay: 500,
    fuzzyThreshold: 0.75
};

// ===== STORAGE KEYS =====
const STORAGE_KEYS = {
    allDoneList: 'gapchecker_allDone',
    commenterList: 'gapchecker_commenter',
    history: 'gapchecker_history',
    theme: 'gapchecker_theme'
};

// ===== DOM ELEMENTS =====
const DOM = {};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    console.log(`🚀 ${CONFIG.appName} v${CONFIG.version} initializing...`);
    
    cacheElements();
    initTheme();
    loadSavedData();
    updatePreview();
    updateHistoryBadge();
    setupEventListeners();
    showShortcutsHint();
    
    console.log('✅ App initialized successfully!');
}

// ===== CACHE DOM ELEMENTS =====
function cacheElements() {
    DOM.allDoneList = document.getElementById('allDoneList');
    DOM.commenterList = document.getElementById('commenterList');
    DOM.checkBtn = document.getElementById('checkBtn');
    DOM.themeToggle = document.getElementById('themeToggle');
    DOM.historyBtn = document.getElementById('historyBtn');
    DOM.closeHistory = document.getElementById('closeHistory');
    DOM.clearHistory = document.getElementById('clearHistory');
    DOM.copyResult = document.getElementById('copyResult');
    DOM.resetAllDone = document.getElementById('resetAllDone');
    DOM.resetCommenter = document.getElementById('resetCommenter');
    DOM.pasteAllDone = document.getElementById('pasteAllDone');
    DOM.pasteCommenter = document.getElementById('pasteCommenter');
    DOM.exportBtn = document.getElementById('exportBtn');
    DOM.shareBtn = document.getElementById('shareBtn');
    DOM.resultsSection = document.getElementById('resultsSection');
    DOM.loadingOverlay = document.getElementById('loadingOverlay');
    DOM.historyModal = document.getElementById('historyModal');
    DOM.quickResultModal = document.getElementById('quickResultModal');
    DOM.historyList = document.getElementById('historyList');
    DOM.historyCount = document.getElementById('historyCount');
    DOM.toast = document.getElementById('toast');
    DOM.shortcutsHint = document.getElementById('shortcutsHint');
    DOM.previewAllDone = document.getElementById('previewAllDone');
    DOM.previewCommenter = document.getElementById('previewCommenter');
    DOM.previewStatus = document.getElementById('previewStatus');
    DOM.statusIcon = document.getElementById('statusIcon');
    DOM.allDoneCount = document.getElementById('allDoneCount');
    DOM.commenterCount = document.getElementById('commenterCount');
    DOM.statAllDone = document.getElementById('statAllDone');
    DOM.statTotalComment = document.getElementById('statTotalComment');
    DOM.statGroupComment = document.getElementById('statGroupComment');
    DOM.statSupportGap = document.getElementById('statSupportGap');
    DOM.progressBar = document.getElementById('progressBar');
    DOM.progressPercent = document.getElementById('progressPercent');
    DOM.progressDone = document.getElementById('progressDone');
    DOM.progressRemaining = document.getElementById('progressRemaining');
    DOM.resultTitle = document.getElementById('resultTitle');
    DOM.resultSubtitle = document.getElementById('resultSubtitle');
    DOM.resultContent = document.getElementById('resultContent');
    DOM.matchedCount = document.getElementById('matchedCount');
    DOM.matchedContent = document.getElementById('matchedContent');
    DOM.extraCount = document.getElementById('extraCount');
    DOM.extraContent = document.getElementById('extraContent');
    DOM.quickResultOutput = document.getElementById('quickResultOutput');
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Check button
    DOM.checkBtn?.addEventListener('click', performAnalysis);
    
    // Theme toggle
    DOM.themeToggle?.addEventListener('click', toggleTheme);
    
    // History modal
    DOM.historyBtn?.addEventListener('click', openHistoryModal);
    DOM.closeHistory?.addEventListener('click', closeHistoryModal);
    DOM.clearHistory?.addEventListener('click', clearAllHistory);
    DOM.historyModal?.addEventListener('click', (e) => {
        if (e.target === DOM.historyModal) closeHistoryModal();
    });
    
    // Quick Result Modal
    document.getElementById('closeQuickResult')?.addEventListener('click', closeQuickResultModal);
    document.getElementById('closeQuickResultBtn')?.addEventListener('click', closeQuickResultModal);
    document.getElementById('copyQuickResult')?.addEventListener('click', () => {
        copyToClipboard(DOM.quickResultOutput?.value);
    });
    DOM.quickResultModal?.addEventListener('click', (e) => {
        if (e.target === DOM.quickResultModal) closeQuickResultModal();
    });
    
    // Reset buttons
    DOM.resetAllDone?.addEventListener('click', () => resetList('allDone'));
    DOM.resetCommenter?.addEventListener('click', () => resetList('commenter'));
    
    // Paste buttons
    DOM.pasteAllDone?.addEventListener('click', () => pasteFromClipboard('allDone'));
    DOM.pasteCommenter?.addEventListener('click', () => pasteFromClipboard('commenter'));
    
    // Copy result
    DOM.copyResult?.addEventListener('click', copyMainResult);
    
    // Export & Share
    DOM.exportBtn?.addEventListener('click', exportResults);
    DOM.shareBtn?.addEventListener('click', shareResults);
    
    // Auto-save with debounce
    DOM.allDoneList?.addEventListener('input', debounce(() => {
        saveToStorage(STORAGE_KEYS.allDoneList, DOM.allDoneList.value);
        updatePreview();
    }, CONFIG.debounceDelay));
    
    DOM.commenterList?.addEventListener('input', debounce(() => {
        saveToStorage(STORAGE_KEYS.commenterList, DOM.commenterList.value);
        updatePreview();
    }, CONFIG.debounceDelay));
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Toast close button
    document.addEventListener('click', (e) => {
        if (e.target.closest('.toast-close')) {
            DOM.toast?.classList.remove('show');
        }
    });
}

// ===== KEYBOARD SHORTCUTS =====
function handleKeyboardShortcuts(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        performAnalysis();
    }
    if (e.key === 'Escape') {
        closeHistoryModal();
        closeQuickResultModal();
    }
}

function showShortcutsHint() {
    if (DOM.shortcutsHint) {
        DOM.shortcutsHint.style.display = 'block';
        setTimeout(() => {
            DOM.shortcutsHint.style.display = 'none';
        }, 5000);
    }
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    } catch (error) {
        console.error('Storage error:', error);
    }
}

function getFromStorage(key, defaultValue = null) {
    try {
        const value = localStorage.getItem(key);
        if (value === null) return defaultValue;
        try { return JSON.parse(value); } catch { return value; }
    } catch { return defaultValue; }
}

// ===== THEME MANAGEMENT =====
function initTheme() {
    const savedTheme = getFromStorage(STORAGE_KEYS.theme, 'dark');
    setTheme(savedTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
    saveToStorage(STORAGE_KEYS.theme, theme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    showToast(`${newTheme === 'dark' ? '🌙 ডার্ক' : '☀️ লাইট'} মোড`, 'info');
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('themeIcon');
    if (icon) {
        icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
}

// ===== DATA MANAGEMENT =====
function loadSavedData() {
    const allDone = getFromStorage(STORAGE_KEYS.allDoneList, '');
    const commenter = getFromStorage(STORAGE_KEYS.commenterList, '');
    if (DOM.allDoneList && allDone) DOM.allDoneList.value = allDone;
    if (DOM.commenterList && commenter) DOM.commenterList.value = commenter;
}

function resetList(type) {
    if (!confirm(type === 'allDone' ? 'All Done লিস্ট মুছে ফেলতে চান?' : 'Commenter লিস্ট মুছে ফেলতে চান?')) return;
    
    if (type === 'allDone' && DOM.allDoneList) {
        DOM.allDoneList.value = '';
        localStorage.removeItem(STORAGE_KEYS.allDoneList);
    } else if (type === 'commenter' && DOM.commenterList) {
        DOM.commenterList.value = '';
        localStorage.removeItem(STORAGE_KEYS.commenterList);
    }
    
    updatePreview();
    hideResults();
    showToast('লিস্ট মুছে ফেলা হয়েছে', 'info');
}

// ===== PASTE FUNCTIONALITY =====
async function pasteFromClipboard(type) {
    try {
        const text = await navigator.clipboard.readText();
        if (type === 'allDone' && DOM.allDoneList) {
            DOM.allDoneList.value = text;
            saveToStorage(STORAGE_KEYS.allDoneList, text);
        } else if (type === 'commenter' && DOM.commenterList) {
            DOM.commenterList.value = text;
            saveToStorage(STORAGE_KEYS.commenterList, text);
        }
        updatePreview();
        showToast('পেস্ট করা হয়েছে!', 'success');
    } catch {
        showToast('পেস্ট করতে পারেনি', 'error');
    }
}

// ===== PREVIEW UPDATES =====
function updatePreview() {
    const allDoneText = DOM.allDoneList?.value || '';
    const commenterText = DOM.commenterList?.value || '';
    
    const allDoneNames = parseAllDoneList(allDoneText);
    const commenterNames = parseCommenterList(commenterText);
    
    if (DOM.previewAllDone) DOM.previewAllDone.textContent = allDoneNames.length;
    if (DOM.previewCommenter) DOM.previewCommenter.textContent = commenterNames.length;
    if (DOM.allDoneCount) DOM.allDoneCount.textContent = `${allDoneNames.length} জন সদস্য`;
    if (DOM.commenterCount) DOM.commenterCount.textContent = `${commenterNames.length} জন কমেন্টার`;
    
    updatePreviewStatus(allDoneNames.length, commenterNames.length);
}

function updatePreviewStatus(allDoneCount, commenterCount) {
    if (!DOM.previewStatus || !DOM.statusIcon) return;
    
    if (allDoneCount > 0 && commenterCount > 0) {
        DOM.previewStatus.textContent = 'চেক করতে প্রস্তুত!';
        DOM.previewStatus.style.color = 'var(--accent-green)';
        DOM.statusIcon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
        DOM.statusIcon.style.background = 'var(--accent-green-light)';
        DOM.statusIcon.style.color = 'var(--accent-green)';
    } else if (allDoneCount > 0 || commenterCount > 0) {
        DOM.previewStatus.textContent = 'আরেকটি লিস্ট দিন';
        DOM.previewStatus.style.color = 'var(--accent-orange)';
        DOM.statusIcon.innerHTML = '<i class="fa-solid fa-hourglass-half"></i>';
        DOM.statusIcon.style.background = 'var(--accent-orange-light)';
        DOM.statusIcon.style.color = 'var(--accent-orange)';
    } else {
        DOM.previewStatus.textContent = 'লিস্ট পেস্ট করুন';
        DOM.previewStatus.style.color = 'var(--primary)';
        DOM.statusIcon.innerHTML = '<i class="fa-solid fa-circle-info"></i>';
        DOM.statusIcon.style.background = 'var(--primary-light)';
        DOM.statusIcon.style.color = 'var(--primary)';
    }
}

// ===== NAME PARSING =====
function parseAllDoneList(text) {
    if (!text.trim()) return [];
    const lines = text.split('\n');
    const names = [];
    
    for (let line of lines) {
        line = line.trim();
        if (!line || isHeaderLine(line)) continue;
        
        if (hasNumberedFormat(line)) {
            let name = extractNameFromLine(line);
            if (!name || name.includes('#N/A') || name === '@' || name === 'No Post') continue;
            
            const cleanedName = cleanName(name);
            if (cleanedName && cleanedName.length > 0) {
                names.push({
                    original: name.trim(),
                    clean: cleanedName,
                    normalized: normalizeName(cleanedName)
                });
            }
        }
    }
    return names;
}

function parseCommenterList(text) {
    if (!text.trim()) return [];
    const lines = text.split('\n');
    const names = [];
    
    for (let line of lines) {
        line = line.trim();
        if (!line) continue;
        if (line.toLowerCase().includes('link no') || line.startsWith('*') || 
            line.startsWith('#') || line.startsWith('//') || line.startsWith('"')) continue;
        
        const cleanedName = cleanName(line);
        if (cleanedName && cleanedName.length > 1) {
            names.push({
                original: line.trim(),
                clean: cleanedName,
                normalized: normalizeName(cleanedName)
            });
        }
    }
    return names;
}

function isHeaderLine(line) {
    return ['তারিখ:', 'বার:', '👇', 'সাপোর্ট করেছেন', 'তালিকা', 'যারা লিংক', '━━━', '───']
        .some(p => line.includes(p));
}

function hasNumberedFormat(line) {
    return /[0-9]️⃣/.test(line) || /^\d+[➤➔→@]/.test(line) || line.includes('➤');
}

function extractNameFromLine(line) {
    const arrowIndex = line.indexOf('➤');
    if (arrowIndex !== -1) return line.substring(arrowIndex + 1).trim();
    for (let sep of ['→', '➔', '@']) {
        const idx = line.indexOf(sep);
        if (idx !== -1) return line.substring(idx + 1).trim();
    }
    return line;
}

function cleanName(name) {
    if (!name) return '';
    return name
        .replace(/@/g, '')
        .replace(/^[0-9️⃣➤➔→\s]+/g, '')
        .replace(/[✅✓☑️]/g, '')
        .replace(/[\u{1F600}-\u{1F64F}]/gu, '')
        .replace(/[\u{1F300}-\u{1F5FF}]/gu, '')
        .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
        .replace(/[\u{2600}-\u{26FF}]/gu, '')
        .replace(/[\u{2700}-\u{27BF}]/gu, '')
        .replace(/[\u{1F900}-\u{1F9FF}]/gu, '')
        .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function normalizeName(name) {
    if (!name) return '';
    return name.toLowerCase().replace(/\s+/g, '').replace(/[^\u0980-\u09FFa-z0-9]/g, '');
}

function extractLinkNo(text) {
    const patterns = [
        /Link\s*No[:\-\.]*\s*(\d+)/i,
        /\*Link\s*No[:\-\.]*\s*(\d+)\*/i,
        /লিংক\s*(?:নং|নম্বর)?[:\-\.]*\s*(\d+)/i,
        /#(\d+)/
    ];
    for (let p of patterns) {
        const match = text.match(p);
        if (match) return match[1];
    }
    return null;
}

// ===== FUZZY MATCHING =====
function calculateSimilarity(str1, str2) {
    if (!str1 || !str2) return 0;
    if (str1 === str2) return 1;
    if (str1.includes(str2) || str2.includes(str1)) {
        if (Math.min(str1.length, str2.length) / Math.max(str1.length, str2.length) > 0.6) return 0.88;
    }
    const maxLen = Math.max(str1.length, str2.length);
    return (maxLen - levenshteinDistance(str1, str2)) / maxLen;
}

function levenshteinDistance(str1, str2) {
    const m = str1.length, n = str2.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            dp[i][j] = str1[i-1] === str2[j-1] 
                ? dp[i-1][j-1] 
                : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
        }
    }
    return dp[m][n];
}

// ===== MAIN ANALYSIS =====
async function performAnalysis() {
    const allDoneText = DOM.allDoneList?.value?.trim() || '';
    const commenterText = DOM.commenterList?.value?.trim() || '';
    
    if (!allDoneText) { showToast('All Done লিস্ট পেস্ট করুন!', 'error'); return; }
    if (!commenterText) { showToast('Commenter লিস্ট পেস্ট করুন!', 'error'); return; }
    
    showLoading();
    await sleep(CONFIG.animationDelay);
    
    try {
        const allDoneUsers = parseAllDoneList(allDoneText);
        const commenters = parseCommenterList(commenterText);
        
        if (allDoneUsers.length === 0) {
            hideLoading();
            showToast('All Done লিস্ট থেকে নাম পাওয়া যায়নি!', 'error');
            return;
        }
        
        const commenterMap = new Map();
        commenters.forEach(c => commenterMap.set(c.normalized, c.original));
        
        const matched = [], gap = [];
        
        for (let user of allDoneUsers) {
            let isMatched = commenterMap.has(user.normalized);
            if (!isMatched) {
                for (let [commNorm] of commenterMap) {
                    if (calculateSimilarity(user.normalized, commNorm) >= CONFIG.fuzzyThreshold) {
                        isMatched = true;
                        break;
                    }
                }
            }
            (isMatched ? matched : gap).push(user.original);
        }
        
        const allDoneNormalized = new Set(allDoneUsers.map(u => u.normalized));
        const extras = commenters.filter(c => {
            if (allDoneNormalized.has(c.normalized)) return false;
            for (let adNorm of allDoneNormalized) {
                if (calculateSimilarity(c.normalized, adNorm) >= CONFIG.fuzzyThreshold) return false;
            }
            return true;
        }).map(c => c.original);
        
        const linkNo = extractLinkNo(commenterText) || 'N/A';
        const resultsData = {
            allDoneCount: allDoneUsers.length,
            totalComment: commenters.length,
            groupComment: matched.length,
            supportGap: gap.length,
            matched, gap, extras, linkNo,
            timestamp: new Date().toLocaleString('bn-BD'),
            percent: allDoneUsers.length > 0 ? Math.round((matched.length / allDoneUsers.length) * 100) : 0
        };
        
        displayResults(resultsData);
        generateQuickResult(resultsData);
        saveToHistory(resultsData);
        showToast(`বিশ্লেষণ সম্পন্ন! ${gap.length} জন গ্যাপ।`, 'success');
    } catch (error) {
        console.error(error);
        showToast('বিশ্লেষণে সমস্যা!', 'error');
    }
    hideLoading();
}

// ===== DISPLAY RESULTS =====
function displayResults(data) {
    if (DOM.statAllDone) DOM.statAllDone.textContent = data.allDoneCount;
    if (DOM.statTotalComment) DOM.statTotalComment.textContent = data.totalComment;
    if (DOM.statGroupComment) DOM.statGroupComment.textContent = data.groupComment;
    if (DOM.statSupportGap) DOM.statSupportGap.textContent = data.supportGap;
    
    if (DOM.progressBar) DOM.progressBar.style.width = `${data.percent}%`;
    if (DOM.progressPercent) DOM.progressPercent.textContent = `${data.percent}%`;
    if (DOM.progressDone) DOM.progressDone.textContent = `${data.groupComment} জন করেছে`;
    if (DOM.progressRemaining) DOM.progressRemaining.textContent = `${data.supportGap} জন বাকি`;
    
    if (DOM.resultTitle) DOM.resultTitle.textContent = `যারা কমেন্ট করেননি (${data.supportGap} জন)`;
    if (DOM.resultSubtitle) DOM.resultSubtitle.textContent = `Link No: ${data.linkNo}`;
    
    if (DOM.resultContent) {
        if (data.gap.length > 0) {
            let gapText = `Link No ${data.linkNo}:- তে যারা কমেন্ট করেননি\nমোট গ্যাপ: ${data.gap.length} জন\n\n`;
            data.gap.forEach((name, i) => gapText += `${i + 1}. ${name}\n`);
            DOM.resultContent.textContent = gapText;
        } else {
            DOM.resultContent.textContent = '🎉 অভিনন্দন! সবাই সাপোর্ট করেছে!';
        }
    }
    
    if (DOM.matchedCount) DOM.matchedCount.textContent = data.matched.length;
    if (DOM.matchedContent) DOM.matchedContent.textContent = data.matched.length > 0 ? data.matched.join('\n') : 'কেউ ম্যাচ হয়নি';
    
    if (DOM.extraCount) DOM.extraCount.textContent = data.extras.length;
    if (DOM.extraContent) DOM.extraContent.textContent = data.extras.length > 0 ? data.extras.join('\n') : 'কোনো বাইরের Commenter নেই';
    
    showResults();
}

function generateQuickResult(data) {
    if (!DOM.quickResultOutput) return;
    let report = `📊 GapChecker Pro Report\n${'━'.repeat(35)}\n\n`;
    report += `🔗 Link No: ${data.linkNo}\n📅 সময়: ${data.timestamp}\n\n`;
    report += `📈 Statistics:\n`;
    report += `   • All Done: ${data.allDoneCount} জন\n`;
    report += `   • মোট কমেন্ট: ${data.totalComment} জন\n`;
    report += `   • গ্রুপ ম্যাচ: ${data.groupComment} জন\n`;
    report += `   • সাপোর্ট গ্যাপ: ${data.supportGap} জন\n`;
    report += `   • Success Rate: ${data.percent}%\n\n`;
    report += `${'━'.repeat(35)}\n\n`;
    
    if (data.gap.length > 0) {
        report += `⚠️ যারা কমেন্ট করেননি:\n\n`;
        data.gap.forEach((name, i) => report += `${i + 1}. ${name}\n`);
    } else {
        report += `🎉 সবাই সাপোর্ট করেছে!\n`;
    }
    
    report += `\n${'━'.repeat(35)}\n© ${CONFIG.copyright} 2026`;
    DOM.quickResultOutput.value = report;
}

function showResults() {
    DOM.resultsSection?.classList.add('show');
    DOM.resultsSection?.scrollIntoView({ behavior: 'smooth' });
}

function hideResults() {
    DOM.resultsSection?.classList.remove('show');
}

// ===== COPY =====
function copyMainResult() {
    const text = DOM.resultContent?.textContent;
    if (text) {
        copyToClipboard(text);
        if (DOM.copyResult) {
            DOM.copyResult.classList.add('copied');
            const span = DOM.copyResult.querySelector('span');
            if (span) span.textContent = 'কপি হয়েছে!';
            setTimeout(() => {
                DOM.copyResult.classList.remove('copied');
                if (span) span.textContent = 'কপি';
            }, 2500);
        }
    }
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('কপি করা হয়েছে!', 'success');
    } catch {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.cssText = 'position:fixed;opacity:0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('কপি করা হয়েছে!', 'success');
    }
}

// ===== EXPORT & SHARE =====
function exportResults() {
    const text = DOM.quickResultOutput?.value || DOM.resultContent?.textContent;
    if (!text) { showToast('এক্সপোর্ট করার কিছু নেই', 'error'); return; }
    
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GapChecker_Report_${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('রিপোর্ট ডাউনলোড হয়েছে!', 'success');
}

async function shareResults() {
    const text = DOM.quickResultOutput?.value || DOM.resultContent?.textContent;
    if (!text) { showToast('শেয়ার করার কিছু নেই', 'error'); return; }
    
    if (navigator.share) {
        try {
            await navigator.share({ title: 'GapChecker Pro Report', text });
        } catch (e) {
            if (e.name !== 'AbortError') copyToClipboard(text);
        }
    } else {
        copyToClipboard(text);
    }
}

// ===== HISTORY =====
function saveToHistory(data) {
    let history = getFromStorage(STORAGE_KEYS.history, []);
    history.unshift({
        linkNo: data.linkNo,
        date: data.timestamp,
        allDoneCount: data.allDoneCount,
        totalComment: data.totalComment,
        groupComment: data.groupComment,
        supportGap: data.supportGap,
        percent: data.percent
    });
    saveToStorage(STORAGE_KEYS.history, history.slice(0, CONFIG.maxHistory));
    updateHistoryBadge();
}

function updateHistoryBadge() {
    const history = getFromStorage(STORAGE_KEYS.history, []);
    if (DOM.historyCount) DOM.historyCount.textContent = history.length;
}

function renderHistory() {
    const history = getFromStorage(STORAGE_KEYS.history, []);
    if (!DOM.historyList) return;
    
    if (history.length === 0) {
        DOM.historyList.innerHTML = '<div class="no-history"><i class="fa-solid fa-clock-rotate-left"></i><p>কোনো হিস্ট্রি নেই</p></div>';
        return;
    }
    
    DOM.historyList.innerHTML = history.map((item) => `
        <div class="history-item">
            <div class="history-item-header">
                <span class="history-item-title"><i class="fa-solid fa-link"></i> Link No: ${item.linkNo}</span>
                <span class="history-item-date">${item.date}</span>
            </div>
            <div class="history-item-stats">
                <span><i class="fa-solid fa-clipboard-check"></i> ${item.allDoneCount}</span>
                <span><i class="fa-solid fa-comments"></i> ${item.totalComment}</span>
                <span><i class="fa-solid fa-user-check"></i> ${item.groupComment}</span>
                <span><i class="fa-solid fa-user-xmark"></i> ${item.supportGap}</span>
                <span><i class="fa-solid fa-percent"></i> ${item.percent}%</span>
            </div>
        </div>
    `).join('');
}

function clearAllHistory() {
    if (!confirm('সব হিস্ট্রি মুছে ফেলতে চান?')) return;
    localStorage.removeItem(STORAGE_KEYS.history);
    updateHistoryBadge();
    renderHistory();
    showToast('হিস্ট্রি মুছে ফেলা হয়েছে', 'info');
}

// ===== MODALS =====
function openHistoryModal() {
    renderHistory();
    DOM.historyModal?.classList.add('show');
}

function closeHistoryModal() {
    DOM.historyModal?.classList.remove('show');
}

function closeQuickResultModal() {
    DOM.quickResultModal?.classList.remove('show');
}

// ===== LOADING =====
function showLoading() {
    DOM.loadingOverlay?.classList.add('show');
}

function hideLoading() {
    DOM.loadingOverlay?.classList.remove('show');
}

// ===== TOAST =====
function showToast(message, type = 'info') {
    if (!DOM.toast) return;
    const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info', warning: 'fa-triangle-exclamation' };
    const toastIcon = DOM.toast.querySelector('.toast-icon');
    const toastMessage = DOM.toast.querySelector('.toast-message');
    if (toastIcon) toastIcon.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i>`;
    if (toastMessage) toastMessage.textContent = message;
    DOM.toast.className = `toast ${type} show`;
    setTimeout(() => DOM.toast.classList.remove('show'), CONFIG.toastDuration);
}

// ===== ERROR HANDLER =====
window.onerror = function() {
    showToast('কিছু সমস্যা হয়েছে', 'error');
    hideLoading();
    return false;
};

console.log(`🎉 ${CONFIG.appName} ready! © ${CONFIG.copyright}`);