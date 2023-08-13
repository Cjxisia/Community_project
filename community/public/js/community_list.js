var table_id_value = document.getElementById('table_id').innerText
var table_user_value = document.getElementById('table_user').innerText
var table_title_value = document.getElementById('table_title').innerText
var table_date_value = document.getElementById('table_date').innerText
var table_time_value = document.getElementById('table_time').innerText
var subject_title = document.getElementById('com_title').innerText

var table_id = table_id_value.split(',');
var table_user = table_user_value.split(',');
var table_title = table_title_value.split(',');
var table_date = table_date_value.split(',');
var table_time = table_time_value.split(',');

var community = [];

for (var i = 0; i < table_id.length; i++) {
  var com_id = table_id[i].trim();
  var com_user = table_user[i].trim();
  var com_title = table_title[i].trim();
  var com_date = new Date(table_date[i].trim()).toLocaleDateString('ko-KR'); 
  var com_time = table_time[i].trim();

  community.push({ 
    ID: com_id,
    제목: com_title,
    날짜: com_date,
    시간: com_time,
    글쓴이: com_user
  });
}

var postsPerPage = 20;      // 한 페이지에 출력되는 개수 설정

var currentPage = 1;        // 현재 페이지 정보를 저장하는 변수

var outputElement = document.getElementById("output");          //리스트를 출력할 곳
var buttonsElement = document.getElementById("buttons");        //버튼을 출력할 곳

function displayPage(page) {        // 페이지를 출력하는 함수
  var startIndex = (page - 1) * postsPerPage;           // 시작과 끝 인덱스 계산
  var endIndex = Math.min(startIndex + postsPerPage, community.length);

  outputElement.innerHTML = "";

  for (var i = startIndex; i < endIndex; i++) {     //배열에 게시판 추가
    var post = community[i];
    var postHTML = "<p><strong>제목:</strong> <a href='#' onclick='send_id_server(\"" + post.ID + "\")'>" + post.제목 + "</a> " +
                   "<strong>글쓴이:</strong> " + post.글쓴이 +
                   "<strong>날짜:</strong> " + post.날짜 + 
                   "<strong>시간:</strong> " + post.시간 + "</p>";
    outputElement.innerHTML += postHTML;    //출력할 요소 출력
  }
}

function createPageButton(page) {       // 페이지 버튼 생성
  var pageButton = document.createElement("button");
  pageButton.textContent = page;
  pageButton.onclick = function() {
    currentPage = page;
    displayPage(currentPage);
  };
  buttonsElement.appendChild(pageButton);
}

displayPage(currentPage);       // 초기 페이지 출력

function prevPage() {           // 이전 페이지 제어 함수
  if (currentPage > 1) {
    currentPage--;
    displayPage(currentPage);
  }
}

function nextPage() {           // 다음 페이지 제어 함수
  var totalPages = Math.ceil(community.length / postsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    displayPage(currentPage);
  }
}

var prevButton = document.createElement("button");      // 이전 페이지와 다음 페이지 버튼 생성
prevButton.textContent = "이전 페이지";
prevButton.onclick = prevPage;
buttonsElement.appendChild(prevButton);

var totalPages = Math.ceil(community.length / postsPerPage);        // 페이지 번호 버튼 생성
for (var i = 1; i <= totalPages; i++) {
  createPageButton(i);
}

var nextButton = document.createElement("button");
nextButton.textContent = "다음 페이지";
nextButton.onclick = nextPage;
buttonsElement.appendChild(nextButton);

function send_id_server(table_id) {
  var form = document.createElement("form");
  form.setAttribute("method", "GET");
  form.setAttribute("action", "/com_read");

  var inputField = document.createElement("input");
  inputField.setAttribute("type", "hidden");
  inputField.setAttribute("name", "table_id");
  inputField.setAttribute("id", "table_id");
  inputField.setAttribute("value", table_id);
  form.appendChild(inputField);

  var inputField2 = document.createElement("input");
  inputField2.setAttribute("type", "hidden");
  inputField2.setAttribute("name", "com_title");
  inputField2.setAttribute("id", "com_title");
  inputField2.setAttribute("value", subject_title);
  form.appendChild(inputField2);

  document.body.appendChild(form);

  form.submit();
}