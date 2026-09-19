export const reportScripts = String.raw`
        function toggleTreeNode(header) {
            const treeNode = header.closest('.tree-node');
            if (!treeNode) {
                return;
            }

            treeNode.classList.toggle('collapsed');
            treeNode.classList.remove('filter-expanded');
        }

        function expandFirstTreeBranch() {
            const treeRoot = document.getElementById('testTreeList');
            if (!treeRoot) {
                return;
            }

            treeRoot.querySelectorAll('.tree-node').forEach(node => {
                node.classList.add('collapsed');
                node.classList.remove('filter-expanded');
                node.style.display = '';
            });

            let currentNode = treeRoot.querySelector(':scope > .tree-node');
            while (currentNode) {
                currentNode.classList.remove('collapsed');
                const childContainer = currentNode.querySelector(':scope > .tree-node-children');
                currentNode = childContainer ? childContainer.querySelector(':scope > .tree-node') : null;
            }
        }

        function selectTest(testId, expandTree = true) {
            const activeDetails = document.getElementById('activeTestDetails');
            if (!activeDetails) {
                return;
            }

            const template = document.getElementById('detail-template-' + testId);
            if (!template) {
                return;
            }

            document.querySelectorAll('.test-list-item').forEach(item => {
                item.classList.toggle('active', item.getAttribute('data-test-id') === testId);
            });

            const selectedItem = Array.from(document.querySelectorAll('.test-list-item')).find(item => item.getAttribute('data-test-id') === testId);
            if (expandTree && selectedItem) {
                let treeNode = selectedItem.closest('.tree-node');
                while (treeNode) {
                    treeNode.classList.remove('collapsed');
                    treeNode = treeNode.parentElement?.closest('.tree-node');
                }
            }

            activeDetails.innerHTML = template.innerHTML;
            activeDetails.scrollTop = 0;
        }

        function toggleTestDetail(testId) {
            selectTest(testId);
        }

        function toggleSection(header) {
            const section = header.parentElement;
            section.classList.toggle('section-collapsed');
        }

        function toggleStepDetails(stepHeader, detailsId) {
            const stepContainer = stepHeader.closest('.step-item-container');
            const details = stepContainer?.querySelector(':scope > .step-details') || document.getElementById(detailsId);
            if (!details) {
                return;
            }

            const isOpen = details.style.display === 'block';
            details.style.display = isOpen ? 'none' : 'block';
            stepHeader.classList.toggle('expanded', !isOpen);
        }

        function filterByStatus(checkbox) {
            const allCheckbox = document.querySelector('.status-filter[value="all"]');
            if (checkbox.value === 'all') {
                if (checkbox.checked) {
                    document.querySelectorAll('.status-filter:not([value="all"])').forEach(cb => cb.checked = false);
                }
            } else {
                if (checkbox.checked && allCheckbox) {
                    allCheckbox.checked = false;
                }
                const anyChecked = document.querySelectorAll('.status-filter:not([value="all"]):checked').length > 0;
                if (!anyChecked && allCheckbox) {
                    allCheckbox.checked = true;
                }
            }
            applyFilters();
        }

        function filterByGroup(checkbox) {
            const allCheckbox = document.querySelector('.group-filter[value="all"]');
            if (checkbox.value === 'all') {
                if (checkbox.checked) {
                    document.querySelectorAll('.group-filter:not([value="all"])').forEach(cb => cb.checked = false);
                }
            } else {
                if (checkbox.checked && allCheckbox) {
                    allCheckbox.checked = false;
                }
                const anyChecked = document.querySelectorAll('.group-filter:not([value="all"]):checked').length > 0;
                if (!anyChecked && allCheckbox) {
                    allCheckbox.checked = true;
                }
            }
            applyFilters();
        }

        function filterBySearch(input) {
            const clearButton = document.getElementById('searchClearButton');
            if (clearButton) {
                clearButton.style.display = input.value.trim() ? 'inline-flex' : 'none';
            }
            applyFilters();
        }

        function clearSearch() {
            const input = document.getElementById('testSearchInput');
            const clearButton = document.getElementById('searchClearButton');
            if (input) {
                input.value = '';
            }
            if (clearButton) {
                clearButton.style.display = 'none';
            }
            applyFilters();
            if (input) {
                input.focus();
            }
        }

        function applyFilters(expandMatchedTree = true) {
            const statusAll = document.querySelector('.status-filter[value="all"]')?.checked;
            const groupAll = document.querySelector('.group-filter[value="all"]')?.checked;
            const statusFilters = Array.from(document.querySelectorAll('.status-filter:not([value="all"]):checked')).map(f => f.value);
            const groupFilters = Array.from(document.querySelectorAll('.group-filter:not([value="all"]):checked')).map(f => f.value);
            const searchValue = document.getElementById('testSearchInput')?.value.trim().toLowerCase() || '';
            const noResults = document.getElementById('noResultsMessage');
            let visibleCount = 0;
            const hasGroupFilters = document.querySelectorAll('.group-filter').length > 0;
            const hasStatusFilters = document.querySelectorAll('.status-filter').length > 0;
            const hasActiveCriteria = !!searchValue || !statusAll || !groupAll;

            let firstVisibleTestId = null;

            if (hasActiveCriteria) {
                document.querySelectorAll('.tree-node').forEach(node => {
                    node.classList.remove('filter-expanded');
                    node.style.display = 'none';
                });
            } else {
                document.querySelectorAll('.tree-node').forEach(node => {
                    node.classList.remove('filter-expanded');
                    node.style.display = '';
                });
            }

            document.querySelectorAll('.test-list-item').forEach(row => {
                let statusMatch = !hasStatusFilters || statusAll;
                if (hasStatusFilters && !statusMatch) {
                    const rowStatus = row.classList.contains('passed') ? 'passed' :
                                       row.classList.contains('failed') ? 'failed' :
                                       row.classList.contains('flaky') ? 'flaky' : 'skipped';
                    statusMatch = statusFilters.includes(rowStatus);
                }

                let groupMatch = !hasGroupFilters || groupAll;
                if (hasGroupFilters && !groupMatch) {
                    const tags = row.getAttribute('data-tags') || '';
                    groupMatch = groupFilters.some(g => tags.toLowerCase().includes(g.toLowerCase()));
                }

                let searchMatch = true;
                if (searchValue) {
                    const searchableText = row.getAttribute('data-search') || '';
                    searchMatch = searchableText.includes(searchValue);
                }

                const isVisible = statusMatch && groupMatch && searchMatch;

                row.style.display = isVisible ? '' : 'none';

                if (isVisible) {
                    visibleCount++;
                    if (!firstVisibleTestId) {
                        firstVisibleTestId = row.getAttribute('data-test-id');
                    }

                    if (hasActiveCriteria && expandMatchedTree) {
                        let treeNode = row.closest('.tree-node');
                        while (treeNode) {
                            treeNode.style.display = '';
                            treeNode.classList.add('filter-expanded');
                            treeNode = treeNode.parentElement?.closest('.tree-node');
                        }
                    }
                }
            });

            if (noResults) {
                noResults.style.display = visibleCount === 0 ? 'block' : 'none';
            }

            const activeDetails = document.getElementById('activeTestDetails');
            if (visibleCount === 0 && activeDetails) {
                activeDetails.innerHTML = '';
            }

            const selectedItem = document.querySelector('.test-list-item.active:not([style*="display: none"])');
            if (!selectedItem && firstVisibleTestId) {
                selectTest(firstVisibleTestId, expandMatchedTree);
            } else if (selectedItem && selectedItem.style.display === 'none' && firstVisibleTestId) {
                selectTest(firstVisibleTestId, expandMatchedTree);
            }
        }

        document.addEventListener('DOMContentLoaded', function() {
            const modal = document.getElementById('screenshotModal');
            const modalImg = document.getElementById('modalImage');

            const videoModal = document.getElementById('videoModal');
            const modalVideo = document.getElementById('modalVideo');

            function closeAllModals() {
                if (modal) {
                    modal.classList.remove('active');
                }
                if (videoModal) {
                    videoModal.classList.remove('active');
                }
                if (modalVideo) {
                    modalVideo.pause();
                    modalVideo.removeAttribute('src');
                    modalVideo.load();
                }
            }

            // Screenshots and videos use event delegation so links inside the
            // dynamically swapped right-side panel still open in the lightbox.
            document.addEventListener('click', function(e) {
                const target = e.target;
                const screenshotLink = target?.closest?.('.screenshot-link');
                if (screenshotLink) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (modal && modalImg) {
                        modal.classList.add('active');
                        modalImg.src = screenshotLink.getAttribute('href') || '';
                    }
                    return;
                }

                const videoLink = target?.closest?.('.video-trigger');
                if (videoLink) {
                    e.preventDefault();
                    e.stopPropagation();
                    const src = videoLink.getAttribute('data-video-src');
                    if (videoModal && modalVideo && src) {
                        modalVideo.src = src;
                        videoModal.classList.add('active');
                        modalVideo.play().catch(() => {});
                    }
                }
            });

            document.querySelectorAll('.modal-close').forEach(function(btn) {
                btn.addEventListener('click', closeAllModals);
            });

            [modal, videoModal].forEach(function(m) {
                if (m) {
                    m.addEventListener('click', function(e) {
                        if (e.target === m) {
                            closeAllModals();
                        }
                    });
                }
            });

            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    closeAllModals();
                }
            });

            const searchInput = document.getElementById('testSearchInput');
            if (searchInput) {
                searchInput.addEventListener('input', function() {
                    filterBySearch(this);
                });
            }

            // All tests start collapsed; click a test name to expand it and
            // see its steps (the failed step inside is already expanded).
            applyFilters(false);
            expandFirstTreeBranch();

            const firstVisibleItem = document.querySelector('.test-list-item:not([style*="display: none"])');
            if (firstVisibleItem) {
                selectTest(firstVisibleItem.getAttribute('data-test-id'), false);
            }
        });
        `
