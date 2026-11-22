// Store the selected star rating.
var rating = 0;

// Show one page and hide the others.
function showPage(id) {
    var pages = document.getElementsByClassName("page");
    for (var i = 0; i < pages.length; i++) pages[i].style.display = "none";
    document.getElementById(id).style.display = "block";
    updateDashboard();
}

// Read and save feedback in this browser.
function getFeedback() {
    return JSON.parse(localStorage.getItem("feedback") || "[]");
}
function saveFeedback(list) {
    localStorage.setItem("feedback", JSON.stringify(list));
}

// Open the form for a facility.
function chooseFacility(name) {
    document.getElementById("facilityName").value = name;
    showPage("feedback");
}

// Select stars.
function setRating(number) {
    rating = number;
    var stars = document.getElementById("ratingButtons").getElementsByTagName("button");
    for (var i = 0; i < stars.length; i++) stars[i].style.color = i < number ? "#00f5ff" : "#718096";
    document.getElementById("ratingText").innerText = number + " out of 5 stars selected.";
}

// Submit feedback.
document.getElementById("feedbackForm").onsubmit = function(event) {
    event.preventDefault();
    if (rating == 0) {
        document.getElementById("formMessage").innerText = "Please select a rating.";
        return;
    }

    var list = getFeedback();
    var item = {
        reference: "CC" + (1001 + list.length),
        name: document.getElementById("personName").value,
        facility: document.getElementById("facilityName").value,
        type: document.getElementById("feedbackType").value,
        message: document.getElementById("feedbackMessage").value,
        rating: rating,
        status: "Pending"
    };
    list.push(item);
    saveFeedback(list);
    document.getElementById("formMessage").innerText = "Submitted! Your reference number is " + item.reference;
    this.reset();
    setRating(0);
    updateDashboard();
};

// Find feedback using its reference number.
function trackFeedback() {
    var number = document.getElementById("referenceInput").value.toUpperCase();
    var list = getFeedback();
    var result = "Feedback not found. Check your number.";
    for (var i = 0; i < list.length; i++) {
        if (list[i].reference == number) {
            result = "Facility: " + list[i].facility + " | Rating: " + list[i].rating + "/5 | Status: " + list[i].status;
            break;
        }
    }
    document.getElementById("trackResult").innerText = result;
}

// Search facilities by name and category.
function filterFacilities() {
    var search = document.getElementById("searchBox").value.toLowerCase();
    var category = document.getElementById("categoryFilter").value;
    var cards = document.getElementsByClassName("facility-card");
    var shown = 0;
    for (var i = 0; i < cards.length; i++) {
        var name = cards[i].getElementsByTagName("h3")[0].innerText.toLowerCase();
        var type = cards[i].getAttribute("data-category");
        var match = name.indexOf(search) != -1 && (category == "all" || category == type);
        cards[i].style.display = match ? "block" : "none";
        if (match) shown++;
    }
    document.getElementById("noFacilities").style.display = shown ? "none" : "block";
}

// Change a feedback status.
function changeStatus(index, status) {
    var list = getFeedback();
    list[index].status = status;
    saveFeedback(list);
    updateDashboard();
}

// Update the dashboard.
function updateDashboard() {
    var list = getFeedback();
    var pending = 0, resolved = 0, rows = "";
    for (var i = 0; i < list.length; i++) {
        if (list[i].status == "Pending") pending++;
        else resolved++;
        rows += "<tr><td>" + list[i].reference + "</td><td>" + list[i].facility + "</td><td>" + list[i].rating + "/5</td><td>" + list[i].status + "</td><td><select onchange='changeStatus(" + i + ",this.value)'><option>Pending</option><option " + (list[i].status == "Resolved" ? "selected" : "") + ">Resolved</option></select></td></tr>";
    }
    document.getElementById("feedbackTable").innerHTML = rows;
    document.getElementById("emptyTable").style.display = list.length ? "none" : "block";
    document.getElementById("homeTotal").innerText = document.getElementById("dashTotal").innerText = list.length;
    document.getElementById("homePending").innerText = document.getElementById("dashPending").innerText = pending;
    document.getElementById("homeResolved").innerText = document.getElementById("dashResolved").innerText = resolved;
}

// Load the home page when the website starts.
showPage("home");
