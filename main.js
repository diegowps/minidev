console.log("Processo principal")

// importação de pacotes (bibliotecas)
// nativeTheme (forçar um tema no sistema operacional)
// Menu (criar um menu personalizado)
// shell (acessar links externos)
const { app, BrowserWindow, nativeTheme, Menu, shell, ipcMain } = require('electron/main')
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
    // a linha abaixo obtem a janela principal
    const main = BrowserWindow.getFocusedWindow()
    let about
    // validar a janela pai
    if (main) {
        about = new BrowserWindow({
            width: 320,
            height: 160,
            autoHideMenuBar: true, //esconder o menu
            resizable: false, // impedir redimensionamento
            minimizable: false, // impedir minimizar a janela
            //titleBarStyle: 'hidden' //esconder a barra de estilo(ex: totem de auto atendimento)
            parent: main, //estabelecer uma hierarquia de janelas
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }

    about.loadFile('./src/views/sobre.html')

    // fechar a janela quando receber mensagem do processo de renderização.
    ipcMain.on('close-about', () => {
        console.log("Recebi a mensagem close-about")
        // validar se a janela foi destruída
        if (about && !about.isDestroyed()) {
            about.close()
        }
    })

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






































function lerArquivo(filePath) {
//usar a trycath sempre com arquivos
try {
    //importar a biblioteca fs
    return fs.readFileSync(filePath, 'utf-8')
    //ler o arquivo
    const data = fs.readFileSync(filePath, 'utf-8')
    //retornar o conteúdo do arquivo
    return data
}
catch (error) {
    console.log('Erro ao ler o arquivo') //exibir erro
    //retornar erro
    return ''
}
} //fim da função lerArquivo







