//importação de pacotes
const { app, BrowserWindow, nativeTheme, Menu, shell, ipcMain } = require('electron/main')
const path = require('node:path')

//Janela principal
let win //Importante! Neste projeto o escopo da variável win deve ser global.
function createWindow() {
    nativeTheme.themeSource = 'dark' //janela sempre escura
    win = new BrowserWindow({
        width: 1010, //largura em pixels
        height: 700, //altura em px
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    //Menu personalizado
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
    win.loadFile('./src/views/index.html')
}

//Janela sobre
function aboutWindow(){
    nativeTheme.themeSource = 'dark'
    const main = BrowserWindow.getFocusedWindow() // obtém a janela principal
    let about 
    // validar a janela pai
    if(main){
        about = new BrowserWindow({
            width: 320,
            height: 160,
            autoHideMenuBar: true, // esconde o menu
            resizable: false, //impedir redimensionamento
            minimizable: false, // impedir minimizar a janela
            //titleBarStyle: 'hidden' // esconder a barra de estilo (ex.: totem de auto atendimento)
            parent: main, //estabelece hierarquia de janelas
            modal:true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }
    about.loadFile('./src/views/sobre.html')
    //Fechar a janela quando receber mensagem do processo do processo de renderização.
    ipcMain.on('close-about', () => {
        console.log('Recebi a mensagem close-about')
        //validar se a janela foi destruída
        if(about && !about.isDestroyed()){
            about.close()
        }
    })
}

//execução assíncrona do aplicativo electron
app.whenReady().then(() => {
    createWindow()
    //comportamento do MAC ao fechar uma janela
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

// Encerrar a aplicação quando a janela for fechada (Windows e Linux)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

//template do menu
const template = [
    {
        label: 'Arquivo',
        submenu: [
            {
                label: 'Novo',
                accelerator: 'CmdOrCtrl+N',
                click: () => novoArquivo()
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
            }
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
                label: 'Reduzir zoom',
                role: 'zoomOut'
            },
            {
                label: 'Restaurar o zoom padrão',
                role: 'resetZoom'
            },
        ]
    },
    {
        label: 'Cor',
        submenu: [
            {
                label: 'Amarelo',
                click: () => win.webContents.send('set-color', "var(--amarelo)")
            },
            {
                label: 'Azul',
                click: () => win.webContents.send('set-color', "var(--azul)")
            },
            {
                label: 'Laranja',
                click: () => win.webContents.send('set-color', "var(--laranja)")
            },
            {
                label: 'Pink',
                click: () => win.webContents.send('set-color', "var(--pink)")
            },
            {
                label: 'Roxo',
                click: () => win.webContents.send('set-color', "var(--roxo)")
            },
            {
                label: 'Verde',
                click: () => win.webContents.send('set-color', "var(--verde)")
            },
            {
                type: 'separator'
            },
            {
                label: 'Restaurar a cor padrão',
                click: () => win.webContents.send('set-color', 'var(--cinzaClaro)')
            }
        ]
    },
    {
        label: 'Ajuda',
        submenu: [
            {
                label: 'Repositório',
                click: () => shell.openExternal('https://github.com/diegowps')
            },
            {
                label: 'Sobre',
                click: () => aboutWindow()
            }
        ]
    }
]

//Novo arquivo >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//1º Criar a estrutura de um arquivo e setar o título
//Um arquivo inicia sem título, sem conteúdo, não está salvo e o local padrão vai ser a pasta documentos.
function novoArquivo(){
    file = {
        name: 'Sem título',
        content: "",
        saved: false,
        path: app.getPath('documents') + 'Sem título'
    }
    //enviar ao renderizador a estrutura de um novo arquivo e título
    win.webContents.send('set-file', file)
}
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<