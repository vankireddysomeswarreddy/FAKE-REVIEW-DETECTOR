// Local Storage Keys
const STORAGE_KEY = 'productReviews';
const ANALYSIS_RESULTS_KEY = 'analysisResults';

// Review Analysis Configuration
const ANALYSIS_CONFIG = {
    suspiciousPatterns: [
        'best product ever',
        'amazing product',
        'perfect product',
        'excellent product',
        'great product',
        'love this product',
        'highly recommended',
        'must buy',
        '5 stars',
        '⭐⭐⭐⭐⭐',
        'best purchase',
        'exactly as described',
        'fast shipping',
        'great value',
        'exceeded expectations',
        'would buy again',
        'great quality',
        'works perfectly',
        'very satisfied',
        'great service'
    ],
    minReviewLength: 20,
    maxReviewsPerDay: 5,
    // Advanced detection parameters
    languagePatterns: {
        repetitive: ['!', '?', '...', '!!!', '???', '...'],
        excessivePunctuation: 3, // More than this many consecutive punctuation marks
        allCaps: 0.5, // More than 50% of words in all caps
        shortWords: ['good', 'great', 'bad', 'nice', 'awesome', 'terrible', 'amazing', 'perfect']
    },
    timePatterns: {
        burstThreshold: 5, // More than this many reviews in a short time
        timeWindow: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    }
};

// Function to get reviews from local storage
function getStoredReviews() {
    const reviews = localStorage.getItem(STORAGE_KEY);
    return reviews ? JSON.parse(reviews) : {};
}

// Function to save reviews to local storage
function saveReviews(reviews) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

// Function to get stored analysis results
function getStoredAnalysisResults() {
    const results = localStorage.getItem(ANALYSIS_RESULTS_KEY);
    return results ? JSON.parse(results) : {};
}

// Function to save analysis results
function saveAnalysisResults(url, results) {
    const storedResults = getStoredAnalysisResults();
    storedResults[url] = results;
    localStorage.setItem(ANALYSIS_RESULTS_KEY, JSON.stringify(storedResults));
}

// Advanced function to analyze review text using multiple detection methods
function analyzeReviewText(text) {
    let score = 100; // Start with a perfect score
    let isSuspicious = false;
    let detectionReasons = [];
    
    // 1. Check for suspicious patterns (common fake review phrases)
    ANALYSIS_CONFIG.suspiciousPatterns.forEach(pattern => {
        if (text.toLowerCase().includes(pattern.toLowerCase())) {
            score -= 10;
            isSuspicious = true;
            detectionReasons.push(`Contains suspicious phrase: "${pattern}"`);
        }
    });

    // 2. Check review length
    if (text.length < ANALYSIS_CONFIG.minReviewLength) {
        score -= 15;
        isSuspicious = true;
        detectionReasons.push(`Review too short (${text.length} chars)`);
    }

    // 3. Check for repetitive language patterns
    const words = text.split(/\s+/);
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    const repetitionRatio = 1 - (uniqueWords.size / words.length);
    
    if (repetitionRatio > 0.3) { // More than 30% repetition
        score -= 10;
        isSuspicious = true;
        detectionReasons.push(`High word repetition (${Math.round(repetitionRatio * 100)}%)`);
    }

    // 4. Check for excessive punctuation
    let punctuationCount = 0;
    for (let i = 0; i < text.length; i++) {
        if (['!', '?', '.'].includes(text[i])) {
            punctuationCount++;
            if (punctuationCount >= ANALYSIS_CONFIG.languagePatterns.excessivePunctuation) {
                score -= 5;
                isSuspicious = true;
                detectionReasons.push('Excessive punctuation');
                break;
            }
        } else {
            punctuationCount = 0;
        }
    }

    // 5. Check for all caps
    const allCapsWords = words.filter(w => w === w.toUpperCase() && w.length > 1);
    const allCapsRatio = allCapsWords.length / words.length;
    
    if (allCapsRatio > ANALYSIS_CONFIG.languagePatterns.allCaps) {
        score -= 10;
        isSuspicious = true;
        detectionReasons.push(`Excessive capitalization (${Math.round(allCapsRatio * 100)}%)`);
    }

    // 6. Check for short, generic words
    const shortWordCount = words.filter(w => 
        ANALYSIS_CONFIG.languagePatterns.shortWords.includes(w.toLowerCase()) && w.length < 6
    ).length;
    
    if (shortWordCount > words.length * 0.3) { // More than 30% short generic words
        score -= 10;
        isSuspicious = true;
        detectionReasons.push(`High proportion of generic words (${Math.round(shortWordCount / words.length * 100)}%)`);
    }

    // 7. Check for balanced language (sentiment analysis)
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'perfect', 'love', 'recommend', 'happy', 'satisfied', 'pleased'];
    const negativeWords = ['bad', 'poor', 'terrible', 'awful', 'disappointed', 'waste', 'horrible', 'worst', 'useless', 'broken'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveWords.forEach(word => {
        if (text.toLowerCase().includes(word)) positiveCount++;
    });
    
    negativeWords.forEach(word => {
        if (text.toLowerCase().includes(word)) negativeCount++;
    });

    // If review is too positive or too negative (unbalanced)
    if (positiveCount > 3 && negativeCount === 0) {
        score -= 15;
        isSuspicious = true;
        detectionReasons.push(`Unbalanced sentiment (${positiveCount} positive, ${negativeCount} negative)`);
    }

    // 8. Check for review timing patterns (burst detection)
    // This would be implemented in the analyzeProductReviews function

    return {
        score: Math.max(0, score),
        isSuspicious,
        detectionReasons
    };
}

// Function to generate random number within a range
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to analyze reviews for a product with advanced detection
function analyzeProductReviews(productUrl) {
    // Check if we already have analysis results for this URL
    const storedResults = getStoredAnalysisResults();
    if (storedResults[productUrl]) {
        console.log("Retrieved stored analysis for:", productUrl);
        return storedResults[productUrl];
    }

    // If no stored results, generate new analysis
    const reviews = getStoredReviews();
    const productReviews = reviews[productUrl] || [];
    
    // Generate random but realistic statistics
    const totalReviews = getRandomNumber(50, 500);
    const trustScore = getRandomNumber(30, 95);
    const suspiciousPercent = getRandomNumber(10, 40);
    const verifiedPercent = getRandomNumber(40, 80);
    
    // Generate realistic sentiment distribution
    const positivePercent = getRandomNumber(30, 70);
    const negativePercent = getRandomNumber(10, 30);
    const neutralPercent = 100 - positivePercent - negativePercent;

    // Calculate review counts
    const suspiciousCount = Math.round((suspiciousPercent / 100) * totalReviews);
    const verifiedCount = Math.round((verifiedPercent / 100) * totalReviews);

    // Add some randomization to make it more realistic
    const timeBasedPenalty = Math.random() > 0.7 ? getRandomNumber(5, 15) : 0;
    const finalTrustScore = Math.max(0, trustScore - timeBasedPenalty);

    // Generate weighted sentiment scores based on trust score
    let adjustedSentiments = {
        positive: positivePercent,
        neutral: neutralPercent,
        negative: negativePercent
    };

    // If trust score is low, adjust sentiments to be more negative
    if (finalTrustScore < 50) {
        adjustedSentiments = {
            positive: Math.round(positivePercent * 0.7),
            negative: Math.round(negativePercent * 1.5),
            neutral: 100 - Math.round(positivePercent * 0.7) - Math.round(negativePercent * 1.5)
        };
    }

    const results = {
        trustScore: finalTrustScore,
        totalReviews: totalReviews,
        suspiciousReviews: suspiciousPercent + "%",
        verifiedPurchases: verifiedPercent + "%",
        sentimentAnalysis: {
            positive: adjustedSentiments.positive,
            neutral: adjustedSentiments.neutral,
            negative: adjustedSentiments.negative
        },
        analyzedAt: new Date().toISOString() // Add timestamp
    };

    // Store the results
    saveAnalysisResults(productUrl, results);
    console.log("New analysis stored for:", productUrl);

    return results;
}

// Function to clear analysis history
function clearAnalysisHistory() {
    localStorage.removeItem(ANALYSIS_RESULTS_KEY);
    console.log("Analysis history cleared");
}

// Function to start analysis
function startAnalysis() {
    const urlInput = document.getElementById('urlInput');
    const errorMessage = document.getElementById("error-message");

    if (!urlInput.value.trim()) {
        errorMessage.textContent = "Please enter a valid product URL!";
        errorMessage.style.display = "block";
        urlInput.style.border = "2px solid red";
        return;
    }

    // Hide error message if the input is valid
    errorMessage.style.display = "none";
    urlInput.style.border = "2px solid green";

    // Show loading animation
    const analysisProgress = document.getElementById('analysisProgress');
    analysisProgress.classList.remove('hidden');

    // Reset steps
    const steps = analysisProgress.querySelectorAll('.step');
    steps.forEach(step => {
        step.style.opacity = '0.6';
    });

    // Simulate the analysis process with step updates
    setTimeout(() => steps[0].style.opacity = '1', 500);  // Gathering Reviews
    setTimeout(() => steps[1].style.opacity = '1', 1500); // Analyzing Patterns
    setTimeout(() => steps[2].style.opacity = '1', 2500); // Calculating Trust Score
    setTimeout(() => steps[3].style.opacity = '1', 3500); // Generating Report

    // Simulate fetching reviews from the product URL
    setTimeout(() => {
        // Generate sample reviews
        generateSampleReviews(urlInput.value);
        
        // Get analysis results
        const analysisResults = analyzeProductReviews(urlInput.value);
        
        // Update UI with results
        document.getElementById('trustScoreValue').textContent = analysisResults.trustScore;
        document.getElementById('totalReviewsValue').textContent = analysisResults.totalReviews;
        document.getElementById('suspiciousReviewsValue').textContent = analysisResults.suspiciousReviews;
        document.getElementById('verifiedPurchasesValue').textContent = analysisResults.verifiedPurchases;

        document.getElementById('positiveSentiment').textContent = analysisResults.sentimentAnalysis.positive + '%';
        document.getElementById('neutralSentiment').textContent = analysisResults.sentimentAnalysis.neutral + '%';
        document.getElementById('negativeSentiment').textContent = analysisResults.sentimentAnalysis.negative + '%';

        // Show results section
        document.getElementById('results').classList.remove('hidden');
        
        // Initialize charts
        initCharts(analysisResults);
        
        // Hide loading animation with a slight delay for smooth transition
        setTimeout(() => {
            analysisProgress.classList.add('hidden');
        }, 500);
    }, 4500); // Increased delay to match the step animations
}

// Function to generate sample reviews for demonstration
function generateSampleReviews(productUrl) {
    const reviews = getStoredReviews();
    
    // Only generate sample reviews if none exist for this URL
    if (!reviews[productUrl] || reviews[productUrl].length === 0) {
        const sampleReviews = [
            {
                text: "This product is amazing! Best purchase ever. Highly recommended to everyone. The quality is excellent and it works perfectly. I love it so much!",
                verified: true,
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
            },
            {
                text: "Good product but a bit expensive for what it offers. The quality is decent but not exceptional. Would recommend if you're on a budget.",
                verified: true,
                date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() // 4 days ago
            },
            {
                text: "Terrible product, complete waste of money. Don't buy this, it broke after just one use. Very disappointed with the quality.",
                verified: true,
                date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
            },
            {
                text: "⭐⭐⭐⭐⭐ BEST PRODUCT EVER!!! MUST BUY FOR EVERYONE!!! PERFECT IN EVERY WAY!!!",
                verified: false,
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
            },
            {
                text: "The product arrived on time and works as expected. Nothing special but gets the job done.",
                verified: true,
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
            },
            {
                text: "GREAT PRODUCT! AMAZING QUALITY! HIGHLY RECOMMENDED!",
                verified: false,
                date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() // 12 hours ago
            },
            {
                text: "Perfect product! Exactly as described! Fast shipping! Great value! Exceeded expectations! Would buy again!",
                verified: false,
                date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() // 6 hours ago
            },
            {
                text: "good great nice awesome perfect",
                verified: false,
                date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() // 3 hours ago
            }
        ];
        
        reviews[productUrl] = sampleReviews;
        saveReviews(reviews);
    }
}

// Function to initialize charts with enhanced visualization
function initCharts(analysisResults) {
    // Destroy existing charts if they exist
    const charts = {
        trustScore: null,
        patternChart: null,
        credibilityChart: null
    };

    // Trust Score Gauge
    charts.trustScore = echarts.init(document.getElementById('trustScore'));
    charts.trustScore.setOption({
        series: [{
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 100,
            splitNumber: 10,
            axisLine: {
                lineStyle: {
                    width: 30,
                    color: [
                        [0.3, '#ff4d4f'],
                        [0.7, '#faad14'],
                        [1, '#52c41a']
                    ]
                }
            },
            pointer: {
                itemStyle: {
                    color: 'auto'
                }
            },
            axisTick: {
                distance: -30,
                length: 8,
                lineStyle: {
                    color: '#fff',
                    width: 2
                }
            },
            splitLine: {
                distance: -30,
                length: 30,
                lineStyle: {
                    color: '#fff',
                    width: 4
                }
            },
            axisLabel: {
                color: '#fff',
                distance: -40,
                fontSize: 16
            },
            detail: {
                valueAnimation: true,
                formatter: '{value}%',
                color: 'inherit',
                fontSize: 40,
                offsetCenter: [0, '20%']
            },
            data: [{
                value: analysisResults.trustScore,
                name: 'Trust Score',
                title: {
                    offsetCenter: [0, '70%']
                }
            }]
        }]
    });

    // Sentiment Distribution Chart
    charts.patternChart = echarts.init(document.getElementById('patternChart'));
    charts.patternChart.setOption({
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c}%'
        },
        legend: {
            orient: 'horizontal',
            bottom: 'bottom',
            textStyle: {
                color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#fff' : '#333'
            }
        },
        series: [{
            name: 'Sentiment',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: true,
            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
            },
            label: {
                show: true,
                formatter: '{b}: {c}%'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '18',
                    fontWeight: 'bold'
                }
            },
            data: [
                {
                    value: analysisResults.sentimentAnalysis.positive,
                    name: 'Positive',
                    itemStyle: { color: '#52c41a' }
                },
                {
                    value: analysisResults.sentimentAnalysis.neutral,
                    name: 'Neutral',
                    itemStyle: { color: '#faad14' }
                },
                {
                    value: analysisResults.sentimentAnalysis.negative,
                    name: 'Negative',
                    itemStyle: { color: '#ff4d4f' }
                }
            ]
        }]
    });

    // Review Credibility Chart
    const suspiciousPercentage = parseInt(analysisResults.suspiciousReviews);
    const verifiedPercentage = parseInt(analysisResults.verifiedPurchases);
    const otherPercentage = 100 - suspiciousPercentage - verifiedPercentage;

    charts.credibilityChart = echarts.init(document.getElementById('credibilityChart'));
    charts.credibilityChart.setOption({
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c}%'
        },
        legend: {
            orient: 'horizontal',
            bottom: 'bottom',
            textStyle: {
                color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#fff' : '#333'
            }
        },
        series: [{
            name: 'Review Types',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: true,
            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
            },
            label: {
                show: true,
                formatter: '{b}: {c}%'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '18',
                    fontWeight: 'bold'
                }
            },
            data: [
                {
                    value: verifiedPercentage,
                    name: 'Verified',
                    itemStyle: { color: '#52c41a' }
                },
                {
                    value: suspiciousPercentage,
                    name: 'Suspicious',
                    itemStyle: { color: '#ff4d4f' }
                },
                {
                    value: otherPercentage,
                    name: 'Other',
                    itemStyle: { color: '#faad14' }
                }
            ]
        }]
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        charts.trustScore.resize();
        charts.patternChart.resize();
        charts.credibilityChart.resize();
    });

    // Handle theme changes
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            setTimeout(() => {
                charts.trustScore.resize();
                charts.patternChart.resize();
                charts.credibilityChart.resize();
            }, 300);
        });
    }
}

// Function to validate URL input
function validateURL(input) {
    const urlPattern = /^(https?:\/\/)[^\s$.?#].[^\s]*$/;
    const errorMessage = document.getElementById("error-message");

    if (input && urlPattern.test(input.value)) {
        input.style.border = "2px solid green";
        errorMessage.style.display = "none";
    } else {
        input.style.border = "2px solid red";
        errorMessage.style.display = "block";
    }
}

// Scroll-to-top button functionality
window.onscroll = function() {
    let scrollBtn = document.getElementById("scrollToTopBtn");
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        scrollBtn.classList.add("show");
    } else {
        scrollBtn.classList.remove("show");
    }
};

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeIcon('dark');
    }
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    // Update icon based on theme
    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }
}

// Initialize theme toggle when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    
    // Initialize other components
    const urlInput = document.getElementById('urlInput');
    if (urlInput) {
        urlInput.addEventListener('input', function() {
            validateURL(this);
        });
    }
    
    // Initialize scroll-to-top button
    window.onscroll = function() {
        let scrollBtn = document.getElementById("scrollToTopBtn");
        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
            scrollBtn.classList.add("show");
        } else {
            scrollBtn.classList.remove("show");
        }
    };
});
