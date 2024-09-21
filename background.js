// Vérifie si l'API browser est disponible, sinon utilise chrome
const browserAPI = typeof browser !== "undefined" ? browser : chrome;

// Écoute les commandes définies dans manifest.json
browserAPI.commands.onCommand.addListener(async (command) => {
    try {
        switch(command) {
            case "show-leftmost-tab": {
                let tabs = await browserAPI.tabs.query({ currentWindow: true });
                if(tabs.length > 0) {
                    let leftmostTabId = tabs[0].id;
                    await browserAPI.tabs.update(leftmostTabId, { active: true });
                }
                break
            }
            case "show-right-most-tab": {
                let tabs = await browserAPI.tabs.query({ currentWindow: true });
                if(tabs.length > 0) {
                    let leftmostTabId = tabs[tabs.length - 1].id;
                    await browserAPI.tabs.update(leftmostTabId, { active: true });
                }
                break
            }
            case "move-tab-to-left": {
                const current_tab = (await browserAPI.tabs.query({active: true, currentWindow: true}))[0]
                if(current_tab) {
                    browserAPI.tabs.move(current_tab.id, {index: 0})
                } else {
                    console.error(`L'onglet actif n'a pas été trouvé !`)
                }
                break
            }
            case "move-tab-to-right": {
                const current_tab = (await browserAPI.tabs.query({active: true, currentWindow: true}))[0]
                if(current_tab) {
                    browserAPI.tabs.move(current_tab.id, {index: (await browserAPI.tabs.query({currentWindow: true})).length})
                } else {
                    console.error(`L'onglet actif n'a pas été trouvé !`)
                }
                break
            }
            default: {
                console.warn(`Aucune action configuré pour "${command}".`)
                break
            }
        }
    } catch(error) {
        console.error(`Erreur d'exécution pour "${command}" : `, error)
    }
});
