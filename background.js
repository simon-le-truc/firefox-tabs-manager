browser.tabs.query({}).then(tabs => {
    const fields = []
    for(const tab of tabs) {
        const location = new URL(tab.url)
        const field = fields.find(f => location.hostname == f.hostname)
        if(field) {
            field.tabs.push(tab)
        } else {
            fields.push({hostname: location.hostname, tabs: [tab], icon: tab.favIconUrl})
        }
    }

    for(const field of fields) {
        console.log(field.hostname, " : ", field.tabs)
    }
}).catch(console.error)