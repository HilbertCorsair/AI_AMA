let corsProxy = "https://cors-anywhere.herokuapp.com/";
let rssFeed = "https://www.federalreserve.gov/feeds/press_all.xml";

fetch(corsProxy + rssFeed)
    .then(response => response.text())
    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
    .then(data => console.log(data));

fetch(corsProxy + rssFeed)
    .then(response => response.text())
    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
    .then(data => {
        let items = data.querySelectorAll("item");
        let html = ``;
        items.forEach(el => {
            let title = el.querySelector("title").textContent;
            let link = el.querySelector("link").textContent;
            //let thumbnail = "https://via.placeholder.com/150";  Placeholder thumbnail

            html += `
            <div class="news-item">
                <a href="${link}" target="_blank">${title}</a>
            </div>
            `;
        });
        document.getElementById('newsContainer').innerHTML = html;  // or append to another HTML element
    });
