document.addEventListener('DOMContentLoaded', () => {


    const htmlElement = document.documentElement;
    const btnTema = document.getElementById('seletor-tema');
    const logoImg = document.getElementById('logo-img');
    
    const isIndexPage = document.getElementById('sobre') !== null;

    
    function aplicarTemaInicial() {
        const temaGuardado = localStorage.getItem('theme');
        const temaSistema = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (temaGuardado === 'dark' || (!temaGuardado && temaSistema)) {
            htmlElement.setAttribute('data-theme', 'dark');
            if (btnTema) btnTema.textContent = 'Tema Claro';
        } else {
            htmlElement.setAttribute('data-theme', 'light');
            if (btnTema) btnTema.textContent = 'Tema Escuro';
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

        
        const pathPrefix = isIndexPage ? '' : '../';

        const temaAtual = htmlElement.getAttribute('data-theme');
        if (temaAtual === 'dark') {
            logoImg.src = `${pathPrefix}imgs/dark_theme.png`;
        } else {
            logoImg.src = `${pathPrefix}imgs/light_theme.png`;
        }
    }

    
    const tabButtons = document.querySelectorAll('.tab-button');
    const contentTabs = document.querySelectorAll('.content-tab');
    
    function changeTab(tabName) {
        if (!isIndexPage) return;

        contentTabs.forEach(tab => tab.classList.remove('active'));
        tabButtons.forEach(btn => btn.classList.remove('active'));

        const activeTab = document.getElementById(tabName);
        const activeButton = document.querySelector(`.tab-button[data-tab="${tabName}"]`);

        if (activeTab) activeTab.classList.add('active');
        if (activeButton) activeButton.classList.add('active');

        if (tabName === 'terminal') {
            const terminalInput = document.getElementById('terminal-input');
            if(terminalInput) terminalInput.focus();
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
                    '  clear    - Limpa o ecrã do terminal',
            'whoami': 'Ivo Xavier, FullStack Software Developer',
            'social': 'Pode encontrar-me em:<br>' +
                      '  GitHub:   <a href="https://github.com/ivoxavier" target="_blank">github.com/ivoxavier</a>' +
                      '  Facebook:  <a href="https://www.facebook.com/ixsvf" target="_blank">facebook.com/ixsvf</a>',
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
                if (command === 'clear') {
                    terminalOutput.innerHTML = '';
                } else if (commands[command]) {
                    printToTerminal(commands[command], true);
                } else {
                    printToTerminal(`Comando não encontrado: ${command}. Escreva 'help' para ajuda.`, true);
                }
            }
        });

        terminal.addEventListener('click', () => terminalInput.focus());
        printToTerminal("Escreva 'help' para ver a lista de comandos disponíveis.", true);
    }
    
   
    aplicarTemaInicial();
});