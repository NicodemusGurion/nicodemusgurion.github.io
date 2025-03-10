document.addEventListener("DOMContentLoaded", function () {
    const content = document.body.innerHTML;
    const sections = [];
    let currentSection = { title: "start", content: "", choices: [] };
    let lines = content.split("\n");
    document.body.innerHTML = ""; // Clear the existing page

    lines.forEach((line) => {
        if (line.startsWith("<h1>")) {
            sections.push(currentSection);
            currentSection = {
                title: line.replace(/<\/?h1>/g, "").trim(),
                content: "",
                choices: []
            };
        } else if (line.startsWith("<ul>")) {
            currentSection.choices = [];
        } else if (line.startsWith("<li>")) {
            let match = line.match(/<li>(.*?)\s*>\s*(.*?)<\/li>/);
            if (match) {
                let choiceText = match[1].trim();
                let targetId = match[2].toLowerCase().replace(/\s+/g, "-");
                currentSection.choices.push({ text: choiceText, target: targetId });
            }
        } else {
            currentSection.content += line + "\n";
        }
    });

    sections.push(currentSection);
    sections.shift(); // Remove the first empty section

    sections.forEach((section) => {
        let sectionDiv = document.createElement("div");
        sectionDiv.classList.add("section");
        sectionDiv.id = section.title.toLowerCase().replace(/\s+/g, "-");
        sectionDiv.innerHTML = `<p>${section.content}</p>`;

        let choicesDiv = document.createElement("div");
        choicesDiv.classList.add("choices");

        section.choices.forEach((choice) => {
            let button = document.createElement("button");
            button.textContent = choice.text;
            button.addEventListener("click", function () {
                document.querySelectorAll(".section").forEach((s) => s.classList.remove("visible"));
                document.getElementById(choice.target).classList.add("visible");
            });
            choicesDiv.appendChild(button);
        });

        sectionDiv.appendChild(choicesDiv);
        document.body.appendChild(sectionDiv);
    });

    document.querySelector(".section").classList.add("visible"); // Show first section
});