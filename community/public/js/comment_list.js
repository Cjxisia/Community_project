var comment_user_value = document.getElementById("comment_user").innerText;
var comments_value = document.getElementById("comments").innerText;
var comment_time_value = document.getElementById("comment_time").innerText;
var comment_date_value = document.getElementById("comment_date").innerText;
var c_id_value = document.getElementById("c_id").innerText;

var comment_user = comment_user_value.split(',');
var comments = comments_value.split(',');
var comment_time = comment_time_value.split(',');
var comment_date = comment_date_value.split(',');
var c_ids = c_id_value.split(',');

var comment = [];

for (var i = 0; i < comment_user.length; i++) {
  var c_user = comment_user[i].trim();
  var com = comments[i].trim();
  var c_time = comment_time[i].trim();
  var c_date = new Date(comment_date[i].trim()).toLocaleDateString('ko-KR');
  var c_id = c_ids[i].trim();

  comment.push({
    글쓴이: c_user,
    내용: com,
    시간: c_time,
    날짜: c_date,
    c_id: c_id
  });
}

var postsPerPage = 5;
var currentPage = 1;

var outputElement = document.getElementById("output");
var buttonsElement = document.getElementById("buttons");

function displayPage(page) { 
  var startIndex = (page - 1) * postsPerPage; 
  var endIndex = Math.min(startIndex + postsPerPage, comment.length);

  outputElement.innerHTML = "";

  for (var i = startIndex; i < endIndex; i++) { 
    var post = comment[i];
    var postHTML =
      "<form method='POST' action='/comment_delete'>" +
      "<a>" + post.글쓴이 + " " +
      post.내용 + "</a>" +
      "<a>" + " - " + post.시간 + " " +
      post.날짜 + "</a>" + " " + 
      "<input type='hidden' name='c_id' value='" + post.c_id + "'>" +
      "<input type='submit' value='삭제'>" +
      "</form><br>";

    outputElement.innerHTML += postHTML;
  }
}

function createPageButton(page) {
    var pageButton = document.createElement("button");
    pageButton.textContent = page;
    pageButton.onclick = function() {
      currentPage = page;
      displayPage(currentPage);
    };
    buttonsElement.appendChild(pageButton);
}

displayPage(currentPage); 

function prevPage() { 
  if (currentPage > 1) {
    currentPage--;
    displayPage(currentPage);
  }
}

function nextPage() { 
  var totalPages = Math.ceil(comment.length / postsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    displayPage(currentPage);
  }
}

var prevButton = document.createElement("button"); 
prevButton.textContent = "이전 페이지";
prevButton.onclick = prevPage;
buttonsElement.appendChild(prevButton);

var totalPages = Math.ceil(comment.length / postsPerPage); 
for (var i = 1; i <= totalPages; i++) {
  createPageButton(i);
}

var nextButton = document.createElement("button");
nextButton.textContent = "다음 페이지";
nextButton.onclick = nextPage;
buttonsElement.appendChild(nextButton);