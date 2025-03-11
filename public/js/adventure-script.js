document.addEventListener("DOMContentLoaded", function () {
    let elements = Array.from(document.body.children);
    let wrapper = null;

    elements.forEach((el) => {
        if (el.tagName === "H1") {
            // Create a new section div
            wrapper = document.createElement("div");
            wrapper.classList.add("section");

            // Generate an ID from the header text
            let sectionId = el.innerText.toLowerCase().replace(/\s+/g, "-");
            wrapper.id = sectionId;

            // Hide the H1 but keep it for reference
            el.style.display = "none";

            // Add the wrapper to the body
            document.body.appendChild(wrapper);
        }
        if (wrapper) {
	        let link = document.createElement("a");
            link.textContent = "&lt;";
            link.onclick = function() {
				history.back();
				return false;
			}
			wrapper.appendChild(link);
            // Move elements into the current wrapper
            wrapper.appendChild(el);
        }
    });
    
//make links

    document.querySelectorAll("li").forEach((li) => {
        let match = li.textContent.match(/(.*?)\s*\#\s*(.*)/);
        if (match) {
            let linkText = match[1].trim();
            let targetId = match[2].trim().toLowerCase().replace(/\s+/g, "-");

            let link = document.createElement("a");
            link.href = "#" + targetId;
            link.textContent = linkText;

            li.textContent = ""; // Clear existing text
            li.appendChild(link); // Add the new link
        } else { // check for hard coded link
	        match = li.textContent.match(/(.*?)\s*\>\s*(.*)/);
	        if (match) {
	            let linkText = match[1].trim();
	            let targetId = match[2].trim();

	            let link = document.createElement("a");
	            link.href = targetId;
	            link.textContent = linkText;

	            li.textContent = ""; // Clear existing text
	            li.appendChild(link); // Add the new link
	        }
        } 
    });
//move to first section
    if (!window.location.hash) {
        let firstSection = document.querySelector(".section");
        if (firstSection && firstSection.id) {
            window.location.hash = "#" + firstSection.id;
        }
    }

});
