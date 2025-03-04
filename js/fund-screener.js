// screener_app_new/static/js/fund-screener.js
// Fund Screener State Management
const FundScreenerState = {
    filters: {},
    view: 'default',

    initialize() {
        // Load state from URL params
        const urlParams = new URLSearchParams(window.location.search);

        // Set view type
        this.view = urlParams.get('view') || 'default';

        // Load filters from URL params
        urlParams.forEach((value, key) => {
            if (key !== 'view' && key !== 'page') {
                if (this.filters[key]) {
                    if (Array.isArray(this.filters[key])) {
                        this.filters[key].push(value);
                    } else {
                        this.filters[key] = [this.filters[key], value];
                    }
                } else {
                    this.filters[key] = value;
                }
            }
        });

        // Set up event listeners for tabs
        document.querySelectorAll('.tab-btn').forEach(tab => {
            tab.addEventListener('click', () => {
                const viewType = tab.getAttribute('data-view');
                this.view = viewType;

                // Update active tab
                document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
            });
        });

        // Set up event listener for advanced filters toggle
        const advancedToggle = document.getElementById('advanced-filters-toggle');
        if (advancedToggle) {
            advancedToggle.addEventListener('click', () => {
                const advancedFilters = document.getElementById('advanced-filters');
                if (advancedFilters) {
                    advancedFilters.classList.toggle('show');

                    // Update toggle button text and icon
                    if (advancedFilters.classList.contains('show')) {
                        advancedToggle.innerHTML = 'Hide Filters <i class="fas fa-chevron-up"></i>';
                    } else {
                        advancedToggle.innerHTML = 'More Filters <i class="fas fa-chevron-down"></i>';
                    }
                }
            });
        }
    },

    updateFilters(name, value) {
        // Skip empty values
        if (value === '' || value === null || value === undefined) {
            delete this.filters[name];
        } else {
            this.filters[name] = value;
        }

        // Apply filters and reset to page 1
        this.applyFilters(true);
    },

    applyFilters(resetPage = false) {
        // Build query string
        const params = new URLSearchParams();

        // Add view type
        params.append('view', this.view);

        // Add all filters
        for (const [key, value] of Object.entries(this.filters)) {
            if (Array.isArray(value)) {
                value.forEach(v => {
                    if (v) params.append(key, v);
                });
            } else if (value) {
                params.append(key, value);
            }
        }

        // Add current page (unless resetting to page 1)
        if (!resetPage) {
            const urlParams = new URLSearchParams(window.location.search);
            const currentPage = urlParams.get('page');
            if (currentPage && currentPage !== '1') {
                params.append('page', currentPage);
            }
        }

        // Update results with new filters
        htmx.ajax('GET', `${window.location.pathname}results/?${params.toString()}`, {
            target: '#fund-results',
            pushUrl: true,
            swap: 'innerHTML',
            headers: {
                'HX-Request': 'true'
            }
        });
    },

    clearFilters() {
        // Clear filter state
        this.filters = {};

        // Reset all form elements
        document.querySelectorAll('select.filter-select').forEach(select => {
            select.selectedIndex = 0;
        });

        document.querySelectorAll('input.filter-input').forEach(input => {
            input.value = '';
        });

        // Apply empty filters (reset to page 1)
        this.applyFilters(true);
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    FundScreenerState.initialize();

    // Set up clear filters button
    const clearBtn = document.getElementById('clear-filters-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', (e) => {
            e.preventDefault();
            FundScreenerState.clearFilters();
        });
    }
});

// Debounce function for search inputs
function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}