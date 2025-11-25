<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Explorer</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .badge-GET { background-color: #dbeafe; color: #1e40af; border: 1px solid #93c5fd; }
        .badge-POST { background-color: #dcfce7; color: #166534; border: 1px solid #86efac; }
        .badge-PUT, .badge-PATCH { background-color: #fef9c3; color: #854d0e; border: 1px solid #fde047; }
        .badge-DELETE { background-color: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
        
        /* Scrollbar logic */
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #1f2937; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #4b5563; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #6b7280; }
    </style>
</head>
<body class="bg-gray-50 text-gray-800 font-sans pb-20">

    <div class="sticky top-0 z-50 bg-gray-900 text-white shadow-lg border-b border-gray-700">
        <div class="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-2">
                <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                <h1 class="text-lg font-bold tracking-wide">API Explorer</h1>
            </div>

            <div id="login-form" class="flex items-center gap-2 w-full md:w-auto">
                <input type="text" id="global-email" placeholder="Email" value="icesiv@gmail.com" class="bg-gray-800 border border-gray-600 text-sm px-3 py-1.5 rounded text-white focus:border-blue-400 outline-none">
                <input type="password" id="global-password" placeholder="Password" value="EggMan-2020" class="bg-gray-800 border border-gray-600 text-sm px-3 py-1.5 rounded text-white focus:border-blue-400 outline-none">
                <button onclick="globalLogin()" class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded text-sm font-bold transition">
                    Login
                </button>
            </div>

            <div id="logged-in-state" class="hidden flex items-center gap-4">
                <div class="text-xs text-green-400 font-mono bg-gray-800 px-2 py-1 rounded border border-green-900 flex items-center gap-2">
                    <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Authenticated
                </div>
                <button onclick="globalLogout()" class="text-gray-400 hover:text-white text-xs uppercase font-bold">Logout</button>
            </div>
        </div>
    </div>

    <div class="max-w-7xl mx-auto py-8 px-4 mt-4">
        
        <div class="mb-8 relative">
            <input type="text" id="searchInput" onkeyup="filterRoutes()" placeholder="Filter endpoints (e.g., 'sneakers', 'users')..." 
                class="w-full pl-4 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white text-lg">
        </div>

        <div id="routes-container">
            @foreach($groupedRoutes as $groupName => $endpoints)
                <div class="mb-8 group-section" data-group="{{ strtolower($groupName) }}">
                    
                    <div class="flex items-center mb-4">
                        <h2 class="text-xl font-bold text-gray-800 uppercase tracking-wider border-l-4 border-blue-500 pl-3">
                            {{ $groupName }}
                        </h2>
                        <div class="h-px flex-1 bg-gray-200 ml-4"></div>
                    </div>

                    <div class="space-y-3">
                        @foreach($endpoints as $uri => $methods)
                            @php $panelId = 'panel_' . md5($uri); @endphp

                            <div class="endpoint-row bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden" data-uri="{{ $uri }}">
                                
                                <div class="flex flex-col md:flex-row md:items-center justify-between p-3 px-5 bg-white">
                                    <div class="flex items-center space-x-2 w-full md:w-2/3 font-mono text-sm">
                                        <span class="text-gray-400 select-none">/</span>
                                        <span class="text-gray-800 font-semibold truncate">{{ $uri }}</span>
                                    </div>
                                    
                                    <div class="flex space-x-2 mt-2 md:mt-0 shrink-0">
                                        @foreach($methods as $method => $details)
                                            @php 
                                                $suggestionJson = json_encode($details['suggestion'] ?? new \stdClass());
                                            @endphp
                                            <button onclick='openTester("{{ $method }}", "{{ $uri }}", "{{ $panelId }}", {!! $suggestionJson !!})'
                                                class="px-3 py-1 rounded text-xs font-bold uppercase transition transform active:scale-95 badge-{{ $method }}">
                                                {{ $method }}
                                            </button>
                                        @endforeach
                                    </div>
                                </div>

                                <div id="{{ $panelId }}" class="hidden bg-slate-50 border-t border-gray-200 p-6 shadow-inner"></div>
                            </div>
                        @endforeach
                    </div>
                </div>
            @endforeach
        </div>
    </div>

    <script>
        // --- 1. Auth & LocalStorage Logic --- //

        const API_URL = "{{ url('/api') }}"; // Base API URL
        
        document.addEventListener("DOMContentLoaded", () => {
            checkLoginState();
        });

        function checkLoginState() {
            const token = localStorage.getItem('api_token');
            if (token) {
                document.getElementById('login-form').classList.add('hidden');
                document.getElementById('logged-in-state').classList.remove('hidden');
            } else {
                document.getElementById('login-form').classList.remove('hidden');
                document.getElementById('logged-in-state').classList.add('hidden');
            }
        }

        async function globalLogin() {
            const email = document.getElementById('global-email').value;
            const password = document.getElementById('global-password').value;
            const btn = document.querySelector('#login-form button');
            
            btn.innerText = "Logging in...";
            btn.disabled = true;

            try {
                // Adjust '/api/login' to match your actual login route
                const res = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();

                if (res.ok && (data.token || data.access_token)) {
                    // Save token
                    localStorage.setItem('api_token', data.token || data.access_token);
                    checkLoginState();
                } else {
                    alert('Login Failed: ' + (data.message || 'Check credentials'));
                }
            } catch (e) {
                alert('Network Error during login');
            } finally {
                btn.innerText = "Login";
                btn.disabled = false;
            }
        }

        function globalLogout() {
            localStorage.removeItem('api_token');
            checkLoginState();
        }


        // --- 2. Tester Panel Logic --- //

        function openTester(method, uri, panelId, suggestion) {
            const panel = document.getElementById(panelId);
            
            // Auto-fill Token from LocalStorage
            const storedToken = localStorage.getItem('api_token') || '';
            
            // Determine Payload Content
            let payloadContent = '';
            
            // If there is a suggestion from Controller, use it
            if (method !== 'GET' && method !== 'DELETE') {
                // Check if suggestion is empty object
                if (Object.keys(suggestion).length > 0) {
                    payloadContent = JSON.stringify(suggestion, null, 4);
                } else {
                    payloadContent = '{\n    "key": "value"\n}';
                }
            }

            const ids = {
                token: `token-${panelId}`,
                payload: `payload-${panelId}`,
                response: `response-${panelId}`,
                status: `status-${panelId}`
            };

            panel.innerHTML = `
                <div class="flex justify-between items-start mb-4">
                    <div class="flex items-center gap-3">
                        <span class="px-3 py-1 rounded text-sm font-bold badge-${method}">${method}</span>
                        <span class="font-mono text-gray-700 text-sm select-all">/{{ url('') }}/${uri}</span>
                    </div>
                    <button onclick="document.getElementById('${panelId}').classList.add('hidden')" class="text-gray-400 hover:text-red-500">✕ Close</button>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <div class="mb-4">
                            <label class="block text-xs font-bold uppercase text-gray-500 mb-1">Auth Token</label>
                            <div class="relative">
                                <input type="text" id="${ids.token}" value="${storedToken}" class="w-full pl-8 p-2 border border-gray-300 rounded text-sm bg-white focus:border-blue-500 outline-none" placeholder="Bearer ...">
                                <span class="absolute left-2 top-2 text-gray-400">🔒</span>
                            </div>
                            <p class="text-[10px] text-gray-400 mt-1 text-right">Auto-filled from login</p>
                        </div>

                        ${(method !== 'GET' && method !== 'DELETE') ? `
                        <div class="mb-4">
                            <div class="flex justify-between items-end mb-1">
                                <label class="block text-xs font-bold uppercase text-gray-500">Request Body</label>
                                <span class="text-[10px] text-blue-500">Suggestion Loaded</span>
                            </div>
                            <textarea id="${ids.payload}" class="w-full h-48 p-3 border border-gray-300 rounded font-mono text-xs focus:border-blue-500 outline-none leading-relaxed" 
                            spellcheck="false">${payloadContent}</textarea>
                        </div>
                        ` : ''}
                        
                        <button onclick="sendRequest('${method}', '${uri}', '${panelId}')" 
                            class="w-full bg-gray-800 hover:bg-gray-900 text-white py-2 rounded font-semibold text-sm transition shadow-lg transform active:scale-95">
                            Send Request 🚀
                        </button>
                    </div>

                    <div class="relative flex flex-col">
                        <label class="block text-xs font-bold uppercase text-gray-500 mb-1">Response</label>
                        <div class="relative flex-grow">
                            <pre id="${ids.response}" class="w-full h-64 lg:h-full bg-gray-900 text-gray-300 p-4 rounded text-xs font-mono overflow-auto border border-gray-800 custom-scrollbar">Ready...</pre>
                            <div id="${ids.status}" class="absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded opacity-0 transition"></div>
                        </div>
                    </div>
                </div>
            `;
            
            panel.classList.remove('hidden');
        }

        async function sendRequest(method, uri, panelId) {
            const payloadEl = document.getElementById(`payload-${panelId}`);
            const tokenEl = document.getElementById(`token-${panelId}`);
            const responseEl = document.getElementById(`response-${panelId}`);
            const statusEl = document.getElementById(`status-${panelId}`);

            const payloadStr = payloadEl ? payloadEl.value.trim() : null;
            const token = tokenEl.value.trim();

            responseEl.innerHTML = '<span class="text-yellow-400">Sending request...</span>';
            statusEl.style.opacity = 0;

            // Fix URI if it starts with 'api/' to ensure valid fetch
            const fullUrl = `/${uri}`; 

            let headers = { 
                'Content-Type': 'application/json', 
                'Accept': 'application/json' 
            };

            if (token) headers['Authorization'] = token.startsWith('Bearer') ? token : 'Bearer ' + token;

            let options = { method: method, headers: headers };

            if (payloadStr && method !== 'GET' && method !== 'DELETE') {
                try {
                    options.body = JSON.stringify(JSON.parse(payloadStr));
                } catch (e) {
                    responseEl.innerHTML = '<span class="text-red-400">Error: Invalid JSON in request body.</span>';
                    return;
                }
            }

            try {
                // Replace placehodlers
                const finalUrl = fullUrl.replace('{id}', '1');

                const start = Date.now();
                const res = await fetch(finalUrl, options);
                const timeTaken = Date.now() - start;

                let data;
                const contentType = res.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    data = await res.json();
                    responseEl.innerHTML = syntaxHighlight(data);
                } else {
                    data = await res.text();
                    responseEl.textContent = data;
                }

                const colorClass = res.ok ? 'bg-green-600 text-white' : 'bg-red-600 text-white';
                statusEl.textContent = `${res.status} ${res.statusText} (${timeTaken}ms)`;
                statusEl.className = `absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded shadow ${colorClass}`;
                statusEl.style.opacity = 1;

            } catch (error) {
                responseEl.innerHTML = `<span class="text-red-400">Network Error: ${error.message}</span>`;
            }
        }

        // JSON Highlighter
        function syntaxHighlight(json) {
            if (typeof json != 'string') json = JSON.stringify(json, undefined, 4);
            json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                var cls = 'text-gray-300';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) cls = 'text-blue-400';
                    else cls = 'text-green-400';
                } else if (/true|false/.test(match)) cls = 'text-red-400';
                else if (/null/.test(match)) cls = 'text-gray-500';
                return '<span class="' + cls + '">' + match + '</span>';
            });
        }
        
        // Search Filter
        function filterRoutes() {
            const input = document.getElementById('searchInput').value.toLowerCase();
            document.querySelectorAll('.group-section').forEach(group => {
                const groupName = group.getAttribute('data-group');
                let hasVisible = false;
                group.querySelectorAll('.endpoint-row').forEach(row => {
                    const uri = row.getAttribute('data-uri').toLowerCase();
                    if (uri.includes(input) || groupName.includes(input)) {
                        row.style.display = 'block'; hasVisible = true;
                    } else { row.style.display = 'none'; }
                });
                group.style.display = hasVisible ? 'block' : 'none';
            });
        }
    </script>
</body>
</html>