window.addEventListener("load", function() {
    const urlE = document.getElementById('web-url');
    const titleE = document.getElementById('title');
    const descriptionE = document.getElementById('description');
    const everyoneCheckbox = document.getElementById('include-everyone');  // Captura o checkbox

    // Carregar dados salvos no storage
    chrome.storage.sync.get(['url', 'title', 'description'], (res) => {
        if (res.url) urlE.value = res.url;
        if (res.title) titleE.value = res.title;
        if (res.description) descriptionE.value = res.description;
    });

    document.getElementById('discord').addEventListener("submit", function(e) {
        e.preventDefault();

        const url = urlE.value;
        if (!url.startsWith('https://discord.com/api/webhooks/')) return false;
        
        const title = titleE.value;
        const description = descriptionE.value;
        const includeEveryone = everyoneCheckbox.checked;  // Verifica se o checkbox está marcado

        // Salvar os dados no storage
        chrome.storage.sync.set({'url': url, 'title': title, 'description': description});

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const embed = {
                    title: title,
                    description: description,
                    color: config.color,
                    thumbnail: {
                        url: config.avatarUrl
                    },
                    image: {
                        url: config.banner
                    },
                    footer: {
                        text: "Copyright ©  Equipe " + config.username + " Todos os Direitos Reservados",
                        icon_url: config.avatarUrl
                    }
                };

                // Envia a mensagem utilizando o nome da webhook
                const xhr = new XMLHttpRequest();
                xhr.open("POST", url, true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify({
                    avatar_url: config.avatarUrl,
                    username: config.username + " 🤖",
                    content: includeEveryone ? '||@everyone||' : '',  // Condição para incluir @everyone
                    embeds: [embed]
                }));
            })
            .catch(error => {
                console.error('Erro ao obter informações da webhook:', error);
                // Se houver um erro, envia a mensagem com o nome padrão
                const embed = {
                    title: configerro.username,
                    description: "Erro ao obter informações da webhook:" + error,
                    color: 16711680,
                    thumbnail: {
                        url: configerro.avatarUrl
                    },
                    image: {
                        url: configerro.banner
                    },
                    footer: {
                        text: "© Equipe " + configerro.username,
                        icon_url: configerro.avatarUrl
                    }
                };

                const xhr = new XMLHttpRequest();
                xhr.open("POST", url, true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify({
                    username: username ,
                    embeds: [embed]
                }));
            });
    });
});
