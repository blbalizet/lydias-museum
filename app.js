// ===== MUSEO BALIZET - Main JavaScript =====

let museumsData = null;
let currentMuseum = null;
let currentLesson = null;
let currentPage = 0;

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    loadContent();
    setupRequestForm();
});

// ===== LOAD CONTENT FROM JSON =====
async function loadContent() {
    try {
        const response = await fetch('content.json');
        if (!response.ok) {
            throw new Error('Failed to load content.json');
        }
        museumsData = await response.json();
        renderMuseums();
        updateProgressStats();
    } catch (error) {
        console.error('Error loading content:', error);
        document.getElementById('museum-grid').innerHTML = 
            '<p style="color: #383d97; text-align: center; padding: 40px;">Content is loading... If this persists, please check that content.json is in the same folder.</p>';
    }
}

// ===== RENDER MUSEUMS GRID =====
function renderMuseums() {
    const grid = document.getElementById('museum-grid');
    if (!museumsData || !museumsData.museums) {
        grid.innerHTML = '<p>No museums available yet.</p>';
        return;
    }

    const visibleMuseums = museumsData.museums.filter(m => m.visible !== false);
    
    grid.innerHTML = visibleMuseums.map(museum => {
        const lessonCount = museum.lessons ? museum.lessons.length : 0;
        const imageUrl = museum.imageUrl || '';
        
        return `
            <div class="museum-card" onclick="showMuseum('${museum.id}')">
                ${imageUrl ? `<img src="${imageUrl}" alt="${museum.name}" class="museum-card-image">` : ''}
                <div class="museum-card-content">
                    <h3>${museum.name}</h3>
                    <p class="location">${museum.location || ''}</p>
                    <p class="description">${museum.description || ''}</p>
                    <p class="lesson-count">${lessonCount} lesson${lessonCount !== 1 ? 's' : ''} available</p>
                </div>
            </div>
        `;
    }).join('');
}

// ===== SHOW MUSEUM DETAIL =====
function showMuseum(museumId) {
    currentMuseum = museumsData.museums.find(m => m.id === museumId);
    if (!currentMuseum) return;

    // Track visit
    trackActivity('visited', museumId, currentMuseum.name);

    const detailContent = document.getElementById('detail-content');
    const lessons = currentMuseum.lessons || [];

    let html = `
        <div class="detail-header">
            <h2>${currentMuseum.name}</h2>
            ${currentMuseum.location ? `<p class="location">${currentMuseum.location}</p>` : ''}
            ${currentMuseum.description ? `<p style="margin-top: 20px;">${currentMuseum.description}</p>` : ''}
        </div>
    `;

    // Intro video if exists
    if (currentMuseum.introVideo) {
        html += `
            <div style="margin-bottom: 30px;">
                <h3>Introduction</h3>
                ${embedYouTube(currentMuseum.introVideo)}
            </div>
        `;
    }

    // Lessons
    if (lessons.length > 0) {
        html += `<div class="lesson-list"><h3>Explore</h3>`;
        lessons.forEach(lesson => {
            const completed = isLessonCompleted(lesson.id);
            html += `
                <div class="lesson-item ${completed ? 'completed' : ''}" onclick="openLesson('${lesson.id}')">
                    <h4>${lesson.title}</h4>
                    <span class="lesson-type">${getLessonTypeLabel(lesson.type)}</span>
                    ${lesson.description ? `<p class="lesson-description">${lesson.description}</p>` : ''}
                    ${lesson.note ? `<p class="lesson-note">${lesson.note}</p>` : ''}
                </div>
            `;
        });
        html += `</div>`;
    } else {
        html += `<p style="font-style: italic; color: #666;">More content coming soon!</p>`;
    }

    detailContent.innerHTML = html;
    showSection('detail');
}

// ===== OPEN LESSON =====
function openLesson(lessonId) {
    const lesson = currentMuseum.lessons.find(l => l.id === lessonId);
    if (!lesson) return;

    currentLesson = lesson;
    currentPage = 0;

    trackActivity('started', lessonId, lesson.title);

    if (lesson.type === 'youtube') {
        showYouTubeLesson(lesson);
    } else if (lesson.type === 'external') {
        showExternalLesson(lesson);
    } else if (lesson.type === 'custom') {
        showCustomLesson(lesson);
    }
}

// ===== SHOW YOUTUBE LESSON =====
function showYouTubeLesson(lesson) {
    const content = `
        <div class="detail-header">
            <h2>${lesson.title}</h2>
            ${lesson.description ? `<p>${lesson.description}</p>` : ''}
        </div>
        ${embedYouTube(lesson.url)}
        <div style="margin-top: 30px; text-align: center;">
            <button class="submit-btn" onclick="markComplete('${lesson.id}')">Mark as Complete</button>
        </div>
    `;
    
    document.getElementById('detail-content').innerHTML = content;
    showSection('detail');
}

// ===== SHOW EXTERNAL LESSON =====
function showExternalLesson(lesson) {
    const content = `
        <div class="detail-header">
            <h2>${lesson.title}</h2>
            ${lesson.description ? `<p>${lesson.description}</p>` : ''}
            ${lesson.note ? `<p style="background: #f8f9ff; padding: 15px; border-radius: 8px; margin-top: 15px;"><strong>📝 Note:</strong> ${lesson.note}</p>` : ''}
        </div>
        <div style="background: #FFFFFF; padding: 30px; border-radius: 12px; margin: 20px 0; text-align: center; border: 2px solid #383d97;">
            <p style="margin-bottom: 20px;">This course is hosted on an external platform.</p>
            ${lesson.note && lesson.note.includes('login') ? `
                <div style="background: #f8f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: left;">
                    <p style="margin-bottom: 10px;"><strong>Login Credentials:</strong></p>
                    <p><strong>Username:</strong> blborganize@gmail.com</p>
                    <p><strong>Password:</strong> museosenora</p>
                    <p style="margin-top: 15px; font-size: 0.9em; font-style: italic;">You'll only need to enter these once on this device.</p>
                </div>
            ` : ''}
            <a href="${lesson.url}" target="_blank" class="submit-btn" style="display: inline-block; text-decoration: none;">Open Course</a>
        </div>
        <div style="margin-top: 30px; text-align: center;">
            <button class="submit-btn" onclick="markComplete('${lesson.id}')">Mark as Visited</button>
        </div>
    `;
    
    document.getElementById('detail-content').innerHTML = content;
    showSection('detail');
}

// ===== SHOW CUSTOM MULTI-PAGE LESSON =====
function showCustomLesson(lesson) {
    document.getElementById('lesson-header').innerHTML = `
        <h2>${lesson.title}</h2>
        ${lesson.author ? `<p class="author">${lesson.author}</p>` : ''}
    `;
    
    renderLessonPage();
    showSection('lesson');
}

// ===== RENDER LESSON PAGE =====
function renderLessonPage() {
    if (!currentLesson || !currentLesson.content) return;
    
    const content = currentLesson.content;
    const totalPages = content.length;
    const pageData = content[currentPage];
    
    let html = '';
    
    if (pageData.type === 'text') {
        html = `<div class="lesson-text">${pageData.text}</div>`;
    } else if (pageData.type === 'image') {
        html = `
            <div class="lesson-image">
                <img src="${pageData.url}" alt="${pageData.caption || ''}">
                ${pageData.caption ? `<p class="caption">${pageData.caption}</p>` : ''}
            </div>
        `;
    } else if (pageData.type === 'youtube') {
        html = `
            ${pageData.description ? `<p class="lesson-text">${pageData.description}</p>` : ''}
            ${embedYouTube(pageData.url)}
        `;
    }
    
    document.getElementById('lesson-page').innerHTML = html;
    document.getElementById('page-indicator').textContent = `Page ${currentPage + 1} of ${totalPages}`;
    
    document.getElementById('prev-btn').disabled = currentPage === 0;
    document.getElementById('next-btn').disabled = currentPage === totalPages - 1;
    
    // Show complete button on last page
    if (currentPage === totalPages - 1) {
        html += `
            <div style="margin-top: 30px; text-align: center;">
                <button class="submit-btn" onclick="markComplete('${currentLesson.id}')">Mark as Complete</button>
            </div>
        `;
        document.getElementById('lesson-page').innerHTML = html;
    }
}

function nextPage() {
    if (currentLesson && currentPage < currentLesson.content.length - 1) {
        currentPage++;
        renderLessonPage();
    }
}

function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        renderLessonPage();
    }
}

function closeLesson() {
    showMuseum(currentMuseum.id);
}

// ===== EMBED YOUTUBE VIDEO =====
function embedYouTube(url) {
    const videoId = extractYouTubeId(url);
    if (!videoId) return `<p>Invalid YouTube URL</p>`;
    
    return `
        <div class="video-container">
            <iframe 
                src="https://www.youtube.com/embed/${videoId}" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        </div>
    `;
}

function extractYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// ===== NAVIGATION =====
function showSection(sectionName) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`${sectionName}-section`).classList.add('active');
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    if (sectionName === 'home' || sectionName === 'progress' || sectionName === 'request') {
        document.querySelector(`.nav-btn[onclick="showSection('${sectionName}')"]`)?.classList.add('active');
    }
    
    if (sectionName === 'progress') {
        updateProgressDisplay();
    }
}

// ===== PROGRESS TRACKING =====
function getProgress() {
    const stored = localStorage.getItem('museoBalizet_progress');
    return stored ? JSON.parse(stored) : { completed: [], activity: [] };
}

function saveProgress(progress) {
    localStorage.setItem('museoBalizet_progress', JSON.stringify(progress));
}

function isLessonCompleted(lessonId) {
    const progress = getProgress();
    return progress.completed.includes(lessonId);
}

function markComplete(lessonId) {
    const progress = getProgress();
    if (!progress.completed.includes(lessonId)) {
        progress.completed.push(lessonId);
        trackActivity('completed', lessonId, currentLesson.title);
        saveProgress(progress);
        alert('✓ Lesson marked as complete!');
        updateProgressStats();
        if (currentMuseum) {
            showMuseum(currentMuseum.id);
        }
    }
}

function trackActivity(action, id, title) {
    const progress = getProgress();
    progress.activity = progress.activity || [];
    progress.activity.unshift({
        action,
        id,
        title,
        timestamp: new Date().toISOString()
    });
    progress.activity = progress.activity.slice(0, 20); // Keep last 20
    saveProgress(progress);
}

function updateProgressStats() {
    if (!museumsData) return;
    
    const progress = getProgress();
    const totalLessons = museumsData.museums.reduce((sum, m) => sum + (m.lessons?.length || 0), 0);
    const visitedMuseums = new Set(progress.activity?.filter(a => a.action === 'visited').map(a => a.id) || []).size;
    
    document.getElementById('completed-count').textContent = progress.completed.length;
    document.getElementById('museum-count').textContent = visitedMuseums;
    document.getElementById('total-count').textContent = totalLessons;
}

function updateProgressDisplay() {
    const progress = getProgress();
    const recentDiv = document.getElementById('recent-activity');
    
    if (!progress.activity || progress.activity.length === 0) {
        recentDiv.innerHTML = '<p style="font-style: italic; color: #666;">No activity yet. Start exploring!</p>';
        return;
    }
    
    recentDiv.innerHTML = progress.activity.slice(0, 10).map(item => `
        <div class="activity-item">
            <p class="date">${new Date(item.timestamp).toLocaleDateString()}</p>
            <p class="title">${item.action === 'completed' ? '✓ Completed' : item.action === 'visited' ? '👁 Visited' : '▶ Started'}: ${item.title}</p>
        </div>
    `).join('');
}

// ===== REQUEST FORM =====
function setupRequestForm() {
    document.getElementById('request-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const topic = document.getElementById('request-topic').value;
        const details = document.getElementById('request-details').value;
        
        const subject = encodeURIComponent('Museo Balizet - Lesson Request');
        const body = encodeURIComponent(`Hi Bernard,\n\nI'd like to request a new lesson:\n\nTopic: ${topic}\n\nDetails: ${details}\n\nThank you!`);
        
        window.location.href = `mailto:bernardaudbalizet@gmail.com?subject=${subject}&body=${body}`;
        
        document.getElementById('request-success').style.display = 'block';
        document.getElementById('request-form').reset();
        
        setTimeout(() => {
            document.getElementById('request-success').style.display = 'none';
        }, 5000);
    });
}

// ===== UTILITY =====
function getLessonTypeLabel(type) {
    const labels = {
        'youtube': 'Video',
        'external': 'External Course',
        'custom': 'Guided Lesson'
    };
    return labels[type] || 'Lesson';
}
