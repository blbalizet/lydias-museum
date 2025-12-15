// ===== APP.JS - Mom's Museum Hub Application =====

// Global state
let appData = {
    museums: [],
    currentItem: null,
    currentLesson: null,
    currentPage: 0,
    progress: {
        completed: [],
        inProgress: [],
        recentActivity: []
    }
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    loadContent();
    loadProgress();
    setupEventListeners();
});

// Load content from content.json
async function loadContent() {
    try {
        const response = await fetch('content.json');
        const data = await response.json();
        appData.museums = data.museums || [];
        renderMuseumGrid();
        updateProgressStats();
    } catch (error) {
        console.error('Error loading content:', error);
        document.getElementById('museum-grid').innerHTML = `
            <p style="color: #6B4423; font-size: 1.2em;">
                Content is loading... If this persists, please check that content.json is in the same folder.
            </p>
        `;
    }
}

// ===== NAVIGATION =====
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active state from nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section
    const sectionMap = {
        'home': 'home-section',
        'progress': 'progress-section',
        'request': 'request-section'
    };
    
    const sectionId = sectionMap[sectionName];
    if (sectionId) {
        document.getElementById(sectionId).classList.add('active');
        
        // Activate corresponding nav button
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            if (btn.textContent.toLowerCase().includes(sectionName) || 
                (sectionName === 'home' && btn.textContent === 'Home')) {
                btn.classList.add('active');
            }
        });
    }
    
    // Special handling for progress section
    if (sectionName === 'progress') {
        renderProgressSection();
    }
}

// ===== MUSEUM GRID RENDERING =====
function renderMuseumGrid() {
    const grid = document.getElementById('museum-grid');
    grid.innerHTML = '';
    
    appData.museums.forEach(museum => {
        if (museum.visible !== false) {
            const card = createMuseumCard(museum);
            grid.appendChild(card);
        }
    });
}

function createMuseumCard(museum) {
    const card = document.createElement('div');
    card.className = 'museum-card';
    
    const lessonCount = museum.lessons ? museum.lessons.length : 0;
    const completedCount = getCompletedLessonsCount(museum.id);
    
    card.innerHTML = `
        <h3>${museum.name}</h3>
        <div class="location">${museum.location}</div>
        <div class="description">${museum.description}</div>
        <div class="lesson-count">
            ${completedCount} of ${lessonCount} lessons completed
        </div>
    `;
    
    card.addEventListener('click', () => showMuseumDetail(museum));
    
    return card;
}

// ===== DETAIL VIEW =====
function showMuseumDetail(museum) {
    appData.currentItem = museum;
    
    const detailContent = document.getElementById('detail-content');
    detailContent.innerHTML = `
        <div class="detail-header">
            <h2>${museum.name}</h2>
            <div class="location">${museum.location}</div>
            <p class="mt-20">${museum.description}</p>
        </div>
        
        ${museum.introVideo ? renderIntroVideo(museum.introVideo) : ''}
        
        <div class="lesson-list">
            <h3>Available Lessons</h3>
            ${renderLessonList(museum)}
        </div>
    `;
    
    // Hide home, show detail
    document.getElementById('home-section').classList.remove('active');
    document.getElementById('detail-section').classList.add('active');
}

function renderIntroVideo(videoUrl) {
    const videoId = extractYouTubeId(videoUrl);
    if (!videoId) return '';
    
    return `
        <div class="video-container">
            <iframe src="https://www.youtube.com/embed/${videoId}" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
            </iframe>
        </div>
    `;
}

function renderLessonList(museum) {
    if (!museum.lessons || museum.lessons.length === 0) {
        return '<p>Lessons coming soon!</p>';
    }
    
    return museum.lessons.map((lesson, index) => {
        const isCompleted = isLessonCompleted(museum.id, lesson.id);
        return `
            <div class="lesson-item ${isCompleted ? 'completed' : ''}" 
                 onclick="openLesson('${museum.id}', '${lesson.id}')">
                <span class="lesson-type">${lesson.type}</span>
                <h4>${lesson.title}</h4>
                <div class="lesson-description">${lesson.description || ''}</div>
            </div>
        `;
    }).join('');
}

// ===== LESSON VIEWER (Multi-page custom lessons) =====
function openLesson(museumId, lessonId) {
    const museum = appData.museums.find(m => m.id === museumId);
    if (!museum) return;
    
    const lesson = museum.lessons.find(l => l.id === lessonId);
    if (!lesson) return;
    
    appData.currentLesson = lesson;
    appData.currentPage = 0;
    
    // Add to recent activity
    addToRecentActivity(museum.name, lesson.title);
    
    // Handle different lesson types
    if (lesson.type === 'custom') {
        showCustomLesson(lesson);
    } else if (lesson.type === 'youtube') {
        showYouTubeLesson(lesson);
    } else if (lesson.type === 'external') {
        handleExternalLesson(lesson);
    }
}

function showCustomLesson(lesson) {
    // Hide detail, show lesson viewer
    document.getElementById('detail-section').classList.remove('active');
    document.getElementById('lesson-section').classList.add('active');
    
    // Render lesson header
    document.getElementById('lesson-header').innerHTML = `
        <h2>${lesson.title}</h2>
        ${lesson.author ? `<div class="author">${lesson.author}</div>` : ''}
    `;
    
    // Render first page
    renderLessonPage();
}

function renderLessonPage() {
    const lesson = appData.currentLesson;
    const pageIndex = appData.currentPage;
    const page = lesson.content[pageIndex];
    
    const pageContainer = document.getElementById('lesson-page');
    pageContainer.innerHTML = renderPageContent(page);
    
    // Update navigation
    document.getElementById('prev-btn').disabled = (pageIndex === 0);
    document.getElementById('next-btn').disabled = (pageIndex === lesson.content.length - 1);
    document.getElementById('page-indicator').textContent = 
        `Page ${pageIndex + 1} of ${lesson.content.length}`;
    
    // Mark as complete if on last page
    if (pageIndex === lesson.content.length - 1) {
        const museumId = appData.currentItem.id;
        markLessonComplete(museumId, lesson.id);
    }
}

function renderPageContent(page) {
    if (page.type === 'text') {
        return `<div class="lesson-text">${page.text}</div>`;
    } else if (page.type === 'image') {
        return `
            <div class="lesson-image">
                <img src="${page.url}" alt="${page.caption || ''}">
                ${page.caption ? `<div class="caption">${page.caption}</div>` : ''}
            </div>
        `;
    } else if (page.type === 'youtube') {
        const videoId = extractYouTubeId(page.url);
        return `
            <div class="video-container">
                <iframe src="https://www.youtube.com/embed/${videoId}" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                </iframe>
            </div>
            ${page.description ? `<div class="lesson-text mt-20">${page.description}</div>` : ''}
        `;
    }
    return '';
}

function showYouTubeLesson(lesson) {
    // For simple YouTube lessons, show in detail panel
    const detailContent = document.getElementById('detail-content');
    const videoId = extractYouTubeId(lesson.url);
    
    detailContent.innerHTML = `
        <div class="detail-header">
            <h2>${lesson.title}</h2>
            <p>${lesson.description || ''}</p>
        </div>
        
        <div class="video-container">
            <iframe src="https://www.youtube.com/embed/${videoId}" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
            </iframe>
        </div>
        
        <button class="submit-btn mt-20" onclick="markCurrentLessonComplete()">
            Mark as Complete
        </button>
    `;
}

function handleExternalLesson(lesson) {
    // For Udemy, Coursera, etc. - open in new tab
    if (confirm(`This will open ${lesson.title} in a new window. Continue?`)) {
        window.open(lesson.url, '_blank');
        
        // Add to in-progress
        const museumId = appData.currentItem.id;
        addToInProgress(museumId, lesson.id);
    }
}

function markCurrentLessonComplete() {
    if (appData.currentItem && appData.currentLesson) {
        markLessonComplete(appData.currentItem.id, appData.currentLesson.id);
        alert('Lesson marked as complete! 🎉');
    }
}

function closeLesson() {
    document.getElementById('lesson-section').classList.remove('active');
    document.getElementById('detail-section').classList.add('active');
}

function nextPage() {
    if (appData.currentPage < appData.currentLesson.content.length - 1) {
        appData.currentPage++;
        renderLessonPage();
    }
}

function prevPage() {
    if (appData.currentPage > 0) {
        appData.currentPage--;
        renderLessonPage();
    }
}

// ===== PROGRESS TRACKING =====
function loadProgress() {
    const saved = localStorage.getItem('museumProgress');
    if (saved) {
        appData.progress = JSON.parse(saved);
    }
}

function saveProgress() {
    localStorage.setItem('museumProgress', JSON.stringify(appData.progress));
}

function isLessonCompleted(museumId, lessonId) {
    return appData.progress.completed.some(
        item => item.museumId === museumId && item.lessonId === lessonId
    );
}

function markLessonComplete(museumId, lessonId) {
    if (!isLessonCompleted(museumId, lessonId)) {
        appData.progress.completed.push({
            museumId,
            lessonId,
            date: new Date().toISOString()
        });
        saveProgress();
        updateProgressStats();
    }
}

function getCompletedLessonsCount(museumId) {
    return appData.progress.completed.filter(
        item => item.museumId === museumId
    ).length;
}

function addToRecentActivity(museumName, lessonTitle) {
    const activity = {
        museum: museumName,
        lesson: lessonTitle,
        date: new Date().toISOString()
    };
    
    // Keep only last 10 activities
    appData.progress.recentActivity.unshift(activity);
    if (appData.progress.recentActivity.length > 10) {
        appData.progress.recentActivity.pop();
    }
    
    saveProgress();
}

function addToInProgress(museumId, lessonId) {
    if (!appData.progress.inProgress.some(
        item => item.museumId === museumId && item.lessonId === lessonId
    )) {
        appData.progress.inProgress.push({ museumId, lessonId });
        saveProgress();
    }
}

function updateProgressStats() {
    const totalLessons = appData.museums.reduce((sum, museum) => 
        sum + (museum.lessons ? museum.lessons.length : 0), 0
    );
    
    const completedCount = appData.progress.completed.length;
    
    const museumsExplored = new Set(
        appData.progress.completed.map(item => item.museumId)
    ).size;
    
    document.getElementById('completed-count').textContent = completedCount;
    document.getElementById('museum-count').textContent = museumsExplored;
    document.getElementById('total-count').textContent = totalLessons;
}

function renderProgressSection() {
    // Render recent activity
    const activityContainer = document.getElementById('recent-activity');
    if (appData.progress.recentActivity.length === 0) {
        activityContainer.innerHTML = '<p>No activity yet. Start exploring!</p>';
    } else {
        activityContainer.innerHTML = appData.progress.recentActivity
            .slice(0, 5)
            .map(activity => `
                <div class="activity-item">
                    <div class="date">${formatDate(activity.date)}</div>
                    <div class="title">${activity.museum}: ${activity.lesson}</div>
                </div>
            `).join('');
    }
    
    // Render in-progress items
    const inProgressContainer = document.getElementById('in-progress');
    if (appData.progress.inProgress.length === 0) {
        inProgressContainer.innerHTML = '<p>No lessons in progress.</p>';
    } else {
        inProgressContainer.innerHTML = appData.progress.inProgress
            .map(item => {
                const museum = appData.museums.find(m => m.id === item.museumId);
                const lesson = museum?.lessons.find(l => l.id === item.lessonId);
                return museum && lesson ? `
                    <div class="activity-item" onclick="openLesson('${item.museumId}', '${item.lessonId}')">
                        <div class="title">${museum.name}: ${lesson.title}</div>
                    </div>
                ` : '';
            }).join('');
    }
}

// ===== REQUEST FORM =====
function setupEventListeners() {
    const requestForm = document.getElementById('request-form');
    requestForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const topic = document.getElementById('request-topic').value;
        const details = document.getElementById('request-details').value;
        
        // Create mailto link
        const subject = encodeURIComponent('Museum Lesson Request: ' + topic);
        const body = encodeURIComponent(
            `New lesson request:\n\nTopic: ${topic}\n\nDetails: ${details}\n\nRequested: ${new Date().toLocaleDateString()}`
        );
        
        window.location.href = `mailto:bernard@agreesearch.com?subject=${subject}&body=${body}`;
        
        // Show success message
        document.getElementById('request-success').style.display = 'block';
        requestForm.reset();
        
        setTimeout(() => {
            document.getElementById('request-success').style.display = 'none';
        }, 5000);
    });
}

// ===== UTILITY FUNCTIONS =====
function extractYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function formatDate(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
}
