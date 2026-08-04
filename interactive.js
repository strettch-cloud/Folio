
// =========================================================================
// SECTION 11: Top-Level State & Persistence (Section 11)
// =========================================================================

// Load active reading plan or use default seed data if memory is empty
let curricula = JSON.parse(localStorage.getItem('curriculaData')) || [
    {
        id: "c1",
        theme: "Narrative craft",
        subtitle: "Storytelling & structure",
        start: "Jan 4",
        end: "Mar 2, 2026",
        active: true,
        archived: false,
        items: [
            {
                id: "i1",
                title: "The Anatomy of Story",
                by: "John Truby",
                source: "",
                type: "Book",
                status: "Completed"
            },
            {
                id: "i2",
                title: "Bird by Bird",
                by: "Anne Lamott",
                source: "",
                type: "Book",
                status: "In progress"
            }
        ]
    }
];

// Load backlog items or fallback to your target seed items (Section 10)
let backlog = JSON.parse(localStorage.getItem('backlogData')) || [
    {
        id: "b1",
        title: "Where Good Ideas Come From",
        by: "Steven Johnson",
        source: "",
        type: "Book",
        tags: ["creativity", "history"],
        note: "Recommended by M.",
        status: "Not started"
    },
    {
        id: "b2",
        title: "The Death and Life of Great American Cities",
        by: "Jane Jacobs",
        source: "",
        type: "Book",
        tags: ["cities", "design"],
        note: "",
        status: "Not started"
    },
    {
        id: "b4",
        title: "The case for slow reading",
        by: "",
        source: "The Atlantic",
        type: "Article",
        tags: ["reading"],
        note: "",
        status: "Not started"
    }
];

// Active global variables for search filtering parameters (Section 8)
let searchStringQuery = "";
let activeTypePillFilter = "All";

// Helper function to sync array updates into browser memory disk
function saveStateToDisk() {
    localStorage.setItem('curriculaData', JSON.stringify(curricula));
    localStorage.setItem('backlogData', JSON.stringify(backlog));
}

// Central master render call pipeline updating all views
function renderApp() {
    renderActiveCurricula();
    renderBacklogView();
}

// =========================================================================
// VIEW 1: Active Curriculum List & Progress Bar (Section 5)
// =========================================================================

function renderActiveCurricula() {
    // 1. Check for the container element FIRST
    const cardsContainer = document.getElementById('reading-list-container');
    if (!cardsContainer) return; // Exit immediately if on the backlog page!

    // 2. Now it is completely safe to fetch data and look for title elements
    const activeCurriculum = curricula.find(c => c.active && !c.archived);
    if (!activeCurriculum) return;

    // 3. Connect text elements safely
    const titleEl = document.getElementById('curriculum-title');
    const metaEl = document.getElementById('curriculum-meta');
    if (titleEl) titleEl.textContent = activeCurriculum.theme;
    if (metaEl) metaEl.textContent = `${activeCurriculum.subtitle} · ${activeCurriculum.start} – ${activeCurriculum.end}`;

    // 4. Wipe old rows and render cards
    cardsContainer.innerHTML = '';

    let completedCount = 0;
    const totalCount = activeCurriculum.items.length;

    activeCurriculum.items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.dataset.id = item.id;

        let statusClass = 'status-todo';
        if (item.status === 'In progress') statusClass = 'status-doing';
        if (item.status === 'Completed') {
            statusClass = 'status-done';
            completedCount++;
        }

        card.innerHTML = `
            <div class="item-main">
              <p class="item-title">${item.title}</p>
              <p class="meta">${item.type === 'Book' ? item.by : item.source}</p>
            </div>
            <span class="badge type-${item.type.toLowerCase()}">${item.type}</span>
            <span class="badge ${statusClass}">● ${item.status}</span>
            <button class="icon-btn delete-btn" title="Delete"><i data-lucide="trash-2"></i></button>
        `;
        cardsContainer.appendChild(card);
    });

    // Compute progress metric tracking bar fill width properties
    const progressStats = document.getElementById('progress-stats');
    const progressBarFill = document.getElementById('progress-bar-fill');
    if (progressStats) progressStats.textContent = `${completedCount} of ${totalCount} completed`;
    if (progressBarFill) {
        const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
        progressBarFill.style.width = `${percentage}%`;
    }

    if (window.lucide) window.lucide.createIcons();
    attachCurriculumInteractions(activeCurriculum);
}

function attachCurriculumInteractions(activeCurriculum) {
    // Targets badges INSIDE the container element for cycling state status
    document.querySelectorAll('#reading-list-container .badge[class*="status-"]').forEach(badge => {
        badge.onclick = function() {
            const cardId = badge.closest('.item-card').dataset.id;
            const targetItem = activeCurriculum.items.find(i => i.id === cardId);
            if (targetItem) {
                // Cycles cleanly: Not started -> In progress -> Completed -> Not started
                if (targetItem.status === 'Not started') targetItem.status = 'In progress';
                else if (targetItem.status === 'In progress') targetItem.status = 'Completed';
                else targetItem.status = 'Not started';
                
                saveStateToDisk();
                renderActiveCurricula();
            }
        };
    });

    // Handle curriculum row items delete button removal click routines
    document.querySelectorAll('#reading-list-container .delete-btn').forEach(btn => {
        btn.onclick = function() {
            const cardId = btn.closest('.item-card').dataset.id;
            activeCurriculum.items = activeCurriculum.items.filter(i => i.id !== cardId);
            saveStateToDisk();
            renderActiveCurricula();
        };
    });
}

// =========================================================================
// VIEW 2: Backlog Shelf Search & Pill Filtering (Section 8)
// =========================================================================

function renderBacklogView() {
    const cardsContainer = document.getElementById('backlog-cards-container');
    if (!cardsContainer) return; 
    cardsContainer.innerHTML = '';

    // CASE-INSENSITIVE MATCH ENGINE RULE (Section 8)
    const filteredBacklogItems = backlog.filter(item => {
        const titleStr = item.title || "";
        const byStr = item.by || "";
        const sourceStr = item.source || "";
        
        const searchableContentString = `${titleStr} ${byStr} ${sourceStr}`.toLowerCase();
        const textMatches = searchableContentString.includes(searchStringQuery.toLowerCase());
        const typeMatches = activeTypePillFilter === "All" || item.type === activeTypePillFilter;
        return textMatches && typeMatches;
    });

    if (filteredBacklogItems.length === 0) {
        cardsContainer.innerHTML = `
            <div style="text-align: center; padding: 32px; color: var(--fg-2);">
                <h2>Nothing here yet</h2>
                <p>No items match. Try a different search or filter.</p>
            </div>
        `;
        return;
    }

    // Fixed loop structure and rendered cards completely
    filteredBacklogItems.forEach(item => {
        const cardElement = document.createElement('div');
        cardElement.className = 'item-card';
        cardElement.dataset.id = item.id;

        const referenceMetadataLabel = item.type === "Book" ? item.by : item.source;
        const generatedTagsHTML = item.tags ? item.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '';

        cardElement.innerHTML = `
            <div class="item-main">
              <p class="item-title">${item.title}</p>
              <p class="meta">${referenceMetadataLabel}</p>
              <div class="tag-row">${generatedTagsHTML}</div>
            </div>
            <div class="item-badges">
              <span class="badge type-${item.type.toLowerCase()}">${item.type}</span>
            </div>
            <div class="item-actions">
              <button class="icon-btn add-curric-btn" title="Add to curriculum"><i data-lucide="list-plus"></i></button>
              <button class="icon-btn edit-btn" title="Edit"><i data-lucide="square-pen"></i></button>
              <button class="icon-btn icon-btn-danger delete-backlog-btn" title="Delete"><i data-lucide="trash-2"></i></button>
            </div>
        `;
        cardsContainer.appendChild(cardElement);
    });

    if (window.lucide) window.lucide.createIcons();
    attachBacklogInteractions();
}

function setupToolbarListeners() {
    const searchInput = document.getElementById('backlog-search');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            searchStringQuery = e.target.value;
            renderBacklogView();
        });
    }

    document.querySelectorAll('.filter-pills button, .filter-pills .pill').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelector('.filter-pills .active')?.classList.remove('active');
            button.classList.add('active');
            
            let filterValue = button.textContent.trim().replace(/s$/, ''); 
            activeTypePillFilter = button.dataset.filter || filterValue;
            renderBacklogView();
        });
    });
}
function attachBacklogInteractions() {
    // Handle deleting from backlog list
    document.querySelectorAll('#backlog-cards-container .delete-backlog-btn').forEach(button => {button.onclick = function() {
        const currentCard = button.closest('.item-card');
        backlog = backlog.filter(item => item.id !== currentCard.dataset.id);
        saveStateToDisk();renderBacklogView();
    };
});
// Handle moving items from backlog list to active curriculum checklist array 
    document.querySelectorAll('#backlog-cards-container .add-curric-btn').forEach(button => {button.onclick = function() {
        const currentCard = button.closest('.item-card');
        const targetId = currentCard.dataset.id;
        const itemToMove = backlog.find(item => item.id === targetId);
        const activeCurriculum = curricula.find(c => c.active && !c.archived);
        if (itemToMove && activeCurriculum) {
            backlog = backlog.filter(item => item.id !== targetId);
            itemToMove.id = "i_" + Date.now();
            activeCurriculum.items.push(itemToMove);
            saveStateToDisk();
            window.location.href = "Reading_Curriculum.html"; // Safe cross-page transition update
    }
}});
}// =========================================================================// RUNTIME LIFECYCLE INVOCATION// =========================================================================
window.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('curriculaData') || !localStorage.getItem('backlogData')) {
        saveStateToDisk();
    }
    setupToolbarListeners();
    renderApp();
});
