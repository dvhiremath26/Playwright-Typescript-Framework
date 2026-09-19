export const reportStyles = String.raw`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        :root {
            --primary: #2563eb;
            --primary-light: #3b82f6;
            --primary-dark: #1d4ed8;
            --primary-bg: #eff6ff;
            --accent: #0284c7;
            --success: #2563eb;
            --pass: #25eb60;
            --danger: #ef4444;
            --warning: #f59e0b;
            --info: #3b82f6;
            --dark: #1e293b;
            --gray-50: #f8fafc;
            --gray-100: #f1f5f9;
            --gray-200: #e2e8f0;
            --gray-300: #cbd5e1;
            --gray-400: #94a3b8;
            --gray-500: #64748b;
            --gray-600: #475569;
            --gray-700: #334155;
            --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
            --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
            --radius: 12px;
            --radius-sm: 8px;
            --radius-lg: 16px;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: 14px;
            line-height: 1.6;
            background: linear-gradient(135deg, var(--gray-100) 0%, var(--primary-bg) 100%);
            min-height: 100vh;
            color: var(--gray-700);
        }

        /* ========== HEADER ========== */
        .header {
            background: var(--primary);
            color: white;
            padding: 20px 20px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        .header-brand {
            position: absolute;
            left: 24px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 1;
            display: flex;
            align-items: center;
        }
        .header-logo {
            display: block;
            max-width: min(320px, 42vw);
            max-height: 50px;
            width: auto;
            height: auto;
            padding-left: 16px;
            object-fit: contain;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
        }
        .header-copy {
            position: relative;
            z-index: 1;
        }
        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
            animation: pulse 15s ease-in-out infinite;
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.1); opacity: 0.3; }
        }
        .header h1 {
            font-size: 32px;
            font-weight: 700;
            letter-spacing: -0.5px;
            position: relative;
            text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .header-subtitle {
            margin-top: 8px;
            font-size: 16px;
            font-weight: 400;
            opacity: 0.9;
            position: relative;
        }

        /* ========== CONTAINER ========== */
        .container {
            max-width: 1600px;
            margin: 0 auto;
            padding: 30px;
        }

        /* ========== STATS DASHBOARD ========== */
        .stats-dashboard {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
            gap: 14px;
            margin-bottom: 22px;
        }
        .stat-card {
            background: white;
            border-radius: var(--radius);
            padding: 18px 20px;
            box-shadow: var(--shadow);
            transition: transform 0.2s, box-shadow 0.2s;
            border-left: 4px solid var(--primary);
        }
        .stat-card:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-lg);
        }
        .stat-card.passed { border-left-color: var(--pass); }
        .stat-card.failed { border-left-color: var(--danger); }
        .stat-card.flaky { border-left-color: #8b5cf6; }
        .stat-card.skipped { border-left-color: var(--gray-400); }
        .stat-value {
            font-size: 28px;
            font-weight: 700;
            color: var(--dark);
            line-height: 1;
        }
        .stat-label {
            font-size: 11px;
            color: var(--gray-500);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 6px;
            font-weight: 500;
        }

        /* ========== META SECTION ========== */
        .meta-section {
            background: white;
            padding: 20px 24px;
            margin-bottom: 24px;
            border-radius: var(--radius);
            box-shadow: var(--shadow);
            display: flex;
            flex-wrap: wrap;
            gap: 24px;
            align-items: center;
        }
        .meta-item {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .meta-label {
            font-size: 12px;
            color: var(--gray-500);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
        }
        .meta-value {
            font-weight: 600;
            color: var(--dark);
        }
        .meta-table { display: none; }
        .env-badge, .browser-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .env-badge {
            background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%);
            color: white;
            box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
        }
        .browser-badge {
            background: var(--gray-100);
            color: var(--gray-700);
            border: 1px solid var(--gray-200);
        }

        /* ========== SUITE & RUN STATUS ========== */
        .suite-status, .run-status {
            background: white;
            padding: 20px 24px;
            margin-bottom: 24px;
            border-radius: var(--radius);
            box-shadow: var(--shadow);
        }
        .suite-status h3, .run-status h3 {
            color: var(--dark);
            margin-bottom: 16px;
            font-size: 16px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .suite-status h3::before { content: '\1F4CA'; }
        .run-status h3::before { content: '\1F680'; }
        .status-table { width: 100%; }
        .status-table td { padding: 8px 12px; }
        .passed-count {
            color: var(--success);
            font-weight: 700;
            font-size: 18px;
        }
        .failed-count {
            color: var(--danger);
            font-weight: 700;
            font-size: 18px;
        }

        /* ========== FILTERS ========== */
        .filters {
            background: white;
            padding: 16px 18px;
            margin-bottom: 18px;
            border-radius: var(--radius);
            box-shadow: var(--shadow);
            display: flex;
            flex-wrap: wrap;
            gap: 18px;
            align-items: center;
        }
        .filter-search {
            flex: 1 1 260px;
            min-width: 220px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .search-label {
            font-size: 12px;
            color: var(--gray-600);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
            white-space: nowrap;
        }
        .search-input-wrap {
            position: relative;
            flex: 1;
            display: flex;
            align-items: center;
        }
        .test-search-input {
            width: 100%;
            border: 1px solid var(--gray-200);
            border-radius: 18px;
            padding: 9px 38px 9px 14px;
            font-size: 12px;
            color: var(--dark);
            background: var(--gray-50);
            outline: none;
            transition: all 0.2s;
        }
        .test-search-input:focus {
            border-color: var(--primary-light);
            background: white;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
        }
        .test-search-input::placeholder {
            color: var(--gray-400);
        }
        .search-clear-btn {
            position: absolute;
            right: 7px;
            border: none;
            background: var(--gray-200);
            color: var(--gray-600);
            width: 24px;
            height: 24px;
            border-radius: 999px;
            display: none;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 16px;
            line-height: 1;
            transition: all 0.2s;
        }
        .search-clear-btn:hover {
            background: var(--primary);
            color: white;
        }
        .filter-group {
            display: flex;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
        }
        .filter-group strong {
            font-size: 12px;
            color: var(--gray-600);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .filter-group label {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            background: var(--gray-50);
            border: 1px solid var(--gray-200);
            border-radius: 16px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.2s;
        }
        .filter-group label:hover {
            background: var(--primary-bg);
            border-color: var(--primary-light);
        }
        .filter-group input[type="checkbox"] {
            accent-color: var(--primary);
            width: 14px;
            height: 14px;
        }
        .filter-group input[type="checkbox"]:checked + span {
            color: var(--primary);
        }

        /* ========== TEST TABLE ========== */
        .test-table-container {
            background: white;
            border-radius: var(--radius);
            box-shadow: var(--shadow-lg);
            overflow: hidden;
        }
        .no-results-message {
            display: none;
            padding: 18px 24px;
            background: #fffbeb;
            color: #92400e;
            border: 1px solid #fcd34d;
            border-radius: var(--radius-sm);
            margin-bottom: 18px;
            font-weight: 500;
        }
        .test-browser {
            display: grid;
            grid-template-columns: minmax(320px, 1fr) minmax(0, 2fr);
            gap: 24px;
            align-items: start;
        }
        .test-browser-left,
        .test-browser-right {
            min-width: 0;
        }
        .test-browser-left {
            background: white;
            border-radius: var(--radius);
            box-shadow: var(--shadow-lg);
            overflow: hidden;
            position: sticky;
            top: 20px;
            max-height: calc(100vh - 180px);
            display: flex;
            flex-direction: column;
        }
        .test-list-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 16px 18px;
            border-bottom: 1px solid var(--gray-100);
            background: linear-gradient(135deg, var(--gray-50) 0%, #ffffff 100%);
        }
        .test-list-title {
            font-size: 14px;
            font-weight: 700;
            color: var(--dark);
        }
        .test-list-count {
            font-size: 12px;
            color: var(--gray-500);
            font-weight: 600;
        }
        .test-list {
            overflow-y: auto;
            padding: 10px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-height: calc(10 * 110px);
        }
        .tree-node {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .tree-node.collapsed > .tree-node-children {
            display: none;
        }
        .tree-node.filter-expanded > .tree-node-children {
            display: flex;
        }
        .tree-node-header {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 12px;
            border-radius: var(--radius);
            border: 1px solid var(--gray-200);
            background: linear-gradient(135deg, #ffffff 0%, var(--gray-50) 100%);
            cursor: pointer;
            transition: all 0.2s;
        }
        .tree-node-header:hover {
            border-color: var(--status-accent, var(--primary-light));
            box-shadow: var(--shadow-sm);
            transform: translateY(-1px);
        }
        .tree-node.folder-node > .tree-node-header {
            --status-accent: var(--primary-light);
            border-left: 4px solid var(--primary);
        }
        .tree-node.describe-node > .tree-node-header {
            --status-accent: var(--accent);
            border-left: 4px solid var(--accent);
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
        }
        .tree-node.root-node > .tree-node-header {
            --status-accent: var(--primary);
        }
        .tree-node-toggle {
            width: 12px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: var(--gray-500);
            font-size: 10px;
            transition: transform 0.2s;
            flex: 0 0 auto;
        }
        .tree-node.collapsed > .tree-node-header .tree-node-toggle {
            transform: rotate(-90deg);
        }
        .tree-node-icon {
            font-size: 12px;
            color: var(--gray-500);
            flex: 0 0 auto;
        }
        .tree-node-title {
            font-size: 13px;
            font-weight: 600;
            color: var(--dark);
            min-width: 0;
            flex: 1;
            word-break: break-word;
        }
        .tree-node-children {
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding-left: 18px;
            margin-left: 8px;
            border-left: 1px dashed var(--gray-200);
        }
        .tree-leaf {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .test-list-item {
            border: 1px solid var(--gray-200);
            border-radius: var(--radius);
            padding: 12px 14px;
            background: white;
            cursor: pointer;
            transition: all 0.2s;
            --status-accent: var(--gray-300);
            --status-bg: var(--gray-50);
            --status-shadow: rgba(148, 163, 184, 0.18);
        }
        .test-list-item:hover {
            transform: translateY(-1px);
            box-shadow: var(--shadow);
            border-color: var(--status-accent);
        }
        .test-list-item.active {
            border-color: var(--status-accent);
            background: var(--status-bg);
            box-shadow: 0 0 0 2px var(--status-shadow);
        }
        .test-list-item.failed {
            --status-accent: var(--danger);
            --status-bg: #fef2f2;
            --status-shadow: rgba(239, 68, 68, 0.14);
            border-left: 4px solid var(--danger);
        }
        .test-list-item.flaky {
            --status-accent: #8b5cf6;
            --status-bg: #f5f3ff;
            --status-shadow: rgba(139, 92, 246, 0.16);
            border-left: 4px solid #8b5cf6;
        }
        .test-list-item.passed {
            --status-accent: var(--success);
            --status-bg: #eff6ff;
            --status-shadow: rgba(37, 99, 235, 0.14);
            border-left: 4px solid var(--success);
        }
        .test-list-item.skipped {
            --status-accent: #d4af37;
            --status-bg: #fff9e6;
            --status-shadow: rgba(212, 175, 55, 0.16);
            border-left: 4px solid #d4af37;
        }
        .tree-leaf .test-list-item {
            margin: 0;
        }
        .test-list-item-top {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 10px;
            margin-bottom: 0;
        }
        .test-list-name {
            min-width: 0;
            flex: 1;
        }
        .detail-template {
            display: none;
        }
        .test-browser-right {
            background: white;
            border-radius: var(--radius);
            box-shadow: var(--shadow-lg);
            min-height: 400px;
            overflow: hidden;
        }
        #activeTestDetails {
            margin: 0;
            min-height: 400px;
        }
        .test-browser-right .test-detail {
            margin: 0;
            border-radius: 0;
            box-shadow: none;
        }
        .test-browser-right .detail-panel {
            padding: 0;
        }
        .test-browser-right .section-header { font-size: 13px; padding: 14px 18px; }
        .test-browser-right .section-content { padding: 16px; }
        .test-browser-right .error-message,
        .test-browser-right .stack-trace-content,
        .test-browser-right .step-console-content,
        .test-browser-right .step-error-message {
            font-size: 11px;
        }
        .test-browser-right .step-item {
            padding: 12px 14px;
        }
        .test-browser-right .step-name {
            font-size: 12px;
        }
        .test-browser-right .step-time {
            font-size: 11px;
            padding: 3px 8px;
        }
        .test-browser-right .step-meta {
            font-size: 11px;
        }
        .test-browser-right .trace-download,
        .test-browser-right .video-link {
            font-size: 12px;
        }
        .test-browser-right .screenshot-name {
            font-size: 11px;
        }
        .test-browser-right .test-video {
            max-height: 380px;
        }
        .test-browser-left .tree-node-children .test-list-item {
            box-shadow: none;
        }
        .test-browser-right .step-meta-item,
        .test-browser-right .stack-details summary,
        .test-browser-right .video-link,
        .test-browser-right .trace-download,
        .test-browser-right .screenshot-name {
            font-size: 11px;
        }
        .test-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            font-size: 13px;
        }
        .test-table thead {
            background: linear-gradient(135deg, var(--dark) 0%, var(--gray-700) 100%);
            color: white;
            position: sticky;
            top: 0;
            z-index: 10;
        }
        .test-table th {
            padding: 16px 12px;
            text-align: left;
            font-weight: 600;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border: none;
            white-space: nowrap;
        }
        .test-table td {
            padding: 14px 12px;
            border-bottom: 1px solid var(--gray-100);
            vertical-align: middle;
        }
        .test-table tbody tr {
            background: white;
            transition: all 0.2s;
        }
        .test-table tbody tr:nth-child(even) {
            background: var(--gray-50);
        }
        .test-row:hover {
            background: var(--primary-bg) !important;
            transform: scale(1.001);
        }
        .test-row.failed {
            background: #fef2f2 !important;
            border-left: 3px solid var(--danger);
        }
        .test-row.failed:hover {
            background: #fee2e2 !important;
        }
        .test-row.passed {
            border-left: 3px solid transparent;
        }

        /* Column widths */
        .col-sno { width: 50px; text-align: center; font-weight: 600; color: var(--gray-400); }
        .col-suite { min-width: 120px; }
        .col-testname { min-width: 280px; }
        .col-author { width: 80px; }
        .col-group { width: 80px; }
        .col-tags { min-width: 120px; }
        .col-file { min-width: 140px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--gray-500); }
        .col-starttime, .col-endtime { width: 160px; font-size: 12px; color: var(--gray-500); }
        .col-duration { width: 80px; text-align: center; font-weight: 600; }
        .col-status { width: 100px; text-align: center; }

        .test-name-link {
            color: var(--dark);
            cursor: pointer;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.2s;
        }
        .test-name-link:hover {
            color: var(--primary);
        }

        /* Status Badges */
        .status-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 6px 14px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            gap: 4px;
        }
        .status-badge.passed {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
            box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
        }
        .status-badge.failed {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
            box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
        }
        .status-badge.flaky {
            background: linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%);
            color: white;
            box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
        }
        .status-badge.skipped {
            background: linear-gradient(135deg, #f4c542 0%, #d4af37 100%);
            color: white;
            box-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
        }

        /* Action Links */
        .screenshot-link, .video-link-cell, .trace-link-cell {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 6px 12px;
            border-radius: var(--radius-sm);
            text-decoration: none;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.2s;
        }
        .screenshot-link {
            background: var(--primary-bg);
            color: var(--primary);
        }
        .screenshot-link:hover {
            background: var(--primary);
            color: white;
        }
        .video-link-cell {
            background: #fef3c7;
            color: #d97706;
        }
        .video-link-cell:hover {
            background: #f59e0b;
            color: white;
        }
        .trace-link-cell {
            background: #ede9fe;
            color: #7c3aed;
        }
        .trace-link-cell:hover {
            background: #8b5cf6;
            color: white;
        }

        /* Tags */
        .tag {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            margin: 2px;
            background: var(--primary-bg);
            color: var(--primary-dark);
            border: 1px solid var(--primary-light);
        }

        /* ========== TEST DETAIL PANEL ========== */
        .test-detail-row { background: var(--gray-50) !important; }
        .test-detail-row td { padding: 0 !important; }
        .test-detail {
            margin: 16px 24px;
            border-radius: var(--radius);
            background: white;
            box-shadow: var(--shadow);
            overflow: hidden;
        }
        .detail-panel { padding: 0; }
        .detail-section {
            border-bottom: 1px solid var(--gray-100);
        }
        .detail-section:last-child { border-bottom: none; }
        .section-header {
            padding: 16px 20px;
            background: var(--gray-50);
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: background 0.2s;
        }
        .section-header:hover { background: var(--gray-100); }
        .section-arrow {
            font-size: 12px;
            color: var(--gray-400);
            transition: transform 0.3s;
        }
        .section-collapsed .section-arrow { transform: rotate(-90deg); }
        .section-collapsed .section-content { display: none; }
        .section-content { padding: 20px; }

        /* Error Section */
        .error-section .section-header {
            background: #fef2f2;
            color: var(--danger);
        }
        .error-box {
            background: white;
            border: 1px solid #fecaca;
            border-radius: var(--radius-sm);
            padding: 16px;
            border-left: 4px solid var(--danger);
        }
        .error-message {
            margin: 0;
            color: var(--danger);
            font-family: 'JetBrains Mono', monospace;
            font-size: 13px;
            white-space: pre-wrap;
            word-break: break-word;
            line-height: 1.6;
        }
        .stack-details { margin-top: 16px; }
        .stack-details summary {
            cursor: pointer;
            color: var(--gray-500);
            font-size: 13px;
            font-weight: 500;
            padding: 8px 0;
        }
        .stack-trace-content {
            margin: 12px 0 0 0;
            padding: 16px;
            background: var(--dark);
            color: #bfdbfe;
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            border-radius: var(--radius-sm);
            overflow-x: auto;
            max-height: 300px;
            overflow-y: auto;
            line-height: 1.6;
        }
        .test-path-value {
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            color: var(--gray-700);
            background: var(--gray-50);
            border: 1px solid var(--gray-200);
            border-radius: var(--radius-sm);
            padding: 12px 14px;
            word-break: break-word;
        }

        /* Steps Section */
        .steps-list {
            background: white;
            border-radius: var(--radius-sm);
            border: 1px solid var(--gray-100);
            overflow: hidden;
        }
        .step-item-container {
            border-bottom: 1px solid var(--gray-100);
        }
        .step-item-container:last-child { border-bottom: none; }
        .step-item {
            display: flex;
            align-items: center;
            padding: 14px 16px;
            transition: background 0.2s;
        }
        .step-item.expandable {
            cursor: pointer;
            user-select: none;
        }
        .step-item.leaf {
            cursor: default;
        }
        .step-item.expandable:hover {
            background: var(--gray-100);
        }
        .step-item.expandable.expanded {
            background: var(--primary-bg);
        }
        .step-item.failed { background: #fef2f2; }
        .step-item.expandable.failed:hover { background: #fee2e2; }
        .step-icon {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
            font-size: 14px;
        }
        .step-expand-icon {
            width: 14px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-right: 10px;
            font-size: 11px;
            color: var(--gray-400);
            transition: transform 0.2s, color 0.2s;
            flex: 0 0 auto;
        }
        .step-expand-placeholder {
            width: 14px;
            margin-right: 10px;
            flex: 0 0 auto;
        }
        .step-item.expandable.expanded .step-expand-icon {
            transform: rotate(90deg);
            color: var(--primary);
        }
        .step-icon.passed {
            background: #dbeafe;
            color: var(--success);
        }
        .step-icon.failed {
            background: #fee2e2;
            color: var(--danger);
        }
        .step-name {
            flex: 1;
            font-size: 13px;
            font-weight: 500;
            color: var(--dark);
        }
        .step-time {
            color: var(--gray-500);
            font-size: 12px;
            font-family: 'JetBrains Mono', monospace;
            background: var(--gray-100);
            padding: 4px 10px;
            border-radius: 12px;
        }
        .step-details {
            background: var(--gray-50);
            border-top: 1px solid var(--gray-100);
            padding: 2px 0 2px 18px;
        }
        .step-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            color: var(--gray-500);
            font-size: 12px;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px dashed var(--gray-200);
        }
        .step-meta-item {
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .step-console { margin-bottom: 16px; }
        .step-console-header {
            font-weight: 600;
            color: var(--dark);
            margin-bottom: 10px;
            font-size: 13px;
        }
        .step-console-content {
            background: var(--dark);
            color: #bfdbfe;
            padding: 16px;
            border-radius: var(--radius-sm);
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            line-height: 1.6;
            max-height: 300px;
            overflow-y: auto;
        }
        .console-line {
            padding: 4px 0;
            border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .console-line:last-child { border-bottom: none; }

        /* Screenshots */
        .step-screenshot { margin-bottom: 16px; }
        .step-screenshot-header { font-weight: 600; color: var(--dark); margin-bottom: 10px; }
        .step-screenshot-img {
            max-width: 100%;
            max-height: 250px;
            border: 1px solid var(--gray-200);
            border-radius: var(--radius-sm);
            box-shadow: var(--shadow);
        }
        .step-error { margin-bottom: 16px; }
        .step-error-header { font-weight: 600; color: var(--danger); margin-bottom: 10px; }
        .step-error-message {
            background: #fef2f2;
            color: #b91c1c;
            padding: 16px;
            border-radius: var(--radius-sm);
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            border-left: 4px solid var(--danger);
        }
        .step-stack-trace { margin-top: 12px; }
        .step-stack-header { font-weight: 600; color: var(--warning); margin-bottom: 10px; }
        .step-stack-content {
            background: #fffbeb;
            color: #92400e;
            padding: 16px;
            border-radius: var(--radius-sm);
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            max-height: 200px;
            overflow-y: auto;
            margin: 0;
            border-left: 4px solid var(--warning);
        }
        .step-children {
            margin-top: 0;
            padding-top: 0;
        }
        .step-children .step-item-container:first-child .step-item {
            padding-top: 8px;
        }

        /* Screenshots Grid */
        .screenshots-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 20px;
        }
        .screenshot-item {
            background: white;
            border: 1px solid var(--gray-200);
            border-radius: var(--radius);
            overflow: hidden;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .screenshot-item:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-lg);
        }
        .screenshot-preview {
            width: 100%;
            height: 160px;
            object-fit: cover;
            display: block;
        }
        .screenshot-name {
            padding: 12px;
            font-size: 12px;
            color: var(--gray-600);
            border-top: 1px solid var(--gray-100);
            font-weight: 500;
        }

        /* Trace & Video */
        .trace-download {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 20px;
            background: linear-gradient(135deg, var(--primary-bg) 0%, #dbeafe 100%);
            color: var(--primary-dark);
            text-decoration: none;
            border-radius: var(--radius-sm);
            font-size: 13px;
            font-weight: 600;
            transition: all 0.2s;
            border: 1px solid var(--primary-light);
        }
        .trace-download:hover {
            background: var(--primary);
            color: white;
            border-color: var(--primary);
        }
        .test-video {
            max-width: 100%;
            max-height: 450px;
            border-radius: var(--radius);
            box-shadow: var(--shadow-lg);
        }
        .video-link { margin-top: 12px; font-size: 13px; }
        .video-link a { color: var(--primary); font-weight: 500; }

        /* ========== MODAL ========== */
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.95);
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(4px);
        }
        .modal.active { display: flex; }
        .modal-content {
            max-width: 95%;
            max-height: 95%;
            object-fit: contain;
            border-radius: var(--radius);
            box-shadow: var(--shadow-xl);
        }
        .modal-close {
            position: absolute;
            top: 20px;
            right: 30px;
            color: white;
            font-size: 40px;
            cursor: pointer;
            transition: color 0.2s, transform 0.2s;
        }
        .modal-close:hover {
            color: var(--primary-light);
            transform: scale(1.1);
        }

        /* ========== FOOTER ========== */
        .report-footer {
            text-align: center;
            padding: 30px 20px;
            background: linear-gradient(135deg, var(--dark) 0%, var(--gray-700) 100%);
            color: white;
            margin-top: 40px;
        }
        .report-footer p {
            font-size: 14px;
            opacity: 0.9;
        }
        .report-footer a {
            color: var(--primary-light);
            text-decoration: none;
            font-weight: 600;
            transition: color 0.2s;
        }
        .report-footer a:hover {
            color: white;
            text-decoration: underline;
        }

        /* ========== RESPONSIVE ========== */
        @media (max-width: 1200px) {
            .container { padding: 20px; }
            .test-table { font-size: 12px; }
            .test-browser {
                grid-template-columns: 1fr;
            }
            .test-browser-left {
                position: relative;
                top: auto;
                max-height: none;
            }
            .stats-dashboard {
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 12px;
            }
            .stat-card {
                padding: 16px 18px;
            }
            .stat-value {
                font-size: 24px;
            }
        }
        @media (max-width: 768px) {
            .header { padding: 28px 15px 22px; }
            .header-brand {
                position: static;
                transform: none;
                justify-content: center;
                margin-bottom: 12px;
            }
            .header-logo { max-width: 260px; max-height: 58px; }
            .header h1 { font-size: 24px; }
            .meta-section, .filters { flex-direction: column; align-items: flex-start; }
            .filters {
                padding: 14px 16px;
                gap: 14px;
            }
            .filter-search { width: 100%; min-width: 0; }
            .search-label { margin-bottom: 2px; }
            .stats-dashboard { grid-template-columns: repeat(2, 1fr); }
            .test-list-item-top,
            .test-list-header {
                flex-direction: column;
                align-items: flex-start;
            }
        }
        `
