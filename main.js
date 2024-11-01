console.log("Processo principal")

// importação de pacotes (bibliotecas)
// nativeTheme (forçar um tema no sistema operacional)
// Menu (criar um menu personalizado)
// shell (acessar links externos)
const { app, BrowserWindow, nativeTheme, Menu, shell } = require('electron/main')
const path = require('node:path')

// janela principal
let win //Importante! Neste projeto o escopo da variável win deve ser global
function createWindow() {
    nativeTheme.themeSource = 'dark' //janela sempre escura
    win = new BrowserWindow({
        width: 1010, //largura em px
        height: 720, //altura em px
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // Menu personalizado
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))

    win.loadFile('./src/views/index.html')
}

// Janela sobre
function aboutWindow() {
    nativeTheme.themeSource = 'dark'
    const about = new BrowserWindow({
        width: 360,
        height: 220,
        autoHideMenuBar: true, //esconder o menu
        resizable: false, // impedir redimensionamento
        minimizable: false, // impedir minimizar a janela
        //titleBarStyle: 'hidden' //esconder a barra de estilo(ex: totem de auto atendimento)
    })

    about.loadFile('./src/views/sobre.html')
}

// execução assíncrona do aplicativo electron
app.whenReady().then(() => {
    createWindow()

    // comportamento do MAC ao fechar uma janela
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

// encerrar a aplicação quando a janela for fechada (Windows e Linux)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// template do menu
const template = [
    {
        label: 'Arquivo',
        submenu: [
            {
                label: 'Novo',
                accelerator: 'CmdOrCtrl+N'
            },
            {
                label: 'Abrir',
                accelerator: 'CmdOrCtrl+O'
            },
            {
                label: 'Salvar',
                accelerator: 'CmdOrCtrl+S'
            },
            {
                label: 'Salvar Como',
                accelerator: 'CmdOrCtrl+Shift+S'
            },
            {
                type: 'separator'
            },
            {
                label: 'Sair',
                accelerator: 'Alt+F4',
                click: () => app.quit()
            }
        ]
    },
    {
        label: 'Editar',
        submenu: [
            {
                label: 'Desfazer',
                role: 'undo'
            },
            {
                label: 'Refazer',
                role: 'redo'
            },
            {
                type: 'separator'
            },
            {
                label: 'Recortar',
                role: 'cut'
            },
            {
                label: 'Copiar',
                role: 'copy'
            },
            {
                label: 'Colar',
                role: 'paste'
            },
        ]
    },
    {
        label: 'Zoom',
        submenu: [
            {
                label: 'Aplicar zoom',
                role: 'zoomIn'
            },
            {
                label: 'Reduzir',
                role: 'zoomOut'
            },
            {
                label: 'Restaurar o zoom padrão',
                role: 'resetZoom'
            }
        ]
    },
    {
        label: 'Cor',
        submenu: [
            {
                label: 'Amarelo'
            },
            {
                label: 'Azul'
            },
            {
                label: 'Laranja'
            },
            {
                label: 'Pink'
            },
            {
                label: 'Roxo'
            },
            {
                label: 'Verde'
            },
            {
                type: 'separator'
            },
            {
                label: 'Restaurar a cor padrão'
            }
        ]
    },
    {
        label: 'Ajuda',
        submenu: [
            {
                label: 'Repositório',
                click: () => shell.openExternal('https://github.com/professorjosedeassis/minidev')
            },
            {
                label: 'Sobre',
                click: () => aboutWindow()
            }
        ]
    }
]