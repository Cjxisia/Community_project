var tableNamesValue = document.getElementById('tablenames').innerText;
var tableNamesArray = tableNamesValue.split(',');

var subject = [];
for (var i = 0; i < tableNamesArray.length; i++) {
    var name = tableNamesArray[i].trim();
    if (name !== "comment") { // "comment" 값을 가진 데이터를 필터링
      subject.push({ text: name, url: 'http://localhost:3000/community' });
    }
}
var pageSize = 10;
var currentPage = 1;
var previousPage = 1; // 이전 페이지 번호

function createPaginationButtons() {    // 페이지네이션 버튼을 생성하는 함수
    var totalPages = Math.ceil(subject.length / pageSize);
    var paginationDiv = document.getElementById("pagination");
    paginationDiv.innerHTML = "";

    var prevButton = document.createElement("button");  // 이전 페이지 버튼
    prevButton.innerText = "이전 페이지";
    prevButton.disabled = (currentPage === 1);
    prevButton.addEventListener("click", function () {
    if (currentPage > 1) {
        previousPage = currentPage;
        currentPage--;
        createPaginationButtons(); // 페이지 버튼 갱신
        showLinks();
    }
    });
    paginationDiv.appendChild(prevButton);

    for (var i = 1; i <= totalPages; i++) { // 페이지 번호 버튼들
        var pageButton = document.createElement("button");
        pageButton.innerText = i.toString();
        pageButton.disabled = (currentPage === i);
        pageButton.addEventListener("click", function (pageNum) {
          return function () {
            previousPage = currentPage;
            currentPage = pageNum;
            createPaginationButtons(); // 페이지 버튼 갱신
            showLinks();
          };
        }(i));
        paginationDiv.appendChild(pageButton);
    }

    var nextButton = document.createElement("button");      // 다음 페이지 버튼
    nextButton.innerText = "다음 페이지";
    nextButton.disabled = (currentPage === totalPages);
    nextButton.addEventListener("click", function () {
    if (currentPage < totalPages) {
        previousPage = currentPage;
        currentPage++;
        createPaginationButtons(); // 페이지 버튼 갱신
        showLinks();
    }
    });
      paginationDiv.appendChild(nextButton);
}

function showLinks() {  // 링크 목록을 생성하는 함수
    var linkListDiv = document.getElementById("linkList");
    linkListDiv.innerHTML = "";

    var startIndex = (currentPage - 1) * pageSize;
    var endIndex = startIndex + pageSize;

    var linkContainer = document.createElement("div");
    linkContainer.className = "link-container";

    var leftLinkList = document.createElement("div");
    leftLinkList.className = "link-list";
    var rightLinkList = document.createElement("div");
    rightLinkList.className = "link-list";

    for (var i = startIndex; i < endIndex && i < subject.length; i++) {
        var link = document.createElement("a");
        link.href = subject[i].url;
        link.innerText = subject[i].text;
        link.className = "links"

        link.addEventListener("click", function (event) {           //링크 클릭시 서버에 데이터 보내도록 함수 작동
          event.preventDefault();
          var clickedSubjectText = event.target.innerText;
          sendSubjectTextToServer(clickedSubjectText);
        });

        if (i % 2 === 0) {
          leftLinkList.appendChild(link);
          leftLinkList.appendChild(document.createElement("br"));
        } else {
          rightLinkList.appendChild(link);
          rightLinkList.appendChild(document.createElement("br"));
        }
    }

    linkContainer.appendChild(leftLinkList);
    linkContainer.appendChild(rightLinkList);
    linkListDiv.appendChild(linkContainer);
}

function goToPreviousPage() {   // 이전 페이지로 돌아가는 함수
    if (previousPage !== currentPage) {
    currentPage = previousPage;
    createPaginationButtons(); // 페이지 버튼 갱신
    showLinks();
    }
}

function initialize() { // 초기 페이지 로딩 시 호출
    createPaginationButtons();
    showLinks();
}

function sendSubjectTextToServer(subjectText) {
  var form = document.createElement("form");
  form.setAttribute("method", "GET");
  form.setAttribute("action", "/community");

  var inputField = document.createElement("input");
  inputField.setAttribute("type", "hidden");
  inputField.setAttribute("name", "community");
  inputField.setAttribute("value", subjectText);
  form.appendChild(inputField);

  document.body.appendChild(form);

  form.submit();
}

window.onload = initialize; // 페이지 로딩 완료 시 초기화 함수 호출