document.addEventListener('DOMContentLoaded', () => {

    //theme 
    const htmlElement = document.documentElement;
    const btnTema = document.getElementById('seletor-tema');
    const logoImg = document.getElementById('logo-img');

    function aplicarTemaInicial() {
        const temaGuardado = localStorage.getItem('theme');
        const temaSistema = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (temaGuardado === 'dark' || (!temaGuardado && temaSistema)) {
            htmlElement.setAttribute('data-theme', 'dark');
            if(btnTema) btnTema.textContent = 'Tema Claro';
        } else {
            htmlElement.setAttribute('data-theme', 'light');
            if(btnTema) btnTema.textContent = 'Tema Escuro';
        }
        atualizarLogo();
    }

    if (btnTema) {
        btnTema.addEventListener('click', function() {
            if (htmlElement.getAttribute('data-theme') === 'dark') {
                htmlElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                this.textContent = 'Tema Escuro';
            } else {
                htmlElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                this.textContent = 'Tema Claro';
            }
            atualizarLogo();
        });
    }

    function atualizarLogo() {
        if (!logoImg) return;
        const temaAtual = htmlElement.getAttribute('data-theme');
        if (temaAtual === 'dark') {
            logoImg.src = 'imgs/dark_theme.png';
        } else {
            logoImg.src = 'imgs/light_theme.png';
        }
    }

    // tabNav
    const tabButtons = document.querySelectorAll('.tab-button');
    const contentTabs = document.querySelectorAll('.content-tab');
    const isIndexPage = document.getElementById('sobre') !== null;

    function changeTab(tabName) {
        if (!isIndexPage) return;

        contentTabs.forEach(tab => tab.classList.remove('active'));
        tabButtons.forEach(btn => btn.classList.remove('active'));

        const activeTab = document.getElementById(tabName);
        const activeButton = document.querySelector(`.tab-button[data-tab="${tabName}"]`);

        if(activeTab) activeTab.classList.add('active');
        if(activeButton) activeButton.classList.add('active');

        if (tabName === 'terminal') {
            document.getElementById('terminal-input').focus();
        }
    }

    if (isIndexPage) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.getAttribute('data-tab');
                changeTab(tabName);
                history.pushState(null, '', window.location.pathname);
            });
        });

        const urlParams = new URLSearchParams(window.location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) {
            changeTab(tabFromUrl);
        } else {
            changeTab('sobre'); // ./me as default
        }
    }

   // terminal

    const terminal = document.getElementById('terminal');
    if (terminal) {
        const terminalInput = document.getElementById('terminal-input');
        const terminalOutput = document.getElementById('terminal-output');
        const prompt = `<span class="terminal-prompt">convidado@ixsvf:~$</span>`;

        const commands = {
            'help': 'Comandos disponíveis: <br>' +
                    '  help     - Mostra esta lista de comandos<br>' +
                    '  whoami   - Mostra uma breve descrição sobre mim<br>' +
                    '  social   - Redes sociais<br>' +
                    '  skills   - Competências técnicas<br>' +
                    '  services - O que faço<br>' +
                    '  clear    - Limpa o ecrã do terminal',
            'whoami': 'Ivo Xavier, FullStack Software Developer',
            'social': 'Pode encontrar-me em:<br>' +
                      '  GitHub:   <a href="https://github.com/ivoxavier" target="_blank">github.com/ivoxavier</a>' +
                      '  Facebook  <a href="https://www.facebook.com/ixsvf" target="_blank">facebook.com/ixsvf</a>',
            'skills': 'QML | C# | MySQL | Kotlin | Jetpack Compose | Android | Ubuntu Touch | SQLServer | MySQL Workbench | WindowsForms | Swagger | Linux | FastReport | Talend | WebServices',
            'services': 'As minhas principais áreas de foco são:<br>' +
                        ' - Integração de Sistemas (EDI & WebServices)<br>' +
                        ' - Desenvolvimento Mobile (Android Nativo & Ubuntu Touch)<br>' +
                        ' - Reparação de computadores<br>' +
                        ' - Consultoria Informática<br>' +
                        ' - Renting de Impressoras Multifunções' +
                        ' - Gestão de Redes Sociais e Tráfego Pago',
            'clear': ''
        };

        function printToTerminal(text, isResponse = false) {
            const lineClass = isResponse ? 'response-line' : 'command-line';
            terminalOutput.innerHTML += `<div class="${lineClass}">${text}</div>`;
            terminal.scrollTop = terminal.scrollHeight;
        }

        terminalInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const command = terminalInput.value.trim().toLowerCase();
                terminalInput.value = '';
                printToTerminal(`${prompt} ${command}`);
                if (command === 'clear') terminalOutput.innerHTML = '';
                else if (commands[command]) printToTerminal(commands[command], true);
                else printToTerminal(`Comando não encontrado: ${command}. Escreva 'help' para ajuda.`, true);
            }
        });

        terminal.addEventListener('click', () => terminalInput.focus());
        printToTerminal("Escreva 'help' para ver a lista de comandos disponíveis.", true);
    }
    
   

    async function carregarPublicacoes() {
        const container = document.getElementById('publication-list');
        if (!container) return;

        try {
            const response = await fetch('posts.json');
            if (!response.ok) throw new Error('Não foi possível carregar o índice de posts.');
            const posts = await response.json();

            posts.sort((a, b) => new Date(b.date) - new Date(a.date));

            let html = '';
            for (const post of posts) {
                const postDate = new Date(post.date).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
                html += `
                    <div class="publication-item">
                        <h3><a href="post.html?slug=${post.slug}">${post.title}</a></h3>
                        <p class="publication-meta">Publicado em: ${postDate}</p>
                        <p class="publication-excerpt">${post.excerpt} <a href="post.html?slug=${post.slug}">Ler mais...</a></p>
                    </div>
                `;
            }
            container.innerHTML = html;
        } catch (error) {
            container.innerHTML = `<p>Ocorreu um erro ao carregar as publicações.</p>`;
            console.error(error);
        }
    }

    async function carregarPostCompleto() {
        const postViewer = document.getElementById('post-viewer');
        if (!postViewer) return;

        const params = new URLSearchParams(window.location.search);
        const slug = params.get('slug');

        if (!slug) {
            postViewer.innerHTML = '<h1>Artigo não encontrado.</h1>';
            return;
        }

        try {
            const response = await fetch(`posts/${slug}.md`);
            if (!response.ok) throw new Error('Ficheiro do artigo não encontrado.');
            const markdownComFrontMatter = await response.text();
            
            const { frontMatter, content } = parseFrontMatter(markdownComFrontMatter);

            document.title = `${frontMatter.title} | Ivo Xavier`;
            document.getElementById('post-title').textContent = frontMatter.title;
            document.getElementById('post-subtitle').textContent = frontMatter.subtitle;
            const postDate = new Date(frontMatter.date).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
            document.getElementById('post-meta').textContent = `Publicado em ${postDate} | Tags: ${frontMatter.tags.join(', ')}`;
            
            document.getElementById('post-content').innerHTML = marked.parse(content);
            
        } catch (error) {
            postViewer.innerHTML = '<h1>Erro ao carregar o artigo.</h1>';
            console.error(error);
        }
    }
    
    function parseFrontMatter(markdown) {
        const match = /---\r?\n([\s\S]+?)\r?\n---/.exec(markdown);
        if (!match) return { frontMatter: {}, content: markdown };

        const frontMatterString = match[1];
        const content = markdown.slice(match[0].length).trim();
        const frontMatter = {};

        frontMatterString.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length > 0) {
                const value = valueParts.join(':').trim();
                if (value.startsWith('[') && value.endsWith(']')) {
                    frontMatter[key.trim()] = value.slice(1, -1).split(',').map(item => item.trim().replace(/"/g, ''));
                } else {
                    frontMatter[key.trim()] = value.replace(/"/g, '');
                }
            }
        });
        return { frontMatter, content };
    }

    aplicarTemaInicial();
    carregarPublicacoes();
    carregarPostCompleto();
});