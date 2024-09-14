browser.tabs.query({}).then(tabs => {
    const fields = []
    for(const tab of tabs) {
        const location = new URL(tab.url)
        const field = fields.find(f => location.hostname == f.hostname)
        if(field) {
            field.tabs.push(tab)
            if(!field.icon){
                field.icon = tab.icon
            }
        } else {
            fields.push({hostname: location.hostname, tabs: [tab], icon: tab.favIconUrl})
        }
    }
    document.body.innerHTML = ""

    for(const field of fields) {
        const fieldElement = document.createElement("div")
        fieldElement.className = "field"

        const title = document.createElement("p")
        title.className = "title"

        const icon = document.createElement("img")
        icon.src = field.icon
        icon.alt = field.icon
        icon.addEventListener("error", () => {
            title.innerText = field.hostname
        })
        title.appendChild(icon)
        title.innerHTML += field.hostname

        const tabs = document.createElement("div")
        tabs.className = "tabs"

        for(const tab of field.tabs){
            const picture = document.createElement("img")
            browser.tabs.captureTab(tab.id, { format: "png" }).then(url => {
                picture.src = url

                const name = document.createElement("div")
                name.className = "name"
                name.innerText = tab.title

                const tabElement = document.createElement("div")
                tabElement.className = "tab"
                tabElement.appendChild(picture)

                const urlElement = document.createElement("span")
                urlElement.innerText = location.host + location.pathname
                urlElement.className = "url"
                
                tabElement.appendChild(name)
                tabElement.appendChild(picture)
                tabElement.appendChild(urlElement)
                tabs.appendChild(tabElement)

                tabElement.addEventListener("click", () => {
                    browser.tabs.update(tab.id, { active: true });
                    close()
                })
                tabElement.addEventListener("contextmenu", e => {
                    e.preventDefault()
                    const background = document.createElement("div")
                    background.style = `height: 100vh;width: 100vw;background-color: rgba(0, 0, 0, 0.6);opacity: 0;transition: 0.5s;position: fixed;top: 0px;left: 0px;`

                    const contenxtMenu = document.createElement("div")
                    contenxtMenu.style = `position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%) scale(2);background-color: #333;transition: 0.5s;border-radius: 15px;overflow: hidden;`

                    const close_tab = document.createElement("div")
                    close_tab.innerText = "Fermer l'onglet"
                    close_tab.className = "context-menu-button"

                    const dupl_tab = document.createElement("div")
                    dupl_tab.innerText = "Dupliquer l'onglet"
                    dupl_tab.className = "context-menu-button"

                    const cancel = document.createElement("div")
                    cancel.innerText = "Annuler"
                    cancel.className = "context-menu-button"

                    contenxtMenu.appendChild(close_tab)
                    contenxtMenu.appendChild(dupl_tab)
                    contenxtMenu.appendChild(cancel)

                    background.appendChild(contenxtMenu)
                    document.body.appendChild(background)
                    setTimeout(() => {
                        background.style.opacity = "1"
                        contenxtMenu.style.transform = "translate(-50%, -50%) scale(1)"
                    }, 1)

                    cancel.addEventListener("click", () => {
                        background.style.opacity = "0"
                        contenxtMenu.style.transform = "translate(-50%, -50%) scale(2)"
                        setTimeout(() => {
                            background.remove()
                        }, 500)
                    })

                    dupl_tab.addEventListener("click", () => {
                        background.style.opacity = "0"
                        contenxtMenu.style.transform = "translate(-50%, -50%) scale(2)"
                        setTimeout(() => {
                            background.remove()
                        }, 500)
                        browser.tabs.duplicate(tab.id).then(tab2 => {
                            browser.tabs.update(tab2.id, { active: true });
                            close()
                        })
                    })

                    close_tab.addEventListener("click", () => {
                        background.style.opacity = "0"
                        contenxtMenu.style.transform = "translate(-50%, -50%) scale(2)"
                        setTimeout(() => {
                            background.remove()
                        }, 500)
                        browser.tabs.remove(tab.id)
                        tabElement.remove()
                        if(tabs.innerHTML === ""){
                            fieldElement.remove()
                        }
                    })
                })
            })
        }

        fieldElement.appendChild(title)
        fieldElement.appendChild(tabs)
        document.body.appendChild(fieldElement)
    }
}).catch(error => {
    document.body.innerHTML = `<span style="color: red;">Erreur : ${error}</span>`
})