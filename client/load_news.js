fetch('/api/fetch-rss')
    .then(response => response.json())
    .then(data => {
        let items = data.rss.channel.item;
        let html = ``;
        items.forEach(el => {
            let title = el.title;
            let link = el.link;

            html += `
            <div class="news-item">
                <a href="${link}" target="_blank">${title}</a>
            </div>
            `;
        });
        document.getElementById('newsContainer').innerHTML = html;
    });