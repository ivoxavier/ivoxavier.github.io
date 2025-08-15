document.addEventListener('DOMContentLoaded', () => {
    
    const htmlElement = document.documentElement;
    const btnTema = document.getElementById('seletor-tema');
    const logoImg = document.getElementById('logo-img');

    function aplicarTemaInicial() {
        const temaGuardado = localStorage.getItem('theme');
        const temaSistema = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (temaGuardado === 'dark' || (!temaGuardado && temaSistema)) {
            htmlElement.setAttribute('data-theme', 'dark');
            btnTema.textContent = 'Tema Claro';
        } else {
            htmlElement.setAttribute('data-theme', 'light');
            btnTema.textContent = 'Tema Escuro';
        }
        atualizarLogo();
    }

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

    
    const tabButtons = document.querySelectorAll('.tab-button');
    const contentTabs = document.querySelectorAll('.content-tab');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');

            
            contentTabs.forEach(tab => tab.classList.remove('active'));
            tabButtons.forEach(btn => btn.classList.remove('active'));

        
            document.getElementById(tabName).classList.add('active');
            button.classList.add('active');

            if (tabName === 'terminal') {
                document.getElementById('terminal-input').focus();
            }
        });
    });

    
    const terminal = document.getElementById('terminal');
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
    

     function atualizarLogo() {
        const temaAtual = htmlElement.getAttribute('data-theme');
        if (temaAtual === 'dark') {
            logoImg.src = 'imgs/dark_theme.png';
        } else {
            logoImg.src = 'imgs/light_theme.png';
        }
    }


    terminalInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const command = terminalInput.value.trim().toLowerCase();
            if (command === '') return;

            printToTerminal(`${prompt} ${command}`);
            terminalInput.value = '';

            if (command === 'clear') {
                terminalOutput.innerHTML = '';
            } else if (commands[command]) {
                const response = commands[command];
                printToTerminal(response, true);
            } else {
                printToTerminal(`Comando não encontrado: ${command}. Escreva 'help' para ajuda.`, true);
            }
        }
    });

    terminal.addEventListener('click', () => {
        terminalInput.focus();
    });


    aplicarTemaInicial();
    printToTerminal("Escreva 'help' para ver a lista de comandos disponíveis.", true);
});