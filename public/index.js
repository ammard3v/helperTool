
const tools = [
    {
        name: "Merge Images",
        description: "Combine two images side-by-side or vertically",
        icon: "fas fa-image",
        link: "mergeImages.html"
    },
    {
        name: "Stack PDF Pages",
        description: "Combine PDF pages vertically",
        icon: "fas fa-file-pdf",
        link: "pptStack.html"
    }

];

function generateToolCards() {
    const toolsGrid = document.getElementById('toolsGrid');

    tools.forEach(tool => {
        const toolCard = document.createElement('a');
        toolCard.className = 'tool-card';
        toolCard.href = tool.link;

        toolCard.innerHTML = `
    <div class="tool-icon">
        <i class="${tool.icon}"></i>
    </div>
    <h2>${tool.name}</h2>
    <p>${tool.description}</p>
    `;

        toolsGrid.appendChild(toolCard);
    });
}

document.addEventListener('DOMContentLoaded', generateToolCards);
