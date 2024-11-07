//importação de pacotes
//nativeTheme (força um tema no sistema operacional)
//
const { app, BrowserWindow, nativeTheme, Menu, shell, ipcMain, dialog } = require('electron/main')
const path = require('node:path')

//Importação da biblioteca file system (nativa do JS) para manipular arquivos
const fs = require('fs')
const { error } = require('node:console')
let file = {}

//Criação de um objeto com a estrutura básica de um arquivo
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
function aboutWindow() {
    nativeTheme.themeSource = 'dark'
    const main = BrowserWindow.getFocusedWindow() // obtém a janela principal
    let about
    // validar a janela pai
    if (main) {
        about = new BrowserWindow({
            width: 320,
            height: 160,
            autoHideMenuBar: true, // esconde o menu
            resizable: false, //impedir redimensionamento
            minimizable: false, // impedir minimizar a janela
            //titleBarStyle: 'hidden' // esconder a barra de estilo (ex.: totem de auto atendimento)
            parent: main, //estabelece hierarquia de janelas
            modal: true,
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
        if (about && !about.isDestroyed()) {
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
                accelerator: 'CmdOrCtrl+O',
                click: () => abrirArquivo()
            },
            {
                label: 'Salvar',
                accelerator: 'CmdOrCtrl+S',
                click: () => salvar()
            },
            {
                label: 'Salvar Como',
                accelerator: 'CmdOrCtrl+Shift+S',
                click: () => salvarComo()
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
                click: () => shell.openExternal('https://github.com/amanda-nogueira')
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
function novoArquivo() {
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

//Abrir arquivo ------------------------------------------------
// 2 funções, abrirArquivo() e lerArquivo(caminho) 
async function abrirArquivo() {
    //Usar um módeulo do Electron para abrir o explorador de arquivos
    let dialogFile = await dialog.showOpenDialog({
        defaultPath: file.path //Selecionar o arquivo no local padrão
    })
    //console.log(dialogFile) vendo caminho das pasta de arquivos solicitados
    //Validação do botão [cancelar]
    if (dialogFile.canceled === true) {
        return false
    } else {
        //Abrir arquivo
        file = {
            name: path.basename(dialogFile.filePaths[0]),
            content: lerArquivo(dialogFile.filePaths[0]),
            saved: true,
            path: dialogFile.filePaths[0]
        }
        //console.log(file)
        //Enviar o arquivo para o renderer
        win.webContents.send('set-file', file)
    }
}

function lerArquivo(filePath) {
    //Usar o trycatch sempre que trabalhar com arquivos
    try {
        //A linha abaixo usa a biblioteca fs para ler um aqruivo, informando o caminho e o encoding do arquivo.
        return fs.readFileSync(filePath, 'utf-8')
    } catch (error) {
        console.log(error)
        return ''
    }
}
//----------------------------------------------------------------------------

//Salvar **************************************************************
//3 funções, salvarComo() e salvar() e salvarArquivo(fs)
async function salvarComo() {
    let dialogFile = await dialog.showSaveDialog({
        defaultPath: file.path
    })
    //console.log(dialogFile)
    if (dialogFile.canceled === true) {
        return false
    } else {
        salvarArquivo(dialogFile.filePath)
    }


    function salvar() {
        if (file.saved === true) {
            return salvarArquivo(file.path)
        } else {
            return salvarComo()
        }

    }


    function salvarArquivo(filePath) {
        try {
            //Uso da biblioteca fs para gravar um arquivo
            fs.write(filePath, file.content, (error) => {
                file.path = filePath
                file.saved = true
                file.name = path.basename(filePath)
            })
        } catch (error) {
            console.log(error)
        }
    }
}    
//*********************************************